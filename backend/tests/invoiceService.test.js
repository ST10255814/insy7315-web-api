import invoiceService from '../src/Services/invoiceService.js';

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
        updateOne: jest.fn(),
        aggregate: jest.fn(() => ({
          toArray: jest.fn()
        }))
      }))
    }))
  }
}));

// Mock validation module
jest.mock('../src/utils/validation.js', () => ({
  sanitizeInput: jest.fn((input) => input),
  validateStartDate: jest.fn(() => true),
  validateRentAmount: jest.fn(() => true)
}));

// Mock ObjectIDConvert
jest.mock('../src/utils/ObjectIDConvert.js', () => ({
  toObjectId: jest.fn((id) => ({ _id: id }))
}));

// Mock ID generator
jest.mock('../src/utils/idGenerator.js', () => ({
  generateInvoiceId: jest.fn(() => Promise.resolve('I-0001'))
}));

// Mock invoice helpers
jest.mock('../src/utils/invoiceHelpers.js', () => ({
  generateInvoiceDescription: jest.fn(() => 'Auto-generated invoice description'),
  formatCurrency: jest.fn((amount) => `$${amount}`),
  truncateText: jest.fn((text) => text)
}));

// Mock status manager
jest.mock('../src/utils/statusManager.js', () => ({
  determineInvoiceStatus: jest.fn(() => 'Pending')
}));

// Mock invoice database operations
jest.mock('../src/utils/invoiceDbOperations.js', () => ({
  getInvoicesFromDB: jest.fn(),
  createInvoiceInDB: jest.fn(),
  findLeaseByLeaseId: jest.fn(),
  markInvoiceAsPaidInDB: jest.fn(),
  getInvoiceStatsFromDB: jest.fn(),
  regenerateDescriptionsInDB: jest.fn()
}));

