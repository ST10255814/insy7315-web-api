/**
 * Lease routes configuration
 * Handles all lease-related API endpoints
 */

import { Router } from 'express';
import leaseController from '../Controllers/leaseController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All lease routes require authentication
router.use(checkAuth);

// Lease statistics routes (must be before dynamic /:leaseId route)
router.get('/count', leaseController.countActiveLeasesByAdminId);
router.get('/leased-percentage', leaseController.getLeasedPropertyPercentage);

// Lease management routes
router.get('/', leaseController.getAdminLeases);
router.post('/create', leaseController.createLease);
router.get('/:leaseId', leaseController.getLeaseById);
router.delete('/:leaseId', leaseController.deleteLease);

// Lease status management routes
router.patch('/update-statuses', leaseController.updateLeaseStatuses);
router.patch('/global-status-update', leaseController.triggerGlobalStatusUpdate);

export default router;