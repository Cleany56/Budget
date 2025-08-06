import { v4 as uuidv4 } from 'uuid';
import { getRealm } from '../config/realm';

// Define types locally to avoid import issues
export type AccountType = 'Bank' | 'Investment' | 'Credit Card' | 'Checking' | 'Savings';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isDeleted: boolean;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  userId?: string;
}

export interface UpdateAccountDto {
  name?: string;
  balance?: number;
  type?: AccountType;
  currency?: string;
}

/**
 * Account Repository - handles all data operations for accounts
 */
export class AccountRepository {
  /**
   * Fix accounts with missing IDs
   * @param userId The user ID for which to fix accounts
   * @returns Number of accounts fixed
   */
  async fixAccountsWithMissingIds(userId: string): Promise<number> {
    try {
      const realm = await getRealm();
      let fixedCount = 0;
      
      // Identify accounts without IDs
      const accountsWithoutIds = realm.objects('Account')
        .filtered('(isDeleted == false) AND (userId == $0) AND (_id == null OR _id == "")', userId);
      
      console.log(`Found ${accountsWithoutIds.length} accounts without IDs for user ${userId}`);
      
      if (accountsWithoutIds.length > 0) {
        realm.write(() => {
          // Fix each account by assigning a new UUID
          accountsWithoutIds.forEach((account: any) => {
            const newId = uuidv4();
            account._id = newId;
            fixedCount++;
            console.log(`Fixed account: "${account.name}" (type: ${account.type}), new ID: ${newId}`);
          });
        });
      }
      
      return fixedCount;
    } catch (error) {
      console.error('Error fixing accounts with missing IDs:', error);
      throw error;
    }
  }

