import { AccountSummary, Budget, Goal, ExpenseCategory } from '../types';

export const DUMMY_BUDGETS: Budget[] = [
  {
    id: 'b1',
    name: 'Monthly Groceries',
    category: ExpenseCategory.FOOD,
    amount: 600,
    spent: 420,
    month: 'August 2025',
    isRecurring: false
  },
  {
    id: 'b2',
    name: 'Entertainment',
    category: ExpenseCategory.ENTERTAINMENT,
    amount: 200,
    spent: 75,
    month: 'August 2025',
    isRecurring: false
  },
  {
    id: 'b3',
    name: 'Transportation',
    category: ExpenseCategory.TRANSPORT,
    amount: 300,
    spent: 285,
    month: 'August 2025',
    isRecurring: false
  },
  {
    id: 'b4',
    name: 'Recurring Utilities',
    category: ExpenseCategory.UTILITIES,
    amount: 250,
    spent: 180,
    isRecurring: true
  }
];

export const DUMMY_GOALS: Goal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 5500,
    targetDate: '2025-12-31',
    priority: 'high'
  },
  {
    id: 'g2',
    name: 'Vacation to Europe',
    targetAmount: 3000,
    currentAmount: 1200,
    targetDate: '2026-03-15',
    priority: 'medium'
  },
  {
    id: 'g3',
    name: 'New Car',
    targetAmount: 15000,
    currentAmount: 3750,
    targetDate: '2026-09-01',
    priority: 'low'
  }
];

export const DUMMY_ACCOUNTS: AccountSummary[] = [
  // Primary accounts
  {
    id: 'a1',
    name: 'Primary Checking (Chase)',
    type: 'Checking',
    balance: 2450.75,
    currency: 'USD',
  },
  {
    id: 'a2',
    name: 'High-Yield Savings (Ally)',
    type: 'Savings',
    balance: 5000.00,
    currency: 'USD',
  },
  {
    id: 'a3',
    name: 'Investment Portfolio (Vanguard)',
    type: 'Investment',
    balance: 11000.00,
    currency: 'USD',
  },
  {
    id: 'a4',
    name: 'Visa Rewards Card (Chase)',
    type: 'Credit Card',
    balance: -400.00,
    currency: 'USD',
  },
  
  // Additional accounts
  {
    id: 'a5',
    name: 'Joint Checking (Bank of America)',
    type: 'Checking',
    balance: 3725.50,
    currency: 'USD',
  },
  {
    id: 'a6',
    name: 'Emergency Fund (Capital One)',
    type: 'Savings',
    balance: 10000.00,
    currency: 'USD',
  },
  {
    id: 'a7',
    name: 'Vacation Fund (Ally)',
    type: 'Savings',
    balance: 2500.00,
    currency: 'USD',
  },
  {
    id: 'a8',
    name: '401(k) (Fidelity)',
    type: 'Investment',
    balance: 45000.00,
    currency: 'USD',
  },
  {
    id: 'a9',
    name: 'Roth IRA (Charles Schwab)',
    type: 'Investment',
    balance: 22500.00,
    currency: 'USD',
  },
  {
    id: 'a10',
    name: 'Amazon Store Card (Synchrony)',
    type: 'Credit Card',
    balance: -250.35,
    currency: 'USD',
  },
  {
    id: 'a11',
    name: 'Business Checking (Wells Fargo)',
    type: 'Checking',
    balance: 7850.25,
    currency: 'USD',
  },
  {
    id: 'a12',
    name: 'Travel Rewards Card (Amex)',
    type: 'Credit Card',
    balance: -1200.80,
    currency: 'USD',
  },
];

// Simulate monthly balances for each account type for 2025
// Each array: Jan, Feb, ..., Dec

// Primary Checking account history
export const PRIMARY_CHECKING_BALANCES_2025: number[] = [2000, 2100, 2050, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600];

// High-Yield Savings account history
export const HIGH_YIELD_SAVINGS_BALANCES_2025: number[] = [5000, 5050, 5100, 5150, 5200, 5250, 5300, 5350, 5375, 5400, 5425, 5450];

// Investment Portfolio account history (more volatile)
export const INVESTMENT_BALANCES_2025: number[] = [5000, 5200, 5100, 5300, 5400, 5600, 6000, 6500, 7000, 8000, 9500, 11000];

