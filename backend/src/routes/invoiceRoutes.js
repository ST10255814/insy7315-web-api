/**
 * Invoice routes configuration
 * Handles all invoice-related API endpoints
 */

import { Router } from 'express';
import invoiceController from '../Controllers/invoiceController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All invoice routes require authentication
router.use(checkAuth);

// Invoice management routes
router.post('/create', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoicesByAdminId);
router.get('/:invoiceId', invoiceController.getInvoiceById);
router.patch('/:invoiceId/pay', invoiceController.markInvoiceAsPaid);

// Invoice statistics and utilities
router.get('/stats', invoiceController.getInvoiceStats);
router.post('/regenerate-descriptions', invoiceController.regenerateInvoiceDescriptions);

export default router;