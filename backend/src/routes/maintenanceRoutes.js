/**
 * Maintenance routes configuration
 * Handles all maintenance request-related API endpoints
 */

import { Router } from 'express';
import maintenanceController from '../Controllers/maintenanceController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { csrfProtection } from '../middleware/csrfProtection.js';

const router = Router();

// All maintenance routes require authentication
router.use(checkAuth);

// Maintenance request management routes
router.get('/', maintenanceController.getAllMaintenanceRequests);

// Caretaker management routes
router.post('/create/caretaker', csrfProtection, maintenanceController.createCareTaker);

// get care Takers
router.get('/caretakers', maintenanceController.getAllAdminsCareTakers);

//assign caretaker to maintenance request
router.post('/assign', csrfProtection, maintenanceController.assignCareTakerToRequest);

//update maintenance request
router.put('/update', csrfProtection, maintenanceController.updateMaintenanceRequest);
//update maintenance status to completed
router.put('/complete', csrfProtection, maintenanceController.updateMaintenanceStatusToCompleted);

// Maintenance statistics routes
router.get('/count', maintenanceController.countMaintenanceRequestsByAdminId);
router.get('/count-high-priority', maintenanceController.countHighPriorityMaintenanceRequestsByAdminId);

export default router;