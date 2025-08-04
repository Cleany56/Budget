/**
 * Tests for security utilities
 * Tests encryption, decryption, and data handling
 */
import {
  encryptData,
  decryptData,
  maskSensitiveData,
  generateEncryptionKey,
  processSensitiveObject,
  decryptSensitiveObject
} from '../../utils/security';

describe('Security Utilities', () => {
  // Test encryption and decryption
  describe('Encryption & Decryption', () => {
    const testKey = generateEncryptionKey();

    test('should encrypt and decrypt data correctly', () => {
      const originalData = 'sensitive financial data';
      const encrypted = encryptData(originalData, testKey);
      
      // Encrypted data should be different from original
      expect(encrypted).not.toBe(originalData);
      
      // Should include separator characters for IV and auth tag
      expect(encrypted.split(':').length).toBe(3);
      
      // Should be able to decrypt back to original
      const decrypted = decryptData(encrypted, testKey);
      expect(decrypted).toBe(originalData);
    });

    test('should handle numeric values', () => {
      const originalAmount = '1234.56';
      const encrypted = encryptData(originalAmount, testKey);
      const decrypted = decryptData(encrypted, testKey);
      expect(decrypted).toBe(originalAmount);
    });

    test('should handle JSON data', () => {
      const originalObject = { balance: 1234.56, currency: 'USD' };
      const originalJson = JSON.stringify(originalObject);
      const encrypted = encryptData(originalJson, testKey);
      const decrypted = decryptData(encrypted, testKey);
      
      // Parse back to object for comparison
      const decryptedObject = JSON.parse(decrypted);
      expect(decryptedObject).toEqual(originalObject);
    });

    test('should fail decryption with wrong key', () => {
      const originalData = 'sensitive financial data';
      const encrypted = encryptData(originalData, testKey);
      const wrongKey = generateEncryptionKey();
      
      // Should throw when using wrong key
      expect(() => decryptData(encrypted, wrongKey)).toThrow();
    });
  });

  // Test masking sensitive data
  describe('Data Masking', () => {
    test('should mask sensitive data correctly', () => {
      const creditCard = '1234567890123456';
      const masked = maskSensitiveData(creditCard);
      
      // Should keep first 2 and last 2 digits
      expect(masked).toBe('12************56');
      
      // Original length should be preserved (with asterisks)
      expect(masked.length).toBe(creditCard.length);
    });
    
    test('should handle short strings', () => {
      expect(maskSensitiveData('123')).toBe('****');
    });
    
    test('should handle empty strings', () => {
      expect(maskSensitiveData('')).toBe('');
    });
  });

  // Test object processing with sensitive fields
  describe('Object Processing', () => {
    const testKey = generateEncryptionKey();
    
    test('should encrypt sensitive fields in object', () => {
      const transaction = {
        _id: '123',
        title: 'Grocery Shopping',
        amount: 123.45,
        date: new Date(),
        category: 'Food'
      };
      
      const sensitiveFields = ['amount'];
      const processed = processSensitiveObject(transaction, sensitiveFields, testKey);
      
      // Sensitive field should be encrypted
      expect(processed.amount).not.toBe(transaction.amount);
      expect(typeof processed.amount).toBe('string');
      
      // Non-sensitive fields should remain unchanged
      expect(processed.title).toBe(transaction.title);
      expect(processed.category).toBe(transaction.category);
      
      // Should be marked as encrypted
      expect(processed.isEncrypted).toBe(true);
      expect(processed.encryptedAt).toBeInstanceOf(Date);
    });
    
    test('should decrypt sensitive fields in object', () => {
      const transaction = {
        _id: '123',
        title: 'Grocery Shopping',
        amount: 123.45,
        date: new Date(),
        category: 'Food'
      };
      
      // First encrypt
      const sensitiveFields = ['amount'];
      const processed = processSensitiveObject(transaction, sensitiveFields, testKey);
      
      // Then decrypt
      const decrypted = decryptSensitiveObject(processed, sensitiveFields, testKey);
      
      // Values should match original
      expect(decrypted.amount).toBe(transaction.amount);
      expect(decrypted.title).toBe(transaction.title);
    });
  });
});
