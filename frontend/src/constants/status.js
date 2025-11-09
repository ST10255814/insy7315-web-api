/**
 * Status-related constants and mappings
 */

// Priority color mappings
export const priorityColor = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800", 
  "High": "bg-red-100 text-red-800"
};

// Lease status mappings
export const leaseStatusMap = {
  "Active": "bg-green-100 text-green-800",
  "Pending": "bg-yellow-100 text-yellow-800",
  "Expired": "bg-red-100 text-red-800",
  "Terminated": "bg-gray-100 text-gray-800"
};

// Invoice status mappings
export const invoiceStatusMap = {
  "Paid": "bg-green-100 text-green-800",
  "Pending": "bg-yellow-100 text-yellow-800", 
  "Overdue": "bg-red-100 text-red-800",
  "Cancelled": "bg-gray-100 text-gray-800"
};

// Property status mappings
export const propertyStatusMap = {
  "Vacant": "bg-green-100 text-green-800", 
  "Occupied": "bg-blue-100 text-blue-800",
  "Under Maintenance": "bg-yellow-100 text-yellow-800",
  "Booked": "bg-orange-100 text-orange-800",
  "Reserved": "bg-purple-100 text-purple-800"
};