/**
 * Maintenance routes configuration
 * Handles all maintenance request-related API endpoints
 */

import { Router } from 'express';
import maintenanceController from '../Controllers/maintenanceController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All maintenance routes require authentication
router.use(checkAuth);

// Maintenance request management routes
router.get('/', maintenanceController.getAllMaintenanceRequests);

// Maintenance statistics routes
router.get('/count', maintenanceController.countMaintenanceRequestsByAdminId);
router.get('/count-high-priority', maintenanceController.countHighPriorityMaintenanceRequestsByAdminId);

export default router;