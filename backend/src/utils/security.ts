/**
 * Security utilities for handling sensitive financial data
 */
import crypto from 'crypto';
import { SensitiveData } from '../models/types';

// AES-256-GCM is a recommended algorithm for sensitive data
const ALGORITHM = 'aes-256-gcm';
// IV length for GCM mode
const IV_LENGTH = 16;
// Auth tag length
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt sensitive data using AES-256-GCM
 * 
 * @param {string} data - Data to encrypt (JSON string)
 * @param {string} key - Encryption key
 * @returns {string} - Encrypted data as base64 string
 */
export const encryptData = (data: string, key: string): string => {
  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher using key and IV
    const cipher = crypto.createCipheriv(
      ALGORITHM, 
      Buffer.from(key, 'hex'), 
      iv
    );
    
    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    
    // Format: base64(iv):base64(authTag):base64(encryptedData)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
};

/**
 * Decrypt sensitive data using AES-256-GCM
 * 
 * @param {string} encryptedData - Encrypted data as base64 string
 * @param {string} key - Encryption key
 * @returns {string} - Decrypted data as string
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    // Split the encrypted data into IV, auth tag, and actual encrypted content
    const [ivBase64, authTagBase64, encryptedContent] = encryptedData.split(':');
    
    // Convert from base64
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM, 
      Buffer.from(key, 'hex'), 
      iv
    );
    
    // Set the auth tag
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
};

/**
 * Generate a secure random key for encryption
 * 
 * @returns {string} - Hex string of the key
 */
export const generateEncryptionKey = (): string => {
  // Generate a 256-bit (32-byte) key
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Mask sensitive data for logging and display
 * 
 * @param {string} data - Data to mask
 * @returns {string} - Masked data
 */
export const maskSensitiveData = (data: string): string => {
  if (!data) return '';
  
  // Keep first 2 and last 2 characters, replace the rest with asterisks
  const length = data.length;
  if (length <= 4) return '****';
  
  return `${data.substring(0, 2)}${'*'.repeat(length - 4)}${data.substring(length - 2)}`;
};

/**
 * Process an object with sensitive fields
 * Mark fields as encrypted and encrypt their values
 * 
 * @param {T} data - Data object to process
 * @param {string[]} sensitiveFields - Array of field names to encrypt
 * @param {string} key - Encryption key
 * @returns {T & SensitiveData} - Processed data with encrypted fields
 */
export const processSensitiveObject = <T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[],
  key: string
): T & SensitiveData => {
  // Use type assertion with Record to allow field assignment
  const result = { ...data } as Record<string, any> & SensitiveData;
  
  // Mark as encrypted
  result.isEncrypted = true;
  result.encryptedAt = new Date();
  
  // Encrypt each sensitive field
  for (const field of sensitiveFields) {
    if (result[field] !== undefined) {
      const valueToEncrypt = typeof result[field] === 'object'
        ? JSON.stringify(result[field])
        : String(result[field]);
      
      result[field] = encryptData(valueToEncrypt, key);
    }
  }
  
  // Cast back to the expected return type
  return result as unknown as T & SensitiveData;
};

/**
 * Decrypt sensitive fields in an object
 * 
 * @param {T & SensitiveData} data - Encrypted data object
 * @param {string[]} sensitiveFields - Array of encrypted field names
 * @param {string} key - Encryption key
 * @returns {T} - Decrypted data object
 */
export const decryptSensitiveObject = <T extends Record<string, any>>(
  data: T & SensitiveData,
  sensitiveFields: string[],
  key: string
): T => {
  if (!data.isEncrypted) {
    return data;
  }
  
  // Use Record<string, any> to allow field assignments
  const result = { ...data } as Record<string, any>;
  
  // Add decryption timestamp
  const withMeta = result as Record<string, any> & Partial<SensitiveData>;
  withMeta.lastDecryptedAt = new Date();
  
  // Decrypt each sensitive field
  for (const field of sensitiveFields) {
    if (withMeta[field] !== undefined) {
      try {
        const decrypted = decryptData(withMeta[field], key);
        
        // Try to parse as JSON if possible
        try {
          withMeta[field] = JSON.parse(decrypted);
        } catch {
          // If not valid JSON, use as string
          withMeta[field] = decrypted;
        }
      } catch (error) {
        console.error(`Failed to decrypt field: ${field}`, error);
        // Keep encrypted value if decryption fails
      }
    }
  }
  
  return withMeta as unknown as T;
};
