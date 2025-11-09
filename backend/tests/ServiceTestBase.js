/**
 * Base test class for service tests to reduce duplication
 */

import {
  mockDbClient,
  createCollectionMocks,
  createMockUser,
  createMockListing,
  createMockBooking,
  createMockLease,
  createMockActivity,
  DEFAULT_MOCKS,
  createTestEnvironment,
  testServiceImport,
  testRequiredFieldValidation,
  testDatabaseErrorHandling
} from './testUtils.js';

export class ServiceTestBase {
  constructor(serviceName, serviceModule, expectedMethods = []) {
    this.serviceName = serviceName;
    this.serviceModule = serviceModule;
    this.expectedMethods = expectedMethods;
    this.testEnv = null;
    this.mockDb = null;
  }

  setupCommonMocks(customMocks = {}) {
    const mocks = {
      ...DEFAULT_MOCKS,
      ...customMocks
    };

    // Mock database
    this.mockDb = mockDbClient(mocks.collections || {});
  }

  setupTestEnvironment() {
    this.testEnv = createTestEnvironment();
  }

  cleanupTestEnvironment() {
    if (this.testEnv) {
      this.testEnv.cleanup();
    }
  }

  runCommonTests() {
    testServiceImport(this.serviceModule, this.expectedMethods);
  }

  // Helper methods for common test patterns
  testRequiredFields(serviceFn, invalidData, fieldDescription) {
    testRequiredFieldValidation(serviceFn, invalidData, fieldDescription);
  }

  testDatabaseErrors(serviceFn, testArgs, expectedError) {
    testDatabaseErrorHandling(serviceFn, testArgs, expectedError);
  }

  // Common setup and teardown
  setupEach(customMocks = {}) {
    beforeEach(() => {
      jest.clearAllMocks();
      this.setupCommonMocks(customMocks);
      this.setupTestEnvironment();
    });
  }

  teardownEach() {
    afterEach(() => {
      this.cleanupTestEnvironment();
    });
  }

  // Specific mock builders for different scenarios
  createSuccessfulDbScenario(collections) {
    return {
      collections: Object.fromEntries(
        Object.entries(collections).map(([name, data]) => [
          name,
          Array.isArray(data)
            ? createCollectionMocks.withFindResult(data)
            : createCollectionMocks.withFindOneResult(data)
        ])
      )
    };
  }

  createInsertScenario(collectionName, insertedId = 'mockId') {
    return {
      collections: {
        [collectionName]: createCollectionMocks.withSuccessfulInsert(insertedId)
      }
    };
  }

  createCountScenario(collectionName, count) {
    return {
      collections: {
        [collectionName]: createCollectionMocks.withCountResult(count)
      }
    };
  }

  createErrorScenario(collectionName, errorMessage = 'Database error') {
    return {
      collections: {
        [collectionName]: createCollectionMocks.withDatabaseError(errorMessage)
      }
    };
  }
}

// Specialized base classes for different service types
export class UserServiceTestBase extends ServiceTestBase {
  constructor(serviceModule) {
    super('UserService', serviceModule, ['register', 'login', 'resetPassword']);
  }

  createRegistrationScenario(userData = {}) {
    const user = createMockUser(userData);
    return this.createSuccessfulDbScenario({
      'System-Users': user
    });
  }

  createLoginScenario(userData = {}) {
    const user = createMockUser({ password: require('crypto').randomBytes(32).toString('hex'), ...userData });
    return {
      collections: {
        'System-Users': createCollectionMocks.withFindOneResult(user),
        'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert()
      }
    };
  }
}

export class ListingServiceTestBase extends ServiceTestBase {
  constructor(serviceModule) {
    super('ListingService', serviceModule, [
      'createListing',
      'getListingsByAdminId',
      'countNumberOfListingsByAdminId',
      'countListingsAddedThisMonth'
    ]);
  }

  createListingScenario(listingData = {}) {
    const listing = createMockListing(listingData);
    return this.createSuccessfulDbScenario({
      'Listings': listing
    });
  }

  createListingsCollectionScenario(listings = []) {
    return this.createSuccessfulDbScenario({
      'Listings': listings.length > 0 ? listings : [createMockListing()]
    });
  }
}

export class BookingServiceTestBase extends ServiceTestBase {
  constructor(serviceModule) {
    super('BookingService', serviceModule, ['getBookings', 'getCurrentMonthRevenue']);
  }

  createBookingScenario(bookingData = {}) {
    const booking = createMockBooking(bookingData);
    const listing = createMockListing();
    const user = createMockUser();

    return {
      collections: {
        'Bookings': createCollectionMocks.withFindResult([booking]),
        'Listings': createCollectionMocks.withFindOneResult(listing),
        'System-Users': createCollectionMocks.withFindOneResult(user)
      }
    };
  }
}

export class LeaseServiceTestBase extends ServiceTestBase {
  constructor(serviceModule) {
    super('LeaseService', serviceModule, [
      'getLeasesByAdminId',
      'createLease',
      'updateLeaseStatusesByAdmin',
      'countActiveLeasesByAdminId',
      'getLeasedPropertyPercentage'
    ]);
  }

  createLeaseScenario(leaseData = {}) {
    const lease = createMockLease(leaseData);
    return this.createSuccessfulDbScenario({
      'Leases': lease
    });
  }

  createCreateLeaseScenario() {
    const booking = createMockBooking();
    const user = createMockUser();
    const listing = createMockListing();

    return {
      collections: {
        'Bookings': createCollectionMocks.withFindOneResult(booking),
        'System-Users': createCollectionMocks.withFindOneResult(user),
        'Listings': createCollectionMocks.withFindOneResult(listing),
        'Leases': createCollectionMocks.withSuccessfulInsert('lease123'),
        'User-Activity-Logs': createCollectionMocks.withSuccessfulInsert('activity123')
      }
    };
  }
}

export class ActivityServiceTestBase extends ServiceTestBase {
  constructor(serviceModule) {
    super('ActivityService', serviceModule, ['getRecentActivities']);
  }

  createActivitiesScenario(activities = []) {
    const activityList = activities.length > 0 ? activities : [createMockActivity()];
    return this.createSuccessfulDbScenario({
      'User-Activity-Logs': activityList
    });
  }
}