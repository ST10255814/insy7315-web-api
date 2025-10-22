import userService from '../src/Services/userService.js';
import bcrypt from 'bcrypt';

// Mock the database client
jest.mock('../src/utils/db.js', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
        insertOne: jest.fn()
      }))
    }))
  }
}));

// Mock bcrypt
jest.mock('bcrypt');

// Mock validation module
jest.mock('../src/utils/validation.js', () => ({
  sanitizeInput: jest.fn((input) => input),
  validateEmail: jest.fn(() => true),
  validatePassword: jest.fn(() => true),
  validateUsername: jest.fn(() => true)
}));

// Mock email handler
jest.mock('../src/emails/emailHandler.js', () => ({
  sendResetPasswordEmail: jest.fn()
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Import', () => {
    test('should import userService successfully', () => {
      expect(userService).toBeDefined();
      expect(typeof userService.register).toBe('function');
      expect(typeof userService.login).toBe('function');
      expect(typeof userService.resetPassword).toBe('function');
    });
  });

  describe('register', () => {
    test('should throw error when required fields are missing', async () => {
      const incompleteData = { email: 'test@example.com' };
      
      await expect(userService.register(incompleteData))
        .rejects
        .toThrow('Please provide all required fields');
    });

    test('should handle fullname parsing correctly', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId' })
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      bcrypt.genSalt.mockResolvedValue('mockSalt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const testData = {
        email: 'test@example.com',
        password: 'testPassword123',
        username: 'testuser',
        fullname: 'John Doe Smith'
      };

      const result = await userService.register(testData);

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          surname: 'Doe Smith',
          email: 'test@example.com',
          username: 'testuser'
        })
      );

      expect(result).toEqual(
        expect.objectContaining({
          fullname: 'John Doe Smith',
          email: 'test@example.com'
        })
      );
    });
  });

  describe('login', () => {
    test('should throw error when required fields are missing', async () => {
      const incompleteData = { prefLogin: 'test@example.com' };
      
      await expect(userService.login(incompleteData))
        .rejects
        .toThrow('Please provide all required fields');
    });

    test('should handle email login successfully', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        surname: 'Doe',
        role: 'landlord'
      };

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection)
      };

      const { client } = await import('../src/utils/db.js');
      client.db.mockReturnValue(mockDb);

      bcrypt.compare.mockResolvedValue(true);

      // Mock JWT
      const mockToken = 'mockJwtToken';
      const jwt = await import('jsonwebtoken');
      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);

      const testData = {
        prefLogin: 'test@example.com',
        password: 'testPassword123'
      };

      const result = await userService.login(testData);

      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String), // Accept any JWT token string
          user: expect.objectContaining({
            fullname: 'John Doe',
            email: 'test@example.com'
          })
        })
      );
    });
  });

  describe('resetPassword', () => {
    test('should throw error when email is missing', async () => {
      const incompleteData = { name: 'John Doe' };
      
      await expect(userService.resetPassword(incompleteData))
        .rejects
        .toThrow('No email was found');
    });

    test('should call email handler for valid request', async () => {
      const { sendResetPasswordEmail } = await import('../src/emails/emailHandler.js');
      
      const testData = {
        email: 'test@example.com',
        name: 'John Doe'
      };

      await userService.resetPassword(testData);

      expect(sendResetPasswordEmail).toHaveBeenCalledWith(
        'test@example.com',
        'John Doe',
        process.env.RESET_PASSWORD_URL
      );
    });
  });
});