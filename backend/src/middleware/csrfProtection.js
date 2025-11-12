import csrf from 'csrf';
import dotenv from 'dotenv';

dotenv.config();

// Initialize CSRF tokens
const tokens = new csrf();

// Store CSRF secrets per session
const sessionSecrets = new Map();

/**
 * Generate CSRF secret for session
 * @param {string} sessionId - Session identifier
 * @returns {string} CSRF secret
 */
export const generateSecret = (sessionId) => {
  const secret = tokens.secretSync();
  sessionSecrets.set(sessionId, secret);
  return secret;
};

/**
 * Generate CSRF token using session secret
 * @param {string} sessionId - Session identifier
 * @returns {string|null} CSRF token or null if no secret found
 */
export const generateToken = (sessionId) => {
  const secret = sessionSecrets.get(sessionId);
  if (!secret) {
    return null;
  }
  return tokens.create(secret);
};

/**
 * Verify CSRF token against session secret
 * @param {string} sessionId - Session identifier
 * @param {string} token - CSRF token to verify
 * @returns {boolean} True if token is valid
 */
export const verifyToken = (sessionId, token) => {
  const secret = sessionSecrets.get(sessionId);
  if (!secret || !token) {
    return false;
  }
  return tokens.verify(secret, token);
};

/**
 * Clear CSRF secret for session
 * @param {string} sessionId - Session identifier
 */
export const clearSecret = (sessionId) => {
  sessionSecrets.delete(sessionId);
};

/**
 * Middleware to generate and provide CSRF tokens
 * This middleware adds CSRF token generation capability to requests
 */
export const csrfSetup = (req, res, next) => {
  // Use session ID or user ID as session identifier
  const sessionId = req.sessionID || req.user?.id || req.user?._id || req.ip;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session identifier required for CSRF protection' });
  }
  
  // Ensure we have a secret for this session
  if (!sessionSecrets.has(sessionId)) {
    generateSecret(sessionId);
  }
  
  // Add CSRF methods to request object
  req.csrfToken = () => generateToken(sessionId);
  req.csrfSessionId = sessionId;
  
  next();
};

/**
 * Middleware to validate CSRF tokens
 * This middleware should be applied to state-changing routes (POST, PUT, DELETE, PATCH)
 */
export const csrfProtection = (req, res, next) => {
  // Skip CSRF validation for GET and HEAD requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  
  const sessionId = req.sessionID || req.user?.id || req.user?._id || req.ip;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session identifier required for CSRF protection' });
  }
  
  // Get token from various possible locations
  const token = (req.body && req.body._csrf) || 
                (req.query && req.query._csrf) || 
                req.headers['csrf-token'] || 
                req.headers['xsrf-token'] || 
                req.headers['x-csrf-token'] || 
                req.headers['x-xsrf-token'];
  
  if (!token) {
    return res.status(403).json({ 
      error: 'CSRF token missing',
      code: 'EBADCSRFTOKEN'
    });
  }
  
  if (!verifyToken(sessionId, token)) {
    return res.status(403).json({ 
      error: 'Invalid CSRF token',
      code: 'EBADCSRFTOKEN'
    });
  }
  
  next();
};

/**
 * Cleanup function to remove old secrets (call periodically)
 * In production, implement TTL-based cleanup with Redis
 */
export const cleanupOldSecrets = () => {
  // Simple cleanup - in production use proper session management
  if (sessionSecrets.size > 1000) {
    const entries = Array.from(sessionSecrets.entries());
    const keepRecent = entries.slice(-500);
    sessionSecrets.clear();
    keepRecent.forEach(([key, value]) => sessionSecrets.set(key, value));
  }
};

// Clean up old secrets every hour
setInterval(cleanupOldSecrets, 60 * 60 * 1000);