describe('InvoiceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import invoiceService successfully', () => {
      expect(invoiceService).toBeDefined();
      expect(typeof invoiceService.createInvoice).toBe('function');
      expect(typeof invoiceService.getInvoicesByAdminId).toBe('function');
      expect(typeof invoiceService.markInvoiceAsPaid).toBe('function');
      expect(typeof invoiceService.getInvoiceStats).toBe('function');
      expect(typeof invoiceService.updateInvoiceStatusesByAdmin).toBe('function');
      expect(typeof invoiceService.updateAllInvoiceStatuses).toBe('function');
      expect(typeof invoiceService.regenerateAllInvoiceDescriptions).toBe('function');
    });
  });

  describe('createInvoice', () => {
    test('should throw error when required fields are missing', async () => {
      const incompleteData = { leaseId: 'L-0001' };
      const adminId = 'admin123';

      await expect(invoiceService.createInvoice(adminId, incompleteData))
        .rejects
        .toThrow('Lease ID, date, and amount are required');
    });

    test('should throw error when lease is not found', async () => {
      const { findLeaseByLeaseId } = await import('../src/utils/invoiceDbOperations.js');
      findLeaseByLeaseId.mockResolvedValue(null);

      const validData = {
        leaseId: 'L-0001',
        date: '2024-12-01',
        amount: 1500
      };
      const adminId = 'admin123';

      await expect(invoiceService.createInvoice(adminId, validData))
        .rejects
        .toThrow('Lease not found with the provided Lease ID');
    });

    test('should create invoice successfully with valid data', async () => {
      const mockLease = {
        _id: 'lease123',
        leaseId: 'L-0001',
        tenant: {
          firstName: 'Jane',
          surname: 'Smith',
          email: 'jane@example.com'
        },
        listing: {
          address: '123 Test St'
        }
      };

      const { findLeaseByLeaseId, createInvoiceInDB } = await import('../src/utils/invoiceDbOperations.js');
      findLeaseByLeaseId.mockResolvedValue(mockLease);
      createInvoiceInDB.mockResolvedValue({ insertedId: 'invoice123' });

      const validData = {
        leaseId: 'L-0001',
        date: '2024-12-01',
        amount: 1500,
        description: 'Monthly rent payment'
      };
      const adminId = 'admin123';

      const result = await invoiceService.createInvoice(adminId, validData);

      expect(createInvoiceInDB).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceId: 'I-0001',
          adminId: { _id: 'admin123' },
          lease: {
            tenant: 'Jane Smith',
            email: 'jane@example.com',
            propertyAddress: '123 Test St'
          },
          description: 'Monthly rent payment',
          originalDescription: 'Monthly rent payment',
          amount: 1500,
          date: '2024-12-01',
          status: 'Pending'
        })
      );

      expect(result).toBe('I-0001');
    });

    test('should auto-generate description when not provided', async () => {
      const mockLease = {
        _id: 'lease123',
        leaseId: 'L-0001',
        tenant: {
          firstName: 'Jane',
          surname: 'Smith',
          email: 'jane@example.com'
        },
        listing: {
          address: '123 Test St'
        }
      };

      const { findLeaseByLeaseId, createInvoiceInDB } = await import('../src/utils/invoiceDbOperations.js');
      findLeaseByLeaseId.mockResolvedValue(mockLease);
      createInvoiceInDB.mockResolvedValue({ insertedId: 'invoice123' });

      const validData = {
        leaseId: 'L-0001',
        date: '2024-12-01',
        amount: 1500
        // No description provided
      };
      const adminId = 'admin123';

      await invoiceService.createInvoice(adminId, validData);

      expect(createInvoiceInDB).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Auto-generated invoice description',
          originalDescription: null
        })
      );
    });

    test('should validate inputs', async () => {
      const mockLease = {
        _id: 'lease123',
        leaseId: 'L-0001',
        tenant: {
          firstName: 'Jane',
          surname: 'Smith',
          email: 'jane@example.com'
        },
        listing: {
          address: '123 Test St'
        }
      };

      const { findLeaseByLeaseId, createInvoiceInDB } = await import('../src/utils/invoiceDbOperations.js');
      findLeaseByLeaseId.mockResolvedValue(mockLease);
      createInvoiceInDB.mockResolvedValue({ insertedId: 'invoice123' });

      const { sanitizeInput, validateStartDate, validateRentAmount } = await import('../src/utils/validation.js');

      const validData = {
        leaseId: 'L-0001',
        date: '2024-12-01',
        amount: 1500,
        description: 'Monthly rent payment'
      };
      const adminId = 'admin123';

      await invoiceService.createInvoice(adminId, validData);

      expect(sanitizeInput).toHaveBeenCalledWith('Monthly rent payment');
      expect(validateStartDate).toHaveBeenCalledWith('2024-12-01');
      expect(validateRentAmount).toHaveBeenCalledWith(1500);
    });
  });

  describe('getInvoicesByAdminId', () => {
    test('should throw error when adminId is missing', async () => {
      await expect(invoiceService.getInvoicesByAdminId(null))
        .rejects
        .toThrow('Admin ID is required');
    });

    test('should fetch and update invoices successfully', async () => {
      const mockInvoices = [
        {
          _id: 'invoice1',
          invoiceId: 'I-0001',
          status: 'Pending',
          date: '2024-12-01',
          amount: 1500,
          lease: {
            tenant: 'Jane Smith',
            propertyAddress: '123 Test St'
          }
        }
      ];

      const mockInvoicesCollection = {
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 0 })
      };

      const { getInvoicesFromDB } = await import('../src/utils/invoiceDbOperations.js');
      getInvoicesFromDB.mockResolvedValue({
        invoices: mockInvoices,
        invoicesCollection: mockInvoicesCollection
      });

      const adminId = 'admin123';
      const result = await invoiceService.getInvoicesByAdminId(adminId);

      expect(getInvoicesFromDB).toHaveBeenCalledWith('admin123');
      expect(result).toEqual(mockInvoices);
    });

    test('should update invoice status when it changes', async () => {
      const mockInvoices = [
        {
          _id: 'invoice1',
          invoiceId: 'I-0001',
          status: 'Pending',
          date: '2024-11-01', // Past date
          amount: 1500,
          lease: {
            tenant: 'Jane Smith',
            propertyAddress: '123 Test St'
          }
        }
      ];

      const mockInvoicesCollection = {
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
      };

      const { getInvoicesFromDB } = await import('../src/utils/invoiceDbOperations.js');
      getInvoicesFromDB.mockResolvedValue({
        invoices: mockInvoices,
        invoicesCollection: mockInvoicesCollection
      });

      // Mock status change to overdue
      const { determineInvoiceStatus } = await import('../src/utils/statusManager.js');
      determineInvoiceStatus.mockReturnValue('Overdue');

      const { generateInvoiceDescription } = await import('../src/utils/invoiceHelpers.js');
      generateInvoiceDescription.mockReturnValue('Updated overdue invoice description');

      const adminId = 'admin123';
      const result = await invoiceService.getInvoicesByAdminId(adminId);

      expect(mockInvoicesCollection.updateOne).toHaveBeenCalledWith(
        { _id: 'invoice1' },
        {
          $set: {
            status: 'Overdue',
            description: 'Updated overdue invoice description',
            lastStatusUpdate: expect.any(Date)
          }
        }
      );

      expect(result[0].status).toBe('Overdue');
    });

    test('should handle invoices with missing date gracefully', async () => {
      const mockInvoices = [
        {
          _id: 'invoice1',
          invoiceId: 'I-0001',
          status: 'Pending',
          // date is missing
          amount: 1500
        }
      ];

      const mockInvoicesCollection = {
        updateOne: jest.fn()
      };

      const { getInvoicesFromDB } = await import('../src/utils/invoiceDbOperations.js');
      getInvoicesFromDB.mockResolvedValue({
        invoices: mockInvoices,
        invoicesCollection: mockInvoicesCollection
      });

      const adminId = 'admin123';
      const result = await invoiceService.getInvoicesByAdminId(adminId);

      expect(mockInvoicesCollection.updateOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('markInvoiceAsPaid', () => {
    test('should mark invoice as paid successfully', async () => {
      const { markInvoiceAsPaidInDB } = await import('../src/utils/invoiceDbOperations.js');
      markInvoiceAsPaidInDB.mockResolvedValue({ found: true, modified: true });

      const result = await invoiceService.markInvoiceAsPaid('I-0001', 'admin123');

      expect(markInvoiceAsPaidInDB).toHaveBeenCalledWith('I-0001', 'admin123');
      expect(result).toBe(true);
    });

    test('should throw error when invoice not found', async () => {
      const { markInvoiceAsPaidInDB } = await import('../src/utils/invoiceDbOperations.js');
      markInvoiceAsPaidInDB.mockResolvedValue({ found: false, modified: false });

      await expect(invoiceService.markInvoiceAsPaid('I-0001', 'admin123'))
        .rejects
        .toThrow('Invoice not found or unauthorized');
    });
  });

  describe('getInvoiceStats', () => {
    test('should return formatted invoice statistics', async () => {
      const mockStats = [
        { _id: 'Pending', count: 5, totalAmount: 7500 },
        { _id: 'Overdue', count: 2, totalAmount: 3000 },
        { _id: 'Paid', count: 10, totalAmount: 15000 }
      ];

      const { getInvoiceStatsFromDB } = await import('../src/utils/invoiceDbOperations.js');
      getInvoiceStatsFromDB.mockResolvedValue(mockStats);

      const result = await invoiceService.getInvoiceStats('admin123');

      expect(result).toEqual({
        pending: { count: 5, totalAmount: 7500 },
        overdue: { count: 2, totalAmount: 3000 },
        paid: { count: 10, totalAmount: 15000 },
        total: { count: 17, totalAmount: 25500 }
      });
    });

    test('should handle missing status categories', async () => {
      const mockStats = [
        { _id: 'Pending', count: 3, totalAmount: 4500 }
        // Missing overdue and paid
      ];

      const { getInvoiceStatsFromDB } = await import('../src/utils/invoiceDbOperations.js');
      getInvoiceStatsFromDB.mockResolvedValue(mockStats);

      const result = await invoiceService.getInvoiceStats('admin123');

      expect(result).toEqual({
        pending: { count: 3, totalAmount: 4500 },
        overdue: { count: 0, totalAmount: 0 },
        paid: { count: 0, totalAmount: 0 },
        total: { count: 3, totalAmount: 4500 }
      });
    });
  });

  describe('regenerateAllInvoiceDescriptions', () => {
    test('should regenerate descriptions for all invoices', async () => {
      const { regenerateDescriptionsInDB } = await import('../src/utils/invoiceDbOperations.js');
      regenerateDescriptionsInDB.mockResolvedValue(5);

      const result = await invoiceService.regenerateAllInvoiceDescriptions();

      expect(regenerateDescriptionsInDB).toHaveBeenCalledWith(null);
      expect(result).toBe(5);
    });

    test('should regenerate descriptions for specific admin', async () => {
      const { regenerateDescriptionsInDB } = await import('../src/utils/invoiceDbOperations.js');
      regenerateDescriptionsInDB.mockResolvedValue(3);

      const result = await invoiceService.regenerateAllInvoiceDescriptions('admin123');

      expect(regenerateDescriptionsInDB).toHaveBeenCalledWith('admin123');
      expect(result).toBe(3);
    });
  });
});