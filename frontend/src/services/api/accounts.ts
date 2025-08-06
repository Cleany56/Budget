/**
 * Account API service
 * Handles all account-related API requests
 */
import apiClient from './config';
import { AccountSummary, AccountType } from '../../types';

// Define the backend account type that needs transformation
interface BackendAccount {
  _id?: string;    // May come from MongoDB/Realm directly
  id?: string;     // May come from API transformation
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isDeleted: boolean;
}

/**
 * Transform backend account format to frontend format
 * With improved ID field handling
 */
const transformAccount = (account: BackendAccount): AccountSummary => {
  // Map backend account types to frontend AccountType enum
  const mapTypeToAccountType = (backendType: string): AccountType => {
    const typeMap: Record<string, AccountType> = {
      'checking': 'Checking',
      'savings': 'Savings',
      'credit card': 'Credit Card',
      'investment': 'Investment',
    };
    
    return typeMap[backendType.toLowerCase()] || 'Bank';
  };
  
  // Debug the account object coming from the backend
  console.log('===== ACCOUNT OBJECT FROM BACKEND =====');
  console.log(`Account ID: _id="${account._id}", id="${account.id}"`);
  console.log(`Account name: "${account.name}"`);
  console.log(`Account type: "${account.type}"`);
  console.log(`Account balance: ${account.balance}`);
  console.log('Raw account object:', JSON.stringify(account, null, 2));
  
  // Extract the ID with fallbacks
  let accountId: string | undefined;
  
  // First try _id (MongoDB style)
  if (account._id) {
    console.log(`Using _id field: ${account._id}`);
    accountId = account._id;
  } 
  // Then try id (REST API style)
  else if (account.id) {
    console.log(`Using id field: ${account.id}`);
    accountId = account.id;
  }
  // If both are missing, generate emergency ID
  else {
    console.error(`ERROR: Account "${account.name}" missing both id and _id fields! Generating emergency ID...`);
    accountId = `emergency-${Math.random().toString(36).substring(2, 15)}`;
    console.warn(`Generated emergency ID: ${accountId} for account "${account.name}"`);
  }
  
  // Convert the ID to a string to ensure consistency
  const id = String(accountId);
  
  const result = {
    id: id,
    name: account.name,
    type: mapTypeToAccountType(account.type),
    balance: account.balance,
    currency: account.currency
  };
  
  console.log('Transformed account:', result);
  return result;
};

/**
 * Fix accounts with missing IDs
 * This is a maintenance function to help recover from data integrity issues
 */
export const fixAccountsWithMissingIds = async (): Promise<number> => {
  try {
    console.log('Calling fix-accounts endpoint...');
    
    // Using the dedicated endpoint instead of the accounts route
    const response = await apiClient.get('/fix-accounts', {
      params: { userId: 'user123' }
    });
    
    console.log('Account fix response:', response.data);
    
    // Show more details in case of issues
    if (response.data.success === false) {
      console.error('Fix accounts failed:', response.data.message);
      throw new Error(response.data.message);
    }
    
    return response.data.fixedCount || 0;
  } catch (error) {
    console.error('Error fixing accounts:', error);
    throw error;
  }
};

/**
 * Get all accounts for the current user
 * @param attemptFix If true, will automatically try to fix accounts if missing IDs are detected
 */
export const getAccounts = async (attemptFix: boolean = false): Promise<AccountSummary[]> => {
  try {
    // Make sure we use the same user ID consistently across the application
    const response = await apiClient.get('/accounts', {
      params: { userId: 'user123' }
    });
    
    // Log for debugging
    console.log('Fetched accounts:', response.data);
    
    // Only attempt to fix accounts if explicitly requested and accounts have issues
    if (attemptFix) {
      const accountsWithoutIds = response.data.filter((account: any) => !account._id && !account.id);
      if (accountsWithoutIds.length > 0) {
        console.log(`Found ${accountsWithoutIds.length} accounts without IDs, attempting fix...`);
        try {
          const fixedCount = await fixAccountsWithMissingIds();
          console.log(`Fixed ${fixedCount} accounts`);
          
          if (fixedCount > 0) {
            // Re-fetch accounts after fixing
            console.log('Re-fetching accounts after fix...');
            const newResponse = await apiClient.get('/accounts', {
              params: { userId: 'user123' }
            });
            
            // Use the new response data
            response.data = newResponse.data;
            console.log('Re-fetched accounts:', response.data);
          }
        } catch (fixError) {
          console.error('Fix attempt failed:', fixError);
          // Continue with original accounts data
        }
      }
    }
    
    // After fixing, handle any accounts that might still have issues
    const accountsWithoutIds = response.data.filter((account: any) => !account._id);
    console.log(`Found ${accountsWithoutIds.length} accounts without IDs after fix attempt`);
    
    // Transform each account with our enhanced transform function that includes emergency fallback
    let transformedAccounts;
    try {
      transformedAccounts = response.data.map(transformAccount);
      console.log(`Successfully transformed ${transformedAccounts.length} accounts`);
    } catch (transformError) {
      console.error('Error transforming accounts:', transformError);
      
      // Last resort recovery: create minimal accounts
      console.warn('FALLBACK: Creating minimal accounts from raw data');
      transformedAccounts = response.data.map((account: any) => {
        const id = account._id || `recovery-${Math.random().toString(36).substring(2, 15)}`;
        return {
          id: String(id),
          name: account.name || 'Unnamed Account',
          type: account.type || 'Bank',
          balance: account.balance || 0,
          currency: account.currency || 'USD'
        } as AccountSummary;
      });
    }
    
    return transformedAccounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

/**
 * Get a specific account by ID
 */
export const getAccount = async (id: string): Promise<AccountSummary> => {
  try {
    const response = await apiClient.get(`/accounts/${id}`);
    return transformAccount(response.data);
  } catch (error) {
    console.error(`Error fetching account ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new account
 */
export const createAccount = async (account: Omit<AccountSummary, 'id'>): Promise<AccountSummary> => {
  try {
    // Transform to backend format
    const backendAccount = {
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      userId: 'user123', // In production, get from auth
    };
    
    const response = await apiClient.post('/accounts', backendAccount);
    
    // Log the response for debugging
    console.log('Account created successfully:', response.data);
    
    return transformAccount(response.data);
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

/**
 * Update an existing account
 */
export const updateAccount = async (id: string, updates: Partial<AccountSummary>): Promise<AccountSummary> => {
  try {
    const response = await apiClient.put(`/accounts/${id}`, {
      ...updates,
      userId: 'user123', // In production, get from auth
    });
    return transformAccount(response.data);
  } catch (error) {
    console.error(`Error updating account ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an account
 */
export const deleteAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/accounts/${id}`);
  } catch (error) {
    console.error(`Error deleting account ${id}:`, error);
    throw error;
  }
};
