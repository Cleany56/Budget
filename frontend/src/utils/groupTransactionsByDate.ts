import { Expense } from '../types';

export interface TransactionSection {
  title: string;
  data: Expense[];
}

/**
 * Groups an array of Expense objects by their exact date (Month DD, YYYY).
 * @param transactions Array of Expense objects
 * @returns Array of sections, each with a title (date string) and data (Expense[])
 */
export function groupTransactionsByDate(transactions: Expense[]): TransactionSection[] {
  const groupedByDate: TransactionSection[] = [];
  transactions.forEach((expense) => {
    let dateObj = expense.date instanceof Date ? expense.date : new Date(expense.date);
    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' });
    let section = groupedByDate.find((g) => g.title === dateStr);
    if (!section) {
      section = { title: dateStr, data: [] };
      groupedByDate.push(section);
    }
    section.data.push(expense);
  });
  return groupedByDate;
}
