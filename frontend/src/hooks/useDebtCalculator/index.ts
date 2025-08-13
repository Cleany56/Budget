import { useState, useEffect } from 'react';
import { 
  DebtItem, 
  RepaymentMethod, 
  CalculationMode, 
  MonthRecord 
} from '../../types/debtTypes';
import { calculateDebtRepayment } from '../../services/debtCalculator';

interface UseDebtCalculatorResult {
  // Debt items state
  debts: DebtItem[];
  addDebt: (newDebt: Omit<DebtItem, 'id'>) => void;
  removeDebt: (id: string) => void;
  
  // New debt form state
  newDebtName: string;
  newDebtBalance: string;
  newDebtInterestRate: string;
  newDebtMinPayment: string;
  setNewDebtName: (value: string) => void;
  setNewDebtBalance: (value: string) => void;
  setNewDebtInterestRate: (value: string) => void;
  setNewDebtMinPayment: (value: string) => void;
  
  // Calculation mode state
  calculationMode: CalculationMode;
  setCalculationMode: (mode: CalculationMode) => void;
  
  // Payment input state
  monthlyPayment: string;
  setMonthlyPayment: (value: string) => void;
  
  // Timeframe input state
  repaymentYears: string;
  repaymentMonths: string;
  setRepaymentYears: (value: string) => void;
  setRepaymentMonths: (value: string) => void;
  
  // Repayment method state
  repaymentMethod: RepaymentMethod;
  setRepaymentMethod: (method: RepaymentMethod) => void;
  
  // Results state
  timeToPayoff: string | null;
  requiredPayment: string | null;
  totalInterest: string | null;
  paymentSchedule: MonthRecord[];
  
  // Actions
  calculateResults: () => void;
  handleAddDebt: () => void;
}

