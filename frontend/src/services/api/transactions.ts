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
 * Get all transactions/expenses for the current user
 */
export const getTransactions = async (): Promise<Expense[]> => {
  try {
    const response = await apiClient.get('/expenses');
    return response.data.map(transformTransaction);
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
    const response = await apiClient.get('/expenses', {
      params: { accountId }
    });
    return response.data.map(transformTransaction);
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
    return response.data.map(transformTransaction);
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
  } catch (error) {
    console.error('Error creating transaction:', error);
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
