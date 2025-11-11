import aj from "../utils/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

/**
 * Arcjet middleware
 */
export const arcjetMiddleware = async (req, res, next) => {
  try {
    // Determine identifier: email or username
    const identifier = req.body.prefLogin ? req.body.prefLogin : req.body.email;

    // If no identifier provided, skip Arcjet checks
    if (!identifier) {
      return res.status(400).json({ error: "No identifier provided for Arcjet." });
    }

    // Ensure identifier is a string
    if(typeof identifier !== "string") {
      return res.status(400).json({ error: "Invalid identifier format for Arcjet." });
    }

    // Skip Arcjet checks for usernames
    if(!identifier.includes("@")) {
      next();
      return;
    }

    const decision = await aj.protect(req, { email: identifier });
    console.log("Arcjet decision:", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ error: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot access denied." });
      } else if (decision.reason.isEmail()) {
        // Extract the emailTypes directly from decision.reason
        const types = decision.reason.emailTypes || [];

        // Map to user-friendly messages
        const emailTypeMessages = {
          DISPOSABLE: "Disposable email addresses are not allowed.",
          INVALID: "This email address is invalid.",
          NO_MX_RECORDS: "Email domain cannot receive emails.",
        };

        const errorString = types
          .map((type) => emailTypeMessages[type] || type)
          .join(" "); // join multiple types if needed

        return res.status(403).json({ error: `Invalid Email: ${errorString}` });
      } else {
        return res.status(403).json({
          error: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};