// Credit Card balance history
export const CREDITCARD_BALANCES_2025: number[] = [-200, -250, -220, -300, -350, -320, -310, -330, -350, -370, -390, -400];

// Emergency Fund account history (steady growth)
export const EMERGENCY_FUND_BALANCES_2025: number[] = [8500, 8700, 8900, 9100, 9300, 9500, 9700, 9850, 9900, 9950, 9975, 10000];

// Joint Checking account history 
export const JOINT_CHECKING_BALANCES_2025: number[] = [3000, 3150, 3250, 3400, 3450, 3500, 3550, 3600, 3650, 3680, 3700, 3725];

// 401(k) account history
export const RETIREMENT_401K_BALANCES_2025: number[] = [38000, 39000, 38500, 40000, 41000, 40500, 41500, 42000, 43000, 44000, 44500, 45000];

// All balances for complete account history
export const ACCOUNT_HISTORY_2025 = {
  'a1': PRIMARY_CHECKING_BALANCES_2025,
  'a2': HIGH_YIELD_SAVINGS_BALANCES_2025,
  'a3': INVESTMENT_BALANCES_2025,
  'a4': CREDITCARD_BALANCES_2025,
  'a5': JOINT_CHECKING_BALANCES_2025,
  'a6': EMERGENCY_FUND_BALANCES_2025,
  'a8': RETIREMENT_401K_BALANCES_2025,
};

import { Expense } from '../types';

