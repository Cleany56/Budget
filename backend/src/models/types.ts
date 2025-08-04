/**
 * Type definitions for the ExpenseTracker application
 */

// Account types
export enum AccountType {
  BANK = 'Bank',
  INVESTMENT = 'Investment',
  CREDIT_CARD = 'Credit Card',
  CHECKING = 'Checking',
  SAVINGS = 'Savings',
}

// Expense categories
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

// Budget types
export enum BudgetType {
  MONTHLY = 'Monthly',
  RECURRING = 'Recurring',
}

// Goal priority
export enum GoalPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Currency codes
export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CAD = 'CAD',
  AUD = 'AUD',
  // Add more as needed
}

// Security and encryption related types
export enum EncryptionStatus {
  ENCRYPTED = 'encrypted',
  UNENCRYPTED = 'unencrypted',
  PENDING = 'pending',
}

// Sync status for tracking offline/online data
export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
}

// Interface for sensitive data fields that require encryption
export interface SensitiveData {
  isEncrypted: boolean;
  encryptedAt?: Date;
  lastDecryptedAt?: Date;
}

// Data access levels
export enum AccessLevel {
  OWNER = 'owner',      // Full access
  VIEWER = 'viewer',    // Read-only access
  EDITOR = 'editor',    // Can modify but not delete
  NONE = 'none'         // No access
}
