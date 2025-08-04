/**
 * Formats a string as currency by removing non-numeric characters and limiting decimal places
 */
export const formatCurrency = (value: string): string => {
  // Remove any non-digit characters except decimal point
  let cleanValue = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const decimalPointIndex = cleanValue.indexOf('.');
  if (decimalPointIndex !== -1) {
    const beforeDecimal = cleanValue.substring(0, decimalPointIndex);
    const afterDecimal = cleanValue.substring(decimalPointIndex + 1);
    // Limit to 2 decimal places
    cleanValue = beforeDecimal + '.' + afterDecimal.replace(/\./g, '').substring(0, 2);
  }
  
  return cleanValue;
};

/**
 * Formats a string as an interest rate, removing non-numeric characters and capping at 100%
 */
export const formatInterestRate = (value: string): string => {
  // Remove any non-digit characters except decimal point
  let cleanValue = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const decimalPointIndex = cleanValue.indexOf('.');
  if (decimalPointIndex !== -1) {
    const beforeDecimal = cleanValue.substring(0, decimalPointIndex);
    const afterDecimal = cleanValue.substring(decimalPointIndex + 1);
    // Limit to 2 decimal places
    cleanValue = beforeDecimal + '.' + afterDecimal.replace(/\./g, '').substring(0, 2);
  }
  
  // Ensure value is not greater than 100
  if (parseFloat(cleanValue) > 100) {
    cleanValue = '100';
  }
  
  return cleanValue;
};

/**
 * Formats a string as a whole number by removing all non-numeric characters
 */
export const formatWholeNumber = (value: string): string => {
  // Remove any non-digit characters
  return value.replace(/[^0-9]/g, '');
};
