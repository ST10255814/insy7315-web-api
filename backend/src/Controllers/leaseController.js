import leaseService from '../Services/leaseService.js';
import { sendSuccess, sendError, sendCreated, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, validateRequiredFields, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get all leases for the authenticated admin
 */
export const getAdminLeases = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Admin Leases', adminId);
    
    const leases = await leaseService.getLeasesByAdminId(adminId);
    
    console.log(`Successfully fetched ${leases.length} leases for admin ${adminId}`);
    sendSuccess(res, leases, `Successfully fetched ${leases.length} leases`);
});

/**
 * Create a new lease from a booking
 */
export const createLease = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    // Validate required fields
    validateRequiredFields(req.body, ['bookingID']);
    
    const { bookingID } = req.body;
    
    logControllerAction('Create Lease', adminId, { bookingID });
    
    const leaseId = await leaseService.createLease(bookingID, adminId);
    
    sendCreated(res, { leaseId }, 'Lease created successfully');
});

/**
 * Update lease statuses for a specific admin
 */
export const updateLeaseStatuses = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    logControllerAction('Update Lease Statuses', adminId);
    
    const updatedCount = await leaseService.updateLeaseStatusesByAdmin(adminId);
    
    sendSuccess(res, { updatedCount }, `Updated ${updatedCount} lease statuses`);
});

/**
 * Trigger global lease status update (admin only)
 */
export const triggerGlobalStatusUpdate = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    logControllerAction('Global Status Update', adminId);
    
    const updatedCount = await leaseService.updateAllLeaseStatuses();
    
    sendSuccess(res, { updatedCount }, `Global status update completed. Updated ${updatedCount} leases`);
});

/**
 * Count active leases for the authenticated admin
 */
export const countActiveLeasesByAdminId = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const count = await leaseService.countActiveLeasesByAdminId(adminId);
    
    sendSuccess(res, { count }, 'Active leases count retrieved successfully');
});

/**
 * Get leased property percentage for the authenticated admin
 */
export const getLeasedPropertyPercentage = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const percentage = await leaseService.getLeasedPropertyPercentage(adminId);
    
    sendSuccess(res, { percentage }, 'Leased property percentage retrieved successfully');
});

const leaseController = {
    getAdminLeases,
    createLease,
    updateLeaseStatuses,
    countActiveLeasesByAdminId,
    triggerGlobalStatusUpdate,
    getLeasedPropertyPercentage
};

export default leaseController;