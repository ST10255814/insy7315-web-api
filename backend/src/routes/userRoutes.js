/**
 * User routes configuration
 * Handles all user-related API endpoints
 */

import { Router } from 'express';
import userController from '../Controllers/userController.js';
import { arcjetMiddleware } from '../middleware/arcjet.middleware.js';
import { csrfProtection } from '../middleware/csrfProtection.js';
import { checkShortLivedAuth } from '../middleware/checkAuth.js';

const router = Router();

// Authentication routes (with rate limiting) - no CSRF required as users don't have sessions yet
router.post('/login', arcjetMiddleware, userController.login);
router.post('/register', arcjetMiddleware, userController.register);
router.post('/forgot-password', arcjetMiddleware, userController.resetPassword);
router.patch('/update-password/:resetToken', checkShortLivedAuth, userController.updatePassword);

// User management routes (logout requires CSRF protection since user has active session)
router.post('/logout', csrfProtection, userController.logout);

// Debug endpoint to check authentication status (no CSRF protection for debugging)
router.get('/auth-debug', async (req, res) => {
  const cookies = req.cookies;
  const headers = req.headers;
  const authToken = cookies?.authToken;
  
  // Try to verify the token if it exists
  let tokenInfo = null;
  if (authToken) {
    try {
      const { verifyToken } = await import('../utils/jwtUtils.js');
      const decoded = await verifyToken(authToken);
      tokenInfo = {
        valid: true,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000).toISOString(),
        iat: new Date(decoded.iat * 1000).toISOString()
      };
    } catch (error) {
      tokenInfo = {
        valid: false,
        error: error.message
      };
    }
  }
  
  res.json({
    hasCookies: !!cookies,
    hasAuthToken: !!authToken,
    tokenLength: authToken ? authToken.length : 0,
    tokenPreview: authToken ? `${authToken.substring(0, 20)}...` : null,
    tokenInfo,
    allCookies: cookies,
    cookieNames: Object.keys(cookies || {}),
    relevantHeaders: {
      authorization: headers.authorization,
      origin: headers.origin,
      referer: headers.referer,
      host: headers.host,
      'user-agent': headers['user-agent'],
      'x-forwarded-for': headers['x-forwarded-for'],
      'x-real-ip': headers['x-real-ip']
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      cookieDomain: process.env.COOKIE_DOMAIN,
      clientUrl: process.env.CLIENT_URL
    },
    timestamp: new Date().toISOString()
  });
});

export default router;