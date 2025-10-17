import { parseDate, hasDatePassed, isToday, isFutureDate } from './dateUtils.js';

/**
 * Status management utility for invoices and leases
 * Provides consistent status validation and determination logic
 */

/**
 * Invoice status enumeration
 */
export const INVOICE_STATUS = {
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  PAID: 'Paid'
};

/**
 * Lease status enumeration
 */
export const LEASE_STATUS = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  EXPIRED: 'Expired'
};

/**
 * Determine invoice status based on due date
 * 
 * @param {string|Date|number} dueDate - Invoice due date
 * @param {string} currentStatus - Current status (optional, for optimization)
 * @returns {string} Invoice status (Pending, Overdue, or Paid)
 */
export function determineInvoiceStatus(dueDate, currentStatus = null) {
  try {
    // If already paid, keep as paid (paid status overrides date-based logic)
    if (currentStatus === INVOICE_STATUS.PAID) {
      return INVOICE_STATUS.PAID;
    }

    // Check if due date has passed (end of day comparison)
    if (hasDatePassed(dueDate, true)) {
      return INVOICE_STATUS.OVERDUE;
    }

    // If due date is today or in the future
    return INVOICE_STATUS.PENDING;
  } catch (error) {
    console.error('Error determining invoice status:', error);
    // Default to pending if there's an error
    return INVOICE_STATUS.PENDING;
  }
}

/**
 * Determine lease status based on start and end dates
 * 
 * @param {string|Date|number} startDate - Lease start date
 * @param {string|Date|number} endDate - Lease end date
 * @returns {string} Lease status (Pending, Active, or Expired)
 */
export function determineLeaseStatus(startDate, endDate) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    // Validate that end date is after start date
    if (end <= start) {
      console.warn('End date is before or equal to start date');
      return LEASE_STATUS.EXPIRED;
    }
    
    // Check if lease has expired (end date has passed)
    if (hasDatePassed(endDate)) {
      return LEASE_STATUS.EXPIRED;
    }
    
    // Check if lease is active (start date has passed or is today)
    if (!isFutureDate(startDate)) {
      return LEASE_STATUS.ACTIVE;
    }
    
    // If start date is in the future, lease is pending
    return LEASE_STATUS.PENDING;
  } catch (error) {
    console.error('Error determining lease status:', error);
    // Default to expired if there's an error parsing dates
    return LEASE_STATUS.EXPIRED;
  }
}

/**
 * Check if a status transition is valid
 * 
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Proposed new status
 * @param {string} entityType - Entity type ('invoice' or 'lease')
 * @returns {boolean} True if transition is valid
 */
export function isValidStatusTransition(currentStatus, newStatus, entityType) {
  if (entityType === 'invoice') {
    // Valid invoice status transitions
    const validTransitions = {
      [INVOICE_STATUS.PENDING]: [INVOICE_STATUS.OVERDUE, INVOICE_STATUS.PAID],
      [INVOICE_STATUS.OVERDUE]: [INVOICE_STATUS.PAID],
      [INVOICE_STATUS.PAID]: [] // Paid invoices cannot change status automatically
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || currentStatus === newStatus;
  }
  
  if (entityType === 'lease') {
    // Valid lease status transitions
    const validTransitions = {
      [LEASE_STATUS.PENDING]: [LEASE_STATUS.ACTIVE, LEASE_STATUS.EXPIRED],
      [LEASE_STATUS.ACTIVE]: [LEASE_STATUS.EXPIRED],
      [LEASE_STATUS.EXPIRED]: [] // Expired leases cannot change status
    };
    
    return validTransitions[currentStatus]?.includes(newStatus) || currentStatus === newStatus;
  }
  
  return false;
}

/**
 * Get status priority for sorting (lower number = higher priority)
 * 
 * @param {string} status - Status to get priority for
 * @param {string} entityType - Entity type ('invoice' or 'lease')
 * @returns {number} Priority number
 */
export function getStatusPriority(status, entityType) {
  if (entityType === 'invoice') {
    const priorities = {
      [INVOICE_STATUS.OVERDUE]: 1,
      [INVOICE_STATUS.PENDING]: 2,
      [INVOICE_STATUS.PAID]: 3
    };
    return priorities[status] || 999;
  }
  
  if (entityType === 'lease') {
    const priorities = {
      [LEASE_STATUS.ACTIVE]: 1,
      [LEASE_STATUS.PENDING]: 2,
      [LEASE_STATUS.EXPIRED]: 3
    };
    return priorities[status] || 999;
  }
  
  return 999;
}

/**
 * Get status color for UI display
 * 
 * @param {string} status - Status to get color for
 * @param {string} entityType - Entity type ('invoice' or 'lease')
 * @returns {string} Color code or class name
 */
export function getStatusColor(status, entityType) {
  if (entityType === 'invoice') {
    const colors = {
      [INVOICE_STATUS.PENDING]: '#FFA500', // Orange
      [INVOICE_STATUS.OVERDUE]: '#FF4444', // Red
      [INVOICE_STATUS.PAID]: '#00AA00'     // Green
    };
    return colors[status] || '#666666'; // Gray default
  }
  
  if (entityType === 'lease') {
    const colors = {
      [LEASE_STATUS.PENDING]: '#FFA500',   // Orange
      [LEASE_STATUS.ACTIVE]: '#00AA00',    // Green
      [LEASE_STATUS.EXPIRED]: '#FF4444'   // Red
    };
    return colors[status] || '#666666'; // Gray default
  }
  
  return '#666666';
}

/**
 * Bulk status validation for multiple entities
 * 
 * @param {Array} entities - Array of entities to validate
 * @param {string} entityType - Entity type ('invoice' or 'lease')
 * @returns {Array} Array of {entity, oldStatus, newStatus, changed} objects
 */
export function bulkStatusValidation(entities, entityType) {
  return entities.map(entity => {
    try {
      const oldStatus = entity.status;
      let newStatus;
      
      if (entityType === 'invoice') {
        newStatus = determineInvoiceStatus(entity.date || entity.dueDate, oldStatus);
      } else if (entityType === 'lease') {
        newStatus = determineLeaseStatus(
          entity.bookingDetails?.startDate || entity.startDate,
          entity.bookingDetails?.endDate || entity.endDate
        );
      } else {
        throw new Error(`Unknown entity type: ${entityType}`);
      }
      
      return {
        entity,
        oldStatus,
        newStatus,
        changed: oldStatus !== newStatus
      };
    } catch (error) {
      console.error(`Error validating status for ${entityType}:`, error);
      return {
        entity,
        oldStatus: entity.status,
        newStatus: entity.status,
        changed: false,
        error: error.message
      };
    }
  });
}

// Export all functions and constants
const statusManager = {
  INVOICE_STATUS,
  LEASE_STATUS,
  determineInvoiceStatus,
  determineLeaseStatus,
  isValidStatusTransition,
  getStatusPriority,
  getStatusColor,
  bulkStatusValidation
};

export default statusManager;