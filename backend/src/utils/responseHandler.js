/**
 * Common response handler utilities for controllers
 * Provides consistent response formatting and error handling
 */

/**
 * Send success response with consistent format
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response with consistent format
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} details - Additional error details (optional)
 */
export const sendError = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: message,
    ...(details && { details })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
export const sendCreated = (res, data, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

/**
 * Send bad request response (400)
 * @param {Object} res - Express response object
 * @param {string} message - Bad request message
 */
export const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, message, 400);
};

/**
 * Send unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, 401);
};

/**
 * Send forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
export const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, message, 403);
};

const responseHandler = {
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden
};

export default responseHandler;