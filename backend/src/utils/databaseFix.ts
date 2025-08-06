/**
 * Special utilities for database fixes and maintenance
 */
import { v4 as uuidv4 } from 'uuid';
import { getRealm } from '../config/realm';

/**
 * Force fix accounts with missing or invalid IDs
 * This function is more aggressive and will check for _id properties that 
 * may exist but be invalid/unusable
 * 
 * @param userId The user ID for which to fix accounts
 * @returns Number of accounts fixed and a list of fixed accounts
 */
export const forceFixAccountIds = async (userId: string = 'user123') => {
  try {
    const realm = await getRealm();
    let fixedCount = 0;
    const fixedAccounts: any[] = [];
    
    // Get ALL accounts for the user, regardless of ID status
    const allAccounts = realm.objects('Account')
      .filtered('(isDeleted == false) AND (userId == $0)', userId);
    
    console.log(`Found ${allAccounts.length} total accounts for user ${userId}`);
    
    // Fix each account in a write transaction
    realm.write(() => {
      // Process each account
      allAccounts.forEach((account: any) => {
        console.log(`Examining account: ${account.name}, ID: ${account._id || 'missing'}`);
        
        // Check if the account has a valid ID
        const needsIdFix = !account._id || 
                           account._id === '' || 
                           account._id === null || 
                           account._id === undefined ||
                           typeof account._id !== 'string';
        
        if (needsIdFix) {
          // Generate a new UUID
          const newId = uuidv4();
          
          // Force update the _id field
          account._id = newId;
          fixedCount++;
          
          console.log(`Fixed account: "${account.name}" (${account.type}), new ID: ${newId}`);
          
          fixedAccounts.push({
            name: account.name,
            type: account.type, 
            balance: account.balance,
            newId: newId
          });
        } else {
          console.log(`Account "${account.name}" already has valid ID: ${account._id}`);
          
          // Make sure _id is definitely set
          if (account._id) {
            fixedAccounts.push({
              name: account.name,
              type: account.type,
              balance: account.balance,
              existingId: account._id
            });
          }
        }
      });
    });
    
    return {
      totalAccounts: allAccounts.length,
      fixedCount,
      fixedAccounts
    };
  } catch (error) {
    console.error('Error in forceFixAccountIds:', error);
    throw error;
  }
};

/**
 * Force proper conversion from Realm objects to plain JavaScript objects
 * This addresses issues with _id field not being included in object spread operations
 * 
 * @param realmObjects The realm objects to convert
 * @returns Array of plain JavaScript objects with all fields explicitly copied
 */
export const forceRealmToPlain = (realmObjects: any[]): any[] => {
  return realmObjects.map(obj => {
    // First, get all keys from the object
    const keys = Object.keys(obj);
    
    // Create a new plain object with all properties explicitly copied
    const plainObj: any = {};
    
    // Copy all properties, with special handling for _id
    keys.forEach(key => {
      // For _id, ensure it's copied and converted to string if needed
      if (key === '_id' && obj[key]) {
        plainObj[key] = obj[key].toString();
      } else {
        plainObj[key] = obj[key];
      }
    });
    
    // Special fallback for _id if missing
    if (!plainObj._id) {
      plainObj._id = uuidv4();
      console.log(`Generated missing ID for conversion: ${plainObj._id}`);
    }
    
    return plainObj;
  });
};
