import listingService from '../Services/listingService.js';
import { sendSuccess, sendError, sendCreated, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Create a new property listing with image uploads
 */
const createListing = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Create Listing', adminId);
    
    // Handle uploaded files
    const files = req.files || [];
    
    if (!files.length) {
        console.log(`[createListing] No files uploaded for admin ${adminId}`);
    }
    
    // Map file paths to image URLs
    const imageUrls = files.map(file => file.path);
    const data = { ...req.body, imagesURL: imageUrls };
    
    const newListing = await listingService.createListing(data, adminId);
    
    console.log(`[createListing] Listing created with id="${newListing?.listingId}" for admin ${adminId}`);
    
    sendCreated(res, newListing, 'Listing created successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Get all listings for the authenticated admin
 */
const getListingsByAdminId = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Admin Listings', adminId);
    
    const listings = await listingService.getListingsByAdminId(adminId);
    
    console.log(`[getListingsByAdminId] Retrieved ${listings.length} listings for admin ${adminId}`);
    
    sendSuccess(res, listings, `Successfully retrieved ${listings.length} listings`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Get a specific listing by its ID
 */
const getListingById = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const listingId = req.params.id;

    logControllerAction('Fetch Listing by ID', adminId);

    const listing = await listingService.getListingById(listingId, adminId);

    if (!listing) {
      return sendError(res, 'Listing not found', 404);
    }

    console.log(`[getListingById] Retrieved listing with id="${listingId}" for admin ${adminId}`);

    sendSuccess(res, listing, 'Listing retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Delete a specific listing by its ID
 */
const deleteListingById = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const listingId = req.params.id;

    logControllerAction('Delete Listing by ID', adminId);

    const result = await listingService.deleteListingById(listingId, adminId);

    if (!result) {
      return sendError(res, 'Listing not found', 404);
    }

    console.log(`[deleteListingById] Deleted listing with id="${listingId}" for admin ${adminId}`);

    sendSuccess(res, null, 'Listing deleted successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Count total number of listings for the authenticated admin
 */
const countNumberOfListingsByAdminId = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Count Listings', adminId);
    
    const count = await listingService.countNumberOfListingsByAdminId(adminId);
    
    console.log(`[countNumberOfListingsByAdminId] Counted ${count} listings for admin ${adminId}`);
    
    sendSuccess(res, { count }, 'Listings count retrieved successfully');
  } catch (error) {
    console.error(`[countNumberOfListingsByAdminId] Error in controller: ${error.message}`);
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Count listings added this month for the authenticated admin
 */
const countListingsAddedThisMonth = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Count This Month Listings', adminId);
    
    const count = await listingService.countListingsAddedThisMonth(adminId);
    
    console.log(`[countListingsAddedThisMonth] Counted ${count} listings added this month for admin ${adminId}`);
    
    sendSuccess(res, { count }, 'This month listings count retrieved successfully');
  } catch (error) {
    console.error(`[countListingsAddedThisMonth] Error in controller: ${error.message}`);
    sendBadRequest(res, error.message, error.details);
  }
});

const returnPropertiesByStatus = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);

    logControllerAction('Return Properties By Status', adminId);

    const count = await listingService.returnPropertiesByStatus(adminId);

    console.log(`[returnPropertiesByStatus] Retrieved property status counts for admin ${adminId}`);
    sendSuccess(res, count, 'Property status counts retrieved successfully');
  } catch (error) {
    console.error(`[returnPropertiesByStatus] Error in controller: ${error.message}`);
    sendBadRequest(res, error.message, error.details);
  }
});

const updateListingInfo = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const listingId = req.params.id;
    logControllerAction('Update Listing Info', adminId);

    // Handle uploaded files
    const files = req.files || [];
    
    if (!files.length) {
        console.log(`[createListing] No files uploaded for admin ${adminId}`);
    }
    
    // Map file paths to image URLs
    const imageUrls = files.map(file => file.path);
    const data = { ...req.body, imagesURL: imageUrls };

    const updatedListing = await listingService.updateListingInfo(listingId, adminId, data);

    if (!updatedListing) {
      return sendError(res, 'Listing not found or no changes made', 404);
    }
    sendSuccess(res, updatedListing, 'Listing updated successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});


// Export individual functions for named imports
export {
    createListing,
    getListingById,
    getListingsByAdminId,
    deleteListingById,
    countNumberOfListingsByAdminId,
    countListingsAddedThisMonth,
    returnPropertiesByStatus,
    updateListingInfo
};

// Export default object for backward compatibility
export default {
    createListing,
    getListingById,
    getListingsByAdminId,
    deleteListingById,
    countNumberOfListingsByAdminId,
    countListingsAddedThisMonth,
    returnPropertiesByStatus,
    updateListingInfo
};