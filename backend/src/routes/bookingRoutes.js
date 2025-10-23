/**
 * Booking routes configuration
 * Handles all booking-related API endpoints
 */

import { Router } from 'express';
import bookingController from '../Controllers/bookingController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All booking routes require authentication
router.use(checkAuth);

// Booking management routes
router.get('/', bookingController.getBookings);

// Booking revenue routes
router.get('/current-month-revenue', bookingController.getCurrentMonthRevenue);

export default router;