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

// Invoice statistics and utilities (more specific routes first)
router.get('/stats', invoiceController.getInvoiceStats);
router.post('/regenerate-descriptions', csrfProtection, invoiceController.regenerateInvoiceDescriptions);

// Debug endpoint to check if specific invoice exists
router.get('/debug/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const adminId = req.user.userId; // From auth middleware
    
    // Try to get the invoice using the same service
    const { getInvoiceById } = await import('../Services/invoiceService.js');
    const invoice = await getInvoiceById(invoiceId, adminId);
    
    res.json({
      found: !!invoice,
      invoiceId,
      adminId,
      invoice: invoice ? {
        id: invoice._id,
        invoiceId: invoice.invoiceId,
        status: invoice.status,
        amount: invoice.amount,
        date: invoice.date
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      found: false,
      error: error.message,
      invoiceId: req.params.invoiceId,
      adminId: req.user?.userId,
      timestamp: new Date().toISOString()
    });
  }
});

// Invoice management routes
router.post('/create', csrfProtection, invoiceController.createInvoice);
router.get('/', invoiceController.getInvoicesByAdminId);
router.get('/data/:id', invoiceController.returnInvoiceData); // Invoice data for preview
router.get('/:invoiceId', invoiceController.getInvoiceById);
router.delete('/:invoiceId', csrfProtection, invoiceController.deleteInvoice);
router.patch('/:invoiceId/pay', csrfProtection, invoiceController.markInvoiceAsPaid);

export default router;