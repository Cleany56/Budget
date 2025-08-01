import { AccountSummary } from '../types';

export const DUMMY_ACCOUNTS: AccountSummary[] = [
  {
    id: 'a1',
    name: 'Checking Account',
    type: 'Checking',
    balance: 2450.75,
    currency: 'USD',
  },
  {
    id: 'a2',
    name: 'Savings Account',
    type: 'Savings',
    balance: 5000.00,
    currency: 'USD',
  },
  {
    id: 'a3',
    name: 'Investment Portfolio',
    type: 'Investment',
    balance: 10250.00,
    currency: 'USD',
  },
  {
    id: 'a4',
    name: 'Visa Credit Card',
    type: 'Credit Card',
    balance: -350.20,
    currency: 'USD',
  },
  {
    id: 'a5',
    name: 'Mastercard',
    type: 'Credit Card',
    balance: -120.00,
    currency: 'USD',
  },
];
import { Expense } from '../types';

// Mock data for initial development
export const DUMMY_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'Groceries',
    amount: 45.99,
    date: new Date(2025, 6, 28),
    category: 'Food' as any,
    notes: 'Weekly grocery shopping',
    accountId: 'a1', // Checking Account
  },
  {
    id: 'e2',
    title: 'Movie tickets',
    amount: 25.50,
    date: new Date(2025, 6, 29),
    category: 'Entertainment' as any,
    accountId: 'a5', // Mastercard (Credit Card)
  },
  {
    id: 'e3',
    title: 'Gas',
    amount: 38.75,
    date: new Date(2025, 6, 30),
    category: 'Transport' as any,
    accountId: 'a1', // Checking Account
  }
];
