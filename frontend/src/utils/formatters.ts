import { TextInput } from 'react-native';

/**
 * Formats a number as currency with proper formatting
 * @param value The number to format
 * @param currency The currency symbol to use, defaults to USD ($)
 * @returns A formatted string representing the currency value
 */
export const formatAsCurrency = (value: number | string, currency: string = '$'): string => {
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // If it's not a number, return 0.00
  if (isNaN(numValue)) {
    return `${currency}0.00`;
  }
  
  // Format the number with 2 decimal places and thousands separators
  const formatted = numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${currency}${formatted}`;
};

/**
 * Normalizes currency input by removing non-numeric characters
 * @param value The currency string to normalize
 * @returns A numeric string that can be parsed
 */
export const normalizeCurrencyInput = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  let normalized = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = normalized.split('.');
  if (parts.length > 2) {
    normalized = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts.length > 1 && parts[1].length > 2) {
    normalized = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return normalized;
};

/**
 * Handle text input for currency fields
 * @param text The entered text
 * @param setter The state setter function
 */
export const handleCurrencyInput = (
  text: string, 
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  const normalized = normalizeCurrencyInput(text);
  setter(normalized);
};

/**
 * Format currency value for display when focus is lost
 * @param value The current value
 * @param setter The state setter function
 */
export const formatCurrencyOnBlur = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!value) {
    setter('');
    return;
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    setter('');
    return;
  }
  
  // Format with commas for thousands
  const formatted = numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  setter(formatted);
};
