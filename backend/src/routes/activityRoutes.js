/**
 * Activity routes configuration
 * Handles all activity log-related API endpoints
 */

import { Router } from 'express';
import activityController from '../Controllers/activityController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All activity routes require authentication
router.use(checkAuth);

// Activity log routes - note: the route in server.js is '/api/activity-logs' so we use '/' here
router.get('/', activityController.getRecentActivities);

export default router;