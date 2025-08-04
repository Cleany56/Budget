import { Budget, Goal, ExpenseCategory } from '../types';
import { DUMMY_BUDGETS, DUMMY_GOALS } from './dummyData';

// In a real app, these would interact with a database, localStorage, or API
// For this demo, we'll just use in-memory storage

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

export const addGoal = (goal: Omit<Goal, 'id'>): Goal => {
  // Generate a unique ID (in a real app would be from the database)
  const id = `g${goals.length + 1}`;
  const newGoal: Goal = { ...goal, id };
  
  // Add to the beginning to show newest first
  goals = [newGoal, ...goals];
  
  return newGoal;
};

export const updateGoal = (goal: Goal): Goal => {
  goals = goals.map(g => g.id === goal.id ? goal : g);
  return goal;
};

export const deleteGoal = (id: string): boolean => {
  const initialLength = goals.length;
  goals = goals.filter(g => g.id !== id);
  return goals.length < initialLength;
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
