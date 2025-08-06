import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getRealm } from './config/realm';
import accountRoutes from './routes/accounts';
import expenseRoutes from './routes/expenses';
import budgetRoutes from './routes/budgets';
import goalRoutes from './routes/goals';
import testDataRoutes from './routes/testData';
import testAccountsRoutes from './routes/testAccounts';
import fixAccountsRoutes from './routes/fixAccounts';
import diagnoseAccountsRoutes from './routes/diagnoseAccounts';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/accounts', accountRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/test-data', testDataRoutes);
app.use('/api/test-accounts', testAccountsRoutes);
app.use('/api/fix-accounts', fixAccountsRoutes); // Dedicated route for fixing accounts
app.use('/api/diagnose-accounts', diagnoseAccountsRoutes); // Diagnostic route for accounts
app.use('/api/diagnose-accounts', diagnoseAccountsRoutes); // Diagnostic endpoint for accounts

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Initialize Realm database connection
const startServer = async () => {
  try {
    // Initialize Realm
    await getRealm();
    console.log('Connected to Realm database');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  try {
    console.log('Shutting down gracefully...');
    // Close database connections
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();

export default app;
