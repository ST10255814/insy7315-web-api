import { FaPlay, FaTimes, FaRedo } from "react-icons/fa";

/**
 * Status styling classes for different entity types
 */
export const statusClasses = {
  // Lease statuses
  Active: "bg-green-100 text-green-700",
  "Expiring Soon": "bg-amber-200 text-amber-800",
  Expired: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-800",

  // Invoice statuses
  Paid: "bg-green-200 text-green-800",
  Overdue: "bg-red-200 text-red-800",
  Unpaid: "bg-red-200 text-red-800",

  // Property statuses
  Vacant: "bg-green-100 text-green-700",
  Occupied: "bg-blue-100 text-blue-700",
  Maintenance: "bg-yellow-100 text-yellow-700",

  // Booking statuses
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

/**
 * Profession styling classes for caretakers
 */
export const professionClasses = {
  "Property Maintenance Specialist": "bg-blue-100 text-blue-700",
  "Security & Safety Coordinator": "bg-red-100 text-red-700",
  "Cleaning & Housekeeping Manager": "bg-green-100 text-green-700",
  "Gardening & Landscaping Expert": "bg-emerald-100 text-emerald-700",
  "General Property Caretaker": "bg-gray-100 text-gray-700",
  "HVAC & Electrical Technician": "bg-orange-100 text-orange-700",
  "Plumbing Specialist": "bg-cyan-100 text-cyan-700",
  "Pest Control Expert": "bg-purple-100 text-purple-700",
  "Building Maintenance": "bg-indigo-100 text-indigo-700",
  "Facility Manager": "bg-pink-100 text-pink-700",
};

/**
 * Action buttons configuration for different lease statuses
 */
export const statusActions = {
  Active: [
    {
      label: "Cancel",
      icon: <FaTimes />,
      color: "text-red-600",
      hover: "hover:bg-red-50",
      action: "Cancel",
    },
  ],
  Pending: [
    {
      label: "Activate",
      icon: <FaRedo />,
      color: "text-yellow-600",
      hover: "hover:bg-yellow-50",
      action: "Activate",
    },
  ],
  Expired: [
    {
      label: "Renew",
      icon: <FaPlay />,
      color: "text-green-600",
      hover: "hover:bg-green-50",
      action: "Renew",
    },
  ],
};

/**
 * Status mappings for maintenance requests
 */
export const maintenanceStatusMap = {
  Pending: { label: "Unassigned", color: "text-red-600" },
  "In Progress": { label: "In Progress", color: "text-yellow-600" },
  Completed: { label: "Completed", color: "text-green-600" },
};

// Maintenance request statuses
export const statuses = ["Pending", "In Progress", "Completed"];

/**
 * Date and number formatting utilities
 */

export const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Regex pattern to match DD-MM-YYYY format
export const ddmmyyyyPattern = /^\d{2}-\d{2}-\d{4}$/;