import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';
import { formatAccountsForResponse } from '../utils/apiFormatters';

// Get all expenses with pagination support for handling large volumes
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    
    // Use query parameters for filtering and pagination
    const userId = req.query.userId as string || 'user123';
    const accountId = req.query.accountId as string;
    const category = req.query.category as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    
    // Build filter criteria
    let filterString = 'userId == $0 && isDeleted == false';
    let filterParams: any[] = [userId];
    let paramIndex = 1;
    
    if (accountId) {
      filterString += ` && accountId == $${paramIndex}`;
      filterParams.push(accountId);
      paramIndex++;
    }
    
    if (category) {
      filterString += ` && category == $${paramIndex}`;
      filterParams.push(category);
      paramIndex++;
    }
    
    // Add date range filters if provided
    if (startDate) {
      filterString += ` && date >= $${paramIndex}`;
      filterParams.push(startDate);
      paramIndex++;
    }
    
    if (endDate) {
      filterString += ` && date <= $${paramIndex}`;
      filterParams.push(endDate);
      paramIndex++;
    }
    
    // Query the database with filters
    const allExpenses = realm.objects('Transaction')
      .filtered(filterString, ...filterParams)
      .sorted('date', true);
    
    // Get total count for pagination metadata
    const total = allExpenses.length;
    
    // Apply pagination using slice (equivalent to LIMIT/OFFSET in SQL)
    const paginatedExpenses = allExpenses.slice(skip, skip + limit);
    
    // Format expenses to ensure consistent ID fields
    const formattedExpenses = Array.from(paginatedExpenses).map((expense: any) => {
      // Make sure both _id and id fields are present
      const formatted = { ...expense };
      if (formatted._id && !formatted.id) formatted.id = formatted._id;
      else if (formatted.id && !formatted._id) formatted._id = formatted.id;
      return formatted;
    });
    
    // Return paginated results with metadata
    res.status(200).json({
      data: formattedExpenses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses', error });
  }
};

