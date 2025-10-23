/**
 * Controller helper utilities for common controller operations
 * Provides reusable functions to reduce code duplication
 */

import { sendError, sendBadRequest } from './responseHandler.js';

/**
 * Async handler wrapper to catch errors and pass to error handler
 * @param {Function} fn - Async controller function
 * @returns {Function} - Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Extract admin ID from authenticated user
 * @param {Object} req - Express request object
 * @returns {string} - Admin ID
 * @throws {Error} - If admin ID not found
 */
export const getAdminId = (req) => {
  const adminId = req.user?.userId;
  if (!adminId) {
    throw new Error('Admin ID not found in request');
  }
  return adminId;
};

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - Array of required field names
 * @throws {Error} - If any required field is missing
 */
export const validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(field => 
    !body[field] || (typeof body[field] === 'string' && body[field].trim() === '')
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Log controller action for debugging
 * @param {string} action - Action being performed
 * @param {string} adminId - Admin ID performing the action
 * @param {Object} details - Additional details to log
 */
export const logControllerAction = (action, adminId, details = {}) => {
  console.log(`[CONTROLLER] ${action} - Admin: ${adminId}`, details);
};

/**
 * Extract pagination parameters from query
 * @param {Object} query - Express request query object
 * @returns {Object} - Pagination object with page, limit, skip
 */
export const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Standardized controller function that handles common patterns
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} serviceFunction - Service function to call
 * @param {Object} options - Configuration options
 */
export const handleControllerRequest = async (req, res, serviceFunction, options = {}) => {
  try {
    const {
      requiresAuth = true,
      requiredFields = [],
      successMessage = 'Request completed successfully',
      successStatusCode = 200,
      logAction = null
    } = options;
    
    // Extract admin ID if authentication is required
    let adminId = null;
    if (requiresAuth) {
      adminId = getAdminId(req);
    }
    
    // Validate required fields if specified
    if (requiredFields.length > 0) {
      validateRequiredFields(req.body, requiredFields);
    }
    
    // Log action if specified
    if (logAction && adminId) {
      logControllerAction(logAction, adminId);
    }
    
    // Call service function
    const result = await serviceFunction(req, adminId);
    
    // Send success response
    return res.status(successStatusCode).json({
      success: true,
      message: successMessage,
      ...(result && { data: result })
    });
    
  } catch (error) {
    console.error(`Controller error: ${error.message}`);
    
    // Handle specific error types
    if (error.message.includes('required') || error.message.includes('Missing')) {
      return sendBadRequest(res, error.message);
    }
    
    if (error.message.includes('not found') || error.message.includes('Not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    // Generic error response
    return sendError(res, error.message);
  }
};

const controllerHelpers = {
  asyncHandler,
  getAdminId,
  validateRequiredFields,
  logControllerAction,
  getPaginationParams,
  handleControllerRequest
};

export default controllerHelpers;