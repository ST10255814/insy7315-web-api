import listingService from '../Services/listingService.js';
import { sendSuccess, sendError, sendCreated, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Create a new property listing with image uploads
 */
const createListing = asyncHandler(async (req, res) => {
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
});

/**
 * Get all listings for the authenticated admin
 */
const getListingsByAdminId = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Admin Listings', adminId);
    
    const listings = await listingService.getListingsByAdminId(adminId);
    
    console.log(`[getListingsByAdminId] Retrieved ${listings.length} listings for admin ${adminId}`);
    
    sendSuccess(res, listings, `Successfully retrieved ${listings.length} listings`);
});

/**
 * Count total number of listings for the authenticated admin
 */
const countNumberOfListingsByAdminId = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const count = await listingService.countNumberOfListingsByAdminId(adminId);
    
    console.log(`[countNumberOfListingsByAdminId] Counted ${count} listings for admin ${adminId}`);
    
    sendSuccess(res, { count }, 'Listings count retrieved successfully');
});

/**
 * Count listings added this month for the authenticated admin
 */
const countListingsAddedThisMonth = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const count = await listingService.countListingsAddedThisMonth(adminId);
    
    console.log(`[countListingsAddedThisMonth] Counted ${count} listings added this month for admin ${adminId}`);
    
    sendSuccess(res, { count }, 'This month listings count retrieved successfully');
});

// Export individual functions for named imports
export { 
    createListing,
    getListingsByAdminId,
    countNumberOfListingsByAdminId,
    countListingsAddedThisMonth
};

// Export default object for backward compatibility
export default {
    createListing,
    getListingsByAdminId,
    countNumberOfListingsByAdminId,
    countListingsAddedThisMonth
};