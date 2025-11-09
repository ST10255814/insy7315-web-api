import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import * as validation from '../utils/validation.js';
import { sendResetPasswordEmail } from '../emails/emailHandler.js';
import { getCollection, logActivity } from '../utils/serviceHelpers.js';

/**
 * Helper function to parse fullname into firstName and surname
 * @param {string} fullname - Full name to parse
 * @returns {Object} - Object containing firstName and surname
 */
const parseFullname = (fullname) => {
    const nameParts = fullname.trim().split(/\s+/);
    
    if (nameParts.length === 1) {
        return { firstName: nameParts[0], surname: "" };
    } else if (nameParts.length >= 2) {
        return { 
            firstName: nameParts[0], 
            surname: nameParts.slice(1).join(" ") 
        };
    } else {
        throw new Error("Please provide a valid name");
    }
};

/**
 * Helper function to validate user input
 * @param {Object} userData - User data to validate
 */
const validateUserData = (userData) => {
    const { email, password, username, firstName, surname } = userData;
    
    // Sanitize inputs
    validation.sanitizeInput(email);
    validation.sanitizeInput(password);
    validation.sanitizeInput(username);
    validation.sanitizeInput(firstName);
    validation.sanitizeInput(surname);

    // Validate inputs
    if (!validation.validateEmail(email.toLowerCase())) {
        throw new Error("Invalid email format or contains inappropriate content");
    }
    
    if (!validation.validatePassword(password)) {
        throw new Error("Password must be at least 8 characters with letters and numbers, and cannot contain inappropriate content");
    }
    
    if (!validation.validateUsername(username.toLowerCase())) {
        throw new Error("Username contains inappropriate content or invalid format");
    }
};

/**
 * Check if user already exists
 * @param {Object} systemUsers - Users collection
 * @param {string} email - Email to check
 * @param {string} username - Username to check
 */
const checkUserExists = async (systemUsers, email, username) => {
    const existingUsername = await systemUsers.findOne({ username: username });
    if (existingUsername) {
        throw new Error("Username already taken");
    }

    const existingUser = await systemUsers.findOne({ email: email });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }
};

/**
 * Service to handle user registration
 */
const register = async (data) => {
    try {
        const { email, password, username, fullname } = data;

        // Check if all fields are provided (preserve original validation)
        if (!email || !password || !username || !fullname) {
            throw new Error("Please provide all required fields");
        }
        
        const systemUsers = getCollection('System-Users');

    // Parse fullname into firstName and surname
    const { firstName, surname } = parseFullname(fullname);

    // Validate user data
    validateUserData({ email, password, username, firstName, surname });

    // Check if user already exists
    await checkUserExists(systemUsers, email, username);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
        email: email,
        password: hashedPassword,
        username: username,
        firstName: firstName,
        surname: surname,
        role: 'landlord', // Default role for website registration
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Insert new user into database
    await systemUsers.insertOne(newUser);

    // Create response data
    const fullnameResponse = `${firstName} ${surname}`.trim();
    
    return { 
        fullname: fullnameResponse, 
        email: newUser.email, 
        createdAt: newUser.createdAt 
    };
    } catch (err) {
        throw new Error("Registration failed: " + err.message);
    }
};

/**
 * Helper function to validate login credentials
 * @param {string} prefLogin - Email or username
 * @param {string} password - Password
 */
const validateLoginData = (prefLogin, password) => {
    validation.sanitizeInput(prefLogin);
    validation.sanitizeInput(password);

    // Validate email/username
    if (prefLogin.includes('@')) {
        if (!validation.validateEmail(prefLogin.toLowerCase())) {
            throw new Error("Invalid email format or contains inappropriate content");
        }
    } else {
        if (!validation.validateUsername(prefLogin.toLowerCase())) {
            throw new Error("Username contains inappropriate content or invalid format");
        }
    }
    
    if (!validation.validatePassword(password)) {
        throw new Error("Invalid password format");
    }
};

/**
 * Helper function to find user by email or username
 * @param {Object} systemUsers - Users collection
 * @param {string} prefLogin - Email or username
 * @returns {Object} - User object or null
 */
const findUserByCredentials = async (systemUsers, prefLogin) => {
    if (prefLogin.includes('@')) {
        return await systemUsers.findOne({ email: prefLogin });
    } else {
        return await systemUsers.findOne({ username: prefLogin });
    }
};

//helper function to check role of user
async function checkUserRole(userId, requiredRole) {
    const systemUsers = getCollection('System-Users');
    const user = await systemUsers.findOne({ _id: userId });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role !== requiredRole) {
        throw new Error("User does not have the required role");
    }
    return true;
};

/**
 * Service to handle user login
 */
const login = async (data) => {
    try {
        const { prefLogin, password } = data;

        // Check if all fields are provided (preserve original validation)
        if (!prefLogin || !password) {
            throw new Error("Please provide all required fields");
        }
        
        const systemUsers = getCollection('System-Users');

    // Validate login data
    validateLoginData(prefLogin, password);

    // Find user by email or username
    const user = await findUserByCredentials(systemUsers, prefLogin);
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const requiredRole = 'landlord'; // Example role check
    const hasRole = await checkUserRole(user._id, requiredRole);
    
    if (!hasRole) {
        throw new Error("User does not have the required role");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Create fullname from firstName and surname
    const fullname = `${user.firstName || ''} ${user.surname || ''}`.trim();

    // Import JWT utilities
    const { generateToken } = await import('../utils/jwtUtils.js');

    // Create and sign JWT token using secure utilities
    const token = generateToken({
        userId: user._id,
        fullname: fullname,
        role: user.role,
        email: user.email
    });
    
    // Add fullname to user object for response
    const userResponse = {
        ...user,
        fullname: fullname
    };

    // Log activity
    await logActivity('User Login', user._id, `User ${user.username} logged in`);
    
    return { token, user: userResponse };
    } catch (err) {
        throw new Error("Login failed: " + err.message);
    }
};

/**
 * Service to handle password reset
 */
const resetPassword = async (data) => {
    try {
        const { email, name } = data;

        if (!email || !name) {
            throw new Error("No email was found");
        }

        // Send password reset email
        await sendResetPasswordEmail(email, name, process.env.RESET_PASSWORD_URL);
        
        return { message: 'Password reset email sent successfully' };
    } catch (err) {
        throw new Error("Failed to send reset email: " + err.message);
    }
};

const userService = { register, login, resetPassword };
export default userService;