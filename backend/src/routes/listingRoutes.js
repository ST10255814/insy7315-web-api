/**
 * Listing routes configuration
 * Handles all property listing-related API endpoints
 */

import { Router } from 'express';
import listingController from '../Controllers/listingController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { upload } from '../utils/cloudinary.js';

const router = Router();

// All listing routes require authentication
router.use(checkAuth);

// Listing management routes
router.post('/create', upload.array('imageURL', 10), listingController.createListing);
router.get('/', listingController.getListingsByAdminId);

// Listing statistics routes
router.get('/count', listingController.countNumberOfListingsByAdminId);
router.get('/count-this-month', listingController.countListingsAddedThisMonth);

export default router;