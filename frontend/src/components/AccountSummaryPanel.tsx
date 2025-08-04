import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AccountSummary } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

// Interface for a simplified account display with a label and value
interface AccountDisplayItem {
  id: string;
  label: string;
  value: number;
  type: string;
  isNegative?: boolean;
}

interface AccountSummaryPanelProps {
  accounts: AccountSummary[];
}

const AccountSummaryPanel: React.FC<AccountSummaryPanelProps> = ({ accounts }) => {
  const { colors } = useTheme();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Calculate account summary information
  const calculateNetCash = (): number => {
    // Calculate total checking and savings
    const checkingSavingsTotal = accounts.reduce((sum, account) => {
      if (account.type === 'Checking' || account.type === 'Savings') {
        return sum + account.balance;
      }
      return sum;
    }, 0);
    
    // Calculate credit card balance (as a positive number)
    const creditCardBalance = Math.abs(accounts.reduce((sum, account) => {
      if (account.type === 'Credit Card') {
        return sum + account.balance;
      }
      return sum;
    }, 0));
    
    // Net cash is checking + savings - credit card balance
    return checkingSavingsTotal - creditCardBalance;
  };

  // Calculate account values
  const checkingTotal = accounts.filter(a => a.type === 'Checking')
    .reduce((sum, account) => sum + account.balance, 0);
  const savingsTotal = accounts.filter(a => a.type === 'Savings')
    .reduce((sum, account) => sum + account.balance, 0);
  const creditCardTotal = Math.abs(accounts.filter(a => a.type === 'Credit Card')
    .reduce((sum, account) => sum + account.balance, 0));
  const netCashValue = calculateNetCash();
  
  // Format display accounts as shown in the image
  const displayAccounts: AccountDisplayItem[] = [
    {
      id: 'checking',
      label: 'Checking',
      value: checkingTotal,
      type: 'Checking'
    },
    {
      id: 'card',
      label: 'Card Balance',
      value: creditCardTotal,
      type: 'Credit Card',
      isNegative: true
    },
    {
      id: 'netcash',
      label: 'Net Cash',
      value: netCashValue,
      type: 'Summary'
    },
    {
      id: 'savings',
      label: 'Savings',
      value: savingsTotal,
      type: 'Savings'
    },
    {
      id: 'investments',
      label: 'Investments',
      value: accounts.filter(a => a.type === 'Investment')
        .reduce((sum, account) => sum + account.balance, 0),
      type: 'Investment'
    }
  ];

  // Toggle expansion of an account
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  // Format currency
  const formatCurrency = (value: number, isNegative: boolean = false): string => {
    const absValue = Math.abs(value);
    const formatted = absValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatted;
  };

  // Get icon for account type
  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'Checking':
        return <MaterialIcons name="account-balance" size={20} color={colors.text} />;
      case 'Credit Card':
        return <MaterialIcons name="credit-card" size={20} color={colors.text} />;
      case 'Summary':
        return <MaterialIcons name="attach-money" size={20} color={colors.text} />;
      case 'Savings':
        return <MaterialIcons name="savings" size={20} color={colors.text} />;
      case 'Investment':
        return <MaterialIcons name="trending-up" size={20} color={colors.text} />;
      default:
        return <MaterialIcons name="account-balance" size={20} color={colors.text} />;
    }
  };

  // Determine color for balance
  const getBalanceColor = (item: AccountDisplayItem) => {
    if (item.id === 'netcash') {
      return item.value >= 0 ? '#4CAF50' : '#e74c3c';
    }
    if (item.isNegative) {
      return '#e74c3c';
    }
    return colors.text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ACCOUNTS</Text>
        <View style={styles.headerTimeContainer}>
          <Text style={[styles.headerTime, { color: colors.muted }]}>
            as of about 19 hours ago | 
          </Text>
          <TouchableOpacity>
            <Text style={[styles.syncText, { color: colors.primary }]}>Sync now</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.accountsList, { backgroundColor: colors.card }]}>
        {displayAccounts.map((item) => (
          <View key={item.id}>
            <TouchableOpacity 
              style={styles.accountItem} 
              onPress={() => item.id !== 'netcash' && toggleExpand(item.id)}
            >
              <View style={styles.accountLeft}>
                {getAccountIcon(item.type)}
                <Text style={[styles.accountLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <View style={styles.accountRight}>
                <Text 
                  style={[
                    styles.accountValue, 
                    { color: getBalanceColor(item) }
                  ]}
                >
                  {formatCurrency(item.value, item.isNegative)}
                </Text>
                
                {item.id !== 'netcash' && (
                  <MaterialIcons 
                    name={expandedIds.includes(item.id) ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color={colors.text} 
                  />
                )}
                
                {item.id === 'netcash' && (
                  <MaterialIcons name="info-outline" size={18} color={colors.muted} />
                )}
              </View>
            </TouchableOpacity>
            
            {/* Expanded subaccounts would go here */}
            {expandedIds.includes(item.id) && (
              <View style={styles.expandedContent}>
                {accounts
                  .filter(account => account.type === item.type)
                  .map(account => (
                    <View key={account.id} style={[styles.subAccountItem, { borderTopColor: colors.border }]}>
                      <Text style={[styles.subAccountName, { color: colors.text }]}>{account.name}</Text>
                      <Text style={[styles.subAccountBalance, { color: colors.text }]}>
                        {formatCurrency(account.balance)}
                      </Text>
                    </View>
                  ))
                }
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTime: {
    fontSize: 12,
  },
  headerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
  },
  accountsList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  expandedContent: {
    borderTopWidth: 0,
  },
  subAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  subAccountName: {
    fontSize: 14,
  },
  subAccountBalance: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AccountSummaryPanel;
