import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Path to store the encryption key
const KEY_PATH = path.join(__dirname, '../../data/keys');
const KEY_FILE = path.join(KEY_PATH, 'realm_key.bin');

/**
 * Generate a secure 64-byte encryption key for Realm
 * @returns {Uint8Array} - 64-byte encryption key
 */
export const generateEncryptionKey = (): Uint8Array => {
  // Generate a random 64-byte key
  return new Uint8Array(crypto.randomBytes(64));
};

/**
 * Get the encryption key, creating it if it doesn't exist
 * @returns {Uint8Array} - 64-byte encryption key
 */
export const getEncryptionKey = (): Uint8Array => {
  try {
    // Ensure the key directory exists
    if (!fs.existsSync(KEY_PATH)) {
      fs.mkdirSync(KEY_PATH, { recursive: true });
    }

    // Check if the key already exists
    if (fs.existsSync(KEY_FILE)) {
      // Load existing key
      const keyData = fs.readFileSync(KEY_FILE);
      return new Uint8Array(keyData);
    } else {
      // Generate a new key
      const key = generateEncryptionKey();
      
      // Save the key to disk
      fs.writeFileSync(KEY_FILE, Buffer.from(key));
      
      return key;
    }
  } catch (error) {
    console.error('Error managing encryption key:', error);
    throw new Error('Failed to get encryption key');
  }
};

/**
 * WARNING: This is a simplistic implementation for demonstration.
 * In a production environment, you should use a secure key management
 * service like AWS KMS, Azure Key Vault, or HashiCorp Vault.
 * 
 * For production:
 * 1. Never store encryption keys in the same location as encrypted data
 * 2. Consider using a Hardware Security Module (HSM)
 * 3. Implement key rotation policies
 * 4. Use secure key derivation from user credentials
 */
