import { Request, Response } from 'express';
import { AccountRepository, CreateAccountDto, UpdateAccountDto } from '../repositories/accountRepository';
import { formatAccountsForResponse } from '../utils/apiFormatters';

// Initialize repository
const accountRepository = new AccountRepository();

/**
 * Account controller - handles HTTP requests for account operations
 */
export class AccountController {
  /**
   * Fix any accounts with missing IDs for the current user
   * This is a maintenance endpoint to help recover from data integrity issues
   */
  async fixAccountsWithMissingIds(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      console.log(`Attempting to fix accounts for user ${userId}`);
      const fixedCount = await accountRepository.fixAccountsWithMissingIds(userId);
      
      // Return the number of accounts that were fixed
      res.status(200).json({ 
        message: `Fixed ${fixedCount} accounts with missing IDs`,
        fixedCount 
      });
    } catch (error) {
      console.error('Error in fixAccountsWithMissingIds:', error);
      res.status(500).json({ message: 'Failed to fix accounts', error: (error as Error).message });
    }
  }
  
  /**
   * Get all accounts for the current user
   */
  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, this would come from authentication middleware
      // For now, we'll use a query parameter or a default user ID
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const accounts = await accountRepository.getAllAccounts(userId);
      
      // Format accounts to ensure consistent ID fields
      const formattedAccounts = formatAccountsForResponse(accounts);
      
      // Add logging to verify account objects have IDs
      console.log(`Returning ${formattedAccounts.length} accounts to client`);
      formattedAccounts.forEach((account: any, index: number) => {
        console.log(`Account ${index + 1}: ID=${account._id || account.id || 'missing'}, Name=${account.name}, Type=${account.type}`);
        console.log(`  - _id field: ${account._id ? 'present' : 'MISSING'}`);
        console.log(`  - id field: ${account.id ? 'present' : 'MISSING'}`);
        
        // Check for missing IDs and add warning
        if (!account._id && !account.id) {
          console.warn(`WARNING: Account "${account.name}" has no ID fields!`);
        }
      });
      
      res.status(200).json(formattedAccounts);
    } catch (error) {
      console.error('Error in getAllAccounts:', error);
      res.status(500).json({ message: 'Failed to retrieve accounts', error: (error as Error).message });
    }
  }
  
  /**
   * Get an account by ID for the current user
   */
  async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const account = await accountRepository.getAccountById(id, userId);
      
      if (!account) {
        res.status(404).json({ message: `Account with ID ${id} not found` });
        return;
      }
      
      // Format account to ensure consistent ID fields
      const formattedAccount = formatAccountsForResponse(account);
      
      // Log ID fields for debugging
      console.log(`Returning account "${formattedAccount.name}" with ID fields:`);
      console.log(`  - _id: ${formattedAccount._id || 'MISSING'}`);
      console.log(`  - id: ${formattedAccount.id || 'MISSING'}`);
      
      res.status(200).json(formattedAccount);
    } catch (error) {
      console.error(`Error in getAccountById for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to retrieve account', error: (error as Error).message });
    }
  }
  
  /**
   * Create a new account for the current user
   */
  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountData: CreateAccountDto = req.body;
      
      // Basic validation
      if (!accountData.name || !accountData.type) {
        res.status(400).json({ message: 'Name and type are required for creating an account' });
        return;
      }
      
      // First check if userId is in the body, then in query params
      // In a real app, this would come from authentication middleware
      const userId = accountData.userId || req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      // Log for debugging
      console.log(`Creating account for user: ${userId}`, accountData);
      
      const newAccount = await accountRepository.createAccount(accountData, userId);
      
      // Format account to ensure consistent ID fields
      const formattedAccount = formatAccountsForResponse(newAccount);
      
      // Log created account with ID field information
      console.log('Account created successfully:', formattedAccount);
      console.log(`Account ID fields: _id=${formattedAccount._id || 'missing'}, id=${formattedAccount.id || 'missing'}`);
      
      res.status(201).json(formattedAccount);
    } catch (error) {
      console.error('Error in createAccount:', error);
      res.status(500).json({ message: 'Failed to create account', error: (error as Error).message });
    }
  }
  
  /**
   * Update an existing account for the current user
   */
  async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateAccountDto = req.body;
      
      // Check for empty update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided' });
        return;
      }
      
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const updatedAccount = await accountRepository.updateAccount(id, updateData, userId);
      
      if (!updatedAccount) {
        res.status(404).json({ message: `Account with ID ${id} not found` });
        return;
      }
      
      // Format account to ensure consistent ID fields
      const formattedAccount = formatAccountsForResponse(updatedAccount);
      
      // Log updated account with ID field information
      console.log(`Updated account "${formattedAccount.name}" with ID fields:`);
      console.log(`  - _id: ${formattedAccount._id || 'MISSING'}`);
      console.log(`  - id: ${formattedAccount.id || 'MISSING'}`);
      
      res.status(200).json(formattedAccount);
    } catch (error) {
      console.error(`Error in updateAccount for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to update account', error: (error as Error).message });
    }
  }
  
  /**
   * Delete an account for the current user
   */
  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const result = await accountRepository.deleteAccount(id, userId);
      
      if (!result) {
        res.status(404).json({ message: `Account with ID ${id} not found or already deleted` });
        return;
      }
      
      res.status(200).json({ message: `Account with ID ${id} successfully deleted` });
    } catch (error) {
      console.error(`Error in deleteAccount for ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete account', error: (error as Error).message });
    }
  }
  
  /**
   * Get accounts grouped by type for the current user
   */
  async getAccountsByType(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const accountsByType = await accountRepository.getAccountsByType(userId);
      res.status(200).json(accountsByType);
    } catch (error) {
      console.error('Error in getAccountsByType:', error);
      res.status(500).json({ message: 'Failed to retrieve accounts by type', error: (error as Error).message });
    }
  }
  
  /**
   * Get total balance across all accounts for the current user
   */
  async getTotalBalance(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, this would come from authentication middleware
      const userId = req.query.userId as string || '1'; // Default to user ID '1'
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const totalBalance = await accountRepository.getTotalBalance(userId);
      res.status(200).json({ totalBalance });
    } catch (error) {
      console.error('Error in getTotalBalance:', error);
      res.status(500).json({ message: 'Failed to calculate total balance', error: (error as Error).message });
    }
  }
}
