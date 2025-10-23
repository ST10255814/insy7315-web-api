/**
 * Centralized utilities index file
 * Provides easy access to all utility modules
 */

// Core utilities
export { default as db, client, mongoConnection } from './db.js';
export { default as dbOperations } from './dbOperations.js';

// Helper utilities
export { default as responseHandler } from './responseHandler.js';
export { default as controllerHelpers } from './controllerHelpers.js';
export { default as serviceHelpers } from './serviceHelpers.js';

// Data utilities
export { default as Object } from './ObjectIDConvert.js';
export * as validation from './validation.js';
export * as dateUtils from './dateUtils.js';

// ID and formatting utilities
export * as idGenerator from './idGenerator.js';
export * as invoiceHelpers from './invoiceHelpers.js';

// Status and state management
export * as statusManager from './statusManager.js';

// Authentication and security
export * as cookieUtils from './cookieUtils.js';
export { default as arcjet } from './arcjet.js';

// External services
export { default as cloudinary, upload } from './cloudinary.js';

// Specialized database operations
export { default as invoiceDbOperations } from './invoiceDbOperations.js';
export { default as revenueDbOperations } from './revenueDbOperations.js';

/**
 * Commonly used utility combinations
 */
export const commonUtils = {
    // Database helpers
    db: () => import('./db.js'),
    dbOps: () => import('./dbOperations.js'),
    
    // Controller helpers
    responses: () => import('./responseHandler.js'),
    controllers: () => import('./controllerHelpers.js'),
    
    // Service helpers  
    services: () => import('./serviceHelpers.js'),
    validation: () => import('./validation.js'),
    
    // Data conversion
    objectId: () => import('./ObjectIDConvert.js'),
    dates: () => import('./dateUtils.js')
};

/**
 * Quick access functions for commonly used utilities
 */
export const quickAccess = {
    // Quick database access
    getCollection: (name) => {
        const { client } = require('./db.js');
        return client.db('RentWise').collection(name);
    },
    
    // Quick ObjectId conversion
    toObjectId: (id) => {
        const { toObjectId } = require('./ObjectIDConvert.js');
        return toObjectId(id);
    },
    
    // Quick validation
    validate: {
        email: (email) => {
            const { validateEmail } = require('./validation.js');
            return validateEmail(email);
        },
        password: (password) => {
            const { validatePassword } = require('./validation.js');
            return validatePassword(password);
        }
    }
};

export default {
    ...commonUtils,
    quickAccess
};