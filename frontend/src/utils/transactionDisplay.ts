import { Expense } from '../types';

export interface DisplayTransaction {
  id: string;
  merchant: string;
  type: string;
  amount: number;
  isExpense: boolean;
  sign: string;
}




/**
 * Maps an Expense (or Plaid-style transaction) to a display-ready transaction object.
 * Handles Plaid fields and fallback to Expense fields.
 */
export function mapToDisplayTransaction(item: Expense | any): DisplayTransaction {
  const isExpense = typeof item.amount === 'number' ? item.amount < 0 : false;
  const sign = isExpense ? '-' : '+';
  // Use category as type for icon mapping, but infer special types for 'Other' category
  let type: string;
  if (item.category && String(item.category).toLowerCase() === 'other') {
    const title = (item.title || '').toLowerCase();
    const notes = (item.notes || '').toLowerCase();
    if (title.includes('salary') || title.includes('payroll') || notes.includes('salary') || notes.includes('payroll') || title.includes('interest') || notes.includes('interest') || title.includes('bonus') || notes.includes('bonus')) {
      type = 'income';
    } else if (title.includes('credit') || notes.includes('credit') || title.includes('cashback') || notes.includes('cashback') || title.includes('fee') || notes.includes('fee')) {
      type = 'credit';
    } else if (title.includes('saving') || notes.includes('saving') || title.includes('deposit') || notes.includes('deposit')) {
      type = 'savings';
    } else {
      type = 'other';
    }
  } else {
    type = item.category ? String(item.category).toLowerCase() : (isExpense ? 'expense' : 'income');
  }
  const merchant = item?.merchant || item.title || 'Transaction';
  return {
    id: item.id,
    merchant,
    type: type,
    amount: Math.abs(item.amount),
    isExpense,
    sign,
  };
}
