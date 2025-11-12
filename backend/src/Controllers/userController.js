import userService from "../Services/userService.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookieUtils.js";
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
} from "../utils/responseHandler.js";
import {
  asyncHandler,
  validateRequiredFields,
  logControllerAction,
} from "../utils/controllerHelpers.js";

/**
 * Controller to handle user registration
 */
export const register = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    validateRequiredFields(req.body, [
      "email",
      "password",
      "username",
      "fullname",
    ]);

    // Register user
    const result = await userService.register(req.body);

    // Log activity
    logControllerAction("User Registration", null, { email: req.body.email });

    // Send success response
    sendCreated(res, result, "User registered successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle user login
 */
export const login = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    validateRequiredFields(req.body, ["prefLogin", "password"]);

    // Authenticate user
    const result = await userService.login(req.body);

    // Set JWT token in HTTP-only cookie
    setAuthCookie(res, result.token);

    // Remove token from response (it's in cookie now)
    const { token: _, ...userResponse } = result;

    // Log activity
    logControllerAction("User Login", result.user._id, {
      email: result.user.email,
    });

    // Send success response
    sendSuccess(res, userResponse, "User logged in successfully");
  } catch (err) {
    sendBadRequest(res, err.message, err.details);
  }
});

/**
 * Controller to handle user logout
 */
export const logout = asyncHandler(async (req, res) => {
  try {
    // Clear the authentication cookie
    clearAuthCookie(res);

    // Log activity if user info is available
    if (req.user?.userId) {
      logControllerAction("User Logout", req.user.userId);
    }

    // Send success response
    sendSuccess(res, null, "User logged out successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

/**
 * Controller to handle password reset
 */
export const resetPassword = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    validateRequiredFields(req.body, ["email"]);

    // Send reset email
    const result = await userService.resetPassword(req.body);

    // Log activity
    logControllerAction("Password Reset Request", req.body.email, {
      email: req.body.email,
    });

    // Send success response
    sendSuccess(res, result, "Reset email sent successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

// Controller to update password
export const updatePassword = asyncHandler(async (req, res) => {
  try {
    // Validate required fields
    validateRequiredFields(req.body, ["newPassword"]);
    validateRequiredFields(req.user, ["userId"]);
    // Update password
    const result = await userService.updatePassword(req.body, req.user.userId);
    // Log activity
    logControllerAction("Password Update", req.user.userId, {
      email: req.body.email,
    });
    // Send success response
    sendSuccess(res, result, "Password updated successfully");
  } catch (error) {
    sendBadRequest(res, error.message, error.details);
  }
});

const userController = {
  register,
  login,
  logout,
  resetPassword,
  updatePassword,
};

export default userController;
