import revenueService from '../Services/revenueService.js';
import { sendSuccess, sendError, sendBadRequest } from '../utils/responseHandler.js';
import { asyncHandler, getAdminId, validateRequiredFields, logControllerAction } from '../utils/controllerHelpers.js';

/**
 * Get monthly revenue for the logged-in admin
 * Query parameters:
 * - month: specific month (1-12) - optional
 * - year: specific year - optional (defaults to current year)
 */
const getMonthlyRevenue = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { month, year } = req.query;
    
    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month) : null;

    let revenueData;
    
    if (targetMonth) {
        // Get specific month data
        revenueData = await revenueService.getStoredRevenue(adminId, targetYear, targetMonth);
        
        if (!revenueData) {
            // If no stored data exists, calculate it on the fly
            revenueData = await revenueService.calculateMonthlyRevenue(adminId, targetMonth, targetYear);
            // Store it for future use
            await revenueService.storeMonthlyRevenue(revenueData);
        }
    } else {
        // Get all months for the year
        revenueData = await revenueService.getStoredRevenue(adminId, targetYear);
    }

    const message = targetMonth ? 
        `Revenue data for ${targetMonth}/${targetYear}` : 
        `Revenue data for ${targetYear}`;
        
    sendSuccess(res, revenueData, message);
});

/**
 * Get revenue trend for the last 12 months for the logged-in admin
 */
const getRevenueTrend = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    const trendData = await revenueService.getRevenueTrend(adminId);
    
    sendSuccess(res, trendData, 'Revenue trend data for the last 12 months');
});

/**
 * Get current month revenue for the logged-in admin
 */
const getCurrentMonthRevenue = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // First try to get stored data
    let revenueData = await revenueService.getStoredRevenue(adminId, currentYear, currentMonth);
    
    if (!revenueData) {
        // If no stored data exists, calculate it
        revenueData = await revenueService.calculateMonthlyRevenue(adminId, currentMonth, currentYear);
        // Store it for future use
        await revenueService.storeMonthlyRevenue(revenueData);
    }
    
    sendSuccess(res, revenueData, `Current month revenue (${currentMonth}/${currentYear})`);
});

/**
 * Manually trigger revenue calculation for a specific month/year
 * (Useful for testing or recalculating past data)
 */
const calculateRevenue = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    
    // Validate required fields
    validateRequiredFields(req.body, ['month', 'year']);
    
    const { month, year } = req.body;
    
    logControllerAction('Manual Revenue Calculation', adminId, { month, year });
    
    const revenueData = await revenueService.calculateMonthlyRevenue(adminId, parseInt(month), parseInt(year));
    const storedData = await revenueService.storeMonthlyRevenue(revenueData);
    
    sendSuccess(res, storedData, `Revenue calculated and stored for ${month}/${year}`);
});

/**
 * Get revenue summary statistics for the admin
 */
const getRevenueSummary = asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Get current year revenue data
    const yearlyData = await revenueService.getStoredRevenue(adminId, currentYear);
    
    // Calculate summary statistics
    const totalYearlyRevenue = yearlyData.reduce((sum, month) => sum + month.totalRevenue, 0);
    const totalYearlyBookings = yearlyData.reduce((sum, month) => sum + month.bookingCount, 0);
    const averageMonthlyRevenue = yearlyData.length > 0 ? totalYearlyRevenue / yearlyData.length : 0;
    
    // Find best and worst performing months
    const bestMonth = yearlyData.reduce((best, current) => 
        current.totalRevenue > (best?.totalRevenue || 0) ? current : best, null);
    const worstMonth = yearlyData.reduce((worst, current) => 
        current.totalRevenue < (worst?.totalRevenue || Infinity) ? current : worst, null);
    
    // Get last month for comparison
    const lastMonth = currentDate.getMonth(); // 0-indexed
    const lastMonthYear = lastMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthNumber = lastMonth === 0 ? 12 : lastMonth;
    
    const lastMonthData = await revenueService.getStoredRevenue(adminId, lastMonthYear, lastMonthNumber);
    const currentMonthData = await revenueService.getStoredRevenue(adminId, currentYear, currentDate.getMonth() + 1);
    
    // Calculate month-over-month growth
    let monthOverMonthGrowth = 0;
    if (lastMonthData && currentMonthData) {
        monthOverMonthGrowth = lastMonthData.totalRevenue > 0 ? 
            ((currentMonthData.totalRevenue - lastMonthData.totalRevenue) / lastMonthData.totalRevenue) * 100 : 0;
    }
    
    const summary = {
        currentYear,
        totalYearlyRevenue,
        totalYearlyBookings,
        averageMonthlyRevenue: Math.round(averageMonthlyRevenue * 100) / 100,
        monthsWithData: yearlyData.length,
        bestPerformingMonth: bestMonth ? {
            month: bestMonth.month,
            year: bestMonth.year,
            revenue: bestMonth.totalRevenue,
            bookings: bestMonth.bookingCount
        } : null,
        worstPerformingMonth: worstMonth ? {
            month: worstMonth.month,
            year: worstMonth.year,
            revenue: worstMonth.totalRevenue,
            bookings: worstMonth.bookingCount
        } : null,
        monthOverMonthGrowth: Math.round(monthOverMonthGrowth * 100) / 100,
        lastUpdated: new Date()
    };
    
    sendSuccess(res, summary, 'Revenue summary statistics');
});

const revenueController = {
    getMonthlyRevenue,
    getRevenueTrend,
    getCurrentMonthRevenue,
    calculateRevenue,
    getRevenueSummary
};

export default revenueController;