import maintenanceService from "../Services/maintenanceService.js";
import { sendSuccess, sendBadRequest } from '../utils/responseHandler.js';
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

export const createCareTaker = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const careTakerData = req.body;

    const caretakerId = await maintenanceService.createCareTaker(adminId, careTakerData);

    sendSuccess(res, { caretakerId }, 'Caretaker created successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const getAllAdminsCareTakers = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);

    const caretakers = await maintenanceService.getAllAdminsCareTakers(adminId);

    sendSuccess(res, caretakers, `Successfully fetched ${caretakers.length} caretakers`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const assignCareTakerToRequest = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { caretakerId, maintenanceRequestId } = req.body;

    await maintenanceService.assignCareTakerToRequest(caretakerId, maintenanceRequestId, adminId);

    sendSuccess(res, null, 'Caretaker assigned to maintenance request successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const updateMaintenanceRequest = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { maintenanceRequestId, updateData } = req.body;
    await maintenanceService.updateMaintenanceRequest(maintenanceRequestId, adminId, updateData);
    sendSuccess(res, null, 'Maintenance request updated successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const updateMaintenanceStatusToCompleted = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { maintenanceRequestId } = req.body;

    await maintenanceService.updateMaintenanceStatusToCompleted(maintenanceRequestId, adminId);
    sendSuccess(res, null, 'Maintenance request status updated to completed successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const deleteCareTaker = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { caretakerId } = req.params;
    await maintenanceService.deleteCareTaker(caretakerId, adminId);
    sendSuccess(res, null, 'Caretaker deleted successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

export const getCareTakerById = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { caretakerId } = req.params;
    const caretaker = await maintenanceService.getCareTakerById(caretakerId, adminId);
    sendSuccess(res, caretaker, 'Caretaker details retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

const maintenanceController = {
  getAllMaintenanceRequests,
  countMaintenanceRequestsByAdminId,
  countHighPriorityMaintenanceRequestsByAdminId,
  getAllAdminsCareTakers,
  assignCareTakerToRequest,
  createCareTaker,
  updateMaintenanceRequest,
  updateMaintenanceStatusToCompleted,
  deleteCareTaker,
  getCareTakerById
};

export default maintenanceController;