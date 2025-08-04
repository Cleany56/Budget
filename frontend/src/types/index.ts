// Account types for dashboard summary
export type AccountType = 'Bank' | 'Investment' | 'Credit Card' | 'Checking' | 'Savings';

export interface AccountSummary {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
}
// Types for the ExpenseTracker app

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  notes?: string;
  accountId?: string; // Link to AccountSummary
}

export enum ExpenseCategory {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  UTILITIES = 'Utilities',
  HEALTH = 'Health',
  HOUSING = 'Housing',
  OTHER = 'Other',
}

export interface Budget {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  month?: string;  // For monthly budgets
  isRecurring: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
}
