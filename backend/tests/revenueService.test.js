import revenueService from '../src/Services/revenueService.js';
import revenueDbOperations from '../src/utils/revenueDbOperations.js';
import { manualRevenueCalculation } from '../src/Schedule_Updates/scheduledTasks.js';

describe('Revenue Service Tests', () => {
    beforeAll(async () => {
        // Initialize the revenue collection before running tests
        await revenueDbOperations.validateRevenueCollection();
    });

    describe('Revenue Calculation', () => {
        test('should calculate monthly revenue for admin', async () => {
            // Mock admin ID - replace with actual admin ID from your test database
            const mockAdminId = '507f1f77bcf86cd799439011';
            const testMonth = 10; // October
            const testYear = 2024;

            const result = await revenueService.calculateMonthlyRevenue(mockAdminId, testMonth, testYear);
            
            expect(result).toHaveProperty('adminId', mockAdminId);
            expect(result).toHaveProperty('month', testMonth);
            expect(result).toHaveProperty('year', testYear);
            expect(result).toHaveProperty('totalRevenue');
            expect(result).toHaveProperty('bookingCount');
            expect(result).toHaveProperty('bookings');
            expect(typeof result.totalRevenue).toBe('number');
            expect(typeof result.bookingCount).toBe('number');
            expect(Array.isArray(result.bookings)).toBe(true);
        }, 30000);

        test('should store monthly revenue in database', async () => {
            const mockRevenueData = {
                adminId: '507f1f77bcf86cd799439011',
                month: 10,
                year: 2024,
                totalRevenue: 5000,
                bookingCount: 3,
                bookings: [
                    {
                        bookingId: 'BK001',
                        listingTitle: 'Test Property',
                        totalPrice: 2000
                    }
                ],
                calculatedAt: new Date()
            };

            const result = await revenueService.storeMonthlyRevenue(mockRevenueData);
            
            expect(result).toHaveProperty('_id');
            expect(result.adminId).toBe(mockRevenueData.adminId);
            expect(result.totalRevenue).toBe(mockRevenueData.totalRevenue);
        }, 30000);

        test('should retrieve stored revenue data', async () => {
            const mockAdminId = '507f1f77bcf86cd799439011';
            const testYear = 2024;

            const result = await revenueService.getStoredRevenue(mockAdminId, testYear);
            
            expect(Array.isArray(result)).toBe(true);
            if (result.length > 0) {
                expect(result[0]).toHaveProperty('adminId', mockAdminId);
                expect(result[0]).toHaveProperty('year', testYear);
            }
        }, 30000);

        test('should get revenue trend for last 12 months', async () => {
            const mockAdminId = '507f1f77bcf86cd799439011';

            const result = await revenueService.getRevenueTrend(mockAdminId);
            
            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(12);
            
            result.forEach(month => {
                expect(month).toHaveProperty('year');
                expect(month).toHaveProperty('month');
                expect(month).toHaveProperty('monthName');
                expect(month).toHaveProperty('totalRevenue');
                expect(month).toHaveProperty('bookingCount');
                expect(typeof month.totalRevenue).toBe('number');
                expect(typeof month.bookingCount).toBe('number');
            });
        }, 30000);
    });

    describe('Database Operations', () => {
        test('should get collection statistics', async () => {
            const stats = await revenueDbOperations.getRevenueCollectionStats();
            
            expect(stats).toHaveProperty('collectionExists');
            expect(stats).toHaveProperty('documentCount');
            expect(stats).toHaveProperty('indexCount');
            expect(stats).toHaveProperty('indexes');
            expect(Array.isArray(stats.indexes)).toBe(true);
        }, 30000);
    });

    describe('Scheduled Tasks', () => {
        test('should manually trigger revenue calculation', async () => {
            const result = await manualRevenueCalculation(10, 2024);
            
            expect(result).toHaveProperty('month', 10);
            expect(result).toHaveProperty('year', 2024);
            expect(result).toHaveProperty('processedAdmins');
            expect(result).toHaveProperty('totalRevenue');
            expect(result).toHaveProperty('errors');
            expect(typeof result.processedAdmins).toBe('number');
            expect(typeof result.totalRevenue).toBe('number');
            expect(Array.isArray(result.errors)).toBe(true);
        }, 60000);
    });
});

describe('Revenue Service Edge Cases', () => {
    test('should handle admin with no listings', async () => {
        const nonExistentAdminId = '507f1f77bcf86cd799439999';
        const testMonth = 10;
        const testYear = 2024;

        const result = await revenueService.calculateMonthlyRevenue(nonExistentAdminId, testMonth, testYear);
        
        expect(result.totalRevenue).toBe(0);
        expect(result.bookingCount).toBe(0);
        expect(result.bookings).toHaveLength(0);
    }, 30000);

    test('should handle invalid date parameters', async () => {
        const mockAdminId = '507f1f77bcf86cd799439011';
        
        // Test with invalid month
        await expect(revenueService.calculateMonthlyRevenue(mockAdminId, 13, 2024))
            .resolves.toBeDefined(); // Should not throw error, just return empty results
            
        // Test with invalid year
        await expect(revenueService.calculateMonthlyRevenue(mockAdminId, 1, 1999))
            .resolves.toBeDefined(); // Should not throw error, just return empty results
    }, 30000);
});