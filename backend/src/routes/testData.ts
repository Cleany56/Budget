import express from 'express';
import { ObjectId } from 'mongodb';
import { getRealm } from '../config/realm';

const router = express.Router();

/**
 * Add test data routes
 */

// POST /api/test-data/add-checking-account - Add a test checking account
router.post('/add-checking-account', async (req, res) => {
  try {
    const realm = await getRealm();
    const userId = 'user123'; // Default test user

    // Create a new checking account
    const accountId = new ObjectId();
    
    realm.write(() => {
      realm.create('Account', {
        _id: accountId.toString(),
        name: 'Test Checking Account',
        type: 'checking',
        balance: 5000.00,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isDeleted: false
      });
    });

    // Add a few test transactions for this account
    realm.write(() => {
      // Deposit
      realm.create('Transaction', {
        _id: new ObjectId().toString(),
        title: 'Initial Deposit',
        amount: 5000.00,
        date: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
        category: 'income',
        notes: 'Starting balance',
        accountId: accountId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isDeleted: false
      });

      // Coffee expense
      realm.create('Transaction', {
        _id: new ObjectId().toString(),
        title: 'Coffee Shop',
        amount: -4.50,
        date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
        category: 'food',
        notes: 'Morning coffee',
        accountId: accountId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isDeleted: false
      });

      // Grocery expense
      realm.create('Transaction', {
        _id: new ObjectId().toString(),
        title: 'Grocery Store',
        amount: -65.87,
        date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
        category: 'groceries',
        notes: 'Weekly groceries',
        accountId: accountId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        isDeleted: false
      });
    });

    // Get the new account to return
    const newAccount = realm.objectForPrimaryKey('Account', accountId.toString());
    
    res.status(201).json({
      message: 'Test checking account added successfully',
      account: newAccount
    });
  } catch (error) {
    console.error('Error adding test checking account:', error);
    res.status(500).json({ message: 'Failed to add test data', error });
  }
});

// POST /api/test-data/reset - Clear all test data
router.post('/reset', async (req, res) => {
  try {
    const realm = await getRealm();
    const userId = 'user123'; // Default test user
    
    realm.write(() => {
      // Soft delete all accounts for this user
      const accounts = realm.objects('Account').filtered('userId == $0', userId);
      accounts.forEach(account => {
        account.isDeleted = true;
        account.updatedAt = new Date();
      });
      
      // Soft delete all transactions for this user
      const transactions = realm.objects('Transaction').filtered('userId == $0', userId);
      transactions.forEach(transaction => {
        transaction.isDeleted = true;
        transaction.updatedAt = new Date();
      });
      
      // Soft delete all budgets for this user
      const budgets = realm.objects('Budget').filtered('userId == $0', userId);
      budgets.forEach(budget => {
        budget.isDeleted = true;
        budget.updatedAt = new Date();
      });
      
      // Soft delete all goals for this user
      const goals = realm.objects('Goal').filtered('userId == $0', userId);
      goals.forEach(goal => {
        goal.isDeleted = true;
        goal.updatedAt = new Date();
      });
    });
    
    res.status(200).json({ message: 'All test data reset successfully' });
  } catch (error) {
    console.error('Error resetting test data:', error);
    res.status(500).json({ message: 'Failed to reset test data', error });
  }
});

export default router;
