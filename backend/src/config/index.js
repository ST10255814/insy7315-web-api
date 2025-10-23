/**
 * Application configuration
 * Centralizes environment variables and app settings
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Server configuration
 */
export const serverConfig = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
};

/**
 * Database configuration
 */
export const databaseConfig = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/rentwise',
    databaseName: 'RentWise'
};

/**
 * JWT configuration
 */
export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};

/**
 * CORS configuration
 */
export const corsConfig = {
    allowedOrigins: [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000',
        'https://rentwiseproperty.onrender.com',
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * Security configuration
 */
export const securityConfig = {
    helmet: {
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                    "'self'",
                    "http://127.0.0.1:5000",
                    "http://localhost:5000",
                    "http://localhost:3000",
                    "https://rentwiseproperty.onrender.com",
                ],
            },
        },
    }
};

/**
 * Email configuration
 */
export const emailConfig = {
    resetPasswordUrl: process.env.RESET_PASSWORD_URL || 'http://localhost:3000/reset-password'
};

/**
 * Cloudinary configuration
 */
export const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
};

/**
 * Rate limiting configuration
 */
export const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
};

/**
 * File upload configuration
 */
export const uploadConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFilesPerUpload: 10
};

/**
 * Application settings
 */
export const appConfig = {
    apiPrefix: '/api',
    defaultUserRole: 'landlord',
    bcryptSaltRounds: 10
};

/**
 * Export all configurations as a single object
 */
export const config = {
    server: serverConfig,
    database: databaseConfig,
    jwt: jwtConfig,
    cors: corsConfig,
    security: securityConfig,
    email: emailConfig,
    cloudinary: cloudinaryConfig,
    rateLimit: rateLimitConfig,
    upload: uploadConfig,
    app: appConfig
};

export default config;