import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';
import { Budget } from '../models/budget';

export class BudgetController {
  /**
   * Get all budgets for a user
   */
  async getAllBudgets(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const userId = req.query.userId as string || 'user123'; // Default for development
      
      const budgets = realm.objects('Budget')
        .filtered('userId == $0 && isDeleted == false', userId)
        .sorted('createdAt', true);
      
      res.status(200).json(Array.from(budgets));
    } catch (error) {
      console.error('Error fetching budgets:', error);
      res.status(500).json({ message: 'Failed to fetch budgets', error });
    }
  }
  
  /**
   * Get a specific budget by ID
   */
  async getBudgetById(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      
      const budget = realm.objectForPrimaryKey('Budget', new ObjectId(id));
      
      if (!budget || budget.isDeleted) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      
      res.status(200).json(budget);
    } catch (error) {
      console.error(`Error fetching budget ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch budget', error });
    }
  }
  
  /**
   * Create a new budget
   */
  async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { name, category, amount, spent = 0, month, isRecurring = false } = req.body;
      const userId = req.body.userId || 'user123'; // Default for development
      
      const newId = new ObjectId();
      
      realm.write(() => {
        realm.create<Budget>('Budget', {
          _id: newId,
          name,
          category,
          amount,
          spent,
          month,
          isRecurring,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          isDeleted: false
        });
      });
      
      const newBudget = realm.objectForPrimaryKey('Budget', newId);
      res.status(201).json(newBudget);
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ message: 'Failed to create budget', error });
    }
  }
  
  /**
   * Update an existing budget
   */
  async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      const updates = req.body;
      
      const budget = realm.objectForPrimaryKey('Budget', new ObjectId(id));
      
      if (!budget || budget.isDeleted) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      
      realm.write(() => {
        Object.keys(updates).forEach(key => {
          if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'isDeleted') {
            budget[key] = updates[key];
          }
        });
        
        budget.updatedAt = new Date();
      });
      
      res.status(200).json(budget);
    } catch (error) {
      console.error(`Error updating budget ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to update budget', error });
    }
  }
  
  /**
   * Delete a budget (soft delete)
   */
  async deleteBudget(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      
      const budget = realm.objectForPrimaryKey('Budget', new ObjectId(id));
      
      if (!budget || budget.isDeleted) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      
      realm.write(() => {
        budget.isDeleted = true;
        budget.updatedAt = new Date();
      });
      
      res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
      console.error(`Error deleting budget ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete budget', error });
    }
  }
}
