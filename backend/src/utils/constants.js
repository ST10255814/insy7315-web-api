/**
 * Application constants and configuration values
 * Centralized location for commonly used constants
 */

// Database configuration
export const DATABASE = {
    NAME: 'RentWise',
    COLLECTIONS: {
        SYSTEM_USERS: 'System-Users',
        LEASES: 'Leases',
        INVOICES: 'Invoices',
        LISTINGS: 'Listings',
        BOOKINGS: 'Bookings-and-Tenants',
        MAINTENANCE: 'Maintenance-Requests',
        ACTIVITY_LOGS: 'User-Activity-Logs',
        REVENUE: 'Revenue'
    }
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// User roles
export const USER_ROLES = {
    LANDLORD: 'landlord',
    TENANT: 'tenant',
    ADMIN: 'admin'
};

// Invoice statuses
export const INVOICE_STATUS = {
    PENDING: 'Pending',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled'
};

// Lease statuses
export const LEASE_STATUS = {
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    TERMINATED: 'Terminated',
    PENDING: 'Pending'
};

// Maintenance request priorities
export const MAINTENANCE_PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent'
};

// Maintenance request statuses
export const MAINTENANCE_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

// Listing statuses
export const LISTING_STATUS = {
    AVAILABLE: 'Available',
    RENTED: 'Rented',
    MAINTENANCE: 'Under Maintenance',
    UNAVAILABLE: 'Unavailable'
};

// Booking statuses
export const BOOKING_STATUS = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed'
};

// Activity log actions
export const ACTIVITY_ACTIONS = {
    USER_LOGIN: 'User Login',
    USER_LOGOUT: 'User Logout',
    USER_REGISTRATION: 'User Registration',
    CREATE_LISTING: 'Create Listing',
    UPDATE_LISTING: 'Update Listing',
    DELETE_LISTING: 'Delete Listing',
    CREATE_LEASE: 'Create Lease',
    UPDATE_LEASE: 'Update Lease',
    CREATE_INVOICE: 'Create Invoice',
    UPDATE_INVOICE: 'Update Invoice',
    MARK_INVOICE_PAID: 'Mark Invoice Paid',
    CREATE_MAINTENANCE: 'Create Maintenance Request',
    UPDATE_MAINTENANCE: 'Update Maintenance Request',
    REVENUE_CALCULATION: 'Revenue Calculation'
};

// Date formats
export const DATE_FORMATS = {
    ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    DATE_ONLY: 'YYYY-MM-DD',
    DISPLAY: 'DD/MM/YYYY',
    INPUT: 'DD-MM-YYYY',
    TIME: 'HH:mm:ss'
};

// Validation patterns
export const VALIDATION_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
    DATE: /^\d{2}-\d{2}-\d{4}$/,
    AMOUNT: /^\d+(\.\d{1,2})?$/
};

// API Response messages
export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Created successfully',
        UPDATED: 'Updated successfully',
        DELETED: 'Deleted successfully',
        FETCHED: 'Fetched successfully',
        LOGIN: 'Login successful',
        LOGOUT: 'Logout successful',
        REGISTRATION: 'Registration successful'
    },
    ERROR: {
        INVALID_CREDENTIALS: 'Invalid credentials',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Resource not found',
        VALIDATION_FAILED: 'Validation failed',
        INTERNAL_ERROR: 'Internal server error',
        MISSING_FIELDS: 'Missing required fields',
        DUPLICATE_ENTRY: 'Duplicate entry found'
    }
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// Cache durations (in seconds)
export const CACHE_DURATION = {
    SHORT: 300,    // 5 minutes
    MEDIUM: 1800,  // 30 minutes
    LONG: 3600,    // 1 hour
    VERY_LONG: 86400  // 24 hours
};

// Export all constants as a single object
export const CONSTANTS = {
    DATABASE,
    HTTP_STATUS,
    USER_ROLES,
    INVOICE_STATUS,
    LEASE_STATUS,
    MAINTENANCE_PRIORITY,
    MAINTENANCE_STATUS,
    LISTING_STATUS,
    BOOKING_STATUS,
    ACTIVITY_ACTIONS,
    DATE_FORMATS,
    VALIDATION_PATTERNS,
    MESSAGES,
    PAGINATION,
    CACHE_DURATION
};

export default CONSTANTS;