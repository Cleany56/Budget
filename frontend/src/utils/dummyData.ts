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

import { Expense, ExpenseCategory } from '../types';

// Mock data for initial development
// JavaScript Date months are 0-based, so 5 = June, 6 = July
export const DUMMY_EXPENSES: Expense[] = [
  // Only categories supported by transactionIcons: FOOD, ENTERTAINMENT, TRANSPORT, INCOME, SHOPPING, CREDIT, SAVINGS
  { id: 'e1', title: 'Groceries', amount: -45.99, date: new Date(2025, 5, 28), category: ExpenseCategory.FOOD, notes: 'Weekly grocery shopping', accountId: 'a1' },
  { id: 'e2', title: 'Movie tickets', amount: -25.50, date: new Date(2025, 5, 29), category: ExpenseCategory.ENTERTAINMENT, notes: 'Cinema night', accountId: 'a4' },
  { id: 'e3', title: 'Gas', amount: -38.75, date: new Date(2025, 5, 30), category: ExpenseCategory.TRANSPORT, notes: 'Filled up tank', accountId: 'a1' },
  { id: 'e4', title: 'Salary', amount: 3200, date: new Date(2025, 5, 30), category: ExpenseCategory.OTHER, notes: 'Monthly salary', accountId: 'a1' }, // Use OTHER for INCOME
  { id: 'e5', title: 'Shopping Spree', amount: -120, date: new Date(2025, 6, 1), category: ExpenseCategory.SHOPPING, notes: 'Clothes and shoes', accountId: 'a1' },
  { id: 'e6', title: 'Credit Card Payment', amount: -200, date: new Date(2025, 6, 1), category: ExpenseCategory.OTHER, notes: 'Paid credit card', accountId: 'a4' }, // Use OTHER for CREDIT
  { id: 'e7', title: 'Savings Deposit', amount: 100, date: new Date(2025, 6, 2), category: ExpenseCategory.OTHER, notes: 'Deposit to savings', accountId: 'a2' }, // Use OTHER for SAVINGS
  { id: 'e8', title: 'Coffee', amount: -4.50, date: new Date(2025, 6, 2), category: ExpenseCategory.FOOD, notes: 'Morning coffee', accountId: 'a1' },
  { id: 'e9', title: 'Bus Pass', amount: -50, date: new Date(2025, 6, 3), category: ExpenseCategory.TRANSPORT, notes: 'Monthly pass', accountId: 'a1' },
  { id: 'e10', title: 'Dinner Out', amount: -60, date: new Date(2025, 6, 3), category: ExpenseCategory.FOOD, notes: 'With friends', accountId: 'a1' },
  { id: 'e11', title: 'Concert', amount: -120, date: new Date(2025, 6, 4), category: ExpenseCategory.ENTERTAINMENT, notes: 'Live music', accountId: 'a4' },
  { id: 'e12', title: 'Groceries', amount: -80, date: new Date(2025, 6, 4), category: ExpenseCategory.FOOD, notes: 'Weekly groceries', accountId: 'a1' },
  { id: 'e13', title: 'Online Shopping', amount: -75, date: new Date(2025, 6, 5), category: ExpenseCategory.SHOPPING, notes: 'Amazon order', accountId: 'a1' },
  { id: 'e14', title: 'Gas', amount: -40, date: new Date(2025, 6, 5), category: ExpenseCategory.TRANSPORT, notes: 'Car fuel', accountId: 'a1' },
  { id: 'e15', title: 'Credit Card Cashback', amount: 10, date: new Date(2025, 6, 6), category: ExpenseCategory.OTHER, notes: 'Cashback', accountId: 'a4' }, // Use OTHER for CREDIT
  { id: 'e16', title: 'Savings Interest', amount: 5, date: new Date(2025, 6, 6), category: ExpenseCategory.OTHER, notes: 'Interest', accountId: 'a2' }, // Use OTHER for SAVINGS
  { id: 'e17', title: 'Groceries', amount: -55, date: new Date(2025, 6, 7), category: ExpenseCategory.FOOD, notes: 'Weekly groceries', accountId: 'a1' },
  { id: 'e18', title: 'Movie Night', amount: -30, date: new Date(2025, 6, 7), category: ExpenseCategory.ENTERTAINMENT, notes: 'Streaming', accountId: 'a4' },
  { id: 'e19', title: 'Bus Ticket', amount: -3, date: new Date(2025, 6, 8), category: ExpenseCategory.TRANSPORT, notes: 'Single ride', accountId: 'a1' },
  { id: 'e20', title: 'Clothing', amount: -60, date: new Date(2025, 6, 8), category: ExpenseCategory.SHOPPING, notes: 'Summer clothes', accountId: 'a1' },
  { id: 'e21', title: 'Groceries', amount: -65, date: new Date(2025, 6, 9), category: ExpenseCategory.FOOD, notes: 'Weekly groceries', accountId: 'a1' },
  { id: 'e22', title: 'Credit Card Fee', amount: -15, date: new Date(2025, 6, 9), category: ExpenseCategory.OTHER, notes: 'Annual fee', accountId: 'a4' }, // Use OTHER for CREDIT
  { id: 'e23', title: 'Savings Bonus', amount: 20, date: new Date(2025, 6, 10), category: ExpenseCategory.OTHER, notes: 'Bonus', accountId: 'a2' }, // Use OTHER for SAVINGS
  { id: 'e24', title: 'Groceries', amount: -70, date: new Date(2025, 6, 10), category: ExpenseCategory.FOOD, notes: 'Weekly groceries', accountId: 'a1' },
  { id: 'e25', title: 'Online Shopping', amount: -90, date: new Date(2025, 6, 11), category: ExpenseCategory.SHOPPING, notes: 'Electronics', accountId: 'a1' },
];
