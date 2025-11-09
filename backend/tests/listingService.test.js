import listingService from '../src/Services/listingService.js';
import { ListingServiceTestBase } from './ServiceTestBase.js';
import { 
  createMockUser, 
  createMockListing,
  createCollectionMocks,
  mockDbClient,
  DateMockHelper,
  expectDatabaseError,
  expectRequiredFieldError
} from './testUtils.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => mockDbClient())
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

// Initialize test base
const testBase = new ListingServiceTestBase(listingService);

// Helper functions to reduce duplication
const setupListingCreationMocks = (landlord = null) => ({
  'System-Users': createCollectionMocks.withFindOneResult(landlord || createMockUser()),
  'Listings': createCollectionMocks.withSuccessfulInsert('listing123'),
  'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert('activity123')
});

describe('ListingService', () => {
  const validAdminId = 'admin123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Use common test from base class
  testBase.runCommonTests();

  describe('createListing', () => {
    const validAdminId = 'admin123';
    
    test('should throw error when required fields are missing', async () => {
      await expectRequiredFieldError(
        () => listingService.createListing({ title: 'Test Property' }, validAdminId),
        'Title, address, description, and price are required'
      );
    });

    test('should throw error when price is invalid', async () => {
      const invalidPriceData = {
        title: 'Test Property',
        address: '123 Test St', 
        description: 'A nice property',
        price: 'invalid-price'
      };
      
      await expectRequiredFieldError(
        () => listingService.createListing(invalidPriceData, validAdminId),
        'Price must be a valid positive number'
      );
    });

    test('should throw error when price is zero or negative', async () => {
      const baseData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property'
      };
      
      await expectRequiredFieldError(
        () => listingService.createListing({ ...baseData, price: '0' }, validAdminId),
        'Price must be a valid positive number'
      );

      await expectRequiredFieldError(
        () => listingService.createListing({ ...baseData, price: '-100' }, validAdminId),
        'Price must be a valid positive number'
      );
    });

    test('should create listing successfully with valid data', async () => {
      const mockLandlord = createMockUser({ _id: 'admin123' });
      const mockCollections = setupListingCreationMocks(mockLandlord);
      
      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const validData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '1500.00',
        amenities: ['WiFi', 'Parking']
      };

      const result = await listingService.createListing(validData, validAdminId);

      expect(mockCollections['Listings'].insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          listingId: 'LS-0001',
          title: 'Test Property',
          address: '123 Test St', 
          description: 'A nice property',
          price: 1500,
          amenities: ['WiFi', 'Parking'],
          status: 'Vacant',
          landlordInfo: expect.objectContaining({
            firstName: mockLandlord.firstName,
            surname: mockLandlord.surname,
            email: mockLandlord.email
          })
        })
      );

      expect(result).toEqual({
        message: 'Listing created',
        listingId: 'LS-0001'
      });
    });

    test('should handle amenities array normalization', async () => {
      const mockCollections = setupListingCreationMocks();
      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const validData = {
        title: 'Test Property',
        address: '123 Test St',
        description: 'A nice property',
        price: '1500.00',
        amenities: ['WiFi', 'Parking', 'WiFi', ' Pool ', ''] // Test deduplication and trimming
      };

      await listingService.createListing(validData, validAdminId);

      expect(mockCollections['Listings'].insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          amenities: ['WiFi', 'Parking', 'Pool'] // Should be deduplicated and trimmed
        })
      );
    });
  });

  describe('getListingsByAdminId', () => {
    test('should fetch listings for admin successfully', async () => {
      const mockListings = [
        createMockListing({ _id: 'listing1', title: 'Property 1' }),
        createMockListing({ _id: 'listing2', title: 'Property 2' })
      ];

      const mockCollections = {
        'Listings': createCollectionMocks.withFindResult(mockListings)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.getListingsByAdminId(validAdminId);

      expect(mockCollections['Listings'].find).toHaveBeenCalledWith({
        'landlordInfo.userId': { _id: validAdminId }
      });
      expect(result).toEqual(mockListings);
    });

    test('should handle database errors gracefully', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withDatabaseError('Database error')
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      await expectDatabaseError(
        () => listingService.getListingsByAdminId(validAdminId),
        'Error fetching listings: Database error'
      );
    });
  });

  describe('countNumberOfListingsByAdminId', () => {
    test('should count listings for admin successfully', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withCountResult(7)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.countNumberOfListingsByAdminId(validAdminId);

      expect(mockCollections['Listings'].countDocuments).toHaveBeenCalledWith({
        $or: [
          { 'landlordInfo.userId': { _id: validAdminId } },
          { 'landlordInfo.landlord': { _id: validAdminId } }
        ]
      });
      expect(result).toBe(7);
    });

    test('should return 0 when no listings found', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withCountResult(0)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.countNumberOfListingsByAdminId(validAdminId);
      expect(result).toBe(0);
    });

    test('should handle database errors gracefully', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withDatabaseError('Database error')
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      await expectDatabaseError(
        () => listingService.countNumberOfListingsByAdminId(validAdminId),
        'Error counting listings: Database error'
      );
    });
  });

  describe('countListingsAddedThisMonth', () => {
    test('should count listings added this month successfully', async () => {
      const dateMock = new DateMockHelper('2024-12-15');
      dateMock.mockGlobalDate();
      
      try {
        const mockCollections = {
          'Listings': createCollectionMocks.withCountResult(3)
        };

        const { client } = await import('../src/utils/db.js');
        client.db.mockReturnValue(mockDbClient(mockCollections));

        const result = await listingService.countListingsAddedThisMonth(validAdminId);

        const expectedQuery = {
          'landlordInfo.userId': { _id: validAdminId },
          'createdAt': {
            $gte: new Date(2024, 11, 1), // December 1st, 2024
            $lte: new Date(2024, 11, 31, 23, 59, 59, 999) // December 31st, 2024
          }
        };

        expect(mockCollections['Listings'].countDocuments).toHaveBeenCalledWith(expectedQuery);
        expect(result).toBe(3);
      } finally {
        dateMock.restore();
      }
    });

    test('should return 0 when no listings added this month', async () => {
      const dateMock = new DateMockHelper('2024-12-15');
      dateMock.mockGlobalDate();
      
      try {
        const mockCollections = {
          'Listings': createCollectionMocks.withCountResult(0)
        };

        const { client } = await import('../src/utils/db.js');
        client.db.mockReturnValue(mockDbClient(mockCollections));

        const result = await listingService.countListingsAddedThisMonth(validAdminId);
        expect(result).toBe(0);
      } finally {
        dateMock.restore();
      }
    });

    test('should handle different months correctly', async () => {
      const dateMock = new DateMockHelper('2025-01-10');
      dateMock.mockGlobalDate();
      
      try {
        const mockCollections = {
          'Listings': createCollectionMocks.withCountResult(2)
        };

        const { client } = await import('../src/utils/db.js');
        client.db.mockReturnValue(mockDbClient(mockCollections));

        const result = await listingService.countListingsAddedThisMonth(validAdminId);

        const expectedQuery = {
          'landlordInfo.userId': { _id: validAdminId },
          'createdAt': {
            $gte: new Date(2025, 0, 1), // January 1st, 2025
            $lte: new Date(2025, 0, 31, 23, 59, 59, 999) // January 31st, 2025
          }
        };

        expect(mockCollections['Listings'].countDocuments).toHaveBeenCalledWith(expectedQuery);
        expect(result).toBe(2);
      } finally {
        dateMock.restore();
      }
    });

    test('should handle February (leap year) correctly', async () => {
      const dateMock = new DateMockHelper('2024-02-15');
      dateMock.mockGlobalDate();
      
      try {
        const mockCollections = {
          'Listings': createCollectionMocks.withCountResult(1)
        };

        const { client } = await import('../src/utils/db.js');
        client.db.mockReturnValue(mockDbClient(mockCollections));

        const result = await listingService.countListingsAddedThisMonth(validAdminId);

        const expectedQuery = {
          'landlordInfo.userId': { _id: validAdminId },
          'createdAt': {
            $gte: new Date(2024, 1, 1), // February 1st, 2024  
            $lte: new Date(2024, 1, 29, 23, 59, 59, 999) // February 29th, 2024 (leap year)
          }
        };

        expect(mockCollections['Listings'].countDocuments).toHaveBeenCalledWith(expectedQuery);
        expect(result).toBe(1);
      } finally {
        dateMock.restore();
      }
    });

    test('should handle database errors gracefully', async () => {
      const dateMock = new DateMockHelper('2024-12-15');
      dateMock.mockGlobalDate();
      
      try {
        const mockCollections = {
          'Listings': createCollectionMocks.withDatabaseError('Database error')
        };

        const { client } = await import('../src/utils/db.js');
        client.db.mockReturnValue(mockDbClient(mockCollections));

        await expectDatabaseError(
          () => listingService.countListingsAddedThisMonth(validAdminId),
          'Error counting listings added this month: Database error'
        );
      } finally {
        dateMock.restore();
      }
    });
  });

  describe('getListingById', () => {
    const validObjectId = '507f1f77bcf86cd799439011';
    
    test('should fetch listing by ID successfully', async () => {
      const mockListing = createMockListing({ 
        listingId: 'L-001',
        landlordInfo: { userId: { _id: validObjectId } }
      });

      const mockCollections = {
        'Listings': createCollectionMocks.withFindOneResult(mockListing)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.getListingById('L-001', validObjectId);

      expect(mockCollections['Listings'].findOne).toHaveBeenCalledWith({
        listingId: 'L-001',
        'landlordInfo.userId': expect.any(Object)
      });
      expect(result).toEqual(mockListing);
    });

    test('should return null when listing not found', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withFindOneResult(null)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.getListingById('L-999', validObjectId);
      expect(result).toBeNull();
    });

    test('should handle database errors gracefully', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withDatabaseError('Database error')
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      await expectDatabaseError(
        () => listingService.getListingById('L-001', validObjectId),
        'Error fetching listing by ID: Database error'
      );
    });
  });

  describe('deleteListingById', () => {
    const validObjectId = '507f1f77bcf86cd799439011';
    
    test('should delete listing successfully', async () => {
      const mockCollections = {
        'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert('activity123'),
        'Listings': createCollectionMocks.withSuccessfulDelete(1)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.deleteListingById('L-001', validObjectId);

      expect(mockCollections['Listings'].deleteOne).toHaveBeenCalledWith({
        listingId: 'L-001',
        'landlordInfo.userId': expect.any(Object)
      });
      expect(mockCollections['User-Activity-Logs'].insertOne).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should return false when listing not found', async () => {
      const mockCollections = {
        'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert('activity123'),
        'Listings': createCollectionMocks.withSuccessfulDelete(0)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      const result = await listingService.deleteListingById('L-999', validObjectId);
      expect(result).toBe(false);
    });

    test('should handle database errors gracefully', async () => {
      const mockCollections = {
        'Listings': createCollectionMocks.withDatabaseError('Database error')
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      await expectDatabaseError(
        () => listingService.deleteListingById('L-001', validObjectId),
        'Error deleting listing by ID: Database error'
      );
    });

    test('should log activity when deleting listing', async () => {
      const mockCollections = {
        'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert('activity123'),
        'Listings': createCollectionMocks.withSuccessfulDelete(1)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDbClient(mockCollections));

      await listingService.deleteListingById('L-001', validObjectId);

      expect(mockCollections['User-Activity-Logs'].insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'Delete Listing',
          adminId: expect.any(Object),
          detail: 'Deleted listing L-001',
          timestamp: expect.any(Date)
        })
      );
    });
  });
});