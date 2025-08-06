/**
 * API response utilities for ensuring consistent data formats
 */

/**
 * Format account objects to ensure they have both id and _id fields
 * This handles inconsistent field naming in the database vs. API expectations
 * 
 * @param accounts One or more account objects to format
 * @returns The formatted account objects with consistent ID fields
 */
export const formatAccountsForResponse = (accounts: any | any[]): any | any[] => {
  // Handle both single account and array of accounts
  if (!Array.isArray(accounts)) {
    return formatSingleAccountForResponse(accounts);
  }
  
  // Format each account in the array
  return accounts.map(formatSingleAccountForResponse);
};

/**
 * Format a single account object to ensure it has both id and _id fields
 * 
 * @param account The account object to format
 * @returns The formatted account object with consistent ID fields
 */
function formatSingleAccountForResponse(account: any): any {
  // If account is null or undefined, return as is
  if (!account) return account;
  
  const formatted = { ...account };
  
  // Import normalization utility
  const { normalizeAccountType } = require('./normalization');
  
  // Normalize account type if present
  if (formatted.type) {
    const originalType = formatted.type;
    formatted.type = normalizeAccountType(originalType);
    
    // Log if there was a change
    if (formatted.type !== originalType) {
      console.log(`Normalized account type from "${originalType}" to "${formatted.type}" for account "${formatted.name}"`);
    }
  }
  
  // Ensure both _id and id fields exist
  if (formatted._id && !formatted.id) {
    // If _id exists but id doesn't, copy _id to id
    formatted.id = formatted._id;
    console.log(`Added id field from _id for account "${formatted.name}"`);
  } else if (formatted.id && !formatted._id) {
    // If id exists but _id doesn't, copy id to _id
    formatted._id = formatted.id;
    console.log(`Added _id field from id for account "${formatted.name}"`);
  } else if (!formatted._id && !formatted.id) {
    // If neither exists (should not happen at this point), log an error
    console.error(`CRITICAL: Account "${formatted.name}" is missing both id and _id fields!`);
  }
  
  return formatted;
}
