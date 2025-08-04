/**
 * Goal API service
 * Handles all goal-related API requests
 */
import apiClient from './config';
import { Goal } from '../../types';

// Define backend goal format
interface BackendGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isDeleted: boolean;
}

/**
 * Transform backend goal to frontend goal format
 */
const transformGoal = (goal: BackendGoal): Goal => {
  return {
    id: goal._id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: goal.targetDate,
    priority: goal.priority,
  };
};

/**
 * Get all goals for the current user
 */
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const response = await apiClient.get('/goals');
    return response.data.map(transformGoal);
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

/**
 * Get a limited number of goals (latest ones)
 */
export const getLatestGoals = async (limit: number = 2): Promise<Goal[]> => {
  try {
    const response = await apiClient.get('/goals', {
      params: { limit }
    });
    return response.data.map(transformGoal);
  } catch (error) {
    console.error('Error fetching latest goals:', error);
    throw error;
  }
};

/**
 * Get a specific goal by ID
 */
export const getGoal = async (goalId: string): Promise<Goal> => {
  try {
    const response = await apiClient.get(`/goals/${goalId}`);
    return transformGoal(response.data);
  } catch (error) {
    console.error(`Error fetching goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Create a new goal
 */
export const createGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  try {
    const response = await apiClient.post('/goals', goal);
    return transformGoal(response.data);
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

/**
 * Update an existing goal
 */
export const updateGoal = async (goalId: string, updates: Partial<Goal>): Promise<Goal> => {
  try {
    const response = await apiClient.put(`/goals/${goalId}`, updates);
    return transformGoal(response.data);
  } catch (error) {
    console.error(`Error updating goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    await apiClient.delete(`/goals/${goalId}`);
  } catch (error) {
    console.error(`Error deleting goal ${goalId}:`, error);
    throw error;
  }
};
