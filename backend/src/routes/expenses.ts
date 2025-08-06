import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkCreateExpenses,
  getExpensesByAccount,
  getMonthlySpending  // Add the new function
} from '../controllers/expenses';

const router = Router();

router.route('/')
  .get(getExpenses)
  .post(createExpense);

// New endpoint for bulk operations
router.route('/bulk')
  .post(bulkCreateExpenses);

// New endpoint for getting expenses by account
router.route('/by-account/:accountId')
  .get(getExpensesByAccount);

// Endpoint for getting monthly spending (negative transactions)
router.route('/monthly-spending')
  .get(getMonthlySpending);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
