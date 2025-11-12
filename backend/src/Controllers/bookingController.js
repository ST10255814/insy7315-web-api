import bookingService from "../Services/bookingService.js";
import { sendSuccess, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get bookings for the authenticated admin (landlord)
 */
const getBookings = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Admin Bookings', adminId);
    
    const bookings = await bookingService.getBookings(adminId);
    
    sendSuccess(res, bookings, `Successfully fetched ${bookings.length} bookings`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Get booking by booking ID
 */

const getBookingById = asyncHandler(async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return sendBadRequest(res, "Booking not found");
    }

    sendSuccess(res, booking, "Booking retrieved successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Get current month revenue for the authenticated admin
 */
const getCurrentMonthRevenue = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    const revenue = await bookingService.getCurrentMonthRevenue(adminId);
    
    const responseData = {
        totalRevenue: revenue,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        adminId: adminId
    };
    
    sendSuccess(res, responseData, 'Current month revenue retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Delete a booking (only if admin owns the listing)
 */
const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const { bookingId } = req.params;
    const adminId = getAdminId(req);
    
    logControllerAction('Delete Booking', adminId, { bookingId });
    
    const success = await bookingService.deleteBooking(bookingId, adminId);
    
    if (success) {
      sendSuccess(res, { deleted: true }, 'Booking deleted successfully');
    } else {
      sendBadRequest(res, 'Failed to delete booking');
    }
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

// Export individual functions for named imports
export { getBookings, getBookingById, getCurrentMonthRevenue, deleteBooking };

// Export default object for backward compatibility
export default {
    getBookings,
    getBookingById,
    getCurrentMonthRevenue,
    deleteBooking,
};