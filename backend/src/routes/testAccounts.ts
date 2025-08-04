import express from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';

const router = express.Router();

/**
 * Test commands for account management in development
 */
router.post('/add-test-accounts', async (req, res) => {
  try {
    const realm = await getRealm();
    const userId = req.query.userId as string || 'user123'; // Use query param or default test user
    
    // Array of test accounts to create
    const testAccounts = [
      {
        _id: new ObjectId().toString(),
        name: 'Primary Checking',
        type: 'checking', // lowercase type
        balance: 2500.75,
        currency: 'USD',
      },
      {
        _id: new ObjectId().toString(),
        name: 'High-Yield Savings',
        type: 'savings', // lowercase type
        balance: 10000.00,
        currency: 'USD',
      },
      {
        _id: new ObjectId().toString(),
        name: 'Visa Credit Card',
        type: 'credit card', // lowercase with space
        balance: -1250.50,
        currency: 'USD',
      },
      {
        _id: new ObjectId().toString(),
        name: 'Retirement Fund',
        type: 'investment', // lowercase type
        balance: 45000.00,
        currency: 'USD',
      }
    ];

    // Create all accounts in a single write transaction
    realm.write(() => {
      testAccounts.forEach(account => {
        realm.create('Account', {
          _id: account._id,
          name: account.name,
          type: account.type,
          balance: account.balance,
          currency: account.currency,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          isDeleted: false
        });
      });
    });
    
    res.status(201).json({
      message: 'Test accounts added successfully',
      accounts: testAccounts
    });
  } catch (error) {
    console.error('Error adding test accounts:', error);
    res.status(500).json({ message: 'Failed to add test accounts', error });
  }
});

/**
 * Clear all accounts (for testing)
 */
router.post('/clear-accounts', async (req, res) => {
  try {
    const realm = await getRealm();
    const userId = req.query.userId as string || 'user123'; // Use query param or default test user
    
    // Soft delete all accounts by marking them as deleted
    realm.write(() => {
      const accounts = realm.objects('Account').filtered('userId == $0', userId);
      accounts.forEach(account => {
        account.isDeleted = true;
      });
    });
    
    res.status(200).json({
      message: 'All accounts have been cleared (marked as deleted)',
      deletedCount: realm.objects('Account').filtered('isDeleted == true AND userId == $0', userId).length
    });
  } catch (error) {
    console.error('Error clearing accounts:', error);
    res.status(500).json({ message: 'Failed to clear accounts', error });
  }
});

export default router;
