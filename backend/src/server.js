import express from "express";
import { client, mongoConnection } from './utils/db.js';
import { checkAuth } from './middleware/checkAuth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json()); // Parse JSON bodies

app.set('trust proxy', true);

app.use(cookieParser());

//helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://127.0.0.1:5000",
          "http://localhost:5000",
          "http://localhost:3000",
          "https://rentwiseproperty.onrender.com",
        ],
      },
    },
  })
);

// CORS configuration - MUST be before routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB
mongoConnection();

//controller declarations
import userController from './Controllers/userController.js';
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

// Test route
app.get('/', (_, res) => {
  res.json({ message: 'API is running!' });
});

//user routes
app.post('/api/user/login', arcjetMiddleware, userController.login);
app.post('/api/user/register', arcjetMiddleware, userController.register);
app.post('/api/user/logout', arcjetMiddleware, userController.logout);
app.post('/api/user/reset-password', arcjetMiddleware, userController.resetPassword);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});