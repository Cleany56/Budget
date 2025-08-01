
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NavBar from '../components/NavBar';
import ChartsCarousel from '../components/ChartsCarousel';
import { Expense, AccountSummary } from '../types';
import { DUMMY_EXPENSES, DUMMY_ACCOUNTS } from '../utils/dummyData';
import AccountDropdown from '../components/AccountDropdown';


const HomeScreen = () => {
  // Use dummy data for now
  const expenses: Expense[] = DUMMY_EXPENSES;
  const accounts: AccountSummary[] = DUMMY_ACCOUNTS;
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  // Only include expenses from Checking and Credit Card accounts
  const allowedAccountIds = accounts
    .filter(acc => acc.type === 'Checking' || acc.type === 'Credit Card')
    .map(acc => acc.id);
  const filteredExpenses = expenses.filter(exp =>
    exp.accountId && allowedAccountIds.includes(exp.accountId)
  );
  const recentExpenses = filteredExpenses.slice(0, 5);

  // Group accounts by type for dropdowns
  const accountTypes = ['Investment', 'Checking', 'Savings', 'Credit Card'];
  const groupedAccounts = accountTypes.map(type => ({
    type,
    accounts: accounts.filter(acc => acc.type === type)
  })).filter(group => group.accounts.length > 0);

  // FlatList header with dropdowns and summary
  // Get current day string
  const today = new Date();
  const dayString = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const ListHeader = () => (
    <View>
      <NavBar date={dayString} />
      <ChartsCarousel />
      <Text style={styles.sectionTitle}>Accounts</Text>
      <View style={styles.accountDropdowns}>
        {groupedAccounts.map(group => (
          <AccountDropdown key={group.type} type={group.type} accounts={group.accounts} />
        ))}
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Total Expenses</Text>
        <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
      </View>
      <Text style={styles.sectionTitle}>Recent Expenses</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={recentExpenses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => (
        <View style={styles.expenseItem}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </View>
      )}
      ListFooterComponent={null}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  accountDropdowns: {
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#888',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e86de',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  expenseList: {
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseTitle: {
    fontSize: 16,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e17055',
  },
  placeholderBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#bbb',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
