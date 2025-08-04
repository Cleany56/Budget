import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { Expense, AccountSummary } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { getDisplayTransactionSections } from '../utils/transactionUtils';
import { mapToDisplayTransaction } from '../utils/transactionDisplay';
import { getTransactionIconComponent } from '../utils/transactionIcons';
import { formatAsCurrency } from '../utils/formatters';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';

interface TransactionListProps {
  expenses: Expense[];
  accounts: AccountSummary[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  ListHeaderComponent?: React.ReactElement;
}

/**
 * Reusable transaction list component with performance optimizations
 */
export const TransactionList: React.FC<TransactionListProps> = React.memo(({
  expenses,
  accounts,
  loading,
  error,
  onRetry,
  ListHeaderComponent
}) => {
  const { colors } = useTheme();
  
  // Memoize transaction sections to prevent recalculation on each render
  const groupedByDate = useMemo(() => {
    return getDisplayTransactionSections(expenses, accounts, 10);
  }, [expenses, accounts]);
  
  // Render empty state for transactions
  const EmptyTransactionsComponent = useCallback(() => {
    if (loading) {
      return null;
    }
    
    if (error) {
      return null;
    }
    
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No transactions found</Text>
        <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8 }}>
          Transactions you add will appear here
        </Text>
      </View>
    );
  }, [loading, error, colors]);

  // Memoize section header rendering
  const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.dateLabelContainer, { backgroundColor: colors.card, shadowColor: colors.text + '22', marginLeft: 20 }] }>
      <Text style={[styles.dateLabelText, { color: colors.text }]}>{title}</Text>
    </View>
  ), [colors]);

  // Memoize renderItem function
  const renderItem = useCallback(({ item }: { item: Expense }) => {
    // Optimize display transaction calculation and icon fetching with useMemo
    const tx = useMemo(() => mapToDisplayTransaction(item), [item]);
    const amountColor = tx.isExpense ? '#e17055' : '#27ae60';
    const IconComponent = useMemo(() => getTransactionIconComponent(tx.type), [tx.type]);
    
    return (
      <View style={[styles.expenseItem, { borderBottomColor: colors.border, marginHorizontal: 20 }] }>
        <View style={[styles.iconBox, { backgroundColor: colors.card }] }>
          {typeof IconComponent === 'function' ? (
            <IconComponent width={24} height={24} />
          ) : null}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.expenseTitle, { color: colors.text }]}>{tx.merchant}</Text>
          {item.notes ? (
            <Text style={[styles.expenseType, { color: colors.muted }]} numberOfLines={1}>{item.notes}</Text>
          ) : null}
        </View>
        <Text style={[styles.expenseAmount, { color: amountColor }]}>{tx.sign}{formatAsCurrency(tx.amount, '')}</Text>
      </View>
    );
  }, [colors]);

  // Handle empty expenses state with transactions
  const isEmpty = expenses.length === 0 && !loading && !error;
  
  // If in loading state, show loading indicator within the list layout
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator type="transaction" />
      </View>
    );
  }

  // If error state, show error message within the list layout
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} onRetry={onRetry} />
      </View>
    );
  }
  
  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={[
        styles.container, 
        isEmpty ? { flex: 1, justifyContent: 'center' } : null
      ]}
      sections={groupedByDate}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyTransactionsComponent />}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={false} // Change to false to fix scrolling issues
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false} // Disable scrolling since parent ScrollView handles it
    />
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  dateLabelContainer: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 16,
    marginBottom: 4,
    marginLeft: 2,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dateLabelText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  expenseTitle: {
    fontSize: 16,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseType: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 0,
  },
});
