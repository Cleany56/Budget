import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AccountSummary } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface AccountDropdownProps {
  type: string;
  accounts: AccountSummary[];
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ type, accounts }) => {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }] }>
      <TouchableOpacity onPress={() => setExpanded((prev) => !prev)} style={[styles.header, { backgroundColor: colors.secondary }] }>
        <View style={styles.headerLeft}>
          <Text style={[styles.type, { color: colors.text }]}>{type}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.total, { color: colors.text }] }>
            {(accounts[0]?.currency === 'USD' || !accounts[0]?.currency) ? '$' : accounts[0]?.currency}
            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.arrow, { color: colors.text }]}>{expanded ? '\u2192' : '\u25BC'}</Text>
        </View>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.accountRow, { backgroundColor: colors.secondary, borderTopColor: colors.border }] }>
              <Text style={[styles.accountName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.accountBalance, { color: colors.text }] }>
                {(item.currency === 'USD' || !item.currency) ? '$' : item.currency}
                {item.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f4f8fb',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#eaf6fb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
    color: '#888',
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0984e3',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  accountName: {
    fontSize: 15,
  },
  accountBalance: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#636e72',
  },
});

export default AccountDropdown;
