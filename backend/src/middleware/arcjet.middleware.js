import aj from '../utils/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if(decision.isDenied){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ message: 'Access denied: Rate limit exceeded. Please try again later' });
            } else if(decision.reason.isBot()){
                return res.status(403).json({ message: 'Access denied: Bot traffic detected' });
            } else {
                return res.status(403).json({ message: 'Access denied by security policy' });
            }
        } 
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({ error: 'Spoofed bot detected', message: 'Malicious activity detected' });
        }
        next();
    }
    catch (error) {
        console.error('Arcjet middleware error:', error);
        next();
    }
}