/**
 * Budget API service
 * Handles all budget-related API requests
 */
import apiClient from './config';
import { Budget, ExpenseCategory } from '../../types';

// Define backend budget format
interface BackendBudget {
  _id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  month?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isDeleted: boolean;
}

/**
 * Transform backend budget to frontend budget format
 */
const transformBudget = (budget: BackendBudget): Budget => {
  return {
    id: budget._id,
    name: budget.name,
    category: budget.category as ExpenseCategory,
    amount: budget.amount,
    spent: budget.spent,
    month: budget.month,
    isRecurring: budget.isRecurring,
  };
};

/**
 * Get all budgets for the current user
 */
export const getBudgets = async (): Promise<Budget[]> => {
  try {
    const response = await apiClient.get('/budgets');
    return response.data.map(transformBudget);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
};

/**
 * Get a limited number of budgets (latest ones)
 */
export const getLatestBudgets = async (limit: number = 3): Promise<Budget[]> => {
  try {
    const response = await apiClient.get('/budgets', {
      params: { limit }
    });
    return response.data.map(transformBudget);
  } catch (error) {
    console.error('Error fetching latest budgets:', error);
    throw error;
  }
};

/**
 * Get a specific budget by ID
 */
export const getBudget = async (budgetId: string): Promise<Budget> => {
  try {
    const response = await apiClient.get(`/budgets/${budgetId}`);
    return transformBudget(response.data);
  } catch (error) {
    console.error(`Error fetching budget ${budgetId}:`, error);
    throw error;
  }
};

/**
 * Create a new budget
 */
export const createBudget = async (budget: Omit<Budget, 'id'> & { userId?: string }): Promise<Budget> => {
  try {
    // Prepare the data for the backend
    // We make sure to include the userId and clean up any potential issues
    const { id, ...restBudget } = budget as any; // Remove any id if it exists
    
    const budgetData = {
      ...restBudget,
      // Ensure userId is a string
      userId: budget.userId || 'user123',
      // Ensure category is passed as a string
      category: budget.category.toString()
    };
    
    // Make sure we don't send _id field - let the backend create it
    if (budgetData._id) {
      delete budgetData._id;
    }
    
    const response = await apiClient.post('/budgets', budgetData);
    return transformBudget(response.data);
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
};

/**
 * Update an existing budget
 */
export const updateBudget = async (budgetId: string, updates: Partial<Budget>): Promise<Budget> => {
  try {
    const response = await apiClient.put(`/budgets/${budgetId}`, updates);
    return transformBudget(response.data);
  } catch (error) {
    console.error(`Error updating budget ${budgetId}:`, error);
    throw error;
  }
};

/**
 * Delete a budget
 */
export const deleteBudget = async (budgetId: string): Promise<void> => {
  try {
    await apiClient.delete(`/budgets/${budgetId}`);
  } catch (error) {
    console.error(`Error deleting budget ${budgetId}:`, error);
    throw error;
  }
};
