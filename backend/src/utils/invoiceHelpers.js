/**
 * Invoice-specific utility functions
 * Contains business logic specific to invoice generation and formatting
 */

/**
 * Generate automatic invoice descriptions based on invoice data
 * 
 * @param {Object} invoiceData - Invoice information
 * @param {string} invoiceData.tenantName - Name of the tenant
 * @param {string} invoiceData.propertyAddress - Property address
 * @param {number} invoiceData.amount - Invoice amount
 * @param {string|Date} invoiceData.date - Invoice date
 * @param {string} invoiceData.status - Invoice status
 * @returns {string} Generated description
 */
export function generateInvoiceDescription(invoiceData) {
  const { propertyAddress, date, status } = invoiceData;
  
  // Parse the date to get month/year for description
  let formattedDate;
  try {
    const parsedDate = new Date(date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();
    formattedDate = `${month} ${year}`;
  } catch (error) {
    formattedDate = "Current Period";
  }

  // Base description based on status
  let baseDescription;
  switch (status) {
    case "Pending":
      baseDescription = `Monthly Rent Invoice - ${formattedDate}`;
      break;
    case "Overdue":
      baseDescription = `OVERDUE: Monthly Rent Invoice - ${formattedDate}`;
      break;
    case "Paid":
      baseDescription = `PAID: Monthly Rent Invoice - ${formattedDate}`;
      break;
    default:
      baseDescription = `Monthly Rent Invoice - ${formattedDate}`;
  }

  // Add tenant and property info
  const shortAddress = truncateText(propertyAddress, 50);

  return `${baseDescription} }`;
}

/**
 * Format currency amounts in South African Rand
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', { 
    style: 'currency', 
    currency: 'ZAR' 
  }).format(amount);
}

/**
 * Truncate text with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + "..." 
    : text;
}

/**
 * Generate invoice summary for reports
 * 
 * @param {Object} invoice - Invoice object
 * @returns {Object} Invoice summary
 */
export function generateInvoiceSummary(invoice) {
  return {
    id: invoice.invoiceId,
    tenant: invoice.lease?.tenant || 'Unknown',
    amount: formatCurrency(invoice.amount),
    status: invoice.status,
    dueDate: invoice.date,
    property: truncateText(invoice.lease?.propertyAddress || 'Unknown', 30)
  };
}

/**
 * Calculate days overdue for an invoice
 * 
 * @param {string|Date} dueDate - Invoice due date
 * @returns {number} Days overdue (0 if not overdue)
 */
export function calculateDaysOverdue(dueDate) {
  try {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    return 0;
  }
}

// Export all functions
const invoiceHelpers = {
  generateInvoiceDescription,
  formatCurrency,
  truncateText,
  generateInvoiceSummary,
  calculateDaysOverdue
};

export default invoiceHelpers;