import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';
import { Goal } from '../models/goal';

export class GoalController {
  /**
   * Get all goals for a user
   */
  async getAllGoals(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const userId = req.query.userId as string || 'user123'; // Default for development
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      let goals = realm.objects('Goal')
        .filtered('userId == $0 && isDeleted == false', userId)
        .sorted('createdAt', true);
      
      let result = Array.from(goals);
      if (limit) {
        result = result.slice(0, limit);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ message: 'Failed to fetch goals', error });
    }
  }
  
  /**
   * Get a specific goal by ID
   */
  async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      
      // Use the ID directly as a string
      const goal = realm.objectForPrimaryKey('Goal', id);
      
      if (!goal || goal.isDeleted) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }
      
      res.status(200).json(goal);
    } catch (error) {
      console.error(`Error fetching goal ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch goal', error });
    }
  }
  
  /**
   * Create a new goal
   */
  async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { name, targetAmount, currentAmount = 0, targetDate, priority = 'medium' } = req.body;
      const userId = req.body.userId || 'user123'; // Default for development
      
      // Generate a new ObjectId and convert it to a string for Realm
      const newIdString = new ObjectId().toString();
      
      realm.write(() => {
        realm.create<Goal>('Goal', {
          _id: newIdString,
          name,
          targetAmount,
          currentAmount,
          targetDate,
          priority,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          isDeleted: false
        });
      });
      
      const newGoal = realm.objectForPrimaryKey('Goal', newIdString);
      res.status(201).json(newGoal);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ message: 'Failed to create goal', error });
    }
  }
  
  /**
   * Update an existing goal
   */
  async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      const updates = req.body;
      
      // Use the ID directly as a string
      const goal = realm.objectForPrimaryKey('Goal', id);
      
      if (!goal || goal.isDeleted) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }
      
      realm.write(() => {
        Object.keys(updates).forEach(key => {
          if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'isDeleted') {
            goal[key] = updates[key];
          }
        });
        
        goal.updatedAt = new Date();
      });
      
      res.status(200).json(goal);
    } catch (error) {
      console.error(`Error updating goal ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to update goal', error });
    }
  }
  
  /**
   * Delete a goal (soft delete)
   */
  async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      const realm = await getRealm();
      const { id } = req.params;
      
      // Use the ID directly as a string
      const goal = realm.objectForPrimaryKey('Goal', id);
      
      if (!goal || goal.isDeleted) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }
      
      realm.write(() => {
        goal.isDeleted = true;
        goal.updatedAt = new Date();
      });
      
      res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error(`Error deleting goal ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete goal', error });
    }
  }
}
