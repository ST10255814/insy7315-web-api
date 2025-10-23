import activityService from "../Services/activityService.js";
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get recent activities for the authenticated admin
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const activities = await activityService.getRecentActivities(adminId);
    
    sendSuccess(res, activities, `Successfully retrieved ${activities.length} recent activities`);
});

// Export default object for backward compatibility
const activityController = { getRecentActivities };
export default activityController;