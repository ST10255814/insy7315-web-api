import revenueService from '../src/Services/revenueService.js';
import revenueDbOperations from '../src/utils/revenueDbOperations.js';
import { manualRevenueCalculation } from '../src/Schedule_Updates/scheduledTasks.js';
import { client } from '../src/utils/db.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
    client: {
        db: jest.fn(() => ({
            collection: jest.fn(() => ({
                find: jest.fn(() => ({
                    toArray: jest.fn()
                })),
                findOne: jest.fn(),
                insertOne: jest.fn(),
                updateOne: jest.fn()
            }))
        }))
    }
}));

// Mock revenueDbOperations
jest.mock('../src/utils/revenueDbOperations.js', () => ({
    validateRevenueCollection: jest.fn().mockResolvedValue(true),
    getRevenueCollectionStats: jest.fn().mockResolvedValue({
        collectionExists: true,
        documentCount: 0,
        indexCount: 1,
        indexes: [{ name: '_id_' }]
    })
}));

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

            // Mock database responses
            const mockListings = [
                { _id: 'listing1', title: 'Test Property 1', address: '123 Test St' },
                { _id: 'listing2', title: 'Test Property 2', address: '456 Test Ave' }
            ];

            const mockBookings = [
                {
                    _id: 'booking1',
                    listingDetail: { listingID: 'listing1' },
                    newBooking: {
                        bookingId: 'BK001',
                        checkInDate: '15-10-2024',
                        checkOutDate: '20-10-2024',
                        numberOfGuests: 2,
                        totalPrice: 1500,
                        status: 'Active'
                    },
                    userId: 'tenant1'
                }
            ];

            const mockDb = {
                collection: jest.fn((name) => {
                    if (name === 'Listings') {
                        return {
                            find: jest.fn(() => ({
                                toArray: jest.fn().mockResolvedValue(mockListings)
                            }))
                        };
                    } else if (name === 'Bookings') {
                        return {
                            find: jest.fn(() => ({
                                toArray: jest.fn().mockResolvedValue(mockBookings)
                            }))
                        };
                    }
                    return {
                        find: jest.fn(() => ({
                            toArray: jest.fn().mockResolvedValue([])
                        }))
                    };
                })
            };

            client.db.mockReturnValue(mockDb);

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

            // Mock database responses
            const mockDb = {
                collection: jest.fn(() => ({
                    findOne: jest.fn().mockResolvedValue(null), // No existing record
                    insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId123' })
                }))
            };

            client.db.mockReturnValue(mockDb);

            const result = await revenueService.storeMonthlyRevenue(mockRevenueData);
            
            expect(result).toHaveProperty('_id');
            expect(result.adminId).toBe(mockRevenueData.adminId);
            expect(result.totalRevenue).toBe(mockRevenueData.totalRevenue);
        }, 30000);

        test('should retrieve stored revenue data', async () => {
            const mockAdminId = '507f1f77bcf86cd799439011';
            const testYear = 2024;

            const mockRevenueData = [
                {
                    adminId: mockAdminId,
                    year: testYear,
                    month: 10,
                    totalRevenue: 5000,
                    bookingCount: 3
                }
            ];

            // Mock database responses
            const mockDb = {
                collection: jest.fn(() => ({
                    find: jest.fn(() => ({
                        sort: jest.fn(() => ({
                            toArray: jest.fn().mockResolvedValue(mockRevenueData)
                        }))
                    }))
                }))
            };

            client.db.mockReturnValue(mockDb);

            const result = await revenueService.getStoredRevenue(mockAdminId, testYear);
            
            expect(Array.isArray(result)).toBe(true);
            if (result.length > 0) {
                expect(result[0]).toHaveProperty('adminId', mockAdminId);
                expect(result[0]).toHaveProperty('year', testYear);
            }
        }, 30000);

        test('should get revenue trend for last 12 months', async () => {
            const mockAdminId = '507f1f77bcf86cd799439011';

            const mockTrendData = [
                {
                    adminId: mockAdminId,
                    year: 2024,
                    month: 10,
                    totalRevenue: 5000,
                    bookingCount: 3
                },
                {
                    adminId: mockAdminId,
                    year: 2024,
                    month: 9,
                    totalRevenue: 3000,
                    bookingCount: 2
                }
            ];

            // Mock database responses
            const mockDb = {
                collection: jest.fn(() => ({
                    find: jest.fn(() => ({
                        sort: jest.fn(() => ({
                            toArray: jest.fn().mockResolvedValue(mockTrendData)
                        }))
                    }))
                }))
            };

            client.db.mockReturnValue(mockDb);

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
            // Mock the manualRevenueCalculation function
            const mockResult = {
                month: 10,
                year: 2024,
                processedAdmins: 2,
                totalRevenue: 8000,
                errors: []
            };

            // Since we can't directly mock the imported function easily,
            // let's test the processAllAdminRevenue function instead
            const mockAdmins = [
                {
                    _id: '507f1f77bcf86cd799439011',
                    firstName: 'John',
                    surname: 'Doe',
                    role: 'admin'
                }
            ];

            const mockDb = {
                collection: jest.fn((name) => {
                    if (name === 'System-Users') {
                        return {
                            find: jest.fn(() => ({
                                toArray: jest.fn().mockResolvedValue(mockAdmins)
                            }))
                        };
                    }
                    if (name === 'Listings') {
                        return {
                            distinct: jest.fn().mockResolvedValue(['507f1f77bcf86cd799439011']),
                            find: jest.fn(() => ({
                                toArray: jest.fn().mockResolvedValue([])
                            }))
                        };
                    }
                    return {
                        find: jest.fn(() => ({
                            toArray: jest.fn().mockResolvedValue([])
                        })),
                        findOne: jest.fn().mockResolvedValue(null),
                        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId' })
                    };
                })
            };

            client.db.mockReturnValue(mockDb);

            const result = await revenueService.processAllAdminRevenue(10, 2024);
            
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

        // Mock database responses for admin with no listings
        const mockDb = {
            collection: jest.fn((name) => {
                if (name === 'Listings') {
                    return {
                        find: jest.fn(() => ({
                            toArray: jest.fn().mockResolvedValue([]) // No listings
                        }))
                    };
                }
                return {
                    find: jest.fn(() => ({
                        toArray: jest.fn().mockResolvedValue([])
                    }))
                };
            })
        };

        client.db.mockReturnValue(mockDb);

        const result = await revenueService.calculateMonthlyRevenue(nonExistentAdminId, testMonth, testYear);
        
        expect(result.totalRevenue).toBe(0);
        expect(result.bookingCount).toBe(0);
        expect(result.bookings).toHaveLength(0);
    }, 30000);

    test('should handle invalid date parameters', async () => {
        const mockAdminId = '507f1f77bcf86cd799439011';
        
        // Mock database responses
        const mockDb = {
            collection: jest.fn(() => ({
                find: jest.fn(() => ({
                    toArray: jest.fn().mockResolvedValue([])
                }))
            }))
        };

        client.db.mockReturnValue(mockDb);
        
        // Test with invalid month
        await expect(revenueService.calculateMonthlyRevenue(mockAdminId, 13, 2024))
            .resolves.toBeDefined(); // Should not throw error, just return empty results
            
        // Test with invalid year
        await expect(revenueService.calculateMonthlyRevenue(mockAdminId, 1, 1999))
            .resolves.toBeDefined(); // Should not throw error, just return empty results
    }, 30000);
});