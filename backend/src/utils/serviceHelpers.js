/**
 * Service helper utilities for common service operations
 * Provides reusable functions to reduce code duplication in services
 */

import { client } from './db.js';
import Object from './ObjectIDConvert.js';

const { toObjectId } = Object;

/**
 * Generic service function wrapper for error handling
 * @param {Function} fn - Service function to wrap
 * @param {string} operation - Operation name for error messages
 * @returns {Function} - Wrapped function with error handling
 */
export const serviceHandler = (fn, operation) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Service error in ${operation}:`, error);
      throw new Error(`${operation} failed: ${error.message}`);
    }
  };
};

/**
 * Validate admin ID format and convert to ObjectId
 * @param {string} adminId - Admin ID to validate
 * @returns {ObjectId} - Converted ObjectId
 * @throws {Error} - If admin ID is invalid
 */
export const validateAndConvertAdminId = (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }
  
  try {
    return toObjectId(adminId);
  } catch {
    throw new Error('Invalid admin ID format');
  }
};

/**
 * Create activity log entry
 * @param {string} action - Action performed
 * @param {string} adminId - Admin ID performing the action
 * @param {string} detail - Detailed description of the action
 * @param {Object} additionalData - Additional data to include
 */
export const logActivity = async (action, adminId, detail, additionalData = {}) => {
  try {
    const db = client.db('RentWise');
    const activityCollection = db.collection('User-Activity-Logs');
    
    const activityLog = {
      action,
      adminId: toObjectId(adminId),
      detail,
      timestamp: new Date(),
      ...additionalData
    };
    
    await activityCollection.insertOne(activityLog);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking main functionality
  }
};

/**
 * Get database collection with error handling
 * @param {string} collectionName - Name of the collection
 * @returns {Object} - MongoDB collection object
 */
export const getCollection = (collectionName) => {
  try {
    const db = client.db('RentWise');
    return db.collection(collectionName);
  } catch (error) {
    throw new Error(`Failed to access collection ${collectionName}: ${error.message}`);
  }
};

/**
 * Validate required service parameters
 * @param {Object} params - Parameters object
 * @param {Array<string>} requiredParams - Array of required parameter names
 * @throws {Error} - If any required parameter is missing
 */
export const validateServiceParams = (params, requiredParams) => {
  const missing = requiredParams.filter(param => {
    const value = params[param];
    return value === undefined || value === null || 
           (typeof value === 'string' && value.trim() === '');
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
};

/**
 * Create standardized service response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {Object} metadata - Additional metadata
 * @returns {Object} - Standardized response object
 */
export const createServiceResponse = (data, message = 'Operation completed successfully', metadata = {}) => {
  return {
    success: true,
    message,
    data,
    ...metadata
  };
};

/**
 * Handle service errors consistently
 * @param {Error} error - Error object
 * @param {string} operation - Operation that failed
 * @param {Object} context - Additional context for debugging
 * @throws {Error} - Standardized error
 */
export const handleServiceError = (error, operation, context = {}) => {
  console.error(`Service error in ${operation}:`, {
    message: error.message,
    stack: error.stack,
    context
  });
  
  // Re-throw with consistent format
  throw new Error(`${operation} failed: ${error.message}`);
};

/**
 * Batch process items with error handling
 * @param {Array} items - Items to process
 * @param {Function} processor - Function to process each item
 * @param {Object} options - Processing options
 * @returns {Object} - Results summary
 */
export const batchProcess = async (items, processor, options = {}) => {
  const { 
    continueOnError = true, 
    batchSize = 10,
    logProgress = false 
  } = options;
  
  const results = {
    total: items.length,
    processed: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    await Promise.allSettled(
      batch.map(async (item, index) => {
        try {
          await processor(item, i + index);
          results.processed++;
          
          if (logProgress && (results.processed % 10 === 0)) {
            console.log(`Processed ${results.processed}/${results.total} items`);
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            index: i + index,
            item,
            error: error.message
          });
          
          if (!continueOnError) {
            throw error;
          }
        }
      })
    );
  }
  
  return results;
};

const serviceHelpers = {
  serviceHandler,
  validateAndConvertAdminId,
  logActivity,
  getCollection,
  validateServiceParams,
  createServiceResponse,
  handleServiceError,
  batchProcess
};

export default serviceHelpers;