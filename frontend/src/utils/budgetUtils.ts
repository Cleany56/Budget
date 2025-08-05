import { ExpenseCategory, Budget } from '../types';
import { createBudget as apiCreateBudget } from '../services/api/budgets';

/**
 * Creates and saves multiple budgets to the backend
 */
export const saveBudgets = async (
  budgetAmounts: Record<string, string>,
  budgetType: 'monthly' | 'recurring',
  month?: string
): Promise<void> => {
  const createBudgetPromises: Promise<any>[] = [];
  const errors: Error[] = [];
  
  // Process budgets sequentially to avoid race conditions
  for (const [category, amountStr] of Object.entries(budgetAmounts)) {
    if (amountStr.trim() !== '') {
      const amount = parseFloat(amountStr);
      
      if (!isNaN(amount) && amount > 0) {
        try {
          const newBudget = createNewBudget(
            `${category} Budget`,
            category as ExpenseCategory,
            amount,
            budgetType === 'monthly' ? month : undefined,
            budgetType === 'recurring'
          );
          
          try {
            // Process one at a time
            await apiCreateBudget(newBudget);
          } catch (error) {
            console.error(`Error creating budget for ${category}:`, error);
            errors.push(error instanceof Error ? error : new Error(String(error)));
          }
        } catch (error) {
          console.error(`Error preparing budget for ${category}:`, error);
          errors.push(error instanceof Error ? error : new Error(String(error)));
        }
      }
    }
  }
  
  // Check if we had any errors
  if (errors.length > 0) {
    console.error(`Encountered ${errors.length} errors while saving budgets`);
    throw new Error(`Failed to save ${errors.length} budget(s)`);
  }
};

/**
 * Creates a new budget object
 */
export const createNewBudget = (
  name: string, 
  category: ExpenseCategory,
  amount: number,
  month?: string,
  isRecurring: boolean = false
): Omit<Budget, 'id'> & { userId?: string } => {
  // Create the budget object with required fields
  const budget: any = {
    name,
    category,
    amount,
    spent: 0, // New budgets start with 0 spent
    month,
    isRecurring,
    userId: 'user123' // Add explicit userId as a string
    // Don't include _id field - let the backend create it as a string
  };

  return budget;
};
