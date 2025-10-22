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
        .toThrow('Price must be a valid number');
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

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingsCollection;
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
        listingId: 'listing123'
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

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'System-Users') return mockUserCollection;
          if (collectionName === 'Listings') return mockListingsCollection;
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
});