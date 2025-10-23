import express from "express";
import { client, mongoConnection } from './utils/db.js';
import { checkAuth } from './middleware/checkAuth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';
import leaseService from './Services/leaseService.js';
import invoiceService from './Services/invoiceService.js';
import { upload } from './utils/cloudinary.js';

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
app.get('api/leases/count', checkAuth, leaseController.countActiveLeasesByAdminId);

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

//booking routes
app.get('/api/bookings', checkAuth, bookingController.getBookings);
app.get('/api/bookings/current-month-revenue', checkAuth, bookingController.getCurrentMonthRevenue);

//maintenance routes
app.get('/api/maintenance', checkAuth, maintenanceController.getAllMaintenanceRequests);



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the status schedulers - runs daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled status updates...');
    try {
      await leaseService.updateAllLeaseStatuses();
      await invoiceService.updateAllInvoiceStatuses();
      console.log('Daily status updates completed successfully');
    } catch (error) {
      console.error('Error during daily status updates:', error);
    }
  });
  
  console.log('Status schedulers started - Daily updates at midnight for leases and invoices');
});