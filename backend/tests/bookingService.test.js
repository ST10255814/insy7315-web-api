import bookingService from '../src/Services/bookingService.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: jest.fn()
        })),
        findOne: jest.fn()
      }))
    }))
  }
}));

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id, toString: () => id }))
}));

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import bookingService successfully', () => {
      expect(bookingService).toBeDefined();
      expect(typeof bookingService.getBookings).toBe('function');
      expect(typeof bookingService.getCurrentMonthRevenue).toBe('function');
    });
  });

  describe('getBookings', () => {
    test('should fetch bookings for admin successfully', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          userId: 'user123',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-12-2024',
            checkOutDate: '20-12-2024',
            numberOfGuests: 2,
            totalPrice: 750,
            status: 'Confirmed'
          },
          createdAt: new Date('2024-12-01')
        }
      ];

      const mockListing = {
        _id: 'listing123',
        address: '123 Test St',
        title: 'Test Property',
        landlordInfo: { userId: { toString: () => 'admin123' } }
      };

      const mockTenant = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith'
      };

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockTenant)
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await bookingService.getBookings(adminId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          bookingID: 'B-0001',
          listingAddress: '123 Test St',
          listingTitle: 'Test Property',
          checkIn: '15-12-2024',
          checkOut: '20-12-2024',
          nights: 5,
          guests: 2,
          price: 750,
          status: 'Confirmed',
          createdAt: expect.any(Date),
          tenantInfo: expect.objectContaining({
            name: 'Jane Smith',
            userId: 'user123'  // Updated to match actual structure
          })
        })
      );
    });

    test('should filter out bookings not belonging to admin', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          userId: 'user123',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-12-2024',
            checkOutDate: '20-12-2024',
            numberOfGuests: 2,
            totalPrice: 750,
            status: 'Confirmed'
          }
        }
      ];

      const mockListing = {
        _id: 'listing123',
        address: '123 Test St',
        title: 'Test Property',
        landlordInfo: { userId: { toString: () => 'different-admin' } } // Different admin
      };

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockUserCollection = {
        findOne: jest.fn()
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await bookingService.getBookings(adminId);

      expect(result).toHaveLength(0); // Should filter out bookings not belonging to this admin
    });

    test('should handle missing tenant information gracefully', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          userId: 'user123',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-12-2024',
            checkOutDate: '20-12-2024',
            numberOfGuests: 2,
            totalPrice: 750,
            status: 'Confirmed'
          },
          createdAt: new Date('2024-12-01')
        }
      ];

      const mockListing = {
        _id: 'listing123',
        address: '123 Test St',
        title: 'Test Property',
        landlordInfo: { userId: { toString: () => 'admin123' } }
      };

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(null) // No tenant found
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await bookingService.getBookings(adminId);

      expect(result).toHaveLength(1);
      expect(result[0].tenantInfo).toEqual({
        name: 'Unknown User',
        userId: 'user123'
      });
    });

    test('should calculate nights correctly', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          userId: 'user123',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '01-01-2024', // Jan 1
            checkOutDate: '05-01-2024', // Jan 5
            numberOfGuests: 2,
            totalPrice: 800,
            status: 'Confirmed'
          },
          createdAt: new Date('2024-12-01')
        }
      ];

      const mockListing = {
        _id: 'listing123',
        address: '123 Test St',
        title: 'Test Property',
        landlordInfo: { userId: { toString: () => 'admin123' } }
      };

      const mockTenant = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith'
      };

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockTenant)
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await bookingService.getBookings(adminId);

      expect(result[0].nights).toBe(4); // Jan 5 - Jan 1 = 4 nights
    });

    test('should handle database errors gracefully', async () => {
      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        }))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockBookingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';

      await expect(bookingService.getBookings(adminId))
        .rejects
        .toThrow('Failed to fetch bookings');
    });
  });

  describe('getCurrentMonthRevenue', () => {
    test('should calculate current month revenue for admin successfully', async () => {
      // Mock current date to be December 2024
      const originalDate = Date;
      const mockDate = new Date('2024-12-15');
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockBookings = [
        {
          _id: 'booking1',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-12-2024', // Current month
            totalPrice: 1500,
            status: 'Active'
          }
        },
        {
          _id: 'booking2',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0002',
            checkInDate: '20-12-2024', // Current month
            totalPrice: 2000,
            status: 'Confirmed'
          }
        },
        {
          _id: 'booking3',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0003',
            checkInDate: '15-11-2024', // Previous month
            totalPrice: 1000,
            status: 'Active'
          }
        }
      ];

      const mockAdminListings = [
        {
          _id: 'listing123',
          landlordInfo: { userId: { _id: 'admin123' } }
        }
      ];

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockAdminListings)
        }))
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await bookingService.getCurrentMonthRevenue('admin123');

      expect(result).toBe(3500); // 1500 + 2000 (only current month bookings)

      // Restore original Date
      global.Date = originalDate;
    });

    test('should return 0 when no bookings found for current month', async () => {
      // Mock current date to be December 2024
      const originalDate = Date;
      const mockDate = new Date('2024-12-15');
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockBookings = [
        {
          _id: 'booking1',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-11-2024', // Previous month
            totalPrice: 1500,
            status: 'Active'
          }
        }
      ];

      const mockAdminListings = [
        {
          _id: 'listing123',
          landlordInfo: { userId: { _id: 'admin123' } }
        }
      ];

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockAdminListings)
        }))
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await bookingService.getCurrentMonthRevenue('admin123');

      expect(result).toBe(0);

      // Restore original Date
      global.Date = originalDate;
    });

    test('should exclude invalid booking statuses', async () => {
      // Mock current date to be December 2024
      const originalDate = Date;
      const mockDate = new Date('2024-12-15');
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockBookings = [
        {
          _id: 'booking1',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: '15-12-2024',
            totalPrice: 1500,
            status: 'Active'
          }
        },
        {
          _id: 'booking2',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0002',
            checkInDate: '20-12-2024',
            totalPrice: 2000,
            status: 'Cancelled' // Invalid status
          }
        }
      ];

      const mockAdminListings = [
        {
          _id: 'listing123',
          landlordInfo: { userId: { _id: 'admin123' } }
        }
      ];

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockAdminListings)
        }))
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await bookingService.getCurrentMonthRevenue('admin123');

      expect(result).toBe(1500); // Only Active booking counted

      // Restore original Date
      global.Date = originalDate;
    });

    test('should handle invalid date formats gracefully', async () => {
      const originalDate = Date;
      const mockDate = new Date('2024-12-15');
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockBookings = [
        {
          _id: 'booking1',
          listingDetail: { listingID: 'listing123' },
          newBooking: {
            bookingId: 'B-0001',
            checkInDate: 'invalid-date',
            totalPrice: 1500,
            status: 'Active'
          }
        }
      ];

      const mockAdminListings = [
        {
          _id: 'listing123',
          landlordInfo: { userId: { _id: 'admin123' } }
        }
      ];

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockBookings)
        }))
      };

      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockAdminListings)
        }))
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await bookingService.getCurrentMonthRevenue('admin123');

      expect(result).toBe(0); // Invalid date should be excluded

      // Restore original Date
      global.Date = originalDate;
    });

    test('should handle database errors gracefully', async () => {
      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        }))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(bookingService.getCurrentMonthRevenue('admin123'))
        .rejects
        .toThrow('Failed to calculate current month revenue');
    });

    test('should return 0 when admin has no listings', async () => {
      const originalDate = Date;
      const mockDate = new Date('2024-12-15');
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return mockDate;
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const mockAdminListings = []; // No listings for admin

      const mockBookingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue([])
        }))
      };

      const mockListingCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockAdminListings)
        }))
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await bookingService.getCurrentMonthRevenue('admin123');

      expect(result).toBe(0);

      // Restore original Date
      global.Date = originalDate;
    });
  });
});