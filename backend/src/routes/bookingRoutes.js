/**
 * Booking routes configuration
 * Handles all booking-related API endpoints
 */

import { Router } from 'express';
import bookingController from '../Controllers/bookingController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { csrfProtection } from '../middleware/csrfProtection.js';

const router = Router();

// All booking routes require authentication and CSRF protection
router.use(checkAuth);
router.use(csrfProtection);

// Booking management routes
router.get('/', bookingController.getBookings);

// Get booking by ID
router.get('/:bookingId', bookingController.getBookingById);

// Delete booking by ID (admin must own the listing)
router.delete('/delete/:bookingId', bookingController.deleteBooking);

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