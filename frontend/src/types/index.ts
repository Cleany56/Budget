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
