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
   * Get all accounts for a specific user
   * @param userId The user ID - required to ensure data isolation
   */
  async getAllAccounts(userId: string): Promise<Account[]> {
    try {
      const realm = await getRealm();
      
      // Query non-deleted accounts for this specific user only
      const accounts = realm.objects('Account')
        .filtered('isDeleted == false AND userId == $0', userId);
      
      // Convert to plain objects to detach from Realm
      return Array.from(accounts).map(acc => ({ ...acc } as unknown as Account));
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
      const realm = await getRealm();
      
      // Find the account with the specified ID that belongs to this user
      const accounts = realm.objects('Account')
        .filtered('_id == $0 AND userId == $1 AND isDeleted == false', id, userId);
      
      if (accounts.length === 0) {
        return null;
      }
      
      const account = accounts[0];
      
      // Convert to plain object to detach from Realm
      return { ...(account as any) } as Account;
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
      
      // Ensure the account is associated with the user
      const accountWithUser = {
        ...accountData,
        userId: userId  // Always set the userId
      };
      
      realm.write(() => {
        newAccount = realm.create('Account', {
          _id: uuidv4(),
          ...accountWithUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false
        });
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
