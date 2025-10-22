import leaseService from '../src/Services/leaseService.js';

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

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id, toString: () => id }))
}));

// Mock ID generators
jest.mock('../src/utils/idGenerator.js', () => ({
  generateLeaseId: jest.fn(() => Promise.resolve('L-0001')),
  generateBookingId: jest.fn(() => Promise.resolve('B-0001'))
}));

// Mock status manager
jest.mock('../src/utils/statusManager.js', () => ({
  determineLeaseStatus: jest.fn(() => 'Pending')
}));

describe('LeaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import leaseService successfully', () => {
      expect(leaseService).toBeDefined();
      expect(typeof leaseService.getLeasesByAdminId).toBe('function');
      expect(typeof leaseService.createLease).toBe('function');
      expect(typeof leaseService.validateDate).toBe('function');
      expect(typeof leaseService.updateLeaseStatusesByAdmin).toBe('function');
      expect(typeof leaseService.updateAllLeaseStatuses).toBe('function');
    });
  });

  describe('getLeasesByAdminId', () => {
    test('should throw error when adminId is missing', async () => {
      await expect(leaseService.getLeasesByAdminId(null))
        .rejects
        .toThrow('Admin ID is required');
    });

    test('should fetch leases for admin successfully', async () => {
      const mockLeases = [
        {
          _id: 'lease1',
          adminId: { _id: 'admin123' },
          leaseId: 'L-0001',
          status: 'Pending',
          bookingDetails: {
            startDate: '01-01-2024',
            endDate: '31-12-2024'
          }
        }
      ];

      const mockLeasesCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockLeases)
        })),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 0 })
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockLeasesCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await leaseService.getLeasesByAdminId(adminId);

      expect(mockLeasesCollection.find).toHaveBeenCalledWith({
        adminId: expect.objectContaining({ _id: 'admin123' })
      });

      expect(result).toEqual(mockLeases);
    });

    test('should update lease status when it changes', async () => {
      const mockLeases = [
        {
          _id: 'lease1',
          adminId: { _id: 'admin123' },
          leaseId: 'L-0001',
          status: 'Pending',
          bookingDetails: {
            startDate: '01-01-2024',
            endDate: '31-12-2024'
          }
        }
      ];

      const mockLeasesCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockLeases)
        })),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockLeasesCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      // Mock status change
      const { determineLeaseStatus } = await import('../src/utils/statusManager.js');
      determineLeaseStatus.mockReturnValue('Active');

      const adminId = 'admin123';
      const result = await leaseService.getLeasesByAdminId(adminId);

      expect(mockLeasesCollection.updateOne).toHaveBeenCalledWith(
        { _id: 'lease1' },
        {
          $set: {
            status: 'Active',
            lastStatusUpdate: expect.any(Date)
          }
        }
      );

      expect(result[0].status).toBe('Active');
    });

    test('should handle leases with missing booking details', async () => {
      const mockLeases = [
        {
          _id: 'lease1',
          adminId: { _id: 'admin123' },
          leaseId: 'L-0001',
          status: 'Pending'
          // Missing bookingDetails
        }
      ];

      const mockLeasesCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockLeases)
        })),
        updateOne: jest.fn()
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockLeasesCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await leaseService.getLeasesByAdminId(adminId);

      expect(mockLeasesCollection.updateOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockLeases);
    });
  });

  describe('createLease', () => {
    test('should throw error when bookingID is missing', async () => {
      await expect(leaseService.createLease(null, 'admin123'))
        .rejects
        .toThrow('Booking ID is required to create a lease');
    });

    test('should throw error when booking is not found', async () => {
      const mockBookingsCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockBookingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(leaseService.createLease('B-0001', 'admin123'))
        .rejects
        .toThrow('Booking not found');
    });

    test('should create lease successfully with valid booking', async () => {
      const mockBooking = {
        _id: 'booking1',
        userId: 'user123',
        listingDetail: { listingID: 'listing123' },
        newBooking: {
          bookingId: 'B-0001',
          checkInDate: '01-01-2024',
          checkOutDate: '31-12-2024',
          totalPrice: 12000
        }
      };

      const mockUser = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith',
        email: 'jane@example.com'
      };

      const mockListing = {
        _id: 'listing123',
        address: '123 Test St'
      };

      const mockBookingsCollection = {
        findOne: jest.fn().mockResolvedValue(mockBooking)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockLeasesCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'lease123' })
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingCollection;
          if (collectionName === 'Leases') return mockLeasesCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await leaseService.createLease('B-0001', 'admin123');

      expect(mockLeasesCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          leaseId: 'L-0001',
          adminId: expect.objectContaining({ _id: 'admin123' }),
          bookingDetails: expect.objectContaining({
            bookingId: 'B-0001',
            startDate: '01-01-2024',
            endDate: '31-12-2024',
            rentAmount: 12000
          }),
          tenant: expect.objectContaining({
            firstName: 'Jane',
            surname: 'Smith',
            email: 'jane@example.com'
          }),
          listing: expect.objectContaining({
            address: '123 Test St'
          }),
          status: 'Pending'
        })
      );

      expect(result).toBe('L-0001');
    });

    test('should throw error when user is not found', async () => {
      const mockBooking = {
        _id: 'booking1',
        userId: 'user123',
        listingDetail: { listingID: 'listing123' },
        newBooking: {
          bookingId: 'B-0001',
          checkInDate: '01-01-2024',
          checkOutDate: '31-12-2024',
          totalPrice: 12000
        }
      };

      const mockBookingsCollection = {
        findOne: jest.fn().mockResolvedValue(mockBooking)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(null) // User not found
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(leaseService.createLease('B-0001', 'admin123'))
        .rejects
        .toThrow('User not found');
    });

    test('should throw error when listing is not found', async () => {
      const mockBooking = {
        _id: 'booking1',
        userId: 'user123',
        listingDetail: { listingID: 'listing123' },
        newBooking: {
          bookingId: 'B-0001',
          checkInDate: '01-01-2024',
          checkOutDate: '31-12-2024',
          totalPrice: 12000
        }
      };

      const mockUser = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith',
        email: 'jane@example.com'
      };

      const mockBookingsCollection = {
        findOne: jest.fn().mockResolvedValue(mockBooking)
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      const mockListingCollection = {
        findOne: jest.fn().mockResolvedValue(null) // Listing not found
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Bookings') return mockBookingsCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(leaseService.createLease('B-0001', 'admin123'))
        .rejects
        .toThrow('Listing not found');
    });
  });

  describe('updateLeaseStatusesByAdmin', () => {
    test('should update statuses for admin leases only', async () => {
      const mockLeases = [
        {
          _id: 'lease1',
          adminId: { _id: 'admin123' },
          status: 'Pending',
          bookingDetails: {
            startDate: '01-01-2024',
            endDate: '31-12-2024'
          }
        }
      ];

      const mockLeasesCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockLeases)
        })),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockLeasesCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      // Mock status change
      const { determineLeaseStatus } = await import('../src/utils/statusManager.js');
      determineLeaseStatus.mockReturnValue('Active');

      const result = await leaseService.updateLeaseStatusesByAdmin('admin123');

      expect(mockLeasesCollection.find).toHaveBeenCalledWith({
        adminId: expect.objectContaining({ _id: 'admin123' }),
        status: { $in: ['Pending', 'Active'] }
      });

      expect(result).toBe(1); // One lease updated
    });
  });

  describe('updateAllLeaseStatuses', () => {
    test('should update all lease statuses across all admins', async () => {
      const mockLeases = [
        {
          _id: 'lease1',
          leaseId: 'L-0001',
          status: 'Pending',
          bookingDetails: {
            startDate: '01-01-2024',
            endDate: '31-12-2024'
          }
        }
      ];

      const mockLeasesCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockLeases)
        })),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockLeasesCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      // Mock status change
      const { determineLeaseStatus } = await import('../src/utils/statusManager.js');
      determineLeaseStatus.mockReturnValue('Active');

      const result = await leaseService.updateAllLeaseStatuses();

      expect(mockLeasesCollection.find).toHaveBeenCalledWith({
        status: { $in: ['Pending', 'Active'] }
      });

      expect(result).toBe(1); // One lease updated
    });
  });
});