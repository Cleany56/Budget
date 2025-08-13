
import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import HorizontalBarChart from '../components/HorizontalBarChart';
import PieChart from '../components/PieChart';
import { useTheme } from '../theme/ThemeContext';
import { getTransactions } from '../services/api/transactions';
import { Expense } from '../types';
import { ExpenseCategory } from '../types';

// Pie chart colors for each category (same as in MonthDetailScreen)
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#4bcffa',
  [ExpenseCategory.TRANSPORT]: '#ffa801',
  [ExpenseCategory.ENTERTAINMENT]: '#a55eea',
  [ExpenseCategory.SHOPPING]: '#ff5e57',
  [ExpenseCategory.UTILITIES]: '#00b894',
  [ExpenseCategory.HEALTH]: '#fd79a8',
  [ExpenseCategory.HOUSING]: '#636e72',
  [ExpenseCategory.OTHER]: '#f7b731',
};

const ReportsScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State for transactions
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const txs = await getTransactions();
        setTransactions(txs);
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Aggregate expenses by month (YYYY-MM)
  const monthlySummary = useMemo(() => {
    const summaryMap: Record<string, { label: string; year: number; month: number; income: number; spend: number }> = {};
    transactions.forEach(exp => {
      const year = exp.date.getFullYear();
      const month = exp.date.getMonth();
      const key = `${year}-${month}`;
      if (!summaryMap[key]) {
        // Use full month name for label
        const label = `${exp.date.toLocaleString('default', { month: 'long' })} ${year}`;
        summaryMap[key] = { label, year, month, income: 0, spend: 0 };
      }
      if (exp.amount >= 0) {
        summaryMap[key].income += exp.amount;
      } else {
        summaryMap[key].spend += exp.amount;
      }
    });
    // Sort descending by year, month
    return Object.values(summaryMap).sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month);
  }, [transactions]);

  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Calculate yearly financial summary
  const yearlyFinancialSummary = useMemo(() => {
    let income = 0;
    let spending = 0;
    
    // Calculate total income and spending for the current year
    transactions
      .filter(exp => exp.date.getFullYear() === currentYear)
      .forEach(exp => {
        if (exp.amount >= 0) {
          income += exp.amount;
        } else {
          spending += Math.abs(exp.amount);
        }
      });
      
    const netIncome = income - spending;
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0;
    
    return {
      income,
      spending,
      netIncome,
      savingsRate
    };
  }, [transactions, currentYear]);
  
  // Calculate yearly expense summary by category
  const yearlyExpensesByCategory = useMemo(() => {
    const categorySummary: Record<ExpenseCategory, number> = {
      [ExpenseCategory.FOOD]: 0,
      [ExpenseCategory.TRANSPORT]: 0,
      [ExpenseCategory.ENTERTAINMENT]: 0,
      [ExpenseCategory.SHOPPING]: 0,
      [ExpenseCategory.UTILITIES]: 0,
      [ExpenseCategory.HEALTH]: 0,
      [ExpenseCategory.HOUSING]: 0,
      [ExpenseCategory.OTHER]: 0,
    };
    
    // Only consider expenses (negative amounts) from current year
    transactions
      .filter(exp => exp.amount < 0 && exp.date.getFullYear() === currentYear)
      .forEach(exp => {
        if (categorySummary[exp.category as ExpenseCategory] !== undefined) {
          categorySummary[exp.category as ExpenseCategory] += Math.abs(exp.amount);
        }
      });
    
    // Convert to pie chart data format
    return Object.entries(categorySummary)
      .filter(([_, value]) => value > 0) // Only include categories with expenses
      .map(([category, value]) => ({
        name: category,
        amount: value,
        color: CATEGORY_COLORS[category as ExpenseCategory],
      }));
  }, [transactions, currentYear]);
  
  if (loading) {
    return (
      <AppLayout toggleDarkMode={toggleDarkMode}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text }}>Loading reports...</Text>
        </View>
      </AppLayout>
    );
  }
  
  if (error) {
    return (
      <AppLayout toggleDarkMode={toggleDarkMode}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.error }}>{error}</Text>
        </View>
      </AppLayout>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <AppLayout toggleDarkMode={toggleDarkMode}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text }}>No transactions found for this year.</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout toggleDarkMode={toggleDarkMode}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        
        {/* Yearly Financial Summary */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.subTitle, { color: colors.text }]}>{currentYear} Financial Summary</Text>
          <View style={styles.financialSummary}>
            <View style={styles.financialItem}>
              <Text style={[styles.financialLabel, { color: colors.muted }]}>Income</Text>
              <Text style={[styles.financialAmount, { color: colors.text }]}>
                ${yearlyFinancialSummary.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={[styles.financialLabel, { color: colors.muted }]}>Spending</Text>
              <Text style={[styles.financialAmount, { color: colors.text }]}>
                ${yearlyFinancialSummary.spending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={[styles.financialLabel, { color: colors.muted }]}>Net Income</Text>
              <Text style={[
                styles.financialAmount, 
                { color: yearlyFinancialSummary.netIncome >= 0 ? '#2ecc71' : '#e74c3c' }
              ]}>
                ${Math.abs(yearlyFinancialSummary.netIncome).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                {yearlyFinancialSummary.netIncome < 0 ? ' (Loss)' : ''}
              </Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={[styles.financialLabel, { color: colors.muted }]}>Savings Rate</Text>
              <Text style={[
                styles.financialAmount, 
                { color: yearlyFinancialSummary.savingsRate >= 0 ? '#2ecc71' : '#e74c3c' }
              ]}>
                {yearlyFinancialSummary.savingsRate.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </Text>
            </View>
          </View>
        </View>
        
        {/* Yearly Expense Summary Pie Chart */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.subTitle, { color: colors.text }]}>{currentYear} Expense Summary</Text>
          {yearlyExpensesByCategory.length > 0 ? (
            <View style={styles.chartWrapper}>
              <PieChart 
                data={yearlyExpensesByCategory}
                width={320}
                height={180}
                totalLabel="ANNUAL SPEND"
              />
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.muted }]}>No expenses for {currentYear}</Text>
          )}
        </View>
        
        {/* Monthly horizontal bar charts */}
        <Text style={[styles.subTitle, { color: colors.text, marginTop: 16 }]}>Monthly Overview</Text>
        <View style={{ width: '100%' }}>
          {(() => {
            // Find the largest value (income or spend) for scaling
            const maxBar = Math.max(
              ...monthlySummary.map(m => Math.max(m.income, Math.abs(m.spend))),
              0.01 // Prevent division by zero if there are no transactions
            );
            return monthlySummary.map((month) => (
              <View 
                key={`${month.year}-${month.month}`} 
                style={[styles.monthBox, styles.smallerMonthBox, { borderColor: colors.border, backgroundColor: colors.card }]}> 
                <View style={styles.monthHeaderRow}>
                  <Text style={[styles.monthLabel, { color: colors.text }]}>{month.label}</Text>
                  <TouchableOpacity
                    style={styles.dotsButton}
                    onPress={() => {
                      navigation.navigate('MonthDetail', { label: month.label, year: month.year, month: month.month });
                    }}
                  >
                    <Text style={[styles.dots, { color: colors.text }]}>⋯</Text>
                  </TouchableOpacity>
                </View>
                <HorizontalBarChart income={month.income} spend={month.spend} maxValue={maxBar} incomeColor="#2ecc40" spendColor="#ff4136" height={60} showValues={false} />
              </View>
            ));
          })()}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'flex-start',
    width: '100%',
  },
  section: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  financialSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  financialItem: {
    width: '48%',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  financialLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  financialAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  monthBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    width: '100%',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  smallerMonthBox: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 60,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  monthLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'left',
  },
  dotsButton: {
    padding: 4,
    marginLeft: 8,
  },
  dots: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default ReportsScreen;
