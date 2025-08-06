import { Request, Response } from 'express';
import { formatAccountsForResponse } from '../utils/apiFormatters';
import { getRealm } from '../config/realm';

/**
 * Get all expenses/transactions for a specific account
 * This is a dedicated endpoint to make account-specific expense retrieval more reliable
 */
export const getExpensesByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const realm = await getRealm();
    const { accountId } = req.params;
    
    // Get the current user ID
    const userId = req.query.userId as string || 'user123';
    
    if (!accountId) {
      res.status(400).json({ message: 'Account ID is required' });
      return;
    }
    
    // Verify the account exists and belongs to this user
    const account = realm.objectForPrimaryKey('Account', accountId);
    
    if (!account || account.isDeleted) {
      res.status(404).json({ message: 'Account not found or deleted' });
      return;
    }
    
    if (account.userId !== userId) {
      res.status(403).json({ message: 'Access to this account is forbidden' });
      return;
    }
    
    // Format the account for consistency with our API
    const formattedAccount = formatAccountsForResponse(account);
    
    // Get all transactions for this account
    const transactions = realm.objects('Transaction')
      .filtered('accountId == $0 && isDeleted == false && userId == $1', accountId, userId)
      .sorted('date', true);
    
    // Convert to plain objects with explicit ID handling
    const transactionList = Array.from(transactions).map(txn => {
      // Make sure to include both _id and id fields for consistency
      const plainTxn = { ...txn };
      
      if (plainTxn._id && !plainTxn.id) {
        plainTxn.id = plainTxn._id;
      } else if (plainTxn.id && !plainTxn._id) {
        plainTxn._id = plainTxn.id;
      }
      
      return plainTxn;
    });
    
    // Return both the account details and its transactions
    res.status(200).json({
      account: formattedAccount,
      transactions: transactionList
    });
  } catch (error) {
    console.error(`Error fetching expenses for account ${req.params.accountId}:`, error);
    res.status(500).json({ message: 'Failed to fetch expenses for account', error: (error as Error).message });
  }
};
