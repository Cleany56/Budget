import express from 'express';
import { AccountController } from '../controllers/accounts';

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

// GET /api/accounts/:id - Get an account by ID
router.get('/:id', (req, res) => accountController.getAccountById(req, res));

// POST /api/accounts - Create a new account
router.post('/', (req, res) => accountController.createAccount(req, res));

// PUT /api/accounts/:id - Update an existing account
router.put('/:id', (req, res) => accountController.updateAccount(req, res));

// DELETE /api/accounts/:id - Delete an account
router.delete('/:id', (req, res) => accountController.deleteAccount(req, res));

export default router;
