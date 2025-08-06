import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AccountController } from '../controllers/accounts';
import { getRealm } from '../config/realm';

const router = express.Router();
const accountController = new AccountController();

/**
 * Account routes
 */

// GET /api/accounts - Get all accounts
router.get('/', (req, res) => accountController.getAllAccounts(req, res));

// GET /api/accounts/by-type - Get accounts grouped by type
router.get('/by-type', (req, res) => accountController.getAccountsByType(req, res));

// GET /api/accounts/total-balance - Get total balance across all accounts
router.get('/total-balance', (req, res) => accountController.getTotalBalance(req, res));

// Maintenance endpoint to fix accounts with missing IDs
router.get('/fix-accounts', (req, res) => accountController.fixAccountsWithMissingIds(req, res));

// Legacy maintenance endpoint kept for backwards compatibility
router.get('/manual-fix-accounts', async (req, res) => {
  try {
    const realm = await getRealm();
    let fixedCount = 0;
    
    realm.write(() => {
      // Find all accounts without IDs
      const accountsWithoutIds = realm.objects('Account')
        .filtered('_id == null OR _id == ""');
      
      console.log(`Found ${accountsWithoutIds.length} accounts without IDs`);
      
      // Fix each account
      accountsWithoutIds.forEach((account: any) => {
        account._id = uuidv4();
        fixedCount++;
        console.log(`Fixed account: ${account.name}, new ID: ${account._id}`);
      });
    });
    
    res.status(200).json({ 
      message: `Fixed ${fixedCount} accounts with missing IDs`,
      fixedCount
    });
  } catch (error: any) {
    console.error('Error fixing accounts:', error);
    res.status(500).json({ 
      message: 'Error fixing accounts', 
      error: error.message 
    });
  }
});

// GET /api/accounts/:id - Get an account by ID
router.get('/:id', (req, res) => accountController.getAccountById(req, res));

// POST /api/accounts - Create a new account
router.post('/', (req, res) => accountController.createAccount(req, res));

// PUT /api/accounts/:id - Update an existing account
router.put('/:id', (req, res) => accountController.updateAccount(req, res));

// DELETE /api/accounts/:id - Delete an account
router.delete('/:id', (req, res) => accountController.deleteAccount(req, res));

// Legacy maintenance endpoint kept for backwards compatibility
router.get('/manual-fix-accounts', async (req, res) => {
  try {
    const realm = await getRealm();
    let fixedCount = 0;
    
    realm.write(() => {
      // Find all accounts without IDs
      const accountsWithoutIds = realm.objects('Account')
        .filtered('_id == null OR _id == ""');
      
      console.log(`Found ${accountsWithoutIds.length} accounts without IDs`);
      
      // Fix each account
      accountsWithoutIds.forEach((account: any) => {
        account._id = uuidv4();
        fixedCount++;
        console.log(`Fixed account: ${account.name}, new ID: ${account._id}`);
      });
    });
    
    res.status(200).json({ 
      message: `Fixed ${fixedCount} accounts with missing IDs`,
      fixedCount
    });
  } catch (error: any) {
    console.error('Error fixing accounts:', error);
    res.status(500).json({ 
      message: 'Error fixing accounts', 
      error: error.message 
    });
  }
});

export default router;