// Get expense by ID
export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { id } = req.params;
    
    const expense = realm.objectForPrimaryKey('Transaction', id);
    
    if (!expense || expense.isDeleted) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    
    // Check if the expense is associated with a valid account
    if (expense.accountId) {
      const account = realm.objectForPrimaryKey('Account', expense.accountId);
      
      if (!account || account.isDeleted) {
        res.status(200).json({
          ...expense,
          accountWarning: 'Associated account no longer exists'
        });
        return;
      }
      
      // Include account details with the response for convenience
      const accountDetails = {
        id: account._id,
        name: account.name,
        type: account.type
      };
      
      res.status(200).json({
        ...expense,
        accountDetails
      });
      return;
    }
    
    res.status(200).json(expense);
  } catch (error) {
    console.error(`Error fetching expense ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch expense', error });
  }
};

// Create new expense
export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { 
      title, 
      amount, 
      date, 
      category, 
      notes = '', 
      accountId
    } = req.body;
    const userId = req.body.userId || 'user123'; // Default for development
    
    // Validate accountId is provided
    if (!accountId) {
      res.status(400).json({ message: 'accountId is required' });
      return;
    }
    
    // Validate the account exists and is a bank account (Checking or Savings)
    const account = realm.objectForPrimaryKey('Account', accountId);
    if (!account || account.isDeleted) {
      res.status(400).json({ message: 'Invalid account ID' });
      return;
    }
    
    // Import the normalization utility
    const { normalizeAccountType } = require('../utils/normalization');
    
    // Enhanced debugging for account type validation
    const normalizedType = normalizeAccountType(account.type);
    
    console.log(`Account type validation: Original="${account.type}", Normalized="${normalizedType}"`);
    console.log('Raw account data from database:', JSON.stringify({
      id: account._id,
      name: account.name,
      type: account.type
    }));
    
    // Check if normalized account type is valid for transactions
    if (normalizedType !== 'Checking' && normalizedType !== 'Savings' && normalizedType !== 'Bank' && normalizedType !== 'Credit Card') {
      console.log(`REJECTED: Account type "${normalizedType}" is not valid for transactions`);
      res.status(400).json({ 
        message: 'Transactions can only be associated with Checking, Savings, or Credit Card accounts',
        providedType: account.type,
        normalizedType: normalizedType
      });
      return;
    }
    
    console.log(`ACCEPTED: Account type "${normalizedType}" is valid for transactions`);
    
    // Create new ID
    const newId = new ObjectId().toString();
    
    realm.write(() => {
      realm.create('Transaction', {
        _id: newId,
        title,
        amount,
        date: new Date(date),
        category,
        notes,
        accountId,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isDeleted: false
      });
    });
    
    const newExpense = realm.objectForPrimaryKey('Transaction', newId);
    res.status(201).json(newExpense);
  } catch (error: any) {
    console.error('Error creating expense:', error);
    res.status(500).json({ 
      message: 'Failed to create expense', 
      error: error.message 
    });
  }
};

// Update expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { id } = req.params;
    const updates = req.body;
    
    const expense = realm.objectForPrimaryKey('Transaction', id);
    
    if (!expense || expense.isDeleted) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    
    // If account ID is being updated, validate it's a bank account
    if (updates.accountId && updates.accountId !== expense.accountId) {
      const account = realm.objectForPrimaryKey('Account', updates.accountId);
      
      if (!account || account.isDeleted) {
        res.status(400).json({ message: 'Invalid account ID' });
        return;
      }
      
      // Import the normalization utility if not already imported
      const { normalizeAccountType } = require('../utils/normalization');
      
      // Normalize the account type for consistent validation
      const normalizedType = normalizeAccountType(account.type);
      console.log(`Update validation: Original="${account.type}", Normalized="${normalizedType}"`);
      
      // Check if normalized account type is valid for transactions
      if (normalizedType !== 'Checking' && normalizedType !== 'Savings' && normalizedType !== 'Bank' && normalizedType !== 'Credit Card') {
        console.log(`REJECTED UPDATE: Account type "${normalizedType}" is not valid for transactions`);
        res.status(400).json({ 
          message: 'Transactions can only be associated with Checking, Savings, or Credit Card accounts',
          providedType: account.type
        });
        return;
      }
      
      console.log(`ACCEPTED UPDATE: Account type "${normalizedType}" is valid for transactions`);
    }
    
    realm.write(() => {
      Object.keys(updates).forEach(key => {
        if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'isDeleted') {
          // Handle date conversion
          if (key === 'date' && updates.date) {
            expense[key] = new Date(updates.date);
          } else {
            expense[key] = updates[key];
          }
        }
      });
      
      expense.updatedAt = new Date();
    });
    
    res.status(200).json(expense);
  } catch (error) {
    console.error(`Error updating expense ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update expense', error });
  }
};

