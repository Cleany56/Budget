import { MongoClient } from 'mongodb';
import crypto from 'crypto';

// Configuration for MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'expenseTracker';

// Field encryption configuration
const ENCRYPTION_KEY_NAME = 'expenseTrackerKey';
let encryptionClient: MongoClient | null = null;

/**
 * Get MongoDB client with Client-Side Field Level Encryption (CSFLE)
 * @returns {Promise<MongoClient>} - MongoDB client with encryption
 */
export const getMongoClient = async (): Promise<MongoClient> => {
  if (encryptionClient && (encryptionClient as any).isConnected?.()) {
    return encryptionClient;
  }

  try {
    // Generate a local key for development (in production, use a key management service)
    const localMasterKey = crypto.randomBytes(96);

    // Create key vault for storing encryption keys
    const keyVaultNamespace = `${MONGODB_DB_NAME}.encryption.__keyVault`;

    // Configure client-side field level encryption
    const kmsProviders = {
      local: {
        key: localMasterKey
      }
    };

    // Create schema for encrypted fields
    // These fields will be automatically encrypted/decrypted
    const encryptedFields = {
      [`${MONGODB_DB_NAME}.accounts`]: {
        fields: [
          {
            keyId: ENCRYPTION_KEY_NAME,
            path: 'balance',
            bsonType: 'double',
            queries: { queryType: 'equality' }
          }
        ]
      },
      [`${MONGODB_DB_NAME}.transactions`]: {
        fields: [
          {
            keyId: ENCRYPTION_KEY_NAME,
            path: 'amount',
            bsonType: 'double',
            queries: { queryType: 'equality' }
          }
        ]
      }
    };

    // Configure MongoDB connection with encryption
    encryptionClient = new MongoClient(MONGODB_URI, {
      monitorCommands: true,
      autoEncryption: {
        keyVaultNamespace,
        kmsProviders,
        schemaMap: encryptedFields
      },
      // Always use TLS for secure transmission
      ssl: true,
      // Validate the server's certificate (prevents MITM attacks)
      tlsAllowInvalidCertificates: false
    });

    // Connect to MongoDB
    await encryptionClient.connect();
    
    return encryptionClient;
  } catch (error) {
    console.error('Error connecting to MongoDB with encryption:', error);
    throw error;
  }
};

/**
 * Get a database instance with encryption configured
 */
export const getDatabase = async () => {
  const client = await getMongoClient();
  return client.db(MONGODB_DB_NAME);
};

/**
 * Close the MongoDB connection
 */
export const closeMongoClient = async (): Promise<void> => {
  if (encryptionClient) {
    await encryptionClient.close();
    encryptionClient = null;
    console.log('MongoDB connection closed');
  }
};
