import invoiceService from "../Services/invoiceService.js";
import { sendSuccess, sendError, sendCreated, sendBadRequest, sendNotFound } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, validateRequiredFields, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Controller to handle invoice creation
 */
const createInvoice = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    // Validate required fields
    validateRequiredFields(req.body, ['leaseId', 'date', 'amount']);
    
    logControllerAction('Create Invoice', adminId, {
      leaseId: req.body.leaseId,
      amount: req.body.amount
    });
    
    const invoiceId = await invoiceService.createInvoice(adminId, req.body);
    
    sendCreated(res, { invoiceId }, 'Invoice created successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle fetching invoices by admin ID
 */
const getInvoicesByAdminId = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Fetch Admin Invoices', adminId);
    
    const invoices = await invoiceService.getInvoicesByAdminId(adminId);
    
    sendSuccess(res, { invoices }, `Successfully fetched ${invoices.length} invoices`);
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle fetching an invoice by ID
 */
const getInvoiceById = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { invoiceId } = req.params;

    logControllerAction('Fetch Invoice', adminId, { invoiceId });

    const invoice = await invoiceService.getInvoiceById(invoiceId, adminId);

    if (!invoice) {
      return sendNotFound(res, "Invoice not found");
    }

    sendSuccess(res, { invoice }, "Invoice fetched successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle marking an invoice as paid
 */
const markInvoiceAsPaid = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { invoiceId } = req.params;
    
    // Validate invoice ID parameter
    if (!invoiceId) {
      return sendBadRequest(res, "Invoice ID is required");
    }
    
    logControllerAction('Mark Invoice Paid', adminId, { invoiceId });
    
    const success = await invoiceService.markInvoiceAsPaid(invoiceId, adminId);
    
    if (success) {
      sendSuccess(res, null, "Invoice marked as paid successfully");
    } else {
      sendNotFound(res, "Invoice not found or no changes made");
    }
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle fetching invoice statistics
 */
const getInvoiceStats = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    const stats = await invoiceService.getInvoiceStats(adminId);
    
    sendSuccess(res, { stats }, 'Invoice statistics retrieved successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to regenerate invoice descriptions
 */
const regenerateInvoiceDescriptions = asyncHandler(async (req, res) => {
  try {
    const adminId = getAdminId(req);
    
    logControllerAction('Regenerate Invoice Descriptions', adminId);
    
    const updatedCount = await invoiceService.regenerateAllInvoiceDescriptions(adminId);
    
    sendSuccess(res, { updatedCount }, 'Invoice descriptions regenerated successfully');
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

// Export individual functions for named imports
export { 
  createInvoice,
  getInvoicesByAdminId,
  markInvoiceAsPaid,
  getInvoiceStats,
  regenerateInvoiceDescriptions
};

// Export default object for backward compatibility
export default {
  createInvoice,
  getInvoicesByAdminId,
  getInvoiceById,
  markInvoiceAsPaid,
  getInvoiceStats,
  regenerateInvoiceDescriptions
};