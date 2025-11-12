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
  const isProduction = process.env.NODE_ENV === 'production';
  
  const defaultOptions = {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production only
    // For cross-origin frontend/backend deployments we must use 'none' and Secure
    // otherwise the browser will block the cookie. Use 'lax' in development.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    path: '/',
    // Add domain setting for production cross-origin setup
    ...(isProduction && { 
      domain: process.env.COOKIE_DOMAIN || undefined // Allow setting cookie domain via env var
    })
  };

  const cookieOptions = { ...defaultOptions, ...options };
  
  // Debug logging for cookie configuration
  if (process.env.NODE_ENV !== 'production') {
    console.log('Setting auth cookie with options:', cookieOptions);
  }
  
  res.cookie('authToken', token, cookieOptions);
};

/**
 * Clear authentication cookie
 * @param {Object} res - Express response object
 */
export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    // Add domain setting for production cross-origin setup
    ...(isProduction && { 
      domain: process.env.COOKIE_DOMAIN || undefined
    })
  };
  
  res.clearCookie('authToken', clearOptions);
};