import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { ExpenseCategory } from '../types';
import { addBudget, createNewBudget } from '../utils/dataManagement';
import { handleCurrencyInput, formatCurrencyOnBlur } from '../utils/formatters';

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
            <View style={styles.budgetTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.budgetTypeButton, 
                  budgetType === 'monthly' ? [styles.budgetTypeButtonActive, { borderColor: colors.primary }] : { borderColor: colors.border },
                  { backgroundColor: budgetType === 'monthly' ? colors.card : 'transparent' }
                ]}
                onPress={() => setBudgetType('monthly')}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={budgetType === 'monthly' ? colors.primary : colors.text} 
                  style={styles.budgetTypeIcon} 
                />
                <Text style={[
                  styles.budgetTypeText, 
                  { color: budgetType === 'monthly' ? colors.primary : colors.text }
                ]}>
                  Monthly Budget
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.budgetTypeButton, 
                  budgetType === 'recurring' ? [styles.budgetTypeButtonActive, { borderColor: colors.primary }] : { borderColor: colors.border },
                  { backgroundColor: budgetType === 'recurring' ? colors.card : 'transparent' }
                ]}
                onPress={() => setBudgetType('recurring')}
              >
                <Ionicons 
                  name="repeat-outline" 
                  size={20} 
                  color={budgetType === 'recurring' ? colors.primary : colors.text} 
                  style={styles.budgetTypeIcon} 
                />
                <Text style={[
                  styles.budgetTypeText, 
                  { color: budgetType === 'recurring' ? colors.primary : colors.text }
                ]}>
                  Recurring Budget
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Month selector - only show for monthly budget */}
          {budgetType === 'monthly' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Month</Text>
              <TouchableOpacity 
                style={[styles.monthSelector, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => setShowMonthPicker(prev => !prev)}
              >
                <Text style={[styles.monthText, { color: colors.text }]}>{month}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text} />
              </TouchableOpacity>
              
              {showMonthPicker && (
                <View style={[styles.monthPickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.yearSelector}>
                    <TouchableOpacity onPress={() => handleYearChange(-1)}>
                      <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.yearText, { color: colors.text }]}>{selectedYear}</Text>
                    <TouchableOpacity onPress={() => handleYearChange(1)}>
                      <Ionicons name="chevron-forward" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.monthsGrid}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthName = new Date(2000, i).toLocaleString('default', { month: 'short' });
                      const isSelected = selectedMonth === i;
                      return (
                        <TouchableOpacity 
                          key={i}
                          style={[
                            styles.monthItem,
                            isSelected && { backgroundColor: colors.primary }
                          ]}
                          onPress={() => handleMonthSelection(i)}
                        >
                          <Text 
                            style={[
                              styles.monthItemText, 
                              { color: isSelected ? 'white' : colors.text }
                            ]}
                          >
                            {monthName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          )}
          
          <View style={[styles.categoryBudgetsContainer, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {budgetType === 'monthly' 
                ? `Set ${month} Budget Amounts` 
                : 'Set Recurring Monthly Budget Amounts'}
            </Text>
            
            {/* Category budget inputs */}
            {Object.values(ExpenseCategory).map((category) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryLabelContainer}>
                  <View 
                    style={[
                      styles.categoryColor,
                      { backgroundColor: 
                        {
                          [ExpenseCategory.FOOD]: '#4bcffa',
                          [ExpenseCategory.TRANSPORT]: '#ffa801',
                          [ExpenseCategory.ENTERTAINMENT]: '#a55eea',
                          [ExpenseCategory.SHOPPING]: '#ff5e57',
                          [ExpenseCategory.UTILITIES]: '#00b894',
                          [ExpenseCategory.HEALTH]: '#fd79a8',
                          [ExpenseCategory.HOUSING]: '#636e72',
                          [ExpenseCategory.OTHER]: '#f7b731',
                        }[category] 
                      }
                    ]} 
                  />
                  <Text style={[styles.categoryLabel, { color: colors.text }]}>{category}</Text>
                </View>
                
                <View style={[styles.budgetInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                  <TextInput
                    style={[styles.budgetInput, { color: colors.text }]}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    value={budgetAmounts[category]}
                    onChangeText={(value) => handleBudgetChange(category, value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>
            ))}
          </View>
          
          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={() => {
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
              
              // Save each category that has a budget amount
              Object.entries(budgetAmounts).forEach(([category, amountStr]) => {
                if (amountStr.trim() !== '') {
                  const amount = parseFloat(amountStr);
                  
                  if (!isNaN(amount) && amount > 0) {
                    // Create and save the budget
                    const newBudget = createNewBudget(
                      `${category} Budget`,
                      category as ExpenseCategory,
                      amount,
                      budgetType === 'monthly' ? month : undefined,
                      budgetType === 'recurring'
                    );
                    
                    addBudget(newBudget);
                  }
                }
              });
              
              Alert.alert(
                'Budget Saved',
                budgetType === 'monthly' 
                  ? `Your budget for ${month} has been created.`
                  : 'Your recurring budget has been created.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
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
  budgetTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  budgetTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
  },
  budgetTypeButtonActive: {
    borderWidth: 2,
  },
  budgetTypeIcon: {
    marginRight: 8,
  },
  budgetTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  monthText: {
    fontSize: 16,
  },
  monthPickerContainer: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthItem: {
    width: '30%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 8,
  },
  monthItemText: {
    fontSize: 14,
    fontWeight: '500',
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
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 120,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  budgetInput: {
    height: 40,
    fontSize: 16,
    flex: 1,
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
