const express = require('express');
const app = express();
const { connectMongo } = require('./utils/db');
const { checkAuth } = require('./utils/checkAuth');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON bodies

//cookie parser middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// CORS configuration - MUST be before routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Connect to MongoDB
connectMongo();

//controller declarations
const userController = require('./Controllers/userController');

//user routes
app.post('/api/user/login', userController.login);
app.post('/api/user/register', userController.register);
app.post('/api/user/logout', userController.logout);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});