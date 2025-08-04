import Realm from 'realm';
import { App, Credentials, User } from 'realm-web';
import { getEncryptionKey } from '../utils/encryption';
import { getRealm, closeRealm } from './realm';
import { getDatabase, closeMongoClient } from './mongodb';

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
 * Setup sync between local Realm and MongoDB Atlas
 * @param {string} userId - User ID for data isolation
 * @returns {Promise<Realm>} - Synced Realm instance
 */
export const setupSync = async (userId: string): Promise<Realm> => {
  try {
    // Get encryption key
    const encryptionKey = getEncryptionKey();
    
    // Get Realm app and authenticate anonymously for demo
    // In production, use proper authentication
    const app = getRealmApp();
    let user = app.currentUser;
    
    if (!user) {
      // For development only - use anonymous auth
      // In production, use proper auth mechanisms
      user = await app.logIn(Credentials.anonymous());
    }
    
    // Import schemas directly to avoid Promise resolution issues
    const { AccountSchema, TransactionSchema, BudgetSchema, GoalSchema } = 
      await import('./realm');
    
    // Configure sync with MongoDB Atlas
    const config: any = {
      schema: [AccountSchema, TransactionSchema, BudgetSchema, GoalSchema],
      sync: {
        user: user,
        partitionValue: `user=${userId}`, // Isolate data by user
        // Secure sync configuration
        ssl: true,
        validateSSL: true,
      },
      // Apply encryption to the local Realm database
      encryptionKey: encryptionKey,
    };
    
    // Open a synced Realm
    // Using 'any' type to bypass TypeScript's strict checking
    return await Realm.open(config);
  } catch (error) {
    console.error('Sync setup error:', error);
    throw error;
  }
};

/**
 * Manual sync from Realm to MongoDB for specific collections
 * For situations where automatic sync is not used
 * @param {string} userId - User ID to sync data for
 */
export const manualSync = async (userId: string): Promise<void> => {
  try {
    const realm = await getRealm();
    const db = await getDatabase();
    
    // Sync accounts
    const accounts = realm.objects('Account').filtered('userId == $0', userId);
    const accountsCollection = db.collection('accounts');
    
    for (const account of accounts) {
      // Type-safe conversion of Realm object to plain object
      const plainAccount = JSON.parse(JSON.stringify(account));
      await accountsCollection.updateOne(
        { _id: plainAccount._id },
        { $set: plainAccount },
        { upsert: true }
      );
    }
    
    // Sync transactions
    const transactions = realm.objects('Transaction').filtered('userId == $0', userId);
    const transactionsCollection = db.collection('transactions');
    
    for (const transaction of transactions) {
      // Type-safe conversion of Realm object to plain object
      const plainTransaction = JSON.parse(JSON.stringify(transaction));
      await transactionsCollection.updateOne(
        { _id: plainTransaction._id },
        { $set: plainTransaction },
        { upsert: true }
      );
    }
    
    console.log(`Data synced to MongoDB for user ${userId}`);
  } catch (error) {
    console.error('Manual sync error:', error);
    throw error;
  } finally {
    // Clean up resources
    closeRealm();
    await closeMongoClient();
  }
};
