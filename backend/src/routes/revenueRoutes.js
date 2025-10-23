/**
 * Revenue routes configuration
 * Handles all revenue-related API endpoints
 */

import { Router } from 'express';
import revenueController from '../Controllers/revenueController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

// All revenue routes require authentication
router.use(checkAuth);

// Revenue data routes
router.get('/monthly', revenueController.getMonthlyRevenue);
router.get('/trend', revenueController.getRevenueTrend);
router.get('/current-month', revenueController.getCurrentMonthRevenue);
router.get('/summary', revenueController.getRevenueSummary);

// Revenue management routes
router.post('/calculate', revenueController.calculateRevenue);

// Test endpoint for revenue system (remove in production)
router.get('/test-calculation', async (req, res) => {
  try {
    const { manualRevenueCalculation } = await import('../Schedule_Updates/scheduledTasks.js');
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

// Test endpoint for historical revenue calculation (remove in production)
router.get('/calculate-historical', async (req, res) => {
  try {
    const { calculateHistoricalRevenue } = await import('../Schedule_Updates/scheduledTasks.js');
    
    console.log('API: Starting historical revenue calculation...');
    const results = await calculateHistoricalRevenue();
    
    res.json({
      success: true,
      message: 'Historical revenue calculation completed successfully',
      data: results
    });
  } catch (error) {
    console.error('API: Historical revenue calculation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Historical revenue calculation failed',
      error: error.message
    });
  }
});

// Test endpoint for cleaning up zero-revenue records (remove in production)
router.get('/cleanup-zero-records', async (req, res) => {
  try {
    const { cleanupZeroRevenueRecords } = await import('../Schedule_Updates/scheduledTasks.js');
    
    console.log('API: Starting zero-revenue records cleanup...');
    const deletedCount = await cleanupZeroRevenueRecords();
    
    res.json({
      success: true,
      message: `Successfully removed ${deletedCount} zero-revenue records`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('API: Zero-revenue cleanup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Zero-revenue cleanup failed',
      error: error.message
    });
  }
});

export default router;