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

// Test endpoint to manually update booking statuses (remove in production)
router.get('/update-statuses', async (req, res) => {
  try {
    const { updateAllBookingStatuses } = await import('../Schedule_Updates/scheduledTasks.js');
    
    console.log('API: Starting manual booking status update...');
    const updatedCount = await updateAllBookingStatuses();
    
    res.json({
      success: true,
      message: 'Booking status update completed successfully',
      data: {
        updatedCount,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('API: Booking status update failed:', error);
    res.status(500).json({
      success: false,
      message: 'Booking status update failed',
      error: error.message
    });
  }
});

export default router;