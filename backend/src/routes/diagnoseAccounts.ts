/**
 * Diagnostic routes for troubleshooting account-related issues
 */
import express from 'express';
import { getRealm } from '../config/realm';
import { formatAccountsForResponse } from '../utils/apiFormatters';
import { normalizeAccountType } from '../utils/normalization';

const router = express.Router();

/**
 * Endpoint to diagnose account issues, particularly related to types and IDs
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string || '1'; // Default to user ID '1'
    const realm = await getRealm();
    
    // Get all accounts for the user
    const accounts = realm.objects('Account')
      .filtered('userId == $0 AND isDeleted == false', userId);
    
    const accountDiagnostics = Array.from(accounts).map((account: any) => {
      const normalizedType = normalizeAccountType(account.type);
      
      // Check if this account is valid for transactions
      const isValidForTransactions = 
        normalizedType === 'Checking' || 
        normalizedType === 'Savings' || 
        normalizedType === 'Bank' || 
        normalizedType === 'Credit Card';
      
      return {
        id: account._id,
        name: account.name,
        originalType: account.type,
        normalizedType,
        hasId: !!account._id,
        validForTransactions: isValidForTransactions,
        balance: account.balance,
        currency: account.currency
      };
    });
    
    // Get statistics
    const stats = {
      totalAccounts: accountDiagnostics.length,
      validForTransactions: accountDiagnostics.filter(a => a.validForTransactions).length,
      invalidForTransactions: accountDiagnostics.filter(a => !a.validForTransactions).length,
      typeCounts: {} as Record<string, number>,
      normalizedTypeCounts: {} as Record<string, number>
    };
    
    // Count types
    accountDiagnostics.forEach(account => {
      // Count original types
      if (!stats.typeCounts[account.originalType]) {
        stats.typeCounts[account.originalType] = 1;
      } else {
        stats.typeCounts[account.originalType]++;
      }
      
      // Count normalized types
      if (!stats.normalizedTypeCounts[account.normalizedType]) {
        stats.normalizedTypeCounts[account.normalizedType] = 1;
      } else {
        stats.normalizedTypeCounts[account.normalizedType]++;
      }
    });
    
    res.status(200).json({
      diagnostics: accountDiagnostics,
      stats
    });
  } catch (error) {
    console.error('Error in diagnoseAccounts:', error);
    res.status(500).json({ 
      message: 'Failed to diagnose accounts', 
      error: (error as Error).message 
    });
  }
});

export default router;
