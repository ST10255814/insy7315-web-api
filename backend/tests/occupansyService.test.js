import occupansyService from '../src/Services/occupansyService.js';
import { client } from '../src/utils/db.js';
import Object from '../src/utils/ObjectIDConvert.js';

const { toObjectId } = Object;

// Mock database setup
jest.mock('../src/utils/db.js');

describe('Occupancy Service', () => {
  let mockDb;
  let mockListingsCollection;
  let mockBookingsCollection;
  let mockMaintenanceCollection;
  let mockUserCollection;

  beforeEach(() => {
    // Reset mocks
    mockListingsCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      updateOne: jest.fn(),
    };
    
    mockBookingsCollection = {
      find: jest.fn(),
    };
    
    mockMaintenanceCollection = {
      find: jest.fn(),
    };
    
    mockUserCollection = {
      find: jest.fn(),
    };

    mockDb = {
      collection: jest.fn((name) => {
        if (name === 'Listings') return mockListingsCollection;
        if (name === 'Bookings') return mockBookingsCollection;
        if (name === 'Maintenance-Requests') return mockMaintenanceCollection;
        if (name === 'System-Users') return mockUserCollection;
        return null;
      }),
    };

    client.db = jest.fn(() => mockDb);
  });

  describe('checkOccupancyStatus', () => {
    it('should return the status of a listing', async () => {
      const listingId = '507f1f77bcf86cd799439011';
      const mockListing = {
        _id: toObjectId(listingId),
        listingId: 'listing123',
        status: 'Occupied',
      };

      mockListingsCollection.findOne.mockResolvedValue(mockListing);

      const status = await occupansyService.checkOccupancyStatus(listingId);

      expect(status).toBe('Occupied');
      expect(mockListingsCollection.findOne).toHaveBeenCalled();
    });

    it('should throw an error if listing not found', async () => {
      mockListingsCollection.findOne.mockResolvedValue(null);

      await expect(
        occupansyService.checkOccupancyStatus('507f1f77bcf86cd799439099')
      ).rejects.toThrow('Listing not found');
    });
  });

  describe('updateListingStatuses', () => {
    const adminId = '507f1f77bcf86cd799439011';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    it('should update listing to Occupied when there is an active booking', async () => {
      const mockListings = [
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          listingId: 'listing1',
          title: 'Test Property',
          address: '123 Test St',
          status: 'Vacant',
        },
      ];

      const mockBookings = [
        {
          listingDetail: { listingID: toObjectId('507f1f77bcf86cd799439012') },
          newBooking: {
            bookingId: 'booking1',
            status: 'Active',
            checkInDate: formatDate(yesterday),
            checkOutDate: formatDate(nextWeek),
          },
        },
      ];

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockListings),
      });

      mockBookingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockBookings),
      });

      mockMaintenanceCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      mockListingsCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await occupansyService.updateListingStatuses(adminId);

      expect(result.processedListings).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.statusCounts.Occupied).toBe(1);
      expect(mockListingsCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockListings[0]._id },
        {
          $set: {
            status: 'Occupied',
            lastStatusUpdate: expect.any(Date),
          },
        }
      );
    });

    it('should update listing to Under Maintenance when there are maintenance requests but no active booking', async () => {
      const mockListings = [
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          listingId: 'listing1',
          title: 'Test Property',
          address: '123 Test St',
          status: 'Vacant',
        },
      ];

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockListings),
      });

      mockBookingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      const mockMaintenanceRequests = [
        {
          listingDetail: { listingID: toObjectId('507f1f77bcf86cd799439012') },
          newMaintenanceRequest: {
            maintenanceId: 'maint1',
            status: 'pending',
            issue: 'Broken window',
          },
        },
      ];

      mockMaintenanceCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockMaintenanceRequests),
      });

      mockListingsCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await occupansyService.updateListingStatuses(adminId);

      expect(result.processedListings).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.statusCounts['Under Maintenance']).toBe(1);
      expect(mockListingsCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockListings[0]._id },
        {
          $set: {
            status: 'Under Maintenance',
            lastStatusUpdate: expect.any(Date),
          },
        }
      );
    });

    it('should update listing to Vacant when there are no active bookings or maintenance requests', async () => {
      const mockListings = [
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          listingId: 'listing1',
          title: 'Test Property',
          address: '123 Test St',
          status: 'Occupied',
        },
      ];

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockListings),
      });

      mockBookingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      mockMaintenanceCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      mockListingsCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await occupansyService.updateListingStatuses(adminId);

      expect(result.processedListings).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.statusCounts.Vacant).toBe(1);
    });

    it('should not update listing if status has not changed', async () => {
      const mockListings = [
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          listingId: 'listing1',
          title: 'Test Property',
          address: '123 Test St',
          status: 'Vacant',
        },
      ];

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockListings),
      });

      mockBookingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      mockMaintenanceCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      const result = await occupansyService.updateListingStatuses(adminId);

      expect(result.processedListings).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.statusCounts.Vacant).toBe(1);
      expect(mockListingsCollection.updateOne).not.toHaveBeenCalled();
    });

    it('should handle listings with expired bookings', async () => {
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const mockListings = [
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          listingId: 'listing1',
          title: 'Test Property',
          address: '123 Test St',
          status: 'Occupied',
        },
      ];

      const mockBookings = [
        {
          listingDetail: { listingID: toObjectId('507f1f77bcf86cd799439012') },
          newBooking: {
            bookingId: 'booking1',
            status: 'Active',
            checkInDate: formatDate(lastWeek),
            checkOutDate: formatDate(yesterday), // Ended yesterday
          },
        },
      ];

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockListings),
      });

      mockBookingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockBookings),
      });

      mockMaintenanceCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      mockListingsCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await occupansyService.updateListingStatuses(adminId);

      expect(result.processedListings).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.statusCounts.Vacant).toBe(1);
    });
  });

  describe('updateAllListingStatuses', () => {
    it('should update listings for all admins', async () => {
      const mockAdmins = [
        {
          _id: toObjectId('507f1f77bcf86cd799439011'),
          firstName: 'John',
          surname: 'Doe',
          role: 'admin',
        },
        {
          _id: toObjectId('507f1f77bcf86cd799439012'),
          firstName: 'Jane',
          surname: 'Smith',
          role: 'landlord',
        },
      ];

      mockUserCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockAdmins),
      });

      mockListingsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      const result = await occupansyService.updateAllListingStatuses();

      expect(result.processedAdmins).toBe(2);
      expect(result.adminResults).toHaveLength(2);
    });

    it('should handle case when no admins exist', async () => {
      mockUserCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });

      const result = await occupansyService.updateAllListingStatuses();

      expect(result.processedAdmins).toBe(0);
      expect(result.totalListingsProcessed).toBe(0);
      expect(result.totalUpdated).toBe(0);
    });
  });
});
