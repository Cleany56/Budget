import { Expense, AccountSummary } from '../types';

export interface TransactionSection {
  title: string;
  data: Expense[];
}

/**
 * Filters, slices, and groups transactions for display.
 * @param expenses All expenses (pre-filtered if needed)
 * @param accounts All accounts
 * @param maxCount Max number of transactions to show (default 25, pass expenses.length to show all)
 * @returns Array of sections, each with a title (date string) and data (Expense[])
 */
export function getDisplayTransactionSections(
  expenses: Expense[],
  accounts: AccountSummary[],
  maxCount = 25
): TransactionSection[] {
  // Only include expenses from Checking and Credit Card accounts
  const allowedAccountIds = accounts
    .filter(acc => acc.type === 'Checking' || acc.type === 'Credit Card')
    .map(acc => acc.id);
  const filteredExpenses = expenses.filter(
    exp => exp.accountId && allowedAccountIds.includes(exp.accountId)
  );
  // Sort by date descending so most recent is first
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const latestTransactions = sortedExpenses.slice(0, maxCount);

  // Group transactions by date (Month DD, YYYY)
  const groupedByDate: TransactionSection[] = [];
  latestTransactions.forEach((expense) => {
    let dateObj = expense.date instanceof Date ? expense.date : new Date(expense.date);
    // Use ISO date string for grouping to avoid locale issues
    const groupKey = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
    let section = groupedByDate.find((g) => g.title === groupKey);
    if (!section) {
      section = { title: groupKey, data: [] };
      groupedByDate.push(section);
    }
    section.data.push(expense);
  });
  // Convert groupKey to display string (Month DD, YYYY)
  return groupedByDate.map(section => {
    const [year, month, day] = section.title.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    return {
      title: dateObj.toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' }),
      data: section.data,
    };
  });
}
