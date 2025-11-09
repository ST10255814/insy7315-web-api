import { Router } from 'express';
import { csrfSetup } from '../middleware/csrfProtection.js';

const router = Router();

/**
 * GET /api/security/csrf-token
 * Get CSRF token for current session
 * This endpoint should be called before making state-changing requests
 */
router.get('/csrf-token', csrfSetup, (req, res) => {
  try {
    const token = req.csrfToken();
    
    if (!token) {
      return res.status(500).json({ 
        error: 'Failed to generate CSRF token' 
      });
    }
    
    res.json({ 
      csrfToken: token,
      message: 'CSRF token generated successfully'
    });
  } catch {
    res.status(500).json({ 
      error: 'Internal server error generating CSRF token' 
    });
  }
});

/**
 * GET /api/security/headers
 * Get security headers information (for debugging/monitoring)
 */
router.get('/headers', (req, res) => {
  const securityHeaders = {
    'strict-transport-security': req.get('strict-transport-security'),
    'x-content-type-options': req.get('x-content-type-options'),
    'x-xss-protection': req.get('x-xss-protection'),
    'referrer-policy': req.get('referrer-policy'),
    'content-security-policy': req.get('content-security-policy')
  };
  
  res.json({
    message: 'Security headers status',
    headers: securityHeaders,
    https: req.secure,
    protocol: req.protocol
  });
});

export default router;