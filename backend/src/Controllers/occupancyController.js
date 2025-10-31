import occupansyService from "../Services/occupansyService.js";
import { sendSuccess, sendError, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get occupancy status for a specific listing
 */
export const getOccupancyStatus = asyncHandler(async (req, res) => {
  try {
    const { listingId } = req.params;
    
    if (!listingId) {
      return sendBadRequest(res, 'Listing ID is required');
    }
    
    const status = await occupansyService.checkOccupancyStatus(listingId);
    
    sendSuccess(res, { listingId, status }, 'Successfully retrieved occupancy status');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Update listing statuses for the authenticated admin
 */
export const updateListingStatuses = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('UpdateListingStatuses', adminId, 'Manually triggered listing status update');
    
    const result = await occupansyService.updateListingStatuses(adminId);
    
    sendSuccess(res, result, `Successfully updated ${result.updated} out of ${result.processedListings} listings`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Update listing statuses for all admins (admin only)
 */
export const updateAllListingStatuses = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('UpdateAllListingStatuses', adminId, 'Manually triggered system-wide listing status update');
    
    const result = await occupansyService.updateAllListingStatuses();
    
    sendSuccess(
      res, 
      result, 
      `Successfully updated ${result.totalUpdated} out of ${result.totalListingsProcessed} listings across ${result.processedAdmins} admins`
    );
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

// Export default object for backward compatibility
const occupancyController = { 
  getOccupancyStatus, 
  updateListingStatuses,
  updateAllListingStatuses
};

export default occupancyController;