// Delete expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { id } = req.params;
    
    const expense = realm.objectForPrimaryKey('Transaction', id);
    
    if (!expense || expense.isDeleted) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    
    realm.write(() => {
      expense.isDeleted = true;
      expense.updatedAt = new Date();
    });
    
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(`Error deleting expense ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete expense', error });
  }
};

// Bulk create expenses - useful for importing large volumes of transactions
export const bulkCreateExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const expenses = req.body.expenses;
    const userId = req.body.userId || 'user123'; // Default for development
    
    if (!Array.isArray(expenses) || expenses.length === 0) {
      res.status(400).json({ message: 'Invalid or empty expenses array' });
      return;
    }
    
    // Validate all accounts before attempting to create any expenses
    const accountIds = [...new Set(expenses.map(exp => exp.accountId))]; // Get unique account IDs
    const invalidAccountIds: string[] = [];
    
    // Check each account ID is valid (exists and is a bank account)
    accountIds.forEach(accountId => {
      if (!accountId) {
        invalidAccountIds.push(accountId);
        return;
      }
      
      const account = realm.objectForPrimaryKey('Account', accountId);
      
      // Import the normalization utility if not already imported
      const { normalizeAccountType } = require('../utils/normalization');
      
      if (!account || account.isDeleted) {
        console.log(`Account with ID ${accountId} not found or deleted`);
        invalidAccountIds.push(accountId);
      } else {
        // Normalize the account type
        const normalizedType = normalizeAccountType(account.type);
        console.log(`Bulk validation for account "${account.name}": Original="${account.type}", Normalized="${normalizedType}"`);
        
        if (normalizedType !== 'Checking' && normalizedType !== 'Savings' && normalizedType !== 'Bank' && normalizedType !== 'Credit Card') {
          console.log(`Invalid account type for ID ${accountId}: ${normalizedType}`);
          invalidAccountIds.push(accountId);
        }
      }
    });
    
    if (invalidAccountIds.length > 0) {
      res.status(400).json({ 
        message: 'Invalid account IDs detected', 
        invalidAccountIds 
      });
      return;
    }
    
    // Process expenses in a single write transaction for performance
    const createdExpenses: any[] = [];
    
    realm.write(() => {
      expenses.forEach(expense => {
        const newId = new ObjectId().toString();
        
        realm.create('Transaction', {
          _id: newId,
          title: expense.title,
          amount: expense.amount,
          date: new Date(expense.date),
          category: expense.category,
          notes: expense.notes || '',
          accountId: expense.accountId,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          isDeleted: false
        });
        
        const createdExpense = realm.objectForPrimaryKey('Transaction', newId);
        if (createdExpense) {
          createdExpenses.push({ ...createdExpense });
        }
      });
    });
    
    res.status(201).json({ 
      message: `${createdExpenses.length} expenses created successfully`,
      expenses: createdExpenses
    });
  } catch (error: any) {
    console.error('Error bulk creating expenses:', error);
    res.status(500).json({ 
      message: 'Failed to bulk create expenses', 
      error: error.message 
    });
  }
};

// Get expenses for a specific account with pagination
export const getExpensesByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { accountId } = req.params;
    const userId = req.query.userId as string || 'user123';
    
    // Check if account exists and is valid type
    const account = realm.objectForPrimaryKey('Account', accountId);
    if (!account || account.isDeleted) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }
    
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    
    // Date range parameters
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    // Build filter
    let filterString = 'userId == $0 && isDeleted == false && accountId == $1';
    let filterParams: any[] = [userId, accountId];
    let paramIndex = 2;
    
    if (startDate) {
      filterString += ` && date >= $${paramIndex}`;
      filterParams.push(startDate);
      paramIndex++;
    }
    
    if (endDate) {
      filterString += ` && date <= $${paramIndex}`;
      filterParams.push(endDate);
      paramIndex++;
    }
    
    // Query the database with filters
    const allExpenses = realm.objects('Transaction')
      .filtered(filterString, ...filterParams)
      .sorted('date', true);
    
    // Get total count for pagination metadata
    const total = allExpenses.length;
    
    // Apply pagination
    const paginatedExpenses = allExpenses.slice(skip, skip + limit);
    
    // Get account summary information with consistent ID fields
    const formattedAccount = formatAccountsForResponse({
      _id: account._id,
      id: account._id, // Ensure both id and _id are present
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency
    });
    
    // Format expenses to ensure consistent ID fields
    const formattedExpenses = Array.from(paginatedExpenses).map((expense: any) => {
      // Make sure both _id and id fields are present
      const formatted = { ...expense };
      if (formatted._id && !formatted.id) formatted.id = formatted._id;
      else if (formatted.id && !formatted._id) formatted._id = formatted.id;
      return formatted;
    });
    
    // Return paginated results with account summary and metadata
    res.status(200).json({
      data: formattedExpenses,
      account: formattedAccount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(`Error fetching expenses for account:`, error);
    res.status(500).json({ message: 'Failed to fetch expenses for account', error });
  }
};

/**
 * Get total spending for the current month (negative transactions only)
 */
export const getMonthlySpending = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const userId = req.query.userId as string || 'user123'; // Default for development
    
    // Calculate start and end dates for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Override dates if provided in query params
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : startOfMonth;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : endOfMonth;
    
    console.log(`Calculating spending from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Filter for negative transactions (spending) within the date range
    const transactions = realm.objects('Transaction')
      .filtered('userId == $0 && isDeleted == false && amount < 0 && date >= $1 && date <= $2', 
        userId, startDate, endDate);
    
    // Calculate total spending (negate the sum to get a positive value)
    let totalSpending = 0;
    transactions.forEach((transaction: any) => {
      totalSpending += Math.abs(transaction.amount);
    });
    
    // Get transaction count
    const transactionCount = transactions.length;
    
    // Additional details for the response
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    res.status(200).json({
      totalSpending,
      transactionCount,
      period: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isCurrentMonth: (
          startDate.getMonth() === now.getMonth() && 
          startDate.getFullYear() === now.getFullYear()
        )
      }
    });
  } catch (error) {
    console.error('Error in getMonthlySpending:', error);
    res.status(500).json({ 
      message: 'Failed to calculate monthly spending', 
      error: (error as Error).message 
    });
  }
};
