import { Budget, Goal, ExpenseCategory } from '../types';
import { DUMMY_BUDGETS, DUMMY_GOALS } from './dummyData';
import { createGoal, updateGoal as updateGoalAPI, deleteGoal as deleteGoalAPI } from '../services/api/goals';

// This file provides a unified interface for data management
// It uses API services for persistence while maintaining local state for UI updates

let budgets = [...DUMMY_BUDGETS];
let goals = [...DUMMY_GOALS];

// Budget management functions
export const getAllBudgets = (): Budget[] => {
  return budgets;
};

export const getLatestBudgets = (limit: number = 3): Budget[] => {
  // Sort by creation date (in a real app) or just return the first few
  return budgets.slice(0, limit);
};

export const addBudget = (budget: Omit<Budget, 'id'>): Budget => {
  // Generate a unique ID (in a real app would be from the database)
  const id = `b${budgets.length + 1}`;
  const newBudget: Budget = { ...budget, id };
  
  // Add to the beginning to show newest first
  budgets = [newBudget, ...budgets];
  
  return newBudget;
};

export const updateBudget = (budget: Budget): Budget => {
  budgets = budgets.map(b => b.id === budget.id ? budget : b);
  return budget;
};

export const deleteBudget = (id: string): boolean => {
  const initialLength = budgets.length;
  budgets = budgets.filter(b => b.id !== id);
  return budgets.length < initialLength;
};

// Goal management functions
export const getAllGoals = (): Goal[] => {
  return goals;
};

export const getLatestGoals = (limit: number = 2): Goal[] => {
  // Sort by priority (high to low) and then by creation date
  return [...goals]
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, limit);
};

export const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  try {
    // Use the API service to create the goal
    const newGoal = await createGoal(goal);
    
    // Update local state for immediate UI updates
    goals = [newGoal, ...goals];
    
    return newGoal;
  } catch (error) {
    console.error('Error adding goal:', error);
    throw error;
  }
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
  try {
    // Use the API service to update the goal
    const updatedGoal = await updateGoalAPI(goal.id, goal);
    
    // Update local state for immediate UI updates
    goals = goals.map(g => g.id === goal.id ? updatedGoal : g);
    
    return updatedGoal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (id: string): Promise<boolean> => {
  try {
    // Use the API service to delete the goal
    await deleteGoalAPI(id);
    
    // Update local state for immediate UI updates
    const initialLength = goals.length;
    goals = goals.filter(g => g.id !== id);
    
    return goals.length < initialLength;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Helper to create a new budget object
export const createNewBudget = (
  name: string, 
  category: ExpenseCategory,
  amount: number,
  month?: string,
  isRecurring: boolean = false
): Omit<Budget, 'id'> => {
  return {
    name,
    category,
    amount,
    spent: 0, // New budgets start with 0 spent
    month,
    isRecurring
  };
};

// Helper to create a new goal object
export const createNewGoal = (
  name: string,
  targetAmount: number,
  currentAmount: number,
  targetDate: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): Omit<Goal, 'id'> => {
  return {
    name,
    targetAmount,
    currentAmount,
    targetDate,
    priority
  };
};
