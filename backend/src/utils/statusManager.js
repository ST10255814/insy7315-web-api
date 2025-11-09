import { parseDate, hasDatePassed, isFutureDate } from './dateUtils.js';

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
 * Booking status enumeration
 */
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
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
 * Determine booking status based on check-in and check-out dates
 * 
 * @param {string|Date|number} checkInDate - Booking check-in date
 * @param {string|Date|number} checkOutDate - Booking check-out date
 * @param {string} currentStatus - Current booking status
 * @returns {string} Booking status (Pending, Confirmed, Active, Expired, Completed, or Cancelled)
 */
export function determineBookingStatus(checkInDate, checkOutDate, currentStatus = null) {
  try {
    // Don't change status if booking is already cancelled or completed
    if (currentStatus === BOOKING_STATUS.CANCELLED || currentStatus === BOOKING_STATUS.COMPLETED) {
      return currentStatus;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const checkIn = parseDate(checkInDate);
    const checkOut = parseDate(checkOutDate);
    
    // Validate that check-out date is after check-in date
    if (checkOut <= checkIn) {
      console.warn('Check-out date is before or equal to check-in date');
      return BOOKING_STATUS.EXPIRED;
    }
    
    // Check if booking has expired (check-out date has passed)
    if (hasDatePassed(checkOutDate)) {
      return BOOKING_STATUS.EXPIRED;
    }
    
    // Check if booking is active (check-in date has passed or is today, but check-out hasn't passed)
    if (!isFutureDate(checkInDate) && !hasDatePassed(checkOutDate)) {
      return BOOKING_STATUS.ACTIVE;
    }
    
    // If check-in date is in the future, keep as Confirmed (or Pending if not confirmed yet)
    if (isFutureDate(checkInDate)) {
      // If current status is Pending, keep it as Pending
      // If current status is Confirmed or any confirmed variation, keep it as Confirmed
      if (currentStatus === BOOKING_STATUS.PENDING || currentStatus === 'Pending') {
        return BOOKING_STATUS.PENDING;
      }
      return BOOKING_STATUS.CONFIRMED;
    }
    
    // Default to current status if provided, otherwise Confirmed
    return currentStatus || BOOKING_STATUS.CONFIRMED;
  } catch (error) {
    console.error('Error determining booking status:', error);
    // Default to current status or expired if there's an error parsing dates
    return currentStatus || BOOKING_STATUS.EXPIRED;
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
  
  if (entityType === 'booking') {
    // Valid booking status transitions
    const validTransitions = {
      [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.ACTIVE, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.ACTIVE]: [BOOKING_STATUS.EXPIRED, BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.EXPIRED]: [BOOKING_STATUS.COMPLETED],
      [BOOKING_STATUS.COMPLETED]: [], // Completed bookings cannot change status
      [BOOKING_STATUS.CANCELLED]: [] // Cancelled bookings cannot change status
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
  
  if (entityType === 'booking') {
    const priorities = {
      [BOOKING_STATUS.ACTIVE]: 1,
      [BOOKING_STATUS.CONFIRMED]: 2,
      [BOOKING_STATUS.PENDING]: 3,
      [BOOKING_STATUS.EXPIRED]: 4,
      [BOOKING_STATUS.COMPLETED]: 5,
      [BOOKING_STATUS.CANCELLED]: 6
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
  
  if (entityType === 'booking') {
    const colors = {
      [BOOKING_STATUS.PENDING]: '#FFA500',    // Orange
      [BOOKING_STATUS.CONFIRMED]: '#0099FF',  // Blue
      [BOOKING_STATUS.ACTIVE]: '#00AA00',     // Green
      [BOOKING_STATUS.EXPIRED]: '#FF4444',    // Red
      [BOOKING_STATUS.COMPLETED]: '#888888',  // Gray
      [BOOKING_STATUS.CANCELLED]: '#000000'   // Black
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
      } else if (entityType === 'booking') {
        newStatus = determineBookingStatus(
          entity.newBooking?.checkInDate || entity.checkInDate,
          entity.newBooking?.checkOutDate || entity.checkOutDate,
          oldStatus
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
  BOOKING_STATUS,
  determineInvoiceStatus,
  determineLeaseStatus,
  determineBookingStatus,
  isValidStatusTransition,
  getStatusPriority,
  getStatusColor,
  bulkStatusValidation
};

export default statusManager;