const { client } = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');
dotenv.config();
const validation = require('../utils/validation');

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

    validation.validateEmail(email);
    validation.validatePassword(password);
    validation.validateUsername(username);
    validation.validateFullname(fullname);

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

    return { email: newUser.email, createdAt: newUser.createdAt };
    }
    catch(err){
        throw new Error("Registration failed: " + err.message);
    }
}

async function login(data){
    try{
        const db = client.db('RentWise');
        const systemUsers = db.collection('System-Users');

        const {email, password} = data;

        //check if all fields are provided
        if(!email || !password){
            throw new Error("Please provide all required fields");
        }

        validation.sanitizeInput(email);
        validation.sanitizeInput(password);

        validation.validateEmail(email);
        validation.validatePassword(password);

        //check if user exists
        const user = await systemUsers.findOne({ email: email });
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
        return { token };

    }
    catch(err){
        throw new Error("Login failed: " + err.message);
    }
}

module.exports = { register, login };