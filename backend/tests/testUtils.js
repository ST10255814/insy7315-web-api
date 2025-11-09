/**
 * Shared test utilities for reducing code duplication across test files
 */

// Common mock factories
export const createMockDb = (collectionMocks = {}) => ({
  collection: jest.fn((collectionName) => {
    const collections = new Map(Object.entries(collectionMocks));
    return collections.has(collectionName) 
      ? collections.get(collectionName)
      : createDefaultMockCollection();
  })
});

export const createDefaultMockCollection = () => ({
  find: jest.fn(() => ({
    toArray: jest.fn(),
    sort: jest.fn(() => ({
      limit: jest.fn(() => ({
        toArray: jest.fn()
      }))
    }))
  })),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn()
});

// Database client mock factory
export const mockDbClient = (collectionMocks = {}) => {
  const mockDb = createMockDb(collectionMocks);
  return mockDb;
};

// Common mock data factories
export const createMockUser = (overrides = {}) => ({
  _id: 'user123',
  firstName: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  role: 'landlord',
  password: require('crypto').randomBytes(32).toString('hex'), // Dynamic hash generation
  ...overrides
});

export const createMockListing = (overrides = {}) => ({
  _id: 'listing123',
  listingId: 'LS-0001',
  title: 'Test Property',
  address: '123 Test St',
  description: 'A test property',
  price: 1500,
  status: 'Vacant',
  amenities: ['WiFi', 'Parking'],
  landlordInfo: {
    userId: { _id: 'admin123' },
    firstName: 'John',
    surname: 'Doe',
    email: 'john@example.com'
  },
  createdAt: new Date('2024-12-01'),
  ...overrides
});

export const createMockBooking = (overrides = {}) => ({
  _id: 'booking123',
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
  createdAt: new Date('2024-12-01'),
  ...overrides
});

export const createMockLease = (overrides = {}) => ({
  _id: 'lease123',
  leaseId: 'L-0001',
  adminId: { _id: 'admin123' },
  status: 'Pending',
  bookingDetails: {
    bookingId: 'B-0001',
    startDate: '01-01-2024',
    endDate: '31-12-2024',
    rentAmount: 12000
  },
  tenant: {
    userId: { _id: 'user123' },
    firstName: 'Jane',
    surname: 'Smith',
    email: 'jane@example.com'
  },
  listing: {
    listingId: { _id: 'listing123' },
    address: '123 Test St'
  },
  createdAt: new Date('2024-12-01'),
  ...overrides
});

export const createMockActivity = (overrides = {}) => ({
  _id: 'activity123',
  action: 'Create Listing',
  adminId: { _id: 'admin123' },
  detail: 'Created listing LS-0001',
  timestamp: new Date('2024-12-01'),
  ...overrides
});

export const createMockInvoice = (overrides = {}) => ({
  _id: 'invoice123',
  invoiceId: 'INV-0001',
  adminId: { _id: 'admin123' },
  amount: 1500,
  status: 'Pending',
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-12-01'),
  ...overrides
});

// Date mocking utilities
export class DateMockHelper {
  constructor(mockDate) {
    this.mockDate = new Date(mockDate);
    this.originalDate = Date;
  }

  mockGlobalDate() {
    const mockDate = this.mockDate;
    const OriginalDate = this.originalDate;
    global.Date = class extends OriginalDate {
      constructor(...args) {
        if (args.length === 0) {
          return mockDate;
        }
        return new OriginalDate(...args);
      }
      static now() {
        return mockDate.getTime();
      }
    };
  }

  restore() {
    global.Date = this.originalDate;
  }
}

export const withMockedDate = (mockDateString, testFn) => {
  const dateMock = new DateMockHelper(mockDateString);
  return async () => {
    dateMock.mockGlobalDate();
    try {
      await testFn();
    } finally {
      dateMock.restore();
    }
  };
};

// Common test setup utilities
export const setupServiceTest = (serviceName, mocks = {}) => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mocks that can be overridden
    if (!mocks.skipDbMock) {
      mockDbClient(mocks.collections || {});
    }
    
    if (!mocks.skipObjectIdMock) {
      jest.doMock('../src/utils/ObjectIDConvert.js', () => ({
        toObjectId: jest.fn((id) => ({ _id: id, toString: () => id }))
      }));
    }
    
    if (mocks.idGenerator) {
      jest.doMock('../src/utils/idGenerator.js', () => mocks.idGenerator);
    }
    
    if (mocks.validation) {
      jest.doMock('../src/utils/validation.js', () => mocks.validation);
    }
    
    if (mocks.emailHandler) {
      jest.doMock('../src/emails/emailHandler.js', () => mocks.emailHandler);
    }
    
    if (mocks.bcrypt) {
      jest.doMock('bcrypt', () => mocks.bcrypt);
    }
    
    if (mocks.statusManager) {
      jest.doMock('../src/utils/statusManager.js', () => mocks.statusManager);
    }
  });
};

