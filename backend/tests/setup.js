// Jest test setup file
// This file runs before all tests

// Set up test environment variables
process.env.NODE_ENV = 'test';
// Generate a secure test JWT secret instead of hardcoding it
process.env.JWT_SECRET = require('crypto').randomBytes(64).toString('hex');
process.env.MONGO_URI = 'mongodb://localhost:27017/test-rentwise';

// Suppress console logs during tests (optional - uncomment if you want cleaner output)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Set up global test configuration
global.TEST_MODE = true;