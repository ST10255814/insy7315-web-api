import invoiceService from "../Services/invoiceService";

// Controller to handle invoice creation
async function createInvoice(req, res) {
  try {
    const adminId = req.user.id; // Get admin ID from the authenticated user
    const invoiceId = await invoiceService.createInvoice(adminId, req.body);
    res.status(201).json({ invoiceId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Controller to handle fetching invoices by admin ID
async function getInvoicesByAdminId(req, res) {
  try {
    const adminId = req.user.id; // Get admin ID from the authenticated user
    const invoices = await invoiceService.getInvoicesByAdminId(adminId);
    res.status(200).json({ invoices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default {
  createInvoice,
  getInvoicesByAdminId
};