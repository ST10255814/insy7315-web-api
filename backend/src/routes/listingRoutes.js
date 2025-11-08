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
router.post('/create', upload.array('imageURL', 10), listingController.createListing);
router.get('/', listingController.getListingsByAdminId);

router.get('/:id', (req, res, next) => {
  console.log('[ROUTE] Hit /:id route with id:', req.params.id);
  next();
}, listingController.getListingById);

router.get('/status', (req, res, next) => {
  console.log('[ROUTE] Hit /status/:adminId route with adminId:', req.params.adminId);
  next();
}, listingController.returnPropertiesByStatus);

router.delete('/delete/:id', listingController.deleteListingById);

export default router;