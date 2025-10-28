import listingService from '../src/Services/listingService.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
        insertOne: jest.fn(),
        find: jest.fn(() => ({
          toArray: jest.fn()
        }))
      }))
    }))
  }
}));

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id }))
}));

// Mock ID generator
jest.mock('../src/utils/idGenerator.js', () => ({
  generateListingId: jest.fn(() => Promise.resolve('LS-0001'))
}));

describe('ListingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import listingService successfully', () => {
      expect(listingService).toBeDefined();
      expect(typeof listingService.createListing).toBe('function');
      expect(typeof listingService.getListingsByAdminId).toBe('function');
      expect(typeof listingService.countNumberOfListingsByAdminId).toBe('function');
      expect(typeof listingService.countListingsAddedThisMonth).toBe('function');
    });
  });

  describe('createListing', () => {
    test('should throw error when required fields are missing', async () => {
      const incompleteData = { title: 'Test Property' };
      const adminId = 'admin123';
      
      await expect(listingService.createListing(incompleteData, adminId))
        .rejects
        .toThrow('Title, address, description, and price are required');
    });

    test('should throw error when price is invalid', async () => {
      const invalidPriceData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: 'invalid-price'
      };
      const adminId = 'admin123';
      
      await expect(listingService.createListing(invalidPriceData, adminId))
        .rejects
        .toThrow('Price must be a valid positive number');
    });

    test('should throw error when price is zero or negative', async () => {
      const zeroPriceData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '0'
      };
      const adminId = 'admin123';
      
      await expect(listingService.createListing(zeroPriceData, adminId))
        .rejects
        .toThrow('Price must be a valid positive number');

      const negativePriceData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '-100'
      };
      
      await expect(listingService.createListing(negativePriceData, adminId))
        .rejects
        .toThrow('Price must be a valid positive number');
    });

    test('should create listing successfully with valid data', async () => {
      const mockLandlord = {
        _id: 'admin123',
        firstName: 'John',
        surname: 'Doe',
        email: 'john@example.com'
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockLandlord)
      };

      const mockListingsCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'listing123' })
      };

      const mockActivityCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'activity123' })
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingsCollection;
          if (collectionName === 'User-Activity-Logs') return mockActivityCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const validData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '1500.00',
        amenities: ['WiFi', 'Parking']
      };
      const adminId = 'admin123';

      const result = await listingService.createListing(validData, adminId);

      expect(mockListingsCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          listingId: 'LS-0001',
          title: 'Test Property',
          address: '123 Test St',
          description: 'A nice property',
          price: 1500,
          amenities: ['WiFi', 'Parking'],
          status: 'Vacant',
          landlordInfo: expect.objectContaining({
            firstName: 'John',
            surname: 'Doe',
            email: 'john@example.com'
          })
        })
      );

      expect(result).toEqual({
        message: 'Listing created',
        listingId: 'LS-0001'
      });
    });

    test('should handle amenities array normalization', async () => {
      const mockLandlord = {
        _id: 'admin123',
        firstName: 'John',
        surname: 'Doe',
        email: 'john@example.com'
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockLandlord)
      };

      const mockListingsCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'listing123' })
      };

      const mockActivityCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'activity123' })
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingsCollection;
          if (collectionName === 'User-Activity-Logs') return mockActivityCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const validData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '1500.00',
        amenities: ['WiFi', 'Parking', 'WiFi', ' Pool ', ''] // Test deduplication and trimming
      };
      const adminId = 'admin123';

      await listingService.createListing(validData, adminId);

      expect(mockListingsCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          amenities: ['WiFi', 'Parking', 'Pool'] // Should be deduplicated and trimmed
        })
      );
    });
  });

  describe('getListingsByAdminId', () => {
    test('should fetch listings for admin successfully', async () => {
      const mockListings = [
        {
          _id: 'listing1',
          title: 'Property 1',
          landlordInfo: { userId: { _id: 'admin123' } }
        },
        {
          _id: 'listing2',
          title: 'Property 2',
          landlordInfo: { userId: { _id: 'admin123' } }
        }
      ];

      const mockListingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockListings)
        }))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';
      const result = await listingService.getListingsByAdminId(adminId);

      expect(mockListingsCollection.find).toHaveBeenCalledWith({
        'landlordInfo.userId': { _id: 'admin123' }
      });

      expect(result).toEqual(mockListings);
    });

    test('should handle database errors gracefully', async () => {
      const mockListingsCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockRejectedValue(new Error('Database error'))
        }))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const adminId = 'admin123';

      await expect(listingService.getListingsByAdminId(adminId))
        .rejects
        .toThrow('Error fetching listings: Database error');
    });
  });

  describe('countNumberOfListingsByAdminId', () => {
    test('should count listings for admin successfully', async () => {
      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(7)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countNumberOfListingsByAdminId('admin123');

      expect(mockListingsCollection.countDocuments).toHaveBeenCalledWith({
        $or: [
          { 'landlordInfo.userId': { _id: 'admin123' } },
          { 'landlordInfo.landlord': { _id: 'admin123' } }
        ]
      });
      expect(result).toBe(7);
    });

    test('should return 0 when no listings found', async () => {
      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(0)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countNumberOfListingsByAdminId('admin123');

      expect(result).toBe(0);
    });

    test('should handle database errors gracefully', async () => {
      const mockListingsCollection = {
        countDocuments: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(listingService.countNumberOfListingsByAdminId('admin123'))
        .rejects
        .toThrow('Error counting listings: Database error');
    });
  });

  describe('countListingsAddedThisMonth', () => {
    test('should count listings added this month successfully', async () => {
      // Mock current date to be December 15, 2024
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

      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(3)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countListingsAddedThisMonth('admin123');

      // Verify the date range for December 2024
      const expectedQuery = {
        'landlordInfo.userId': { _id: 'admin123' },
        'createdAt': {
          $gte: new Date(2024, 11, 1), // December 1st, 2024
          $lte: new Date(2024, 11, 31, 23, 59, 59, 999) // December 31st, 2024
        }
      };

      expect(mockListingsCollection.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(result).toBe(3);

      // Restore original Date
      global.Date = originalDate;
    });

    test('should return 0 when no listings added this month', async () => {
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

      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(0)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countListingsAddedThisMonth('admin123');

      expect(result).toBe(0);

      // Restore original Date
      global.Date = originalDate;
    });

    test('should handle different months correctly', async () => {
      // Mock current date to be January 10, 2025
      const originalDate = Date;
      const mockDate = new Date('2025-01-10');
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

      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(2)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countListingsAddedThisMonth('admin123');

      // Verify the date range for January 2025
      const expectedQuery = {
        'landlordInfo.userId': { _id: 'admin123' },
        'createdAt': {
          $gte: new Date(2025, 0, 1), // January 1st, 2025
          $lte: new Date(2025, 0, 31, 23, 59, 59, 999) // January 31st, 2025
        }
      };

      expect(mockListingsCollection.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(result).toBe(2);

      // Restore original Date
      global.Date = originalDate;
    });

    test('should handle February (leap year) correctly', async () => {
      // Mock current date to be February 15, 2024 (leap year)
      const originalDate = Date;
      const mockDate = new Date('2024-02-15');
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

      const mockListingsCollection = {
        countDocuments: jest.fn().mockResolvedValue(1)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.countListingsAddedThisMonth('admin123');

      // Verify the date range for February 2024 (leap year - 29 days)
      const expectedQuery = {
        'landlordInfo.userId': { _id: 'admin123' },
        'createdAt': {
          $gte: new Date(2024, 1, 1), // February 1st, 2024
          $lte: new Date(2024, 1, 29, 23, 59, 59, 999) // February 29th, 2024 (leap year)
        }
      };

      expect(mockListingsCollection.countDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(result).toBe(1);

      // Restore original Date
      global.Date = originalDate;
    });

    test('should handle database errors gracefully', async () => {
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

      const mockListingsCollection = {
        countDocuments: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(listingService.countListingsAddedThisMonth('admin123'))
        .rejects
        .toThrow('Error counting listings added this month: Database error');

      // Restore original Date
      global.Date = originalDate;
    });
  });

  describe('getListingById', () => {
    test('should fetch listing by ID successfully', async () => {
      const mockListing = {
        _id: 'listing123',
        listingId: 'L-001',
        title: 'Test Property',
        address: '123 Test St',
        description: 'A test property',
        price: 1500,
        landlordInfo: {
          userId: { _id: 'admin123' }
        }
      };

      const mockListingsCollection = {
        findOne: jest.fn().mockResolvedValue(mockListing)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.getListingById('L-001', 'admin123');

      expect(mockListingsCollection.findOne).toHaveBeenCalledWith({
        listingId: 'L-001',
        'landlordInfo.userId': { _id: 'admin123' }
      });
      expect(result).toEqual(mockListing);
    });

    test('should return null when listing not found', async () => {
      const mockListingsCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.getListingById('L-999', 'admin123');

      expect(result).toBeNull();
    });

    test('should handle database errors gracefully', async () => {
      const mockListingsCollection = {
        findOne: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(listingService.getListingById('L-001', 'admin123'))
        .rejects
        .toThrow('Error fetching listing by ID: Database error');
    });
  });

  describe('deleteListingById', () => {
    test('should delete listing successfully', async () => {
      const mockActivityCollection = {
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true })
      };

      const mockListingsCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
      };

      const mockDb = {
        collection: jest.fn((name) => {
          if (name === 'User-Activity-Logs') return mockActivityCollection;
          if (name === 'Listings') return mockListingsCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.deleteListingById('L-001', 'admin123');

      expect(mockListingsCollection.deleteOne).toHaveBeenCalledWith({
        listingId: 'L-001',
        'landlordInfo.userId': { _id: 'admin123' }
      });
      expect(mockActivityCollection.insertOne).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should return false when listing not found', async () => {
      const mockActivityCollection = {
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true })
      };

      const mockListingsCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 })
      };

      const mockDb = {
        collection: jest.fn((name) => {
          if (name === 'User-Activity-Logs') return mockActivityCollection;
          if (name === 'Listings') return mockListingsCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await listingService.deleteListingById('L-999', 'admin123');

      expect(result).toBe(false);
    });

    test('should handle database errors gracefully', async () => {
      const mockListingsCollection = {
        deleteOne: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockListingsCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(listingService.deleteListingById('L-001', 'admin123'))
        .rejects
        .toThrow('Error deleting listing by ID: Database error');
    });

    test('should log activity when deleting listing', async () => {
      const mockActivityCollection = {
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true })
      };

      const mockListingsCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
      };

      const mockDb = {
        collection: jest.fn((name) => {
          if (name === 'User-Activity-Logs') return mockActivityCollection;
          if (name === 'Listings') return mockListingsCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await listingService.deleteListingById('L-001', 'admin123');

      expect(mockActivityCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'Delete Listing',
          adminId: { _id: 'admin123' },
          detail: 'Deleted listing L-001',
          timestamp: expect.any(Date)
        })
      );
    });
  });
});