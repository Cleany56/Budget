import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';

// Get all expenses
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    // Use query parameters for filtering
    const userId = req.query.userId as string || 'user123';
    const accountId = req.query.accountId as string;
    const category = req.query.category as string;
    
    // Build filter criteria
    let filterString = 'userId == $0 && isDeleted == false';
    let filterParams = [userId];
    
    if (accountId) {
      filterString += ' && accountId == $1';
      filterParams.push(accountId);
    }
    
    if (category) {
      filterString += (accountId ? ' && category == $2' : ' && category == $1');
      filterParams.push(category);
    }
    
    // Query the database with filters
    const expenses = realm.objects('Transaction')
      .filtered(filterString, ...filterParams)
      .sorted('date', true);
    
    res.status(200).json(Array.from(expenses));
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
    
    const expense = realm.objectForPrimaryKey('Transaction', new ObjectId(id));
    
    if (!expense || expense.isDeleted) {
      res.status(404).json({ message: 'Expense not found' });
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
    
    // Create new ID
    const newId = new ObjectId();
    
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
    
    const expense = realm.objectForPrimaryKey('Transaction', new ObjectId(id));
    
    if (!expense || expense.isDeleted) {
      res.status(404).json({ message: 'Expense not found' });
      return;
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
    
    const expense = realm.objectForPrimaryKey('Transaction', new ObjectId(id));
    
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
