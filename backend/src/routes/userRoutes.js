/**
 * User routes configuration
 * Handles all user-related API endpoints
 */

import { Router } from 'express';
import userController from '../Controllers/userController.js';
import { arcjetMiddleware } from '../middleware/arcjet.middleware.js';

const router = Router();

// Authentication routes (with rate limiting)
router.post('/login', arcjetMiddleware, userController.login);
router.post('/register', arcjetMiddleware, userController.register);
router.post('/forgot-password', arcjetMiddleware, userController.resetPassword);

// User management routes
router.post('/logout', userController.logout);

export default router;