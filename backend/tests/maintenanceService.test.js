import maintenanceService from '../src/Services/maintenanceService.js';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          toArray: jest.fn()
        })),
        countDocuments: jest.fn()
      }))
    }))
  }
}));

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id }))
}));

describe('MaintenanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import maintenanceService successfully', () => {
      expect(maintenanceService).toBeDefined();
      expect(typeof maintenanceService.getAllMaintenanceRequests).toBe('function');
      expect(typeof maintenanceService.countMaintenanceRequestsByAdminId).toBe('function');
      expect(typeof maintenanceService.countHighPriorityMaintenanceRequestsByAdminId).toBe('function');
    });
  });

  describe('getAllMaintenanceRequests', () => {
    test('should throw error when adminId is missing', async () => {
      await expect(maintenanceService.getAllMaintenanceRequests(null))
        .rejects
        .toThrow('Admin ID is required');
    });

    test('should return empty array when no maintenance requests found', async () => {
      const mockMaintenanceCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue([])
        }))
      };

      const mockUserCollection = {
        findOne: jest.fn()
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Maintenance-Requests') return mockMaintenanceCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.getAllMaintenanceRequests('admin123');

      expect(result).toEqual([]);
    });

    test('should fetch maintenance requests successfully', async () => {
      const mockMaintenanceRequests = [
        {
          _id: 'maintenance1',
          userId: 'user123',
          listingDetail: {
            landlordID: { _id: 'admin123' },
            address: '123 Test St'
          },
          newMaintenanceRequest: {
            maintenanceId: 'M-0001',
            issue: 'Plumbing',
            description: 'Leaky faucet',
            priority: 'high',
            status: 'pending',
            documentURL: 'http://example.com/doc.pdf',
            createdAt: new Date('2024-12-01')
          }
        }
      ];

      const mockUser = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith'
      };

      const mockMaintenanceCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockMaintenanceRequests)
        }))
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Maintenance-Requests') return mockMaintenanceCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.getAllMaintenanceRequests('admin123');

      expect(mockMaintenanceCollection.find).toHaveBeenCalledWith({
        'listingDetail.landlordID': { _id: 'admin123' }
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        maintenanceID: 'M-0001',
        issue: 'Plumbing',
        description: 'Leaky faucet',
        priority: 'high',
        status: 'pending',
        documentURL: 'http://example.com/doc.pdf',
        notes: '',
        followUps: 0,
        createdAt: expect.any(Date),
        updatedAt: undefined,
        property: '123 Test St',
        tenantName: 'Jane Smith',
        careTaker: null
      });
    });

    test('should handle missing user information gracefully', async () => {
      const mockMaintenanceRequests = [
        {
          _id: 'maintenance1',
          userId: 'user123',
          listingDetail: {
            landlordID: { _id: 'admin123' },
            address: '123 Test St'
          },
          newMaintenanceRequest: {
            maintenanceId: 'M-0001',
            issue: 'Plumbing',
            description: 'Leaky faucet',
            priority: 'high',
            status: 'pending'
          }
        }
      ];

      const mockMaintenanceCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockMaintenanceRequests)
        }))
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(null) // User not found
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Maintenance-Requests') return mockMaintenanceCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.getAllMaintenanceRequests('admin123');

      expect(result[0].tenantName).toBe('Unknown Tenant');
    });

    test('should handle maintenance requests with missing newMaintenanceRequest fields', async () => {
      const mockMaintenanceRequests = [
        {
          _id: 'maintenance1',
          userId: 'user123',
          listingDetail: {
            landlordID: { _id: 'admin123' },
            address: '123 Test St'
          },
          createdAt: new Date('2024-12-01'),
          newMaintenanceRequest: {
            issue: 'Plumbing',
            description: 'Leaky faucet'
            // Missing priority, status, etc.
          }
        }
      ];

      const mockUser = {
        _id: 'user123',
        firstName: 'Jane',
        surname: 'Smith'
      };

      const mockMaintenanceCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue(mockMaintenanceRequests)
        }))
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      const mockDb = {
        collection: jest.fn((collectionName) => {
          if (collectionName === 'Maintenance-Requests') return mockMaintenanceCollection;
          if (collectionName === 'System-Users') return mockUserCollection;
        })
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.getAllMaintenanceRequests('admin123');

      expect(result[0]).toEqual(
        expect.objectContaining({
          priority: 'medium',
          status: 'pending',
          createdAt: expect.any(Date)
        })
      );
    });

    test('should handle database errors gracefully', async () => {
      const mockMaintenanceCollection = {
        find: jest.fn(() => ({
          toArray: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        }))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(maintenanceService.getAllMaintenanceRequests('admin123'))
        .rejects
        .toThrow('Error fetching maintenance requests: Database connection failed');
    });
  });

  describe('countMaintenanceRequestsByAdminId', () => {
    test('should count maintenance requests for admin successfully', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockResolvedValue(5)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.countMaintenanceRequestsByAdminId('admin123');

      expect(mockMaintenanceCollection.countDocuments).toHaveBeenCalledWith({
        'listingDetail.landlordID': { _id: 'admin123' }
      });
      expect(result).toBe(5);
    });

    test('should return 0 when no maintenance requests found', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockResolvedValue(0)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.countMaintenanceRequestsByAdminId('admin123');

      expect(result).toBe(0);
    });

    test('should handle database errors gracefully', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(maintenanceService.countMaintenanceRequestsByAdminId('admin123'))
        .rejects
        .toThrow('Error counting maintenance requests: Database error');
    });
  });

  describe('countHighPriorityMaintenanceRequestsByAdminId', () => {
    test('should count high priority maintenance requests successfully', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockResolvedValue(3)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.countHighPriorityMaintenanceRequestsByAdminId('admin123');

      expect(mockMaintenanceCollection.countDocuments).toHaveBeenCalledWith({
        'listingDetail.landlordID': { _id: 'admin123' },
        'newMaintenanceRequest.priority': { $in: ['high', 'High'] }
      });
      expect(result).toBe(3);
    });

    test('should return 0 when no high priority requests found', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockResolvedValue(0)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      const result = await maintenanceService.countHighPriorityMaintenanceRequestsByAdminId('admin123');

      expect(result).toBe(0);
    });

    test('should handle database errors gracefully', async () => {
      const mockMaintenanceCollection = {
        countDocuments: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockMaintenanceCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      await expect(maintenanceService.countHighPriorityMaintenanceRequestsByAdminId('admin123'))
        .rejects
        .toThrow('Error counting high priority maintenance requests: Database error');
    });
  });
});