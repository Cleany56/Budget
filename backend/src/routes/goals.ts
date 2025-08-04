import express from 'express';
import { GoalController } from '../controllers/goals';

const router = express.Router();
const goalController = new GoalController();

/**
 * Goal routes
 */

// GET /api/goals - Get all goals
router.get('/', (req, res) => goalController.getAllGoals(req, res));

// GET /api/goals/:id - Get a goal by ID
router.get('/:id', (req, res) => goalController.getGoalById(req, res));

// POST /api/goals - Create a new goal
router.post('/', (req, res) => goalController.createGoal(req, res));

// PUT /api/goals/:id - Update an existing goal
router.put('/:id', (req, res) => goalController.updateGoal(req, res));

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', (req, res) => goalController.deleteGoal(req, res));

export default router;
