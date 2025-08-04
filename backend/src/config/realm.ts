import Realm from 'realm';
import path from 'path';
import fs from 'fs';
import { getEncryptionKey } from '../utils/encryption';

// Define schema versions and migration functions
const SCHEMA_VERSION = 1;

// Ensure the realm directory exists
const REALM_PATH = path.join(__dirname, '../../data/realm');
if (!fs.existsSync(REALM_PATH)) {
  fs.mkdirSync(REALM_PATH, { recursive: true });
}

// Define schemas

// Account Schema
export const AccountSchema = {
  name: 'Account',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    type: 'string',
    balance: 'double',
    currency: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    userId: 'string?', // For future multi-user support
    isDeleted: { type: 'bool', default: false }
  }
};

// Transaction Schema
export const TransactionSchema = {
  name: 'Transaction',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    title: 'string',
    amount: 'double',
    date: 'date',
    category: 'string',
    notes: 'string?',
    accountId: 'string?', // Reference to account
    createdAt: 'date',
    updatedAt: 'date',
    userId: 'string?', // For future multi-user support
    isDeleted: { type: 'bool', default: false }
  }
};

// Budget Schema
export const BudgetSchema = {
  name: 'Budget',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    category: 'string',
    amount: 'double',
    spent: 'double',
    month: 'string?',
    isRecurring: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
    userId: 'string?', // For future multi-user support
    isDeleted: { type: 'bool', default: false }
  }
};

// Goal Schema
export const GoalSchema = {
  name: 'Goal',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    targetAmount: 'double',
    currentAmount: 'double',
    targetDate: 'string',
    priority: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    userId: 'string?', // For future multi-user support
    isDeleted: { type: 'bool', default: false }
  }
};

// Realm instance
let realm: Realm | null = null;

/**
 * Get or initialize a Realm instance
 */
export const getRealm = async (): Promise<Realm> => {
  if (realm && !realm.isClosed) {
    return realm;
  }

  try {
    // Get encryption key for realm
    const encryptionKey = getEncryptionKey();
    
    // Open a realm with all schemas and encryption
    const config = {
      path: path.join(REALM_PATH, 'expenseTracker.realm'),
      schema: [AccountSchema, TransactionSchema, BudgetSchema, GoalSchema],
      schemaVersion: SCHEMA_VERSION,
      encryptionKey: encryptionKey,
    };
    
    // @ts-ignore - Work around Realm typings
    realm = await Realm.open(config);
    
    if (!realm) {
      throw new Error('Failed to open Realm database');
    }
    
    return realm as Realm;
  } catch (error) {
    console.error('Error opening Realm:', error);
    throw error;
  }
};

/**
 * Close the Realm instance
 */
export const closeRealm = (): void => {
  if (realm && !realm.isClosed) {
    realm.close();
    realm = null;
    console.log('Realm connection closed');
  }
};
