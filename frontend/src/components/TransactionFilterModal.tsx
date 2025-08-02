import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ExpenseCategory } from '../types';
import { DUMMY_ACCOUNTS } from '../utils/dummyData';

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: TransactionFilters) => void;
}

export interface TransactionFilters {
  dateRange: DateRangeFilter;
  type: TransactionType;
  categories: ExpenseCategory[];
  accounts: string[];
  amountRange?: AmountRange;
  sortBy: SortOption;
}

export type DateRangeFilter = 
  | 'all'
  | 'today' 
  | 'thisWeek' 
  | 'lastWeek' 
  | 'thisMonth' 
  | 'lastMonth'
  | 'last3Months'
  | 'thisYear'
  | 'custom';

export type TransactionType = 'all' | 'expense' | 'income' | 'transfer';

export interface AmountRange {
  min?: number;
  max?: number;
}

export interface SortOption {
  field: 'date' | 'amount' | 'title';
  direction: 'asc' | 'desc';
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({ visible, onClose, onApply }) => {
  const { colors } = useTheme();
  
  // Default filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'thisMonth',
    type: 'all',
    categories: [],
    accounts: [],
    amountRange: undefined,
    sortBy: { field: 'date', direction: 'desc' },
  });
  
  // Date range options
  const dateRangeOptions: Array<{ id: DateRangeFilter; label: string }> = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'lastWeek', label: 'Last Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'last3Months', label: 'Last 3 Months' },
    { id: 'thisYear', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];
  
  // Transaction type options
  const typeOptions: Array<{ id: TransactionType; label: string }> = [
    { id: 'all', label: 'All Types' },
    { id: 'expense', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'transfer', label: 'Transfers' }
  ];
  
  // Category options based on ExpenseCategory enum
  const categoryOptions = Object.values(ExpenseCategory).map(category => ({
    id: category,
    label: category
  }));
  
  // Account options based on DUMMY_ACCOUNTS
  const accountOptions = DUMMY_ACCOUNTS.map(account => ({
    id: account.id,
    label: account.name
  }));
  
  // Sort options
  const sortOptions = [
    { id: 'dateDesc', label: 'Newest First', value: { field: 'date' as const, direction: 'desc' as const } },
    { id: 'dateAsc', label: 'Oldest First', value: { field: 'date' as const, direction: 'asc' as const } },
    { id: 'amountDesc', label: 'Highest Amount', value: { field: 'amount' as const, direction: 'desc' as const } },
    { id: 'amountAsc', label: 'Lowest Amount', value: { field: 'amount' as const, direction: 'asc' as const } },
  ];
  
  // Handler for filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Toggle item in array filter (categories, accounts)
  const toggleArrayItem = (array: any[], item: any) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };
  
  // Apply filters and close modal
  const handleApply = () => {
    onApply(filters);
    onClose();
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      dateRange: 'thisMonth',
      type: 'all',
      categories: [],
      accounts: [],
      amountRange: undefined,
      sortBy: { field: 'date', direction: 'desc' },
    });
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Filter Transactions</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Date Range Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Date Range</Text>
              <View style={styles.optionsGrid}>
                {dateRangeOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: filters.dateRange === option.id ? colors.primary : colors.background,
                        borderColor: filters.dateRange === option.id ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => handleFilterChange('dateRange', option.id)}
                  >
                    <Text 
                      style={[
                        styles.chipText, 
                        { color: filters.dateRange === option.id ? '#fff' : colors.text }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Transaction Type Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction Type</Text>
              <View style={styles.optionsRow}>
                {typeOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.pill,
                      { 
                        backgroundColor: filters.type === option.id ? colors.primary : colors.background,
                        borderColor: filters.type === option.id ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => handleFilterChange('type', option.id)}
                  >
                    <Text 
                      style={[
                        styles.pillText, 
                        { color: filters.type === option.id ? '#fff' : colors.text }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Categories Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
              <View style={styles.optionsGrid}>
                {categoryOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: filters.categories.includes(option.id) ? colors.primary : colors.background,
                        borderColor: filters.categories.includes(option.id) ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => handleFilterChange('categories', toggleArrayItem(filters.categories, option.id))}
                  >
                    <Text 
                      style={[
                        styles.chipText, 
                        { color: filters.categories.includes(option.id) ? '#fff' : colors.text }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Accounts Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Accounts</Text>
              <View style={styles.optionsGrid}>
                {accountOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: filters.accounts.includes(option.id) ? colors.primary : colors.background,
                        borderColor: filters.accounts.includes(option.id) ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => handleFilterChange('accounts', toggleArrayItem(filters.accounts, option.id))}
                  >
                    <Text 
                      style={[
                        styles.chipText, 
                        { color: filters.accounts.includes(option.id) ? '#fff' : colors.text }
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Sort By */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sort By</Text>
              <View style={styles.optionsRow}>
                {sortOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.pill,
                      { 
                        backgroundColor: 
                          filters.sortBy.field === option.value.field && 
                          filters.sortBy.direction === option.value.direction 
                            ? colors.primary 
                            : colors.background,
                        borderColor: 
                          filters.sortBy.field === option.value.field && 
                          filters.sortBy.direction === option.value.direction
                            ? colors.primary 
                            : colors.border,
                      }
                    ]}
                    onPress={() => handleFilterChange('sortBy', option.value)}
                  >
                    <Text 
                      style={[
                        styles.pillText, 
                        { 
                          color: 
                            filters.sortBy.field === option.value.field && 
                            filters.sortBy.direction === option.value.direction
                              ? '#fff' 
                              : colors.text 
                        }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.border }]} onPress={onClose}>
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]} 
              onPress={handleApply}
            >
              <Text style={{ color: '#fff' }}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    width: '100%',
    maxHeight: '80%',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  pillText: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default TransactionFilterModal;
