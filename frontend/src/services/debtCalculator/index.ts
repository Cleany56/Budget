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
  
  // Log initial state before sorting
  console.log(`Debt calculation starting. Strategy: ${repaymentMethod}`);
  console.log('Original debt order:', workingDebts.map(debt => 
    `${debt.name}: $${debt.balance} at ${debt.interestRate}%`
  ));
  
  // Sort based on repayment method
  if (repaymentMethod === 'avalanche') {
    // Sort by highest interest rate first (avalanche method)
    workingDebts.sort((a, b) => b.interestRate - a.interestRate);
    console.log('Using AVALANCHE method - Highest interest rate first');
    
    // Check if snowball would result in the same order
    const snowballOrder = [...workingDebts].sort((a, b) => a.balance - b.balance);
    const sameOrder = workingDebts.every((debt, index) => debt.id === snowballOrder[index].id);
    if (sameOrder) {
      console.log('NOTE: For this debt scenario, Avalanche and Snowball methods will prioritize the same debt first, resulting in identical payoff schedules.');
    }
  } else if (repaymentMethod === 'snowball') {
    // Sort by lowest balance first (snowball method)
    workingDebts.sort((a, b) => a.balance - b.balance);
    console.log('Using SNOWBALL method - Smallest balance first');
    
    // Check if avalanche would result in the same order
    const avalancheOrder = [...workingDebts].sort((a, b) => b.interestRate - a.interestRate);
    const sameOrder = workingDebts.every((debt, index) => debt.id === avalancheOrder[index].id);
    if (sameOrder) {
      console.log('NOTE: For this debt scenario, Avalanche and Snowball methods will prioritize the same debt first, resulting in identical payoff schedules.');
    }
  }
  
  // Log the sorted order
  console.log('Prioritized debt order after sorting:', workingDebts.map(debt => 
    `${debt.name}: $${debt.balance} at ${debt.interestRate}%`
  ));
  
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
  
  // Calculate total minimum payment
  const minimumPaymentSum = activeDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
  
  // Ensure payment is at least the sum of all minimum payments
  payment = Math.max(payment, minimumPaymentSum);
  
  while (activeDebts.length > 0 && months < 600) {
    months++;
    let monthRecord: MonthRecord = { month: months, debts: [] };
    
    // This is the additional payment beyond minimum payments
    // User enters this as their "monthly payment"
    let additionalPayment = payment - minimumPaymentSum;
    
    // Pay minimum on all debts and calculate interest
    activeDebts.forEach(debt => {
      const interest = (debt.interestRate / 100 / 12) * debt.balance;
      totalInterestPaid += interest;
      debt.balance += interest;
      
      const minPayment = Math.min(debt.minPayment, debt.balance);
      debt.balance -= minPayment;
      
      monthRecord.debts.push({
        name: debt.name,
        startBalance: debt.balance + minPayment - interest,
        interest,
        payment: minPayment,
        endBalance: debt.balance
      });
    });
    
    // Apply additional payment to highest priority debt (first in the sorted list)
    for (let i = 0; i < activeDebts.length && additionalPayment > 0; i++) {
      if (activeDebts[i].balance > 0) {
        const extraPayment = Math.min(additionalPayment, activeDebts[i].balance);
        activeDebts[i].balance -= extraPayment;
        additionalPayment -= extraPayment;
        
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
    
    // Calculate current minimum payments (might change as balances get paid off)
    let activeTestDebts = testDebts.filter(debt => debt.balance > 0);
    let currentMinPaymentSum = activeTestDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
    
    while (stillPaying && testMonths < 600) {
      testMonths++;
      stillPaying = false;
      
      // Ensure payment is at least the sum of all minimum payments
      let totalPayment = Math.max(estimatedPayment, currentMinPaymentSum);
      // This is the additional payment beyond minimum payments
      let additionalPayment = totalPayment - currentMinPaymentSum;
      
      // Pay minimum on all debts
      activeTestDebts.forEach(debt => {
        if (debt.balance > 0) {
          const interest = (debt.interestRate / 100 / 12) * debt.balance;
          const minPayment = Math.min(debt.minPayment, debt.balance + interest);
          
          debt.balance += interest - minPayment;
          stillPaying = stillPaying || debt.balance > 0;
        }
      });
      
      // Apply additional payment to prioritized debt
      for (let i = 0; i < activeTestDebts.length && additionalPayment > 0; i++) {
        if (activeTestDebts[i].balance > 0) {
          const extraPayment = Math.min(additionalPayment, activeTestDebts[i].balance);
          activeTestDebts[i].balance -= extraPayment;
          additionalPayment -= extraPayment;
        }
      }
      
      // Update active debts and minimum payment sum for next iteration
      activeTestDebts = activeTestDebts.filter(debt => debt.balance > 0);
      currentMinPaymentSum = activeTestDebts.reduce((sum, debt) => sum + debt.minPayment, 0);
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
