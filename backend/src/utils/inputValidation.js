/**
 * Enhanced Input Validation and Sanitization Module
 * Provides comprehensive validation and sanitization for database operations
 */

import { ObjectId } from 'mongodb';

/**
 * Sanitize user input to prevent NoSQL injection
 * @param {any} input - User input to sanitize
 * @returns {any} Sanitized input
 */
export function sanitizeForDatabase(input) {
    if (input === null || input === undefined) {
        return input;
    }

    // Handle arrays
    if (Array.isArray(input)) {
        return input.map(item => sanitizeForDatabase(item));
    }

    // Handle objects (but not ObjectId instances or Date objects)
    if (typeof input === 'object' && !(input instanceof ObjectId) && !(input instanceof Date)) {
        // Remove dangerous operators
        const dangerousOperators = ['$where', '$regex', '$expr', '$jsonSchema', '$function'];
        const sanitized = {};
        
        for (const [key, value] of Object.entries(input)) {
            // Skip dangerous operators
            if (dangerousOperators.includes(key)) {
                continue;
            }
            // Validate key name to prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                continue;
            }
            // Recursively sanitize nested objects
            Object.defineProperty(sanitized, key, {
                value: sanitizeForDatabase(value),
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        return sanitized;
    }

    // Handle strings - escape special characters and check for dangerous patterns
    if (typeof input === 'string') {
        // Remove control characters (null bytes, etc.)
        let sanitized = input.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
        
        // Limit string length to prevent DoS
        if (sanitized.length > 1000) {
            sanitized = sanitized.substring(0, 1000);
        }
        
        return sanitized;
    }

    // Return primitives as-is (numbers, booleans)
    return input;
}

/**
 * Validate and sanitize MongoDB ObjectId
 * @param {string|ObjectId} id - ID to validate
 * @returns {ObjectId} Valid ObjectId
 * @throws {Error} If ID is invalid
 */
export function validateObjectId(id) {
    if (!id) {
        throw new Error('ID is required');
    }

    if (id instanceof ObjectId) {
        return id;
    }

    if (typeof id === 'string') {
        // Check if it's a valid ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error('Invalid ID format');
        }
        
        try {
            return new ObjectId(id);
        } catch (error) {
            throw new Error('Invalid ObjectId: ' + error.message);
        }
    }

    throw new Error('ID must be a string or ObjectId');
}

/**
 * Validate string input with specific constraints
 * @param {string} input - Input to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @param {RegExp} options.pattern - Pattern to match
 * @param {boolean} options.required - Whether input is required
 * @returns {string} Validated input
 */
export function validateString(input, options = {}) {
    const {
        minLength = 0,
        maxLength = 1000,
        pattern = null,
        required = true
    } = options;

    if (!input || typeof input !== 'string') {
        if (required) {
            throw new Error('String input is required');
        }
        return input;
    }

    const sanitized = sanitizeForDatabase(input);

    if (sanitized.length < minLength) {
        throw new Error(`Input must be at least ${minLength} characters long`);
    }

    if (sanitized.length > maxLength) {
        throw new Error(`Input must not exceed ${maxLength} characters`);
    }

    if (pattern && !pattern.test(sanitized)) {
        throw new Error('Input format is invalid');
    }

    return sanitized;
}

/**
 * Validate numeric input
 * @param {number|string} input - Input to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {boolean} options.integer - Whether number must be integer
 * @param {boolean} options.required - Whether input is required
 * @returns {number} Validated number
 */
export function validateNumber(input, options = {}) {
    const {
        min = Number.MIN_SAFE_INTEGER,
        max = Number.MAX_SAFE_INTEGER,
        integer = false,
        required = true
    } = options;

    if (input === null || input === undefined || input === '') {
        if (required) {
            throw new Error('Number input is required');
        }
        return input;
    }

    const num = Number(input);
    
    if (isNaN(num)) {
        throw new Error('Input must be a valid number');
    }

    if (integer && !Number.isInteger(num)) {
        throw new Error('Input must be an integer');
    }

    if (num < min || num > max) {
        throw new Error(`Number must be between ${min} and ${max}`);
    }

    return num;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string} Validated email
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Email is required');
    }

    const sanitized = sanitizeForDatabase(email).toLowerCase();
    // Use a more secure regex pattern to prevent ReDoS attacks
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(sanitized)) {
        throw new Error('Invalid email format');
    }

    if (sanitized.length > 254) {
        throw new Error('Email address is too long');
    }

    return sanitized;
}

/**
 * Validate date input
 * @param {string|Date} date - Date to validate
 * @returns {Date} Validated date
 */
export function validateDate(date) {
    if (!date) {
        throw new Error('Date is required');
    }

    let validDate;
    
    if (date instanceof Date) {
        validDate = date;
    } else if (typeof date === 'string') {
        validDate = new Date(date);
    } else {
        throw new Error('Date must be a string or Date object');
    }

    if (isNaN(validDate.getTime())) {
        throw new Error('Invalid date format');
    }

    // Check for reasonable date range (not before 1900, not more than 10 years in future)
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);

    if (validDate < minDate || validDate > maxDate) {
        throw new Error('Date is outside acceptable range');
    }

    return validDate;
}

/**
 * Create safe query object by validating and sanitizing all inputs
 * @param {Object} queryParams - Query parameters
 * @returns {Object} Safe query object
 */
export function createSafeQuery(queryParams) {
    if (!queryParams || typeof queryParams !== 'object') {
        return {};
    }

    const safeQuery = {};
    
    for (const [key, value] of Object.entries(queryParams)) {
        // Validate field names
        if (typeof key !== 'string' || key.startsWith('$') || key.includes('.')) {
            continue; // Skip potentially dangerous field names
        }

        // Validate key name to prevent prototype pollution
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }

        // Sanitize values using safe assignment
        Object.defineProperty(safeQuery, key, {
            value: sanitizeForDatabase(value),
            writable: true,
            enumerable: true,
            configurable: true
        });
    }

    return safeQuery;
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated pagination params
 */
export function validatePagination(page, limit) {
    const validatedPage = validateNumber(page || 1, {
        min: 1,
        max: 10000,
        integer: true,
        required: false
    });

    const validatedLimit = validateNumber(limit || 20, {
        min: 1,
        max: 100,
        integer: true,
        required: false
    });

    return {
        page: validatedPage || 1,
        limit: validatedLimit || 20,
        skip: ((validatedPage || 1) - 1) * (validatedLimit || 20)
    };
}

/**
 * Validate and sanitize sort parameters
 * @param {Object} sortParams - Sort parameters
 * @param {Array} allowedFields - Allowed fields for sorting
 * @returns {Object} Safe sort object
 */
export function validateSort(sortParams, allowedFields = []) {
    if (!sortParams || typeof sortParams !== 'object') {
        return {};
    }

    const safeSort = {};
    
    for (const [field, direction] of Object.entries(sortParams)) {
        // Only allow whitelisted fields
        if (!allowedFields.includes(field)) {
            continue;
        }

        // Only allow 1 or -1 for sort direction
        if (direction === 1 || direction === -1 || direction === '1' || direction === '-1') {
            Object.defineProperty(safeSort, field, {
                value: parseInt(direction),
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }

    return safeSort;
}

export default {
    sanitizeForDatabase,
    validateObjectId,
    validateString,
    validateNumber,
    validateEmail,
    validateDate,
    createSafeQuery,
    validatePagination,
    validateSort
};