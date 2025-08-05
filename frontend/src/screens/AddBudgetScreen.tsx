import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { ExpenseCategory } from '../types';
import { handleCurrencyInput, formatCurrencyOnBlur } from '../utils/formatters';
import { saveBudgets } from '../utils/budgetUtils';
import { Ionicons } from '@expo/vector-icons';

// Import custom components
import BudgetTypeSelector from '../components/budget/BudgetTypeSelector';
import MonthPicker from '../components/budget/MonthPicker';
import CategoryBudgetInputs from '../components/budget/CategoryBudgetInputs';

const AddBudgetScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  
  // Format the selected month and year as a string
  const month = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }) + ' ' + selectedYear;
  
  const [budgetType, setBudgetType] = useState<'monthly' | 'recurring'>('monthly');
  
  // Initialize budget amounts for each category
  const [budgetAmounts, setBudgetAmounts] = useState<Record<ExpenseCategory, string>>(
    Object.values(ExpenseCategory).reduce((acc, category) => {
      acc[category] = '';
      return acc;
    }, {} as Record<ExpenseCategory, string>)
  );
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleMonthSelection = (month: number) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };
  
  const handleYearChange = (increment: number) => {
    setSelectedYear(prevYear => prevYear + increment);
  };
  
  const handleBudgetChange = (category: ExpenseCategory, value: string) => {
    const formattedValue = handleCurrencyInput(value, (newValue) => {
      setBudgetAmounts(prev => ({
        ...prev,
        [category]: newValue
      }));
    });
  };
  
  const handleBudgetBlur = (category: ExpenseCategory) => {
    formatCurrencyOnBlur(budgetAmounts[category], (newValue) => {
      setBudgetAmounts(prev => ({
        ...prev,
        [category]: newValue
      }));
    });
  };

  return (
    <AppLayout 
      toggleDarkMode={toggleDarkMode}
      showBack={true}
      onBackPress={handleBackPress}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Create Budget</Text>
        
        <View style={styles.formContainer}>
          {/* Budget Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Budget Type</Text>
            <BudgetTypeSelector 
              budgetType={budgetType}
              setBudgetType={setBudgetType}
              colors={colors}
            />
          </View>

          {/* Month selector - only show for monthly budget */}
          {budgetType === 'monthly' && (
            <MonthPicker
              month={month}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              showMonthPicker={showMonthPicker}
              setShowMonthPicker={setShowMonthPicker}
              handleYearChange={handleYearChange}
              handleMonthSelection={handleMonthSelection}
              colors={colors}
            />
          )}
          
          <View style={[styles.categoryBudgetsContainer, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {budgetType === 'monthly' 
                ? `Set ${month} Budget Amounts` 
                : 'Set Recurring Monthly Budget Amounts'}
            </Text>
            
            {/* Category budget inputs */}
            <CategoryBudgetInputs 
              categories={Object.values(ExpenseCategory)}
              budgetAmounts={budgetAmounts}
              handleBudgetChange={handleBudgetChange}
              colors={colors}
            />
          </View>
          
          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={async () => {
              // Validate if at least one category has a budget amount
              const hasAnyBudget = Object.values(budgetAmounts).some(amount => amount.trim() !== '');
              
              if (!hasAnyBudget) {
                Alert.alert(
                  'Missing Budget Amounts',
                  'Please set at least one budget amount before saving.',
                  [{ text: 'OK' }]
                );
                return;
              }
              
              try {
                await saveBudgets(budgetAmounts, budgetType, month);
                Alert.alert(
                  'Budget Saved',
                  budgetType === 'monthly' 
                    ? `Your budget for ${month} has been created.`
                    : 'Your recurring budget has been created.',
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              } catch (err) {
                Alert.alert('Error', 'Failed to save budget(s). Please try again.');
              }
              
            }}
          >
            <Text style={[styles.saveButtonText, { color: 'white' }]}>
              {budgetType === 'monthly' ? 'Save Monthly Budget' : 'Save Recurring Budget'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryBudgetsContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBudgetScreen;
