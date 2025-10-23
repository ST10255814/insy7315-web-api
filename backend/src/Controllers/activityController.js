import activityService from "../Services/activityService.js";
import { sendSuccess, sendError, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get recent activities for the authenticated admin
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    const activities = await activityService.getRecentActivities(adminId);
    
    sendSuccess(res, activities, `Successfully retrieved ${activities.length} recent activities`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

// Export default object for backward compatibility
const activityController = { getRecentActivities };
export default activityController;