import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AccountSummary, Budget, Goal } from '../types';
import DevToolbar from './DevToolbar';
import StatSwitcher from './StatSwitcher';
import AccountSummaryPanel from './AccountSummaryPanel';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { HomeScreenSection } from './HomeScreenSection';

interface HomeHeaderProps {
  accounts: AccountSummary[];
  budgets: Budget[];
  goals: Goal[];
  loading: {
    accounts: boolean;
    budgets: boolean;
    goals: boolean;
    expenses: boolean;
  };
  error: {
    accounts: string | null;
    budgets: string | null;
    goals: string | null;
    expenses: string | null;
  };
  colors: any;
  onDataRefresh: () => void;
}

/**
 * Header component for the home screen
 */
export const HomeHeader: React.FC<HomeHeaderProps> = React.memo(({
  accounts,
  budgets,
  goals,
  loading,
  error,
  colors,
  onDataRefresh
}) => {
  return (
    <View style={styles.container}>
      {/* Developer Tools - Remove this in production */}
      <DevToolbar onDataChanged={onDataRefresh} />
      
      {/* Status indicators at the top */}
      {Object.values(loading).every(val => val) && (
        <View style={styles.statusContainer}>
          <LoadingIndicator type="data" />
          <Text style={[styles.statusText, { color: colors.text }]}>Loading your data...</Text>
        </View>
      )}
      
      {Object.values(error).some(val => val !== null) && (
        <View style={styles.statusContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Error loading some data. Pull down to refresh.
          </Text>
        </View>
      )}
      
      <StatSwitcher 
        accounts={accounts}
        isLoading={loading.accounts}
        error={error.accounts}
      />
      
      {/* Accounts */}
      {loading.accounts ? (
        <LoadingIndicator type="account" />
      ) : error.accounts ? (
        <ErrorMessage message={error.accounts} onRetry={onDataRefresh} />
      ) : (
        <AccountSummaryPanel accounts={accounts} />
      )}
      
      {/* Budgets Section */}
      <HomeScreenSection
        title="My Budgets"
        navigateTo="AddBudget"
        loading={loading.budgets}
        error={error.budgets}
        colors={colors}
        data={budgets.slice(0, 3)}
        dataType="budgets"
        onRetry={onDataRefresh}
      />
      
      {/* Goals Section */}
      <HomeScreenSection
        title="My Goals"
        navigateTo="AddGoal"
        loading={loading.goals}
        error={error.goals}
        colors={colors}
        data={goals.slice(0, 2)}
        dataType="goals"
        onRetry={onDataRefresh}
      />
      
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Latest Transactions
      </Text>
      
      {loading.expenses && <LoadingIndicator type="transaction" />}
      {error.expenses && <ErrorMessage message={error.expenses} onRetry={onDataRefresh} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',  // Light gray background
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  }
});
