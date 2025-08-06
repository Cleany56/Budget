import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkCreateExpenses,  // We'll add this function
  getExpensesByAccount  // We'll add this function too
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

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
