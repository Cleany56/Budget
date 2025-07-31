// Types for the ExpenseTracker app

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  notes?: string;
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