  /**
   * Get all accounts for a specific user
   * @param userId The user ID - required to ensure data isolation
   */
  async getAllAccounts(userId: string): Promise<Account[]> {
    try {
      // Import the force fix utilities
      const { forceFixAccountIds, forceRealmToPlain } = require('../utils/databaseFix');
      
      // Force fix any accounts with missing IDs first
      const fixResult = await forceFixAccountIds(userId);
      if (fixResult.fixedCount > 0) {
        console.log(`Force-fixed ${fixResult.fixedCount} accounts with missing IDs for user ${userId}`);
      }
      
      const realm = await getRealm();
      
      // Now query non-deleted accounts for this specific user
      const accounts = realm.objects('Account')
        .filtered('isDeleted == false AND userId == $0', userId);
      
      console.log(`Found ${accounts.length} accounts for user ${userId}`);
      
      // Convert using the special force conversion function
      const plainAccounts = forceRealmToPlain(Array.from(accounts));
      
      // Log all account IDs to verify
      plainAccounts.forEach((acc: any) => {
        console.log(`VERIFIED ACCOUNT: ID=${acc._id}, Name=${acc.name}, Type=${acc.type}`);
      });
      
      return plainAccounts.map((acc: any) => ({
        _id: acc._id, 
        name: acc.name,
        type: acc.type,
        balance: acc.balance,
        currency: acc.currency,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
        userId: acc.userId,
        isDeleted: acc.isDeleted
      } as Account));
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }
  
  /**
   * Get account by ID for a specific user
   * @param id The account ID
   * @param userId The user ID - required to ensure data isolation
   */
  async getAccountById(id: string, userId: string): Promise<Account | null> {
    try {
      // Import the force fix utilities
      const { forceFixAccountIds, forceRealmToPlain } = require('../utils/databaseFix');
      
      // First, force fix any accounts with missing IDs
      await forceFixAccountIds(userId);
      
      const realm = await getRealm();
      
      // Find the account with the specified ID that belongs to this user
      const accounts = realm.objects('Account')
        .filtered('_id == $0 AND userId == $1 AND isDeleted == false', id, userId);
      
      if (accounts.length === 0) {
        console.log(`Account with ID ${id} not found, trying alternative lookup methods`);
        
        // Try to find by name as a fallback
        const accountsByName = realm.objects('Account')
          .filtered('userId == $0 AND isDeleted == false', userId);
        
        // List all available accounts for debugging
        console.log(`Available accounts for user ${userId}:`);
        Array.from(accountsByName).forEach((acc: any, index: number) => {
          console.log(`Account ${index + 1}: ID=${acc._id || 'undefined'}, Name=${acc.name}`);
        });
        
        return null;
      }
      
      // Use force conversion to ensure ID is preserved
      const plainAccounts = forceRealmToPlain([accounts[0]]);
      
      if (plainAccounts.length === 0) {
        console.error(`Failed to convert account with ID ${id}`);
        return null;
      }
      
      const account = plainAccounts[0];
      
      console.log(`Retrieved account by ID ${id}: Name=${account.name}, ID=${account._id}`);
      
      return { 
        _id: account._id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        userId: account.userId,
        isDeleted: account.isDeleted
      } as Account;
    } catch (error) {
      console.error(`Error getting account with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new account for a specific user
   * @param accountData The account data
   * @param userId The user ID - required to ensure data isolation
   */
  async createAccount(accountData: CreateAccountDto, userId: string): Promise<Account> {
    try {
      const realm = await getRealm();
      let newAccount: Account | null = null;
      
      // Import the normalization utility
      const { normalizeAccountType } = require('../utils/normalization');
      
      // Normalize the account type for consistency
      const normalizedAccountData = {
        ...accountData,
        type: normalizeAccountType(accountData.type)
      };
      
      // Ensure the account is associated with the user
      const accountWithUser = {
        ...normalizedAccountData,
        userId: userId  // Always set the userId
      };
      
      // Generate ID outside of realm.write to ensure it's set
      const newId = uuidv4();
      console.log(`Creating account "${accountWithUser.name}" with ID: ${newId}, type: "${accountWithUser.type}" (normalized from "${accountData.type}")`);
      
      realm.write(() => {
        newAccount = realm.create('Account', {
          _id: newId,
          ...accountWithUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false
        });
        
        // Double check that ID was set
        if (!newAccount._id) {
          console.error(`WARNING: ID not set for new account "${accountWithUser.name}", forcing ID`);
          newAccount._id = newId;
        }
      });
      
      if (!newAccount) {
        throw new Error('Failed to create account');
      }
      
      // Convert to plain object to detach from Realm
      return { ...(newAccount as any) } as Account;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing account for a specific user
   * @param id The account ID
   * @param updateData The data to update
   * @param userId The user ID - required to ensure data isolation
   */
  async updateAccount(id: string, updateData: UpdateAccountDto, userId: string): Promise<Account | null> {
    try {
      const realm = await getRealm();
      
      // Find the account with the specified ID that belongs to this user
      const accounts = realm.objects('Account')
        .filtered('_id == $0 AND userId == $1 AND isDeleted == false', id, userId);
      
      if (accounts.length === 0) {
        return null;
      }
      
      const account = accounts[0];
      let updatedAccount: any = null;
      
      realm.write(() => {
        Object.keys(updateData).forEach(key => {
          (account as any)[key] = (updateData as any)[key];
        });
        (account as any).updatedAt = new Date();
        updatedAccount = account;
      });
      
      // Convert to plain object to detach from Realm
      return updatedAccount ? { ...(updatedAccount as any) } as Account : null;
    } catch (error) {
      console.error(`Error updating account with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Soft delete an account for a specific user
   * @param id The account ID
   * @param userId The user ID - required to ensure data isolation
   */
  async deleteAccount(id: string, userId: string): Promise<boolean> {
    try {
      const realm = await getRealm();
      
      // Find the account with the specified ID that belongs to this user
      const accounts = realm.objects('Account')
        .filtered('_id == $0 AND userId == $1 AND isDeleted == false', id, userId);
      
      if (accounts.length === 0) {
        return false;
      }
      
      const account = accounts[0];
      
      realm.write(() => {
        (account as any).isDeleted = true;
        (account as any).updatedAt = new Date();
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting account with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get accounts grouped by type for a specific user
   * @param userId The user ID - required to ensure data isolation
   */
  async getAccountsByType(userId: string): Promise<Record<string, Account[]>> {
    try {
      const accounts = await this.getAllAccounts(userId);
      
      // Group accounts by type
      return accounts.reduce((grouped, account) => {
        const type = account.type;
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(account);
        return grouped;
      }, {} as Record<string, Account[]>);
    } catch (error) {
      console.error('Error getting accounts by type:', error);
      throw error;
    }
  }
  
  /**
   * Get total balance across all accounts for a specific user
   * @param userId The user ID - required to ensure data isolation
   */
  async getTotalBalance(userId: string): Promise<number> {
    try {
      const accounts = await this.getAllAccounts(userId);
      return accounts.reduce((total, account) => total + account.balance, 0);
    } catch (error) {
      console.error('Error calculating total balance:', error);
      throw error;
    }
  }
}
