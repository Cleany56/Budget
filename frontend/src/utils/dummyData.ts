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
    balance: 11000,
    currency: 'USD',
  },
  {
    id: 'a4',
    name: 'Visa Credit Card',
    type: 'Credit Card',
    balance: -400,
    currency: 'USD',
  },
];

// Simulate monthly balances for each account type for 2025
// Each array: Jan, Feb, ..., Dec
export const INVESTMENT_BALANCES_2025: number[] = [5000, 5200, 5100, 5300, 5400, 5600, 6000, 6500, 7000, 8000, 9500, 11000];
export const CHECKING_BALANCES_2025: number[] = [2000, 2100, 2050, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600];
export const SAVINGS_BALANCES_2025: number[] = [5000, 5050, 5100, 5150, 5200, 5250, 5300, 5350, 5375, 5400, 5400, 5400];
export const CREDITCARD_BALANCES_2025: number[] = [-200, -250, -220, -300, -350, -320, -310, -330, -350, -370, -390, -400];

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
