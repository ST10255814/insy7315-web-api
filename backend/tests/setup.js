// Jest test setup file
// This file runs before all tests

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';

// Suppress console logs during tests (optional - uncomment if you want cleaner output)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Set up global test configuration
global.TEST_MODE = true;