// Common assertion helpers
export const expectServiceToBeImported = (service, expectedMethods = []) => {
  expect(service).toBeDefined();
  expectedMethods.forEach(method => {
    expect(service).toHaveProperty(method);
    expect(typeof service[method]).toBe('function');
  });
};

export const expectDatabaseError = async (testFn, expectedMessage) => {
  await expect(testFn()).rejects.toThrow(expectedMessage);
};

export const expectRequiredFieldError = async (testFn, fieldName = 'required fields') => {
  await expect(testFn()).rejects.toThrow(fieldName);
};

// Collection mock builders for specific scenarios
export const createCollectionMocks = {
  withSuccessfulInsert: (insertedId = 'mockId') => ({
    insertOne: jest.fn().mockResolvedValue({ insertedId, acknowledged: true })
  }),
  
  withSuccessfulUpdate: (modifiedCount = 1) => ({
    updateOne: jest.fn().mockResolvedValue({ modifiedCount, acknowledged: true })
  }),
  
  withSuccessfulDelete: (deletedCount = 1) => ({
    deleteOne: jest.fn().mockResolvedValue({ deletedCount, acknowledged: true })
  }),
  
  withCountResult: (count) => ({
    countDocuments: jest.fn().mockResolvedValue(count)
  }),
  
  withFindResult: (results) => ({
    find: jest.fn(() => ({
      toArray: jest.fn().mockResolvedValue(results),
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(results)
        }))
      }))
    }))
  }),
  
  withFindOneResult: (result) => ({
    findOne: jest.fn().mockResolvedValue(result)
  }),
  
  withDatabaseError: (errorMessage = 'Database connection failed') => ({
    find: jest.fn(() => ({
      toArray: jest.fn().mockRejectedValue(new Error(errorMessage))
    })),
    findOne: jest.fn().mockRejectedValue(new Error(errorMessage)),
    insertOne: jest.fn().mockRejectedValue(new Error(errorMessage)),
    updateOne: jest.fn().mockRejectedValue(new Error(errorMessage)),
    deleteOne: jest.fn().mockRejectedValue(new Error(errorMessage)),
    countDocuments: jest.fn().mockRejectedValue(new Error(errorMessage))
  })
};

// Common test patterns
export const testServiceImport = (service, expectedMethods) => {
  describe('Service Import', () => {
    test('should import service successfully', () => {
      expectServiceToBeImported(service, expectedMethods);
    });
  });
};

export const testRequiredFieldValidation = (serviceFn, testData, fieldDescription = 'required fields') => {
  test(`should throw error when ${fieldDescription} are missing`, async () => {
    await expectRequiredFieldError(() => serviceFn(testData), fieldDescription);
  });
};

export const testDatabaseErrorHandling = (serviceFn, testArgs, expectedErrorMessage) => {
  test('should handle database errors gracefully', async () => {
    await expectDatabaseError(() => serviceFn(...testArgs), expectedErrorMessage);
  });
};

// JWT mocking utility
export const mockJWT = (mockToken = 'mockJwtToken') => {
  return {
    sign: jest.fn().mockReturnValue(mockToken),
    verify: jest.fn().mockReturnValue({ userId: 'user123' })
  };
};

// bcrypt mocking utility
export const mockBcrypt = () => ({
  genSalt: jest.fn().mockResolvedValue('mockSalt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true)
});

// Default mock configurations
export const DEFAULT_MOCKS = {
  bcrypt: mockBcrypt(),
  validation: {
    sanitizeInput: jest.fn((input) => input),
    validateEmail: jest.fn(() => true),
    validatePassword: jest.fn(() => true),
    validateUsername: jest.fn(() => true)
  },
  emailHandler: {
    sendResetPasswordEmail: jest.fn()
  },
  idGenerator: {
    generateListingId: jest.fn(() => Promise.resolve('LS-0001')),
    generateLeaseId: jest.fn(() => Promise.resolve('L-0001')),
    generateBookingId: jest.fn(() => Promise.resolve('B-0001')),
    generateInvoiceId: jest.fn(() => Promise.resolve('INV-0001'))
  },
  statusManager: {
    determineLeaseStatus: jest.fn(() => 'Pending'),
    determineBookingStatus: jest.fn(() => 'Confirmed')
  }
};

// Helper to create test environment
export const createTestEnvironment = () => {
  const env = new Map([
    ['JWT_SECRET', require('crypto').randomBytes(32).toString('hex')],
    ['NODE_ENV', 'test'],
    ['MONGO_URI', 'mongodb://localhost:27017/test-rentwise']
  ]);
  
  env.forEach((value, key) => {
    process.env[key] = value;
  });
  
  return {
    cleanup: () => {
      env.forEach((value, key) => {
        delete process.env[key];
      });
    }
  };
};

// Date calculation helpers
export const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate.split('-').reverse().join('-'));
  const checkOut = new Date(checkOutDate.split('-').reverse().join('-'));
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isCurrentMonth = (dateString) => {
  const date = new Date(dateString.split('-').reverse().join('-'));
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// Async test wrapper for better error handling
export const asyncTest = (testFn) => {
  return testFn;
};