// Mock data for testing and development
// JavaScript Date months are 0-based, so 0 = January, 4 = May, 5 = June, 6 = July, 7 = August
export const DUMMY_EXPENSES: Expense[] = [
  // Current month (August 2025) transactions
  { id: 'e101', title: 'Monthly Rent', amount: -1500, date: new Date(2025, 7, 1), category: ExpenseCategory.OTHER, notes: 'August rent payment', accountId: 'a1' },
  { id: 'e102', title: 'Salary Deposit', amount: 3500, date: new Date(2025, 7, 1), category: ExpenseCategory.OTHER, notes: 'August salary', accountId: 'a1' },
  { id: 'e103', title: 'Whole Foods', amount: -85.43, date: new Date(2025, 7, 1), category: ExpenseCategory.FOOD, notes: 'Organic groceries', accountId: 'a1' },
  { id: 'e104', title: 'Netflix', amount: -17.99, date: new Date(2025, 7, 2), category: ExpenseCategory.ENTERTAINMENT, notes: 'Monthly subscription', accountId: 'a4' },
  { id: 'e105', title: 'Gas Station', amount: -48.32, date: new Date(2025, 7, 2), category: ExpenseCategory.TRANSPORT, notes: 'Full tank', accountId: 'a4' },

  // Previous month (July 2025) transactions
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
  
  // More July transactions
  { id: 'e26', title: 'Gym Membership', amount: -35, date: new Date(2025, 6, 12), category: ExpenseCategory.OTHER, notes: 'Monthly membership', accountId: 'a4' },
  { id: 'e27', title: 'Pharmacy', amount: -22.45, date: new Date(2025, 6, 12), category: ExpenseCategory.OTHER, notes: 'Prescriptions', accountId: 'a1' },
  { id: 'e28', title: 'Restaurant', amount: -78.32, date: new Date(2025, 6, 13), category: ExpenseCategory.FOOD, notes: 'Birthday dinner', accountId: 'a4' },
  { id: 'e29', title: 'Uber', amount: -12.75, date: new Date(2025, 6, 14), category: ExpenseCategory.TRANSPORT, notes: 'Ride to airport', accountId: 'a4' },
  { id: 'e30', title: 'Freelance Work', amount: 350, date: new Date(2025, 6, 15), category: ExpenseCategory.OTHER, notes: 'Website design project', accountId: 'a1' },
  
  // June 2025 transactions
  { id: 'e31', title: 'Monthly Rent', amount: -1500, date: new Date(2025, 5, 1), category: ExpenseCategory.OTHER, notes: 'June rent payment', accountId: 'a1' },
  { id: 'e32', title: 'Salary', amount: 3200, date: new Date(2025, 5, 1), category: ExpenseCategory.OTHER, notes: 'June salary', accountId: 'a1' },
  { id: 'e33', title: 'Internet Bill', amount: -75, date: new Date(2025, 5, 5), category: ExpenseCategory.OTHER, notes: 'Monthly internet', accountId: 'a1' },
  { id: 'e34', title: 'Phone Bill', amount: -65, date: new Date(2025, 5, 5), category: ExpenseCategory.OTHER, notes: 'Mobile phone', accountId: 'a4' },
  { id: 'e35', title: 'Electricity Bill', amount: -110, date: new Date(2025, 5, 8), category: ExpenseCategory.OTHER, notes: 'Monthly electricity', accountId: 'a1' },
  
  // May 2025 transactions
  { id: 'e36', title: 'Monthly Rent', amount: -1500, date: new Date(2025, 4, 1), category: ExpenseCategory.OTHER, notes: 'May rent payment', accountId: 'a1' },
  { id: 'e37', title: 'Salary', amount: 3200, date: new Date(2025, 4, 1), category: ExpenseCategory.OTHER, notes: 'May salary', accountId: 'a1' },
  { id: 'e38', title: 'Dentist', amount: -150, date: new Date(2025, 4, 10), category: ExpenseCategory.OTHER, notes: 'Annual checkup', accountId: 'a1' },
  { id: 'e39', title: 'Car Repair', amount: -320, date: new Date(2025, 4, 15), category: ExpenseCategory.TRANSPORT, notes: 'Brake replacement', accountId: 'a4' },
  { id: 'e40', title: 'Bonus', amount: 500, date: new Date(2025, 4, 20), category: ExpenseCategory.OTHER, notes: 'Performance bonus', accountId: 'a1' },
  
  // Different account transactions
  { id: 'e41', title: 'Investment Deposit', amount: -1000, date: new Date(2025, 6, 15), category: ExpenseCategory.OTHER, notes: 'Stock purchase', accountId: 'a3' },
  { id: 'e42', title: 'Dividend Payment', amount: 75, date: new Date(2025, 6, 20), category: ExpenseCategory.OTHER, notes: 'Quarterly dividend', accountId: 'a3' },
  { id: 'e43', title: 'Savings Transfer', amount: -200, date: new Date(2025, 7, 1), category: ExpenseCategory.OTHER, notes: 'Monthly savings', accountId: 'a2' },
  
  // Large transactions
  { id: 'e44', title: 'New Laptop', amount: -1299.99, date: new Date(2025, 6, 18), category: ExpenseCategory.SHOPPING, notes: 'MacBook Air', accountId: 'a4' },
  { id: 'e45', title: 'Vacation Package', amount: -2500, date: new Date(2025, 6, 20), category: ExpenseCategory.OTHER, notes: 'Summer vacation booking', accountId: 'a4' },
  
  // Small transactions
  { id: 'e46', title: 'Coffee', amount: -3.50, date: new Date(2025, 7, 1), category: ExpenseCategory.FOOD, notes: 'Morning coffee', accountId: 'a1' },
  { id: 'e47', title: 'Snack', amount: -1.75, date: new Date(2025, 7, 1), category: ExpenseCategory.FOOD, notes: 'Afternoon snack', accountId: 'a1' },
  { id: 'e48', title: 'Parking', amount: -2.00, date: new Date(2025, 7, 1), category: ExpenseCategory.TRANSPORT, notes: 'Downtown parking', accountId: 'a1' },
  
  // Recurring subscriptions
  { id: 'e49', title: 'Spotify', amount: -9.99, date: new Date(2025, 6, 15), category: ExpenseCategory.ENTERTAINMENT, notes: 'Monthly subscription', accountId: 'a4' },
  { id: 'e50', title: 'Spotify', amount: -9.99, date: new Date(2025, 7, 15), category: ExpenseCategory.ENTERTAINMENT, notes: 'Monthly subscription', accountId: 'a4' },
  { id: 'e51', title: 'Amazon Prime', amount: -14.99, date: new Date(2025, 6, 20), category: ExpenseCategory.SHOPPING, notes: 'Monthly subscription', accountId: 'a4' },
  { id: 'e52', title: 'Amazon Prime', amount: -14.99, date: new Date(2025, 7, 20), category: ExpenseCategory.SHOPPING, notes: 'Monthly subscription', accountId: 'a4' },
];
