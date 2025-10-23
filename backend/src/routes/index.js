/**
 * Main routes index file
 * Centralizes all route configurations
 */

import { Router } from 'express';

// Import individual route modules
import userRoutes from './userRoutes.js';
import leaseRoutes from './leaseRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import listingRoutes from './listingRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import activityRoutes from './activityRoutes.js';
import revenueRoutes from './revenueRoutes.js';

const router = Router();

// Mount route modules to match your existing API structure
router.use('/user', userRoutes);
router.use('/leases', leaseRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/listings', listingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/activity-logs', activityRoutes);
router.use('/revenue', revenueRoutes);

export default router;