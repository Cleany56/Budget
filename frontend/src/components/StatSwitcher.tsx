
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AccountSummary } from '../types';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { getMonthlySpending } from '../services/api/transactions';
import { formatAsCurrency } from '../utils/formatters';

// Props interface
interface StatSwitcherProps {
  accounts: AccountSummary[];
  isLoading: boolean;
  error: string | null;
}

const cardWidth = Dimensions.get('window').width - 40; // match HomeScreen horizontal padding

/**
 * Financial statistics switcher component
 */
const StatSwitcher: React.FC<StatSwitcherProps> = ({ accounts, isLoading, error }) => {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [spendingData, setSpendingData] = useState({
    totalSpending: 0,
    transactionCount: 0,
    isLoading: true,
    error: null as string | null
  });
  
  // Get current month name for display
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  // Fetch monthly spending data
  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        setSpendingData(prev => ({ ...prev, isLoading: true, error: null }));
        const data = await getMonthlySpending();
        console.log('Monthly spending data:', data);
        
        setSpendingData({
          totalSpending: data.totalSpending,
          transactionCount: data.transactionCount,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching monthly spending:', err);
        setSpendingData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load spending data'
        }));
      }
    };
    
    fetchMonthlySpending();
  }, []);
  
  // Calculate assets and liabilities from accounts with debug logs
  console.log('StatSwitcher received accounts:', accounts);
  
  const assets = accounts
    .filter(a => a.type === 'Investment' || a.type === 'Checking' || a.type === 'Savings' || a.type === 'Bank')
    .reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
    
  const liabilities = accounts
    .filter(a => a.type === 'Credit Card')
    .reduce((sum, a) => sum + (a.balance < 0 ? Math.abs(a.balance) : 0), 0);
  
  console.log('Calculated assets:', assets);
  console.log('Calculated liabilities:', liabilities);
  
  const netWorth = assets - liabilities;
  console.log('Calculated net worth:', netWorth);
  
  // Define card data
  const cards = [
    {
      title: 'Spending',
      desc: `Your ${currentMonth} spending`,
      amount: formatAsCurrency(spendingData.totalSpending),
      isLoading: spendingData.isLoading,
      error: spendingData.error,
    },
    {
      title: 'Net Worth',
      amount: formatAsCurrency(netWorth),
      assets: formatAsCurrency(assets),
      liabilities: formatAsCurrency(liabilities),
    },
  ];
  
  const handlePrev = () => setIndex(i => (i > 0 ? i - 1 : 0));
  const handleNext = () => setIndex(i => (i < cards.length - 1 ? i + 1 : i));

  // Display appropriate content based on loading/error state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator type="account" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.viewButton} accessibilityLabel="View">
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        {index === 0 ? (
          <>
            <Text style={[styles.spendingDesc, { color: colors.text }]}>{cards[0].desc}</Text>
            {cards[0].isLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingIndicator size="small" />
              </View>
            ) : cards[0].error ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                Error loading data
              </Text>
            ) : (
              <Text style={[styles.spendingAmount, { color: colors.error }]}>{cards[0].amount}</Text>
            )}
          </>
        ) : (
          <>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{cards[1].title}</Text>
            <Text style={[styles.netWorthAmount, { color: netWorth >= 0 ? colors.success : colors.error }]}>
              {cards[1].amount}
            </Text>
            <View style={styles.netWorthDetailsRow}>
              <View style={styles.netWorthDetailBox}>
                <Text style={[styles.netWorthDetailLabel, { color: colors.muted }]}>Assets</Text>
                <Text style={[styles.netWorthDetailValue, { color: colors.success }]}>{cards[1].assets}</Text>
              </View>
              <View style={styles.netWorthDetailBox}>
                <Text style={[styles.netWorthDetailLabel, { color: colors.muted }]}>Liabilities</Text>
                <Text style={[styles.netWorthDetailValue, { color: colors.error }]}>{cards[1].liabilities}</Text>
              </View>
            </View>
          </>
        )}
        <View style={styles.arrowRow}>
          {index > 0 && (
            <TouchableOpacity onPress={handlePrev} style={styles.arrowButton} accessibilityLabel="Previous card">
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {index < cards.length - 1 && (
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton} accessibilityLabel="Next card">
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 210,
    maxHeight: 210,
    height: 210,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  netWorthDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    paddingHorizontal: 12,
  },
  netWorthDetailBox: {
    flex: 1,
    alignItems: 'center',
  },
  netWorthDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  netWorthDetailValue: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  arrowRow: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    zIndex: 2,
  },
  arrowButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
  },
  spendingDesc: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  spendingAmount: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  netWorthAmount: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
  viewButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default StatSwitcher;
