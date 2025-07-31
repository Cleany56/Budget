import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenses';

const router = Router();

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
