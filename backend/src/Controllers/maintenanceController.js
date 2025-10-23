import maintenanceService from "../Services/maintenanceService.js";
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get all maintenance requests for the authenticated admin
 */
export const getAllMaintenanceRequests = asyncHandler(async (req, res) => {
  const adminId = getAdminId(req);
  
  logControllerAction('Fetch Maintenance Requests', adminId);
  
  const requests = await maintenanceService.getAllMaintenanceRequests(adminId);
  
  sendSuccess(res, requests, `Successfully fetched ${requests.length} maintenance requests`);
});

/**
 * Count total maintenance requests for the authenticated admin
 */
export const countMaintenanceRequestsByAdminId = asyncHandler(async (req, res) => {
  const adminId = getAdminId(req);
  
  const count = await maintenanceService.countMaintenanceRequestsByAdminId(adminId);
  
  sendSuccess(res, { count }, 'Maintenance requests count retrieved successfully');
});

/**
 * Count high priority maintenance requests for the authenticated admin
 */
export const countHighPriorityMaintenanceRequestsByAdminId = asyncHandler(async (req, res) => {
  const adminId = getAdminId(req);
  
  const count = await maintenanceService.countHighPriorityMaintenanceRequestsByAdminId(adminId);
  
  sendSuccess(res, { count }, 'High priority maintenance requests count retrieved successfully');
});

const maintenanceController = {
  getAllMaintenanceRequests,
  countMaintenanceRequestsByAdminId,
  countHighPriorityMaintenanceRequestsByAdminId,
};
export default maintenanceController;