const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { client } = require('../utils/db.js');
const { ObjectId } = require('mongodb');
const { setTokenCookie, clearTokenCookie } = require('../utils/cookieUtils.js');
dotenv.config();

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

/**
 * Middleware to authenticate and authorize requests using JWT tokens.
 * Verifies the token from cookies (preferred) or Authorization header and attaches user information to the request object.
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header containing the JWT token
 * @param {Object} req.cookies - Request cookies
 * @param {string} req.cookies.authToken - JWT token stored in cookie
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} If token verification fails or user is not found
 * @returns {void}
 * 
 * The middleware:
 * 1. Extracts and validates JWT token from cookies (preferred) or Authorization header
 * 2. Decodes token and searches for user in database
 * 3. Attempts to find user by multiple identifiers (ObjectId, googleId, email)
 * 4. Retrieves user profile settings
 * 5. Attaches sanitized user data to request object
 * 
 * On failure, returns 401 status with error message
 */
const checkAuth = async (req, res, next) => {
  try {
    // Try to get token from cookies first (preferred), then from Authorization header
    let token = req.cookies?.authToken;
    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("checkAuth error:", err.message);
    res.status(401).json({ message: "Your session is expired. Please login again." });
  }
};

/**
 * Helper function to set authentication token in cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to store
 */
const setAuthCookie = (res, token) => {
  setTokenCookie(res, token);
};

/**
 * Helper function to clear authentication cookie
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  clearTokenCookie(res);
};

module.exports = { checkAuth, setAuthCookie, clearAuthCookie };