/**
 * Utility functions for managing JWT tokens in cookies
 */

/**
 * Set JWT token in HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to store
 * @param {Object} options - Cookie options
 */
export const setAuthCookie = (res, token, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000, 
    path: '/',
  };

  const cookieOptions = { ...defaultOptions, ...options };
  
  res.cookie('authToken', token, cookieOptions);
};

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 */
export const clearAuthCookie = (res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};