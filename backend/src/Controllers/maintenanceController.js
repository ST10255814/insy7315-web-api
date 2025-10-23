import maintenanceService from "../Services/maintenanceService.js";
import { sendSuccess, sendError, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get all maintenance requests for the authenticated admin
 */
export const getAllMaintenanceRequests = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Maintenance Requests', adminId);
    
    const requests = await maintenanceService.getAllMaintenanceRequests(adminId);
    
    sendSuccess(res, requests, `Successfully fetched ${requests.length} maintenance requests`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Count total maintenance requests for the authenticated admin
 */
export const countMaintenanceRequestsByAdminId = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    const count = await maintenanceService.countMaintenanceRequestsByAdminId(adminId);
    
    sendSuccess(res, { count }, 'Maintenance requests count retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Count high priority maintenance requests for the authenticated admin
 */
export const countHighPriorityMaintenanceRequestsByAdminId = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    const count = await maintenanceService.countHighPriorityMaintenanceRequestsByAdminId(adminId);
    
    sendSuccess(res, { count }, 'High priority maintenance requests count retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

const maintenanceController = {
  getAllMaintenanceRequests,
  countMaintenanceRequestsByAdminId,
  countHighPriorityMaintenanceRequestsByAdminId,
};
export default maintenanceController;