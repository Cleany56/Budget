import { useState, useCallback, useEffect } from 'react';
import { Expense, AccountSummary, Budget, Goal } from '../types';
import { 
  getTransactions, 
  getAccounts, 
  getLatestBudgets as apiGetLatestBudgets,
  getLatestGoals as apiGetLatestGoals 
} from '../services/api';
import { checkApiStatus } from '../services/api/status';

interface DataState {
  expenses: Expense[];
  accounts: AccountSummary[];
  budgets: Budget[];
  goals: Goal[];
}

interface LoadingState {
  expenses: boolean;
  accounts: boolean;
  budgets: boolean;
  goals: boolean;
}

interface ErrorState {
  expenses: string | null;
  accounts: string | null;
  budgets: string | null;
  goals: string | null;
}

/**
 * Custom hook for handling data fetching for the home screen
 */
export const useHomeData = () => {
  // State for data from API
  const [data, setData] = useState<DataState>({
    expenses: [],
    accounts: [],
    budgets: [],
    goals: []
  });
  
  // API connectivity state
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState<LoadingState>({
    expenses: true,
    accounts: true,
    budgets: true,
    goals: true
  });
  
  // Error states
  const [error, setError] = useState<ErrorState>({
    expenses: null,
    accounts: null,
    budgets: null,
    goals: null
  });
  
  // Load data from API - memoized with useCallback to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    // Reset loading states
    setLoading({
      expenses: true,
      accounts: true,
      budgets: true,
      goals: true
    });
    
    // Clear previous errors
    setError({
      expenses: null,
      accounts: null,
      budgets: null,
      goals: null
    });
    
    // First check if the API is online
    try {
      const isOnline = await checkApiStatus();
      setApiOnline(isOnline);
      
      if (!isOnline) {
        const offlineError = "Backend server is offline. Please check your connection.";
        setError({
          expenses: offlineError,
          accounts: offlineError,
          budgets: offlineError,
          goals: offlineError
        });
        setLoading({
          expenses: false,
          accounts: false,
          budgets: false,
          goals: false
        });
        return;
      }
    } catch (err) {
      console.error("Failed to check API status:", err);
      setApiOnline(false);
      
      const offlineError = "Could not connect to backend server.";
      setError({
        expenses: offlineError,
        accounts: offlineError,
        budgets: offlineError,
        goals: offlineError
      });
      setLoading({
        expenses: false,
        accounts: false,
        budgets: false,
        goals: false
      });
      return;
    }
    
    // API is online, fetch expenses
    getTransactions()
      .then(expenses => {
        setData(prev => ({ ...prev, expenses }));
        setLoading(prev => ({ ...prev, expenses: false }));
      })
      .catch(err => {
        console.error('Failed to load transactions:', err);
        setError(prev => ({ 
          ...prev, 
          expenses: "Could not load transactions. Please try again." 
        }));
        setLoading(prev => ({ ...prev, expenses: false }));
      });
      
    // Fetch accounts (explicitly disable auto-fixing)
    getAccounts(false)
      .then(accounts => {
        console.log('Accounts fetched successfully:', accounts);
        setData(prev => {
          console.log('Previous accounts state:', prev.accounts);
          console.log('New accounts state:', accounts);
          return { ...prev, accounts };
        });
        setLoading(prev => ({ ...prev, accounts: false }));
      })
      .catch(err => {
        console.error('Failed to load accounts:', err);
        setError(prev => ({ 
          ...prev, 
          accounts: "Could not load accounts. Please try again." 
        }));
        setLoading(prev => ({ ...prev, accounts: false }));
      });
      
    // Fetch budgets
    apiGetLatestBudgets(3)
      .then(budgets => {
        setData(prev => ({ ...prev, budgets }));
        setLoading(prev => ({ ...prev, budgets: false }));
      })
      .catch(err => {
        console.error('Failed to load budgets:', err);
        setError(prev => ({ 
          ...prev, 
          budgets: "Could not load budgets. Please try again." 
        }));
        setLoading(prev => ({ ...prev, budgets: false }));
      });
      
    // Fetch goals
    apiGetLatestGoals(2)
      .then(goals => {
        setData(prev => ({ ...prev, goals }));
        setLoading(prev => ({ ...prev, goals: false }));
      })
      .catch(err => {
        console.error('Failed to load goals:', err);
        setError(prev => ({ 
          ...prev, 
          goals: "Could not load goals. Please try again." 
        }));
        setLoading(prev => ({ ...prev, goals: false }));
      });
  }, []);

  // Helper to check if any data is still loading
  const isAnyLoading = Object.values(loading).some(Boolean);
  
  return {
    data,
    loading,
    error,
    apiOnline,
    isAnyLoading,
    loadData,
  };
};
