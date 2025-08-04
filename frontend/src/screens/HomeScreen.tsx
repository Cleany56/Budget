import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { HomeHeader } from '../components/HomeHeader';
import { TransactionList } from '../components/TransactionList';
import { useHomeData } from '../hooks/useHomeData';

interface HomeScreenProps {
  toggleDarkMode?: () => void;
}

/**
 * Main HomeScreen component with optimized structure and API integration
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ toggleDarkMode: toggleDarkModeProp }) => {
  const { colors, toggleDarkMode: themeToggleDarkMode } = useTheme();
  const navigation = useNavigation();
  const toggleDarkModeFn = toggleDarkModeProp || themeToggleDarkMode;
  
  // Use custom hook for data fetching and state management
  const { 
    data: { expenses, accounts, budgets, goals },
    loading,
    error,
    loadData
  } = useHomeData();
  
  useEffect(() => {
    // Initial data load
    loadData();
    
    // Set up focus listener to reload data when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    
    // Clean up listener on unmount
    return unsubscribe;
  }, [navigation, loadData]);
  
  // Get current day string
  const today = new Date();
  const dayString = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppLayout date={dayString} toggleDarkMode={toggleDarkModeFn}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <HomeHeader 
          accounts={accounts}
          budgets={budgets}
          goals={goals}
          loading={loading}
          error={error}
          colors={colors}
          onDataRefresh={loadData}
        />
        
        {/* Transactions List */}
        <TransactionList 
          expenses={expenses}
          accounts={accounts}
          loading={loading.expenses}
          error={error.expenses}
          onRetry={loadData}
        />
      </ScrollView>
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  }
});

export default HomeScreen;
