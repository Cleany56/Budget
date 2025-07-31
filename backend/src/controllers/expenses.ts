import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/expense';

// Get all expenses
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    // For now, we're not implementing user authentication, so we use a default userId
    const userId = req.query.userId || 'default-user';
    const expenses: IExpense[] = await Expense.find({ userId }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get expense by ID
export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense: IExpense | null = await Expense.findById(req.params.id);
    
    if (!expense) {
      res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new expense
export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    // Set a default userId if not provided (for future auth implementation)
    const expenseData = { ...req.body, userId: req.body.userId || 'default-user' };
    
    const expense: IExpense = await Expense.create(expenseData);
    
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense: IExpense | null = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
