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

//controller declarations
import userController from './Controllers/userController.js';
import leaseController from './Controllers/leaseController.js';
import invoiceController from './Controllers/invoiceController.js';
import listingController from './Controllers/listingController.js';
import bookingController from './Controllers/bookingController.js';
import maintenanceController from './Controllers/maintenanceController.js';
import activityController from './Controllers/activityController.js';
import revenueController from './Controllers/revenueController.js';

// Arcjet middleware import
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

// Test route
app.get('/', (_, res) => {
  res.json({ message: 'API is running!' });
});

//user routes
app.post('/api/user/login', arcjetMiddleware, userController.login);
app.post('/api/user/register', arcjetMiddleware, userController.register);
app.post('/api/user/logout', userController.logout);
app.post('/api/user/forgot-password', arcjetMiddleware, userController.resetPassword);

//lease routes
app.get('/api/leases', checkAuth, leaseController.getAdminLeases);
app.post('/api/leases/create', checkAuth, leaseController.createLease);
app.get('/api/leases/count', checkAuth, leaseController.countActiveLeasesByAdminId);
app.get('/api/leases/leased-percentage', checkAuth, leaseController.getLeasedPropertyPercentage);

//invoice routes
app.post('/api/invoices/create', checkAuth, invoiceController.createInvoice);
app.get('/api/invoices', checkAuth, invoiceController.getInvoicesByAdminId);
app.get('/api/invoices/stats', checkAuth, invoiceController.getInvoiceStats);
app.patch('/api/invoices/:invoiceId/pay', checkAuth, invoiceController.markInvoiceAsPaid);
app.post('/api/invoices/regenerate-descriptions', checkAuth, invoiceController.regenerateInvoiceDescriptions);

//listing routes
app.post('/api/listings/create', checkAuth, upload.array('imageURL', 10), listingController.createListing);
app.get('/api/listings', checkAuth, listingController.getListingsByAdminId);
app.get('/api/listings/count', checkAuth, listingController.countNumberOfListingsByAdminId);
app.get('/api/listings/count-this-month', checkAuth, listingController.countListingsAddedThisMonth);

//booking routes
app.get('/api/bookings', checkAuth, bookingController.getBookings);
app.get('/api/bookings/current-month-revenue', checkAuth, bookingController.getCurrentMonthRevenue);

//maintenance routes
app.get('/api/maintenance', checkAuth, maintenanceController.getAllMaintenanceRequests);
app.get('/api/maintenance/count', checkAuth, maintenanceController.countMaintenanceRequestsByAdminId);
app.get('/api/maintenance/count-high-priority', checkAuth, maintenanceController.countHighPriorityMaintenanceRequestsByAdminId);

//activity routes
app.get('/api/activity-logs', checkAuth, activityController.getRecentActivities);

//revenue routes
app.get('/api/revenue/monthly', checkAuth, revenueController.getMonthlyRevenue);
app.get('/api/revenue/trend', checkAuth, revenueController.getRevenueTrend);
app.get('/api/revenue/current-month', checkAuth, revenueController.getCurrentMonthRevenue);
app.get('/api/revenue/summary', checkAuth, revenueController.getRevenueSummary);
app.post('/api/revenue/calculate', checkAuth, revenueController.calculateRevenue);

// Test endpoint for revenue system (remove in production)
app.get('/api/revenue/test-calculation', checkAuth, async (req, res) => {
  try {
    const { manualRevenueCalculation } = await import('./Schedule_Updates/scheduledTasks.js');
    const currentDate = new Date();
    const testMonth = currentDate.getMonth() || 12; // Previous month
    const testYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    
    const results = await manualRevenueCalculation(testMonth, testYear);
    res.json({
      success: true,
      message: `Test revenue calculation completed for ${testMonth}/${testYear}`,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test revenue calculation failed',
      error: error.message
    });
  }
});


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