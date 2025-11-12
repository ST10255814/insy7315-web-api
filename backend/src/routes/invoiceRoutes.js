/**
 * Invoice routes configuration
 * Handles all invoice-related API endpoints
 */

import { Router } from 'express';
import invoiceController from '../Controllers/invoiceController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { csrfProtection } from '../middleware/csrfProtection.js';

const router = Router();

// All invoice routes require authentication
router.use(checkAuth);

// Invoice management routes
router.post('/create', csrfProtection, invoiceController.createInvoice);
router.get('/', invoiceController.getInvoicesByAdminId);
router.get('/:invoiceId', invoiceController.getInvoiceById);
router.delete('/:invoiceId', csrfProtection, invoiceController.deleteInvoice);
router.patch('/:invoiceId/pay', csrfProtection, invoiceController.markInvoiceAsPaid);

// Invoice statistics and utilities
router.get('/stats', invoiceController.getInvoiceStats);
router.post('/regenerate-descriptions', csrfProtection, invoiceController.regenerateInvoiceDescriptions);

export default router;