export const useDebtCalculator = (): UseDebtCalculatorResult => {
  // Debt items state
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: '1', name: 'Credit Card', balance: 5000, interestRate: 18.9, minPayment: 150 },
    { id: '2', name: 'Student Loan', balance: 15000, interestRate: 4.5, minPayment: 180 },
  ]);
  
  // New debt form state
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtBalance, setNewDebtBalance] = useState('');
  const [newDebtInterestRate, setNewDebtInterestRate] = useState('');
  const [newDebtMinPayment, setNewDebtMinPayment] = useState('');
  
  // Calculation mode state
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('payment');
  const [monthlyPayment, setMonthlyPayment] = useState('500');
  const [repaymentYears, setRepaymentYears] = useState('3');
  const [repaymentMonths, setRepaymentMonths] = useState('0');
  
  // Repayment method state
  const [repaymentMethod, setRepaymentMethod] = useState<RepaymentMethod>('avalanche');
  
  // Results state
  const [timeToPayoff, setTimeToPayoff] = useState<string | null>(null);
  const [requiredPayment, setRequiredPayment] = useState<string | null>(null);
  const [totalInterest, setTotalInterest] = useState<string | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<MonthRecord[]>([]);
  
  // Flag to track if a calculation has been performed
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  
  // Internal calculation function to avoid dependency cycle
  const performCalculation = () => {
    if (debts.length === 0) {
      return;
    }
    
    // Reset results to show calculation is happening
    setTimeToPayoff(null);
    setTotalInterest(null);
    setRequiredPayment(null);
    
    if (calculationMode === 'timeframe') {
      const targetMonths = (parseInt(repaymentYears) || 0) * 12 + (parseInt(repaymentMonths) || 0);
      
      if (targetMonths <= 0) {
        return;
      }
      
      // Get current values from state to ensure we're using latest values
      const results = calculateDebtRepayment(
        debts,
        repaymentMethod,
        0, // Monthly payment will be calculated based on timeframe
        targetMonths
      );
      
      setRequiredPayment(`$${results.payment.toLocaleString('en-US', { maximumFractionDigits: 2 })}`);
      
      const years = Math.floor(results.months / 12);
      const remainingMonths = results.months % 12;
      
      const yearsDisplay = years === 1 ? '1 year' : `${years} years`;
      const monthsDisplay = remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;
      setTimeToPayoff(`${yearsDisplay}, ${monthsDisplay}`);
      setTotalInterest(`$${results.totalInterestPaid.toLocaleString('en-US', { maximumFractionDigits: 2 })}`);
      setPaymentSchedule(results.paymentSchedule);
      
    } else {
      // Payment-based calculation
      const payment = parseFloat(monthlyPayment);
      
      if (!payment || payment <= 0) {
        return;
      }
      
      // Get current values from state to ensure we're using latest values
      const results = calculateDebtRepayment(
        debts,
        repaymentMethod,
        payment
      );
      
      const years = Math.floor(results.months / 12);
      const remainingMonths = results.months % 12;
      
      const yearsDisplay = years === 1 ? '1 year' : `${years} years`;
      const monthsDisplay = remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;
      setTimeToPayoff(`${yearsDisplay}, ${monthsDisplay}`);
      setTotalInterest(`$${results.totalInterestPaid.toLocaleString('en-US', { maximumFractionDigits: 2 })}`);
      setPaymentSchedule(results.paymentSchedule);
    }
  };
  
  // Automatically recalculate when relevant parameters change if a calculation has already been performed
  useEffect(() => {
    if (calculationPerformed) {
      // Force recalculation when repayment method changes
      performCalculation();
    }
  }, [
    repaymentMethod, // Recalculate when strategy changes
    calculationPerformed,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Disable the exhaustive deps warning as we want to control exactly when recalculations happen
  ]); // Re-run when these dependencies change
  
  // Actions
  const addDebt = (newDebtData: Omit<DebtItem, 'id'>) => {
    const newDebt: DebtItem = {
      ...newDebtData,
      id: Date.now().toString()
    };
    
    setDebts([...debts, newDebt]);
  };
  
  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };
  
  const handleAddDebt = () => {
    if (!newDebtName || !newDebtBalance || !newDebtInterestRate || !newDebtMinPayment) return;
    
    addDebt({
      name: newDebtName,
      balance: parseFloat(newDebtBalance),
      interestRate: parseFloat(newDebtInterestRate),
      minPayment: parseFloat(newDebtMinPayment)
    });
    
    // Clear form
    setNewDebtName('');
    setNewDebtBalance('');
    setNewDebtInterestRate('');
    setNewDebtMinPayment('');
  };
  
  const calculateResults = () => {
    if (debts.length === 0) {
      alert('Please add at least one debt to calculate');
      return;
    }
    
    if (calculationMode === 'timeframe') {
      const targetMonths = (parseInt(repaymentYears) || 0) * 12 + (parseInt(repaymentMonths) || 0);
      
      if (targetMonths <= 0) {
        alert('Please enter a valid timeframe');
        return;
      }
    } else {
      // Payment-based calculation
      const payment = parseFloat(monthlyPayment);
      
      if (!payment || payment <= 0) {
        alert('Please enter a valid monthly payment');
        return;
      }
    }
    
    // Mark that a calculation has been performed
    setCalculationPerformed(true);
    
    // Perform the calculation - force immediate recalculation
    performCalculation();
  };
  
  return {
    // Debt items state
    debts,
    addDebt,
    removeDebt,
    
    // New debt form state
    newDebtName,
    newDebtBalance,
    newDebtInterestRate,
    newDebtMinPayment,
    setNewDebtName,
    setNewDebtBalance,
    setNewDebtInterestRate,
    setNewDebtMinPayment,
    
    // Calculation mode state
    calculationMode,
    setCalculationMode,
    
    // Payment input state
    monthlyPayment,
    setMonthlyPayment,
    
    // Timeframe input state
    repaymentYears,
    repaymentMonths,
    setRepaymentYears,
    setRepaymentMonths,
    
    // Repayment method state
    repaymentMethod,
    setRepaymentMethod,
    
    // Results state
    timeToPayoff,
    requiredPayment,
    totalInterest,
    paymentSchedule,
    
    // Actions
    calculateResults,
    handleAddDebt
  };
};
