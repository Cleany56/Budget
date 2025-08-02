import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { Expense, AccountSummary } from '../types';
import { AccountType } from '../types';
import { DUMMY_EXPENSES, DUMMY_ACCOUNTS } from '../utils/dummyData';
import { getDisplayTransactionSections } from '../utils/transactionUtils';
import { mapToDisplayTransaction } from '../utils/transactionDisplay';
import { getTransactionIconComponent } from '../utils/transactionIcons';
import AccountDropdown from '../components/AccountDropdown';
import StatSwitcher from '../components/StatSwitcher';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';

interface HomeScreenProps {
  toggleDarkMode?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ toggleDarkMode: toggleDarkModeProp }) => {
  const { darkMode, colors, toggleDarkMode: themeToggleDarkMode } = useTheme();
  const toggleDarkModeFn = toggleDarkModeProp || themeToggleDarkMode;
  // Use dummy data for now
  const expenses: Expense[] = DUMMY_EXPENSES;
  const accounts: AccountSummary[] = DUMMY_ACCOUNTS;
  const groupedByDate = getDisplayTransactionSections(expenses, accounts, 10);

  // Group accounts by AccountType (not by name), so multiple accounts of the same type appear under the same dropdown
  
  const accountTypes: AccountType[] = ['Bank', 'Investment', 'Credit Card', 'Checking', 'Savings'];
  const groupedAccounts = accountTypes
    .map(type => ({
      type,
      accounts: accounts.filter(acc => acc.type === type)
    }))
    .filter(group => group.accounts.length > 0);

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
      <StatSwitcher />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Accounts</Text>
      <View style={styles.accountDropdowns}>
        {groupedAccounts.map(group => (
          <AccountDropdown key={group.type} type={group.type} accounts={group.accounts} />
        ))}
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Transactions</Text>
    </View>
  );

  return (
    <AppLayout date={dayString} toggleDarkMode={toggleDarkModeFn}>
      <SectionList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        sections={groupedByDate}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>{ListHeader()}</View>}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.dateLabelContainer, { backgroundColor: colors.card, shadowColor: colors.text + '22', marginLeft: 20 }] }>
            <Text style={[styles.dateLabelText, { color: colors.text }]}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const tx = mapToDisplayTransaction(item);
          const amountColor = tx.isExpense ? '#e17055' : '#27ae60';
          const IconComponent = getTransactionIconComponent(tx.type);
          // Use theme card color for icon background
          const iconBoxBg = colors.card;
          // Use theme muted color for notes text
          const notesColor = colors.muted;
          return (
            <View style={[styles.expenseItem, { borderBottomColor: colors.border, marginHorizontal: 20 }] }>
              <View style={[styles.iconBox, { backgroundColor: iconBoxBg }] }>
                {typeof IconComponent === 'function' ? (
                  <IconComponent width={24} height={24} />
                ) : null}
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={[styles.expenseTitle, { color: colors.text }]}>{tx.merchant}</Text>
                {item.notes ? (
                  <Text style={[styles.expenseType, { color: notesColor }]} numberOfLines={1}>{item.notes}</Text>
                ) : null}
              </View>
              <Text style={[styles.expenseAmount, { color: amountColor }]}>{tx.sign}${tx.amount.toFixed(2)}</Text>
            </View>
          );
        }}
        stickySectionHeadersEnabled={false}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
      />
    </AppLayout>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    // Use theme color for background
    // backgroundColor is set inline from colors.background
  },

  accountDropdowns: {
    marginBottom: 16,
  },
  summaryBox: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    // backgroundColor is set inline from colors.card
  },
  summaryLabel: {
    fontSize: 16,
    // color is set inline from colors.textSecondary
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    // color is set inline from colors.primary
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    // borderBottomColor is set inline from colors.border
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    // backgroundColor is set inline from colors.card
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 1,
    // shadowColor is set inline from colors.shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  expenseTitle: {
    fontSize: 16,
    // color is set inline from colors.text
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    // color is set inline from amountColor
  },
  expenseType: {
    fontSize: 13,
    // color is set inline from colors.textSecondary
    marginTop: 2,
    marginBottom: 0,
  },
  expenseNotes: {
    fontSize: 12,
    // color is set inline from colors.textTertiary
    fontStyle: 'italic',
    marginTop: 1,
  },
  expenseIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  placeholderBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    // backgroundColor is set inline from colors.card
  },
  placeholderText: {
    // color is set inline from colors.textTertiary
    fontStyle: 'italic',
  },
  dateLabelContainer: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 16,
    marginBottom: 4,
    marginLeft: 2,
    // backgroundColor is set inline from colors.card
    elevation: 2,
    // shadowColor is set inline from colors.shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dateLabelText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
    // color is set inline from colors.text
  },
// IMPORTANT: For every new component, always use theme colors from the colors object for all color and backgroundColor styles.
});

export default HomeScreen;
