import { Expense } from '../types';

// Mock data for initial development
export const DUMMY_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'Groceries',
    amount: 45.99,
    date: new Date(2025, 6, 28),
    category: 'Food' as any,
    notes: 'Weekly grocery shopping'
  },
  {
    id: 'e2',
    title: 'Movie tickets',
    amount: 25.50,
    date: new Date(2025, 6, 29),
    category: 'Entertainment' as any,
  },
  {
    id: 'e3',
    title: 'Gas',
    amount: 38.75,
    date: new Date(2025, 6, 30),
    category: 'Transport' as any,
  }
];
