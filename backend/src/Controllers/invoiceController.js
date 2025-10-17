import invoiceService from "../Services/invoiceService.js";

// Controller to handle invoice creation
async function createInvoice(req, res) {
  try {
    const adminId = req.user.userId; // Get admin ID from the authenticated user
    const invoiceId = await invoiceService.createInvoice(adminId, req.body);
    res.status(201).json({ invoiceId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller to handle fetching invoices by admin ID
async function getInvoicesByAdminId(req, res) {
  try {
    const adminId = req.user.userId; // Get admin ID from the authenticated user
    const invoices = await invoiceService.getInvoicesByAdminId(adminId);
    res.status(200).json({ invoices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller to handle marking an invoice as paid
async function markInvoiceAsPaid(req, res) {
  try {
    const adminId = req.user.userId; // Get admin ID from the authenticated user
    const { invoiceId } = req.params;
    
    if (!invoiceId) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }

    const success = await invoiceService.markInvoiceAsPaid(invoiceId, adminId);
    
    if (success) {
      res.status(200).json({ message: "Invoice marked as paid successfully" });
    } else {
      res.status(404).json({ error: "Invoice not found or no changes made" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller to handle fetching invoice statistics
async function getInvoiceStats(req, res) {
  try {
    const adminId = req.user.userId; // Get admin ID from the authenticated user
    const stats = await invoiceService.getInvoiceStats(adminId);
    res.status(200).json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default {
  createInvoice,
  getInvoicesByAdminId,
  markInvoiceAsPaid,
  getInvoiceStats
};