import express from 'express';
import { BudgetController } from '../controllers/budgets';

const router = express.Router();
const budgetController = new BudgetController();

/**
 * Budget routes
 */

// GET /api/budgets - Get all budgets
router.get('/', (req, res) => budgetController.getAllBudgets(req, res));

// GET /api/budgets/:id - Get a budget by ID
router.get('/:id', (req, res) => budgetController.getBudgetById(req, res));

// POST /api/budgets - Create a new budget
router.post('/', (req, res) => budgetController.createBudget(req, res));

// PUT /api/budgets/:id - Update an existing budget
router.put('/:id', (req, res) => budgetController.updateBudget(req, res));

// DELETE /api/budgets/:id - Delete a budget
router.delete('/:id', (req, res) => budgetController.deleteBudget(req, res));

export default router;
