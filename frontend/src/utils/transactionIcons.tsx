// Centralized SVG icon mapping for transaction types
import GroceryIcon from '../../assets/icons/grocery.svg';
import MovieIcon from '../../assets/icons/movie.svg';
import GasIcon from '../../assets/icons/gas.svg';
import IncomeIcon from '../../assets/icons/income.svg';
import ShoppingIcon from '../../assets/icons/shopping.svg';
import CreditIcon from '../../assets/icons/credit.svg';
import SavingsIcon from '../../assets/icons/savings.svg';
import PlaceholderIcon from '../../assets/icons/placeholder.svg';

export function getTransactionIconComponent(type: string): React.ComponentType<any> {
  const key = type?.toLowerCase() || '';
  if (key.includes('food') || key.includes('grocery')) return GroceryIcon;
  if (key.includes('entertainment') || key.includes('movie')) return MovieIcon;
  if (key.includes('transport') || key.includes('gas')) return GasIcon;
  if (key.includes('income') || key.includes('payroll')) return IncomeIcon;
  if (key.includes('shopping')) return ShoppingIcon;
  if (key.includes('credit')) return CreditIcon;
  if (key.includes('savings')) return SavingsIcon;
  return PlaceholderIcon;
}
