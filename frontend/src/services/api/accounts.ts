/**
 * Account API service
 * Handles all account-related API requests
 */
import apiClient from './config';
import { AccountSummary, AccountType } from '../../types';

// Define the backend account type that needs transformation
interface BackendAccount {
  _id: string;
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
  
  console.log(`Transforming account ${account._id}:`, account);
  
  const result = {
    id: account._id,
    name: account.name,
    type: mapTypeToAccountType(account.type),
    balance: account.balance,
    currency: account.currency
  };
  
  console.log('Transformed to:', result);
  return result;
};

/**
 * Get all accounts for the current user
 */
export const getAccounts = async (): Promise<AccountSummary[]> => {
  try {
    // Make sure we use the same user ID consistently across the application
    const response = await apiClient.get('/accounts', {
      params: { userId: 'user123' }
    });
    
    // Log for debugging
    console.log('Fetched accounts:', response.data);
    
    // Transform each account to match frontend model
    return response.data.map(transformAccount);
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
