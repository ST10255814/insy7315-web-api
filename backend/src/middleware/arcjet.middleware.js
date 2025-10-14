import aj from '../utils/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

/**
 * Arcjet middleware - deployment-safe
 */
export const arcjetMiddleware = async (req, res, next) => {
    try {
        // Run Arcjet protection
        const decision = await aj.protect(req);

        if (!decision) {
            console.warn('Arcjet returned no decision, allowing request.');
            return next(); // Fail-open: allow traffic if Arcjet fails silently
        }

        // Deny cases
        if (decision.isDenied) {
            const reason = decision.reason;
            if (reason?.isRateLimit?.()) {
                return res.status(429).json({ error: 'Access denied: Rate limit exceeded. Please try again later' });
            }
            if (reason?.isBot?.()) {
                return res.status(403).json({ error: 'Access denied: Bot traffic detected' });
            }
            return res.status(403).json({ error: 'Access denied by security policy' });
        }

        // Detect spoofed bots
        if (decision.results?.some(isSpoofedBot)) {
            return res.status(403).json({ error: 'Spoofed bot detected. Malicious activity blocked.' });
        }

        // Everything okay
        next();

    } catch (error) {
        // Log full error for production debugging
        console.error('[Arcjet Middleware Error]:', error);

        // Fail-open: allow legitimate traffic if Arcjet fails
        next();
    }
};
