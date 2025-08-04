import { DebtItem, MonthRecord, RepaymentMethod } from '../../types/debtTypes';

/**
 * Calculates debt repayment plan with the given parameters
 */
export const calculateDebtRepayment = (
  debts: DebtItem[],
  repaymentMethod: RepaymentMethod,
  monthlyPayment: number,
  timeframe?: number
): {
  payment: number;
  months: number;
  totalInterestPaid: number;
  paymentSchedule: MonthRecord[];
} => {
  // Create a deep copy of debts to work with
  let workingDebts = JSON.parse(JSON.stringify(debts)) as DebtItem[];
  
  // Sort based on repayment method
  if (repaymentMethod === 'avalanche') {
    // Sort by highest interest rate first (avalanche method)
    workingDebts.sort((a, b) => b.interestRate - a.interestRate);
  } else if (repaymentMethod === 'snowball') {
    // Sort by lowest balance first (snowball method)
    workingDebts.sort((a, b) => a.balance - b.balance);
  }
  
  // Calculate total minimum payment
  const totalMinPayment = workingDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  
  let payment = monthlyPayment || totalMinPayment;
  let months = 0;
  let totalInterestPaid = 0;
  let paymentSchedule: MonthRecord[] = [];
  
  // If timeframe is provided, calculate required monthly payment
  if (timeframe && timeframe > 0) {
    payment = estimateRequiredPayment(workingDebts, totalMinPayment, timeframe);
  }
  
  // Run simulation with the payment
  let activeDebts = workingDebts.filter(debt => debt.balance > 0);
  
  while (activeDebts.length > 0 && months < 600) {
    months++;
    let monthRecord: MonthRecord = { month: months, debts: [] };
    let remainingPayment = payment;
    
    // Pay minimum on all debts and calculate interest
    activeDebts.forEach(debt => {
      const interest = (debt.interestRate / 100 / 12) * debt.balance;
      totalInterestPaid += interest;
      debt.balance += interest;
      
      const minPayment = Math.min(debt.minPayment, debt.balance);
      debt.balance -= minPayment;
      remainingPayment -= minPayment;
      
      monthRecord.debts.push({
        name: debt.name,
        startBalance: debt.balance + minPayment - interest,
        interest,
        payment: minPayment,
        endBalance: debt.balance
      });
    });
    
    // Apply remaining payment to highest priority debt (first in the sorted list)
    for (let i = 0; i < activeDebts.length && remainingPayment > 0; i++) {
      if (activeDebts[i].balance > 0) {
        const extraPayment = Math.min(remainingPayment, activeDebts[i].balance);
        activeDebts[i].balance -= extraPayment;
        remainingPayment -= extraPayment;
        
        // Update the payment in the month record
        monthRecord.debts[i].payment += extraPayment;
        monthRecord.debts[i].endBalance = activeDebts[i].balance;
      }
    }
    
    paymentSchedule.push(monthRecord);
    activeDebts = activeDebts.filter(debt => debt.balance > 0);
  }
  
  return {
    payment,
    months,
    totalInterestPaid,
    paymentSchedule
  };
};

/**
 * Estimates the required monthly payment to pay off debt within the given timeframe
 */
const estimateRequiredPayment = (
  debts: DebtItem[],
  totalMinPayment: number,
  targetMonths: number
): number => {
  // Estimate required payment using binary search
  let lowerBound = totalMinPayment;
  let upperBound = totalMinPayment * 5; // An arbitrary upper limit
  let estimatedPayment = (lowerBound + upperBound) / 2;
  let iterations = 0;
  const maxIterations = 20; // Prevent infinite loops
  
  while (iterations < maxIterations) {
    // Calculate payoff with current estimated payment
    let testDebts = JSON.parse(JSON.stringify(debts)) as DebtItem[];
    let testMonths = 0;
    let stillPaying = true;
    
    while (stillPaying && testMonths < 600) {
      testMonths++;
      stillPaying = false;
      
      let remainingPayment = estimatedPayment;
      
      // Pay minimum on all debts
      testDebts.forEach(debt => {
        if (debt.balance > 0) {
          const interest = (debt.interestRate / 100 / 12) * debt.balance;
          const minPayment = Math.min(debt.minPayment, debt.balance + interest);
          
          debt.balance += interest - minPayment;
          remainingPayment -= minPayment;
          stillPaying = stillPaying || debt.balance > 0;
        }
      });
      
      // Apply remaining payment to prioritized debt
      for (let i = 0; i < testDebts.length && remainingPayment > 0; i++) {
        if (testDebts[i].balance > 0) {
          const extraPayment = Math.min(remainingPayment, testDebts[i].balance);
          testDebts[i].balance -= extraPayment;
          remainingPayment -= extraPayment;
        }
      }
    }
    
    if (Math.abs(testMonths - targetMonths) < 1 || upperBound - lowerBound < 1) {
      return estimatedPayment;
    }
    
    if (testMonths > targetMonths) {
      lowerBound = estimatedPayment;
    } else {
      upperBound = estimatedPayment;
    }
    
    estimatedPayment = (lowerBound + upperBound) / 2;
    iterations++;
  }
  
  return estimatedPayment;
};
