import bookingService from "../Services/bookingService.js";
import { sendSuccess, sendError, sendBadRequest } from '../utils/responseHandler.js';
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

// Export individual functions for named imports
export { getBookings, getCurrentMonthRevenue };

// Export default object for backward compatibility
export default {
    getBookings,
    getCurrentMonthRevenue,
};