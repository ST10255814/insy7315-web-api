import React from "react";
import { FaPlay, FaTimes } from "react-icons/fa";

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
  "Expiring Soon": [
    {
      label: "Renew",
      icon: <FaPlay />,
      color: "text-yellow-600",
      hover: "hover:bg-yellow-50",
      action: "Renew",
    },
  ],
  Expired: [
    {
      label: "Activate",
      icon: <FaPlay />,
      color: "text-green-600",
      hover: "hover:bg-green-50",
      action: "Activate",
    },
  ],
  Pending: [],
};

/**
 * Priority color mappings for maintenance requests
 */
export const priorityColor = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

/**
 * Status mappings for maintenance requests
 */
export const maintenanceStatusMap = {
  Pending: { label: "Unassigned", color: "text-red-600" },
  "In Progress": { label: "In Progress", color: "text-yellow-600" },
  Completed: { label: "Completed", color: "text-green-600" },
};