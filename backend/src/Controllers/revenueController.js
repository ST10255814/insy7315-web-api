import revenueService from '../Services/revenueService.js';

/**
 * Get monthly revenue for the logged-in admin
 * Query parameters:
 * - month: specific month (1-12) - optional
 * - year: specific year - optional (defaults to current year)
 */
const getMonthlyRevenue = async (req, res) => {
    try {
        const adminId = req.user.userId; // Assuming user ID is stored in req.user from auth middleware
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

        res.status(200).json({
            success: true,
            data: revenueData,
            message: targetMonth ? 
                `Revenue data for ${targetMonth}/${targetYear}` : 
                `Revenue data for ${targetYear}`
        });
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly revenue',
            error: error.message
        });
    }
};

/**
 * Get revenue trend for the last 12 months for the logged-in admin
 */
const getRevenueTrend = async (req, res) => {
    try {
        const adminId = req.user.userId;
        
        const trendData = await revenueService.getRevenueTrend(adminId);
        
        res.status(200).json({
            success: true,
            data: trendData,
            message: 'Revenue trend data for the last 12 months'
        });
    } catch (error) {
        console.error('Error fetching revenue trend:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue trend',
            error: error.message
        });
    }
};

/**
 * Get current month revenue for the logged-in admin
 */
const getCurrentMonthRevenue = async (req, res) => {
    try {
        const adminId = req.user.userId;
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
        
        res.status(200).json({
            success: true,
            data: revenueData,
            message: `Current month revenue (${currentMonth}/${currentYear})`
        });
    } catch (error) {
        console.error('Error fetching current month revenue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current month revenue',
            error: error.message
        });
    }
};

/**
 * Manually trigger revenue calculation for a specific month/year
 * (Useful for testing or recalculating past data)
 */
const calculateRevenue = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { month, year } = req.body;
        
        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }
        
        const revenueData = await revenueService.calculateMonthlyRevenue(adminId, parseInt(month), parseInt(year));
        const storedData = await revenueService.storeMonthlyRevenue(revenueData);
        
        res.status(200).json({
            success: true,
            data: storedData,
            message: `Revenue calculated and stored for ${month}/${year}`
        });
    } catch (error) {
        console.error('Error calculating revenue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate revenue',
            error: error.message
        });
    }
};

/**
 * Get revenue summary statistics for the admin
 */
const getRevenueSummary = async (req, res) => {
    try {
        const adminId = req.user.userId;
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
        
        res.status(200).json({
            success: true,
            data: summary,
            message: 'Revenue summary statistics'
        });
    } catch (error) {
        console.error('Error fetching revenue summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue summary',
            error: error.message
        });
    }
};

const revenueController = {
    getMonthlyRevenue,
    getRevenueTrend,
    getCurrentMonthRevenue,
    calculateRevenue,
    getRevenueSummary
};

export default revenueController;