/**
 * Transaction API service
 * Handles all transaction-related API requests
 */
import apiClient from './config';
import { Expense, ExpenseCategory } from '../../types';

// Define backend transaction format
interface BackendTransaction {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
  accountId?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isDeleted: boolean;
}

/**
 * Transform backend transaction to frontend expense format
 */
const transformTransaction = (transaction: BackendTransaction): Expense => {
  return {
    id: transaction._id,
    title: transaction.title,
    amount: transaction.amount,
    date: new Date(transaction.date),
    category: transaction.category as ExpenseCategory,
    notes: transaction.notes,
    accountId: transaction.accountId,
  };
};

/**
 * Filter parameters for transaction queries
 */
export interface TransactionQueryParams {
  search?: string;
  type?: 'all' | 'expense' | 'income' | 'transfer';
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  accounts?: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Get all transactions/expenses for the current user with optional filters
 */
export const getTransactions = async (params: TransactionQueryParams = {}): Promise<Expense[]> => {
  try {
    // Build query parameters
    const queryParams: Record<string, string> = {};
    
    if (params.search) queryParams.search = params.search;
    if (params.type && params.type !== 'all') queryParams.type = params.type;
    if (params.dateRange) queryParams.dateRange = params.dateRange;
    if (params.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params.endDate) queryParams.endDate = params.endDate.toISOString();
    if (params.categories && params.categories.length > 0) queryParams.categories = params.categories.join(',');
    if (params.accounts && params.accounts.length > 0) queryParams.accounts = params.accounts.join(',');
    
    // Add sorting parameters
    if (params.sortField) {
      queryParams.sortField = params.sortField;
      if (params.sortDirection) queryParams.sortDirection = params.sortDirection;
    }
    
    // Add pagination parameters
    if (params.page) queryParams.page = params.page.toString();
    if (params.limit) queryParams.limit = params.limit.toString();
    
    const response = await apiClient.get('/expenses', { params: queryParams });
    
    // Log the response structure to debug
    console.log('Transactions response structure:', {
      hasData: !!response.data?.data,
      isPaginated: !!response.data?.pagination,
      dataType: response.data?.data ? typeof response.data.data : 'N/A',
      isArray: response.data?.data ? Array.isArray(response.data.data) : false
    });
    
    // Handle paginated response (data property contains the actual transactions)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map(transformTransaction);
    }
    
    // Handle direct array response (fallback for older API)
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(transformTransaction);
    }
    
    // If the response structure is unexpected, log and return empty array
    console.error('Unexpected response structure from /expenses endpoint:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Get transactions for a specific account
 */
export const getAccountTransactions = async (accountId: string): Promise<Expense[]> => {
  try {
    // Use the specific 'by-account' endpoint for better handling
    const response = await apiClient.get(`/expenses/by-account/${accountId}`);
    
    console.log('Account transactions response:', {
      hasData: !!response.data?.data,
      hasAccount: !!response.data?.account,
      isPaginated: !!response.data?.pagination,
      dataLength: response.data?.data?.length
    });
    
    // Handle paginated response (data property contains the actual transactions)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map(transformTransaction);
    }
    
    // Handle direct array response (fallback for older API)
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(transformTransaction);
    }
    
    // Handle case where data might be empty but valid
    if (response.data && response.data.data === null) {
      console.log(`No transactions found for account ${accountId}`);
      return [];
    }
    
    // If the response structure is unexpected, log and return empty array
    console.error('Unexpected response structure from /expenses/by-account endpoint:', response.data);
    return [];
  } catch (error) {
    console.error(`Error fetching transactions for account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Get transactions by category
 */
export const getTransactionsByCategory = async (category: ExpenseCategory): Promise<Expense[]> => {
  try {
    const response = await apiClient.get('/expenses', {
      params: { category }
    });
    
    // Handle paginated response (data property contains the actual transactions)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map(transformTransaction);
    }
    
    // Handle direct array response (fallback for older API)
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(transformTransaction);
    }
    
    // If the response structure is unexpected, log and return empty array
    console.error('Unexpected response structure from /expenses endpoint:', response.data);
    return [];
  } catch (error) {
    console.error(`Error fetching transactions for category ${category}:`, error);
    throw error;
  }
};

/**
 * Create a new transaction/expense
 */
export const createTransaction = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  try {
    // Check if the account ID is a generated fallback ID (these won't work with the backend)
    if (expense.accountId && expense.accountId.startsWith('gen_')) {
      throw new Error('Cannot create transaction with a generated account ID. Please refresh accounts list or select a valid account.');
    }
    
    // Log the transaction being sent
    console.log('Creating transaction with data:', {
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      accountId: expense.accountId
    });
    
    // Transform to backend format
    const backendTransaction = {
      title: expense.title,
      amount: expense.amount,
      date: expense.date.toISOString(),
      category: expense.category,
      notes: expense.notes,
      accountId: expense.accountId,
      userId: 'user123', // In production, get from auth
    };
    
    const response = await apiClient.post('/expenses', backendTransaction);
    return transformTransaction(response.data);
  } catch (error: any) {
    // Provide more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error creating transaction - server response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error creating transaction - no response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error creating transaction - request setup error:', error.message);
    }
    throw error;
  }
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
  try {
    // Handle date conversion if present
    const backendUpdates = {
      ...updates,
      date: updates.date ? updates.date.toISOString() : undefined,
      userId: 'user123', // In production, get from auth
    };
    
    const response = await apiClient.put(`/expenses/${id}`, backendUpdates);
    return transformTransaction(response.data);
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/expenses/${id}`);
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Get total spending for the current month (or specified date range)
 */
export const getMonthlySpending = async (
  params: TransactionQueryParams = {}
): Promise<{ 
  totalSpending: number, 
  transactionCount: number, 
  period: { 
    startDate: string, 
    endDate: string, 
    isCurrentMonth: boolean 
  } 
}> => {
  try {
    // Build query parameters
    const queryParams: Record<string, string> = {};
    
    if (params.startDate) queryParams.startDate = params.startDate.toISOString();
    if (params.endDate) queryParams.endDate = params.endDate.toISOString();
    if (params.search) queryParams.search = params.search;
    if (params.type && params.type !== 'all') queryParams.type = params.type;
    if (params.dateRange) queryParams.dateRange = params.dateRange;
    if (params.categories && params.categories.length > 0) queryParams.categories = params.categories.join(',');
    if (params.accounts && params.accounts.length > 0) queryParams.accounts = params.accounts.join(',');
    
    console.log('Fetching monthly spending with params:', queryParams);
    const response = await apiClient.get('/expenses/monthly-spending', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly spending:', error);
    throw error;
  }
};
