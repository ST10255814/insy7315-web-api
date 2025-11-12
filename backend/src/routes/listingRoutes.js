/**
 * Listing routes configuration
 * Handles all property listing-related API endpoints
 */

import { Router } from 'express';
import listingController from '../Controllers/listingController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { csrfProtection } from '../middleware/csrfProtection.js';
import { upload } from '../utils/cloudinary.js';

const router = Router();

// All listing routes require authentication and CSRF protection for state-changing operations
router.use(checkAuth);

// Listing statistics routes (must come before /:id route)
router.get('/count', (req, res, next) => {
  console.log('[ROUTE] Hit /count route');
  next();
}, listingController.countNumberOfListingsByAdminId);

router.get('/count-this-month', (req, res, next) => {
  console.log('[ROUTE] Hit /count-this-month route');
  next();
}, listingController.countListingsAddedThisMonth);

// Listing management routes
router.post('/create', csrfProtection, upload.array('imageURL', 10), listingController.createListing);
router.get('/', listingController.getListingsByAdminId);

//update listing info
router.put('/update/:id', csrfProtection, upload.array('imageURL', 10), listingController.updateListingInfo);

// Status route must come before /:id route to avoid parameter conflicts
router.get('/status', (req, res, next) => {
  console.log('[ROUTE] Hit /status route');
  next();
}, listingController.returnPropertiesByStatus);

router.get('/:id', (req, res, next) => {
  console.log('[ROUTE] Hit /:id route with id:', req.params.id);
  next();
}, listingController.getListingById);

router.delete('/delete/:id', csrfProtection, listingController.deleteListingById);

export default router;