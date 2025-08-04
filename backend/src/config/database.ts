import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connection URI from environment variables or default to local
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';

// Database Name
const dbName = process.env.DB_NAME || 'expense_tracker';

// MongoDB Client
const client = new MongoClient(uri);

// Database reference
let db: Db;

/**
 * Connect to MongoDB
 */
export const connectToDatabase = async (): Promise<Db> => {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Get database reference
    db = client.db(dbName);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Get database instance
 */
export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase first.');
  }
  return db;
};

/**
 * Close database connection
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  await client.close();
  console.log('MongoDB connection closed');
};
