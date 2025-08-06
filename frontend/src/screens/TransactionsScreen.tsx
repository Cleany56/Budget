
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import AppLayout from '../components/AppLayout';
import TransactionSearchBar from '../components/TransactionSearchBar';
import TransactionFilterDropdown from '../components/TransactionFilterDropdown';
import TransactionFilterModal, { TransactionFilters } from '../components/TransactionFilterModal';
import { mapToDisplayTransaction } from '../utils/transactionDisplay';
import { getDisplayTransactionSections } from '../utils/transactionUtils';
import { getTransactions } from '../services/api/transactions';
import { getAccounts } from '../services/api/accounts';
import { getTransactionIconComponent } from '../utils/transactionIcons';
import { Expense, ExpenseCategory } from '../types';

const TransactionsScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TransactionFilters>({
    dateRange: 'thisMonth',
    type: 'all',
    categories: [],
    accounts: [],
    sortBy: { field: 'date', direction: 'desc' }
  });
  
  // State for actual API data
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination logic - start with more transactions initially
  const INITIAL_PAGE_SIZE = 20;
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  
  // Load transactions and accounts from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch transactions and accounts in parallel
        const [transactionsData, accountsData] = await Promise.all([
          getTransactions(),
          getAccounts()
        ]);
        
        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (err) {
        console.error('Error loading transaction data:', err);
        setError('Failed to load transaction data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    // If still loading or error, return empty array
    if (isLoading || error || transactions.length === 0) {
      return [];
    }
    
    let result = [...transactions];
    
    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter(tx => 
        tx.title.toLowerCase().includes(searchLower) || 
        (tx.notes && tx.notes.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by transaction type
    if (activeFilters.type !== 'all') {
      switch (activeFilters.type) {
        case 'expense':
          result = result.filter(tx => tx.amount < 0);
          break;
        case 'income':
          result = result.filter(tx => tx.amount > 0);
          break;
        case 'transfer':
          // For simplicity, assume transfers have "Transfer" in notes
          result = result.filter(tx => 
            tx.notes && tx.notes.toLowerCase().includes('transfer')
          );
          break;
      }
    }
    
    // Filter by categories
    if (activeFilters.categories.length > 0) {
      result = result.filter(tx => 
        activeFilters.categories.includes(tx.category)
      );
    }
    
    // Filter by accounts
    if (activeFilters.accounts.length > 0) {
      result = result.filter(tx => 
        tx.accountId && activeFilters.accounts.includes(tx.accountId)
      );
    }
    
    // Sort transactions
    const { field, direction } = activeFilters.sortBy;
    result.sort((a, b) => {
      let comparison = 0;
      
      if (field === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (field === 'amount') {
        comparison = a.amount - b.amount;
      } else if (field === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [transactions, search, activeFilters, isLoading, error]);
  
  // Get the number of active filters for the badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.type !== 'all') count++;
    if (activeFilters.categories.length > 0) count++;
    if (activeFilters.accounts.length > 0) count++;
    if (activeFilters.dateRange !== 'thisMonth') count++;
    return count;
  }, [activeFilters]);
  
  // Reset pagination whenever filters or search change
  React.useEffect(() => {
    setPage(1);
  }, [search, activeFilters]);
  
  // Calculate how many transactions to show:
  // First page: INITIAL_PAGE_SIZE, subsequent pages: add PAGE_SIZE each time
  const itemsToShow = INITIAL_PAGE_SIZE + (page - 1) * PAGE_SIZE;
  
  // Get the transactions to display based on filters and pagination
  const pagedTransactions = filteredTransactions.slice(0, itemsToShow);
  
  // Format transactions into sections for display - no need to limit further
  const sections = getDisplayTransactionSections(pagedTransactions, accounts, pagedTransactions.length);

  const handleLoadMore = () => {
    // Only load more if we haven't displayed all filtered transactions yet
    if (pagedTransactions.length < filteredTransactions.length) {
      setPage(page + 1);
    }
  };

  // Render different content based on loading state and data availability
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading transactions...
          </Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No transactions found. Add your first expense to get started!
          </Text>
        </View>
      );
    }
    
    if (filteredTransactions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No transactions match your filters.
          </Text>
        </View>
      );
    }
    
    return (
      <SectionList
        sections={sections as { title: string; data: Expense[] }[]}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.dateLabelContainer, { backgroundColor: colors.card, shadowColor: colors.text + '22' }]}>
            <Text style={[styles.dateLabelText, { color: colors.text }]}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const tx = mapToDisplayTransaction(item);
          const amountColor = tx.isExpense ? '#e17055' : '#27ae60';
          const IconComponent = getTransactionIconComponent(tx.type);
          const iconBoxBg = colors.card;
          const notesColor = colors.muted;
          
          return (
            <View style={[styles.txItem, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: iconBoxBg }]}>
                {typeof IconComponent === 'function' ? (
                  <IconComponent width={24} height={24} />
                ) : IconComponent}
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={[styles.txTitle, { color: colors.text }]}>{tx.merchant}</Text>
                {item.notes ? (
                  <Text style={[styles.txType, { color: notesColor }]} numberOfLines={1}>{item.notes}</Text>
                ) : (
                  <Text style={[styles.txType, { color: colors.muted }]}>{tx.type}</Text>
                )}
              </View>
              <Text style={[styles.txAmount, { color: amountColor }]}>{tx.sign}${tx.amount.toFixed(2)}</Text>
            </View>
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: 'center', marginTop: 32 }}>No transactions found.</Text>}
        style={{ marginTop: 8 }}
        stickySectionHeadersEnabled={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    );
  };

  return (
    <AppLayout toggleDarkMode={toggleDarkMode}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>All Transactions</Text>
        <View style={styles.searchFilterRow}>
          <TransactionSearchBar 
            value={search} 
            onChange={(text) => {
              setSearch(text);
              // Reset pagination when search changes
              setPage(1);
            }}
          />
          <TransactionFilterDropdown 
            onPress={() => setFilterModalVisible(true)}
            filtersCount={activeFilterCount}
            activeFilters={activeFilters}
          />
        </View>
        <TransactionFilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setPage(1); // Reset pagination when filters change
          }}
        />
        {renderContent()}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  txTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  txType: {
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
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
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
});

export default TransactionsScreen;
