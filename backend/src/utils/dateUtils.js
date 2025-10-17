/**
 * Date utility functions for parsing, validation, and formatting
 * Provides consistent date handling across the application
 */

/**
 * Helper function to parse dates flexibly
 * Supports multiple date formats: DD-MM-YYYY, YYYY-MM-DD, Date objects, and timestamps
 * 
 * @param {string|Date|number} dateInput - The date to parse
 * @returns {Date} Parsed Date object
 * @throws {Error} If date cannot be parsed
 */
export function parseDate(dateInput) {
  // If already a Date object, return it
  if (dateInput instanceof Date) {
    return new Date(dateInput);
  }
  
  // If it's a string, try different parsing methods
  if (typeof dateInput === 'string') {
    // Try DD-MM-YYYY format first
    if (dateInput.includes('-') && dateInput.split('-').length === 3) {
      const parts = dateInput.split('-');
      // Check if it's DD-MM-YYYY or YYYY-MM-DD
      if (parts[0].length === 4) {
        // YYYY-MM-DD format
        return new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        // DD-MM-YYYY format
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    // Fall back to native Date parsing
    return new Date(dateInput);
  }
  
  // If it's a number (timestamp), create Date object
  if (typeof dateInput === 'number') {
    return new Date(dateInput);
  }
  
  throw new Error(`Unable to parse date: ${dateInput}`);
}

/**
 * Check if a date has passed (is in the past)
 * 
 * @param {string|Date|number} dateInput - The date to check
 * @param {boolean} endOfDay - Whether to compare to end of today (default: false)
 * @returns {boolean} True if date has passed
 */
export function hasDatePassed(dateInput, endOfDay = false) {
  try {
    const inputDate = parseDate(dateInput);
    const today = new Date();
    
    if (endOfDay) {
      today.setHours(23, 59, 59, 999); // Set to end of day
    } else {
      today.setHours(0, 0, 0, 0); // Set to start of day
    }
    
    return inputDate < today;
  } catch (error) {
    console.error('Error checking if date has passed:', error);
    return false; // Default to false if date parsing fails
  }
}

/**
 * Check if a date is today
 * 
 * @param {string|Date|number} dateInput - The date to check
 * @returns {boolean} True if date is today
 */
export function isToday(dateInput) {
  try {
    const inputDate = parseDate(dateInput);
    const today = new Date();
    
    return inputDate.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
}

/**
 * Check if a date is in the future
 * 
 * @param {string|Date|number} dateInput - The date to check
 * @returns {boolean} True if date is in the future
 */
export function isFutureDate(dateInput) {
  try {
    const inputDate = parseDate(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    return inputDate > today;
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
}

/**
 * Validate if a date falls between start and end dates (inclusive)
 * 
 * @param {string|Date|number} checkDate - Date to validate
 * @param {string|Date|number} startDate - Start of range
 * @param {string|Date|number} endDate - End of range
 * @returns {boolean} True if date is within range
 */
export function isDateInRange(checkDate, startDate, endDate) {
  try {
    const check = parseDate(checkDate);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    return check >= start && check <= end;
  } catch (error) {
    console.error('Error checking if date is in range:', error);
    return false;
  }
}

/**
 * Format date for display purposes
 * 
 * @param {string|Date|number} dateInput - Date to format
 * @param {string} format - Format type ('short', 'long', 'iso')
 * @returns {string} Formatted date string
 */
export function formatDate(dateInput, format = 'short') {
  try {
    const date = parseDate(dateInput);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-ZA'); // DD/MM/YYYY format
      case 'long':
        return date.toLocaleDateString('en-ZA', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'iso':
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      case 'dd-mm-yyyy':
        return date.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY format
      default:
        return date.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Get the difference between two dates in days
 * 
 * @param {string|Date|number} date1 - First date
 * @param {string|Date|number} date2 - Second date
 * @returns {number} Difference in days (positive if date1 > date2)
 */
export function getDateDifference(date1, date2) {
  try {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    
    const diffTime = d1.getTime() - d2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating date difference:', error);
    return 0;
  }
}

// Export all functions
const dateUtils = {
  parseDate,
  hasDatePassed,
  isToday,
  isFutureDate,
  isDateInRange,
  formatDate,
  getDateDifference
};

export default dateUtils;