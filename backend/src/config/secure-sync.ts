import Realm from 'realm';
import { getEncryptionKey } from '../utils/encryption';

// For MongoDB Atlas App Services (formerly Realm)
import { App, Credentials, User } from 'realm-web';

// Sync configuration
const APP_ID = process.env.REALM_APP_ID || 'expensetracker-xxxxx'; // Replace with your Realm App ID

/**
 * Configure Realm App with MongoDB Atlas
 * @returns {App} - Configured Realm App instance
 */
export const getRealmApp = (): App => {
  return new App({ id: APP_ID });
};

/**
 * Authenticate user with Realm
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<User>} - Authenticated user
 */
export const authenticateUser = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    const app = getRealmApp();
    const credentials = Credentials.emailPassword(email, password);
    return await app.logIn(credentials);
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

/**
 * Setup secure synchronization between local Realm and MongoDB Atlas
 * @param {string} userId - User ID for data isolation
 * @returns {Promise<Realm>} - Configured Realm instance for secure sync
 */
export const setupSecureSync = async (userId: string): Promise<Realm> => {
  try {
    // Get the current Realm schemas from realm.ts
    const { AccountSchema, TransactionSchema, BudgetSchema, GoalSchema } = 
      await import('./realm');
    
    // Get encryption key for local database
    const encryptionKey = getEncryptionKey();
    
    // Get Realm app and authenticate
    const app = getRealmApp();
    let user = app.currentUser;
    
    if (!user) {
      // In production, replace this with proper authentication
      user = await app.logIn(Credentials.anonymous());
    }
    
    // Configure a secure sync configuration
    // We need to create a compatible configuration for Realm
    const config: any = {
      schema: [AccountSchema, TransactionSchema, BudgetSchema, GoalSchema],
      sync: {
        user,
        partitionValue: `user=${userId}`, // Isolate data by user
        ssl: true,
        validateSSL: true,
      },
      // Apply encryption to the local database
      encryptionKey,
    };
    
    // Open a synced Realm
    // Using 'any' here because of type incompatibility between Realm SDK versions
    return await Realm.open(config);
  } catch (error) {
    console.error('Secure sync setup error:', error);
    throw error;
  }
};
