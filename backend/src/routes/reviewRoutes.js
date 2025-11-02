/**
 * Review Routes
 * Handles all review-related API endpoints
 */
import { Router } from 'express';
import reviewController from '../Controllers/reviewController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All review routes require authentication
router.use(checkAuth);

// Review management route
router.get('/', reviewController.getAdminReviews);

export default router;