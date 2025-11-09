import activityService from '../src/Services/activityService.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          sort: jest.fn(() => ({
            limit: jest.fn(() => ({
              toArray: jest.fn()
            }))
          }))
        }))
      }))
    }))
  }
}));

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id }))
}));

describe('ActivityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import activityService successfully', () => {
      expect(activityService).toBeDefined();
      expect(activityService).toHaveProperty('getRecentActivities');
      expect(typeof activityService.getRecentActivities).toBe('function');
    });
  });

  describe('getRecentActivities', () => {
    test('should throw error when adminId is missing', async () => {
      await expect(activityService.getRecentActivities(null))
        .rejects
        .toThrow('Admin ID is required');
    });

    test('should fetch recent activities successfully with default limit', async () => {
      const mockActivities = [
        {
          _id: 'activity1',
          action: 'Create Listing',
          adminId: { _id: 'admin123' },
          detail: 'Created listing LS-0001',
          timestamp: new Date('2024-12-01')
        },
        {
          _id: 'activity2',
          action: 'Create Lease',
          adminId: { _id: 'admin123' },
          detail: 'Created lease L-0001',
          timestamp: new Date('2024-12-02')
        }
      ];

      const mockToArray = jest.fn().mockResolvedValue(mockActivities);
      const mockLimit = jest.fn(() => ({ toArray: mockToArray }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      const mockFind = jest.fn(() => ({ sort: mockSort }));

      const mockActivityCollection = {
        find: mockFind
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockActivityCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await activityService.getRecentActivities('admin123');

      expect(mockFind).toHaveBeenCalledWith({
        adminId: { _id: 'admin123' }
      });
      expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockLimit).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockActivities);
    });

    test('should fetch recent activities with custom limit', async () => {
      const mockActivities = [
        {
          _id: 'activity1',
          action: 'Create Listing',
          adminId: { _id: 'admin123' },
          detail: 'Created listing LS-0001',
          timestamp: new Date('2024-12-01')
        }
      ];

      const mockToArray = jest.fn().mockResolvedValue(mockActivities);
      const mockLimit = jest.fn(() => ({ toArray: mockToArray }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      const mockFind = jest.fn(() => ({ sort: mockSort }));

      const mockActivityCollection = {
        find: mockFind
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockActivityCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await activityService.getRecentActivities('admin123', 5);

      expect(mockLimit).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockActivities);
    });

    test('should return empty array when no activities found', async () => {
      const mockToArray = jest.fn().mockResolvedValue([]);
      const mockLimit = jest.fn(() => ({ toArray: mockToArray }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      const mockFind = jest.fn(() => ({ sort: mockSort }));

      const mockActivityCollection = {
        find: mockFind
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockActivityCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await activityService.getRecentActivities('admin123');

      expect(result).toEqual([]);
    });

    test('should handle database errors gracefully', async () => {
      const mockToArray = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      const mockLimit = jest.fn(() => ({ toArray: mockToArray }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      const mockFind = jest.fn(() => ({ sort: mockSort }));

      const mockActivityCollection = {
        find: mockFind
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockActivityCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(activityService.getRecentActivities('admin123'))
        .rejects
        .toThrow('Failed to retrieve recent activities: Database connection failed');
    });

    test('should handle invalid adminId format', async () => {
      const mockToArray = jest.fn().mockRejectedValue(new Error('Invalid ObjectId'));
      const mockLimit = jest.fn(() => ({ toArray: mockToArray }));
      const mockSort = jest.fn(() => ({ limit: mockLimit }));
      const mockFind = jest.fn(() => ({ sort: mockSort }));

      const mockActivityCollection = {
        find: mockFind
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockActivityCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(activityService.getRecentActivities('invalid-id'))
        .rejects
        .toThrow('Failed to retrieve recent activities: Invalid ObjectId');
    });
  });
});