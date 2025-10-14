const express = require('express');
const app = express();
const { connectMongo } = require('./utils/db');
const { checkAuth } = require('./middleware/checkAuth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON bodies

app.use(cookieParser());

//helmet for security headers
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
const { arcjetMiddleware } = require('./middleware/arcjet.middleware');

//user routes
app.post('/api/user/login', arcjetMiddleware, userController.login);
app.post('/api/user/register', arcjetMiddleware, userController.register);
app.post('/api/user/logout', arcjetMiddleware, userController.logout);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});