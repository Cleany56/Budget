export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

export type RepaymentMethod = 'avalanche' | 'snowball' | 'custom';
export type CalculationMode = 'payment' | 'timeframe';

export interface DebtPaymentRecord {
  name: string;
  startBalance: number;
  interest: number;
  payment: number;
  endBalance: number;
}

export interface MonthRecord {
  month: number;
  debts: DebtPaymentRecord[];
}
