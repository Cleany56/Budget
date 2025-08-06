import express from 'express';
import { forceFixAccountIds } from '../utils/databaseFix';
import { getRealm } from '../config/realm';

const router = express.Router();

/**
 * Special route dedicated to fixing account IDs
 * This is separate from the main accounts routes to avoid conflicts
 */
router.get('/', async (req, res) => {
  console.log('Fix accounts endpoint called - using force fix');
  
  try {
    // In a real app, this would come from authentication middleware
    const userId = req.query.userId as string || 'user123'; // Default to user ID 'user123'
    
    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    
    // Use the new force fix function for a more thorough fix
    const result = await forceFixAccountIds(userId);
    
    console.log(`FORCE FIX RESULTS: Fixed ${result.fixedCount} of ${result.totalAccounts} accounts`);
    
    // If no accounts were fixed but some exist, check if they are accessible
    if (result.fixedCount === 0 && result.totalAccounts > 0) {
      console.log('No accounts needed fixing, verifying they are accessible...');
      
      // Try to access all accounts to verify they are working
      const realm = await getRealm();
      const accounts = realm.objects('Account')
        .filtered('(isDeleted == false) AND (userId == $0)', userId);
      
      // Print details of all accounts
      console.log('ACCOUNT VERIFICATION:');
      const verifiedAccounts = Array.from(accounts).map((acc: any, index: number) => {
        console.log(`Account ${index + 1}: ID=${acc._id || 'undefined'}, Name=${acc.name}, Type=${acc.type}`);
        return {
          name: acc.name,
          type: acc.type,
          _id: acc._id || 'undefined'
        };
      });
      
      // Return the verification results
      res.status(200).json({ 
        message: `Verified ${verifiedAccounts.length} accounts for user ${userId}`,
        fixedCount: result.fixedCount,
        totalAccounts: result.totalAccounts,
        verifiedAccounts,
        success: true
      });
      return;
    }
    
    // Return the number of accounts that were fixed
    res.status(200).json({ 
      message: `Fixed ${result.fixedCount} accounts with missing IDs for user ${userId}`,
      fixedCount: result.fixedCount,
      totalAccounts: result.totalAccounts,
      fixedAccounts: result.fixedAccounts,
      success: true
    });
  } catch (error: any) {
    console.error('Error fixing accounts:', error);
    res.status(500).json({ 
      message: 'Error fixing accounts', 
      error: error.message,
      success: false
    });
  }
});

export default router;
