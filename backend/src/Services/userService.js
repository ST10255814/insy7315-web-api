import { client } from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();
import * as validation from '../utils/validation.js';
import { sendResetPasswordEmail } from '../emails/emailHandler.js';

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  throw new Error("Invalid id format");
}

//Service to handle user registration
async function register(data){
    try{
        const db = client.db('RentWise');
    const systemUsers = db.collection('System-Users');

    const {email, password, username, fullname} = data;

    //check if all fields are provided
    if(!email || !password || !username || !fullname){
        throw new Error("Please provide all required fields");
    }

    validation.sanitizeInput(email);
    validation.sanitizeInput(password);
    validation.sanitizeInput(username);
    validation.sanitizeInput(fullname);

    // Validate inputs and throw errors if validation fails
    if (!validation.validateEmail(email.toLowerCase())) {
        throw new Error("Invalid email format or contains inappropriate content");
    }
    
    if (!validation.validatePassword(password)) {
        throw new Error("Password must be at least 8 characters with letters and numbers, and cannot contain inappropriate content");
    }
    
    if (!validation.validateUsername(username.toLowerCase())) {
        throw new Error("Username contains inappropriate content or invalid format");
    }
    
    if (!validation.validateFullname(fullname.toLowerCase())) {
        throw new Error("Full name contains inappropriate content");
    }

    //check if username already exists
    const existingUsername = await systemUsers.findOne({ username: username });
    if(existingUsername){
        throw new Error("Username already taken");
    }

    //check if user already exists
    const existingUser = await systemUsers.findOne({ email: email });
    if(existingUser){
        throw new Error("User already exists with this email");
    }

    //salt & hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //assign default role value
    const role = 'landlord';

    //create new user
    const newUser = {
        email: email,
        password: hashedPassword,
        username: username,
        fullname: fullname,
        role: role, //default value when registering on the website
        createdAt: new Date(),
        updatedAt: new Date()
    }

    //insert new user into database
    await systemUsers.insertOne(newUser);

    return { fullname: newUser.fullname, email: newUser.email, createdAt: newUser.createdAt };
    }
    catch(err){
        throw new Error("Registration failed: " + err.message);
    }
}

async function login(data){
    try{
        const db = client.db('RentWise');
        const systemUsers = db.collection('System-Users');

        const {prefLogin, password} = data;

        //check if all fields are provided
        if(!prefLogin || !password){
            throw new Error("Please provide all required fields");
        }

        validation.sanitizeInput(prefLogin);
        validation.sanitizeInput(password);

        //validate email/username
        if(prefLogin.includes('@')){
            if (!validation.validateEmail(prefLogin.toLowerCase())) {
                throw new Error("Invalid email format or contains inappropriate content");
            }
        }else{
            if (!validation.validateUsername(prefLogin.toLowerCase())) {
                throw new Error("Username contains inappropriate content or invalid format");
            }
        }
        
        if (!validation.validatePassword(password)) {
            throw new Error("Invalid password format");
        }

        //check if user exists
        if(prefLogin.includes('@')){
            var user = await systemUsers.findOne({ email: prefLogin});
        }else{
            var user = await systemUsers.findOne({ username: prefLogin});
        }

        if(!user){
            throw new Error("Invalid email or password");
        }

        //compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid email or password");
        }

        //create and sign JWT token
        const token = jwt.sign(
            { userId: user._id, fullname: user.fullname, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { token, user };

    }
    catch(err){
        throw new Error("Login failed: " + err.message);
    }
}

async function resetPassword(data) {
    try {
        const { email, name } = data;

        if(!email || !name) {
            throw new Error("No email was found");
        }

        // Send password reset email
        await sendResetPasswordEmail(email, name, process.env.RESET_PASSWORD_URL);
    } catch (err) {
        throw new Error("Failed to send reset email: " + err.message);
    }
}

const userService = { register, login, resetPassword };
export default userService;