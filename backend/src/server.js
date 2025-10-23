import express from "express";
import { client, mongoConnection } from './utils/db.js';
import { checkAuth } from './middleware/checkAuth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { upload } from './utils/cloudinary.js';
import { startStatusScheduler } from './Schedule_Updates/scheduledTasks.js';
import revenueDbOperations from './utils/revenueDbOperations.js';

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
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://127.0.0.1:3000',
      'https://rentwiseproperty.onrender.com',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    // Remove any trailing slashes and check
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => 
      allowed.replace(/\/$/, '') === normalizedOrigin
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB
mongoConnection();

// Import organized routes
import apiRoutes from './routes/index.js';

// Test route
app.get('/', (_, res) => {
  res.json({ message: 'API is running!' });
});

// Mount all API routes
app.use('/api', apiRoutes);


// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
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