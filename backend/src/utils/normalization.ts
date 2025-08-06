/**
 * Utilities to normalize data between frontend and backend
 */

/**
 * Normalizes account types to ensure consistent casing and formatting
 * @param accountType The account type string to normalize
 * @returns The normalized account type
 */
export const normalizeAccountType = (accountType: string): string => {
  // First convert to lowercase
  const lowerType = accountType.toLowerCase();
  
  // Map normalized types
  switch (lowerType) {
    case 'checking':
      return 'Checking';
    case 'savings':
      return 'Savings';
    case 'credit card':
    case 'creditcard':
    case 'credit':
      return 'Credit Card';
    case 'bank':
      return 'Bank';
    case 'investment':
      return 'Investment';
    default:
      // If unknown, return the original with first letter capitalized
      return accountType.charAt(0).toUpperCase() + accountType.slice(1);
  }
};
