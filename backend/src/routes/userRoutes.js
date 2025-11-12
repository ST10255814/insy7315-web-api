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

export default router;