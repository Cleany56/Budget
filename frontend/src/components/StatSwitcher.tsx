
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { DUMMY_ACCOUNTS, DUMMY_EXPENSES } from '../utils/dummyData';

const cardWidth = Dimensions.get('window').width - 40; // match HomeScreen horizontal padding




// Calculate spending for a specific month (set to July for demo)
// To use current month, replace 'selectedMonth' with: new Date().getMonth()
const selectedMonth = 6; // July (0-based)
const spending = DUMMY_EXPENSES
  .filter(e => e.amount < 0 && e.date.getMonth() === selectedMonth)
  .reduce((sum, e) => sum + Math.abs(e.amount), 0);

// Calculate assets and liabilities from DUMMY_ACCOUNTS
const assets = DUMMY_ACCOUNTS
  .filter(a => a.type === 'Investment' || a.type === 'Checking' || a.type === 'Savings')
  .reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
const liabilities = DUMMY_ACCOUNTS
  .filter(a => a.type === 'Credit Card')
  .reduce((sum, a) => sum + (a.balance < 0 ? Math.abs(a.balance) : 0), 0);
const netWorth = assets - liabilities;

const cards = [
  {
    title: 'Spending',
    desc: 'Your spending for the month',
    amount: `-$${spending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    title: 'Net Worth',
    amount: `$${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    assets: `$${assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    liabilities: `$${liabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
];




const StatSwitcher: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { colors } = useTheme();
  const handlePrev = () => setIndex(i => (i > 0 ? i - 1 : 0));
  const handleNext = () => setIndex(i => (i < cards.length - 1 ? i + 1 : i));

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.viewButton} accessibilityLabel="View">
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        {index === 0 ? (
          <>
            <Text style={[styles.spendingDesc, { color: colors.text }]}>{cards[0].desc}</Text>
            <Text style={styles.spendingAmount}>{cards[0].amount}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{cards[1].title}</Text>
            <Text style={styles.netWorthAmount}>{cards[1].amount}</Text>
            <View style={styles.netWorthDetailsRow}>
              <View style={styles.netWorthDetailBox}>
                <Text style={styles.netWorthDetailLabel}>Assets</Text>
                <Text style={styles.netWorthDetailValue}>{cards[1].assets}</Text>
              </View>
              <View style={styles.netWorthDetailBox}>
                <Text style={styles.netWorthDetailLabel}>Liabilities</Text>
                <Text style={styles.netWorthDetailValue}>{cards[1].liabilities}</Text>
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
  card: {
    backgroundColor: '#f4f4f7',
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 210, // Increased to fit all contents
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
    color: '#636e72',
    fontWeight: '600',
    marginBottom: 2,
  },
  netWorthDetailValue: {
    fontSize: 17,
    color: '#00b894',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  cardDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
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
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  spendingAmount: {
    fontSize: 28,
    color: '#e17055',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  netWorthAmount: {
    fontSize: 32,
    color: '#0984e3',
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
});

export default StatSwitcher;
