import express from "express";
import { mongoConnection } from './utils/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { startStatusScheduler } from './Schedule_Updates/scheduledTasks.js';
import revenueDbOperations from './utils/revenueDbOperations.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Trust proxy first
app.set('trust proxy', true);

// CORS configuration - MUST be at the top, before other middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000', 
  'http://127.0.0.1:3000',
  'https://rentwiseproperties.onrender.com',
  'https://insy7315-web-api.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

// Simple CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // For development, you might want to allow all temporarily
      // callback(null, true);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-CSRF-Token', 
    'x-csrf-token', 
    'CSRF-Token', 
    'csrf-token',
    'X-XSRF-Token',
    'x-xsrf-token',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['set-cookie', 'csrf-token']
}));

// Handle preflight requests globally
app.options('*', cors());

// Other middleware
app.use(express.json());
app.use(cookieParser());

// Helmet configuration (simplified for now)
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily to isolate issues
  crossOriginEmbedderPolicy: false
}));

// Connect to MongoDB
mongoConnection();

// Import organized routes
import apiRoutes from './routes/index.js';

// Test route with CORS headers
app.get('/', (_, res) => {
  res.json({ message: 'API is running!' });
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// Mount all API routes
app.use('/api', apiRoutes);

// Global error handler for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy blocked the request',
      requestedOrigin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  }
  next(err);
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  
  // Initialize revenue collection
  try {
    await revenueDbOperations.validateRevenueCollection();
    const stats = await revenueDbOperations.getRevenueCollectionStats();
    console.log('Revenue collection stats:', stats);
  } catch (error) {
    console.error('Error initializing revenue collection:', error);
  }
  
  // Start the schedulers (status updates and revenue calculations)
  startStatusScheduler();
});
