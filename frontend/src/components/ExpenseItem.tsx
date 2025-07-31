import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types';

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  // Format date
  const formattedDate = expense.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{expense.category}</Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>
          ${expense.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContainer: {
    flex: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 12,
    color: '#444',
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});

export default ExpenseItem;
