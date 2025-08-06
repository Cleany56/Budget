import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { ExpenseCategory, AccountSummary, AccountType } from '../types';
import { getAccounts, fixAccountsWithMissingIds } from '../services/api/accounts';
import { createTransaction } from '../services/api/transactions';
import apiClient from '../services/api/config';

const AddTransactionScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isIncome, setIsIncome] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  
  // Accounts state
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [savingTransaction, setSavingTransaction] = useState<boolean>(false);
  
  // Debug selectedAccountId changes
  useEffect(() => {
    console.log("EFFECT - selectedAccountId changed to:", selectedAccountId);
  }, [selectedAccountId]);
  
  // Function to reload accounts from the server
  const reloadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      console.log("Reloading accounts from server...");
      
      const freshAccounts = await getAccounts(false);
      console.log(`Loaded ${freshAccounts.length} accounts from server`);
      
      if (freshAccounts.length === 0) {
        Alert.alert('No Accounts', 'No accounts found. Please add an account first.');
        return;
      }
      
      // Set the accounts
      setAccounts(freshAccounts);
      
      // Find a suitable default account
      const defaultAccount = freshAccounts.find(a => 
        !isIncome ? 
          (a.type === 'Checking' || a.type === 'Savings') : 
          (a.type === 'Checking')
      ) || freshAccounts[0];
      
      console.log("Setting default account to:", defaultAccount.name, defaultAccount.id);
      setSelectedAccountId(defaultAccount.id);
    } catch (error) {
      console.error('Failed to reload accounts:', error);
      // Show an error message with option to fix accounts
      Alert.alert(
        'Account Loading Error',
        'There was an error loading your accounts. Would you like to try to fix the account data?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Fix Accounts',
            onPress: async () => {
              try {
                console.log("Attempting to fix accounts...");
                
                // Use the new function from accounts service
                const fixedCount = await fixAccountsWithMissingIds();
                
                Alert.alert(
                  'Accounts Fixed', 
                  `${fixedCount} accounts were fixed. Please reload the accounts list.`,
                  [{ text: 'OK', onPress: reloadAccounts }]
                );
              } catch (fixError) {
                console.error("Failed to fix accounts:", fixError);
                Alert.alert('Error', 'Failed to fix accounts. Please contact support.');
              }
            }
          }
        ]
      );
    } finally {
      setLoadingAccounts(false);
    }
  };
  
  // Filter accounts based on transaction type (expense vs income)
  const filteredAccounts = accounts.filter(account => {
    if (!isIncome) {
      // For expenses, we want checking/savings accounts and credit cards
      return account.type === 'Checking' || 
             account.type === 'Savings' || 
             account.type === 'Credit Card';
    } 
    // For income, we only want deposit accounts (no credit cards)
    return account.type === 'Checking' || 
           account.type === 'Savings' || 
           account.type === 'Bank';
  });
  
  // Debug: Log account state information
  useEffect(() => {
    console.log("DEBUG - Current account selection state:");
    console.log("Selected Account ID:", selectedAccountId);
    console.log("Total accounts:", accounts.length);
    console.log("Filtered accounts:", filteredAccounts.length);
    console.log("First account ID (if any):", filteredAccounts.length > 0 ? filteredAccounts[0].id : "none");
    
    if (selectedAccountId) {
      const selectedAccount = accounts.find(a => a.id === selectedAccountId);
      console.log("Selected account found:", selectedAccount ? "yes" : "no");
      if (selectedAccount) {
        console.log("Selected account name:", selectedAccount.name);
      }
    }
  }, [selectedAccountId, accounts, filteredAccounts]);
  
  // Effect to update selected account when filteredAccounts changes
  useEffect(() => {
    console.log("Filtered accounts changed - length:", filteredAccounts.length);
    
    if (filteredAccounts.length > 0) {
      // Check if current selection is valid in filtered list
      const isCurrentSelectionValid = filteredAccounts.some(account => account.id === selectedAccountId);
      console.log("Is current selection valid:", isCurrentSelectionValid);
      
      if (!isCurrentSelectionValid || !selectedAccountId) {
        // If not valid or undefined, select the first account in filtered list
        console.log("Updating selected account to:", filteredAccounts[0].name);
        setSelectedAccountId(filteredAccounts[0].id);
      }
    } else if (selectedAccountId) {
      // No accounts available, clear selection
      console.log("No filtered accounts available, clearing selection");
      setSelectedAccountId('');
    }
  }, [filteredAccounts, isIncome]);
  
  // Load accounts when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true);
        const fetchedAccounts = await getAccounts(false);
        
        console.log("FETCH - Got accounts:", fetchedAccounts.length);
        
        if (fetchedAccounts.length === 0) {
          console.log("FETCH - No accounts available");
          setAccounts([]);
          setLoadingAccounts(false);
          return;
        }
        
        // First set the accounts array to update filteredAccounts
        setAccounts(fetchedAccounts);
        
        // Get suitable accounts for the current transaction type
        const suitableAccounts = fetchedAccounts.filter(account => {
          if (!isIncome) {
            return account.type === 'Checking' || 
                   account.type === 'Savings' || 
                   account.type === 'Credit Card';
          } else {
            return account.type === 'Checking' || 
                   account.type === 'Savings' || 
                   account.type === 'Bank';
          }
        });
        
        console.log("FETCH - Suitable accounts:", suitableAccounts.length);
        
        if (suitableAccounts.length > 0) {
          // Set default account based on transaction type
          let defaultAccount;
          
          // For either type: prefer Checking account
          defaultAccount = suitableAccounts.find(a => a.type === 'Checking');
          
          // Fallback to first suitable account if no checking account found
          if (!defaultAccount) {
            defaultAccount = suitableAccounts[0];
          }
          
          console.log("FETCH - Setting default account:", defaultAccount.name, defaultAccount.id);
          
          // IMPORTANT: Immediately set the selected account ID
          setSelectedAccountId(defaultAccount.id);
        } else if (fetchedAccounts.length > 0) {
          // No suitable accounts for this transaction type, but we have some accounts
          // Just use the first account as fallback
          console.log("FETCH - No suitable accounts, using first available:", fetchedAccounts[0].name);
          setSelectedAccountId(fetchedAccounts[0].id);
        }
      } catch (error) {
        console.error('Failed to load accounts:', error);
        Alert.alert('Error', 'Failed to load accounts. Please try again.');
      } finally {
        setLoadingAccounts(false);
      }
    };
    
    fetchAccounts();
  }, [isIncome]); // Re-fetch and reset when income/expense toggle changes

  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Helper function to validate if an account is properly selected
  const validateAccountSelection = () => {
    console.log("VALIDATION - Validating account ID:", selectedAccountId);
    console.log("VALIDATION - All account IDs:", accounts.map(a => a.id));
    
    if (!selectedAccountId) {
      console.log("VALIDATION - Account ID is undefined!");
      return false;
    }
    
    if (selectedAccountId === '') {
      console.log("VALIDATION - Account ID is empty string!");
      return false;
    }
    
    // Check if the selected account ID exists in the accounts list
    const selectedAccount = accounts.find(a => a.id === selectedAccountId);
    console.log("VALIDATION - Found account:", selectedAccount ? selectedAccount.name : "not found");
    
    if (!selectedAccount) {
      console.log("VALIDATION - Selected account not found in accounts list");
      
      // Try a more flexible search if exact match fails
      const fuzzyMatch = accounts.find(a => 
        a.id && selectedAccountId && 
        (a.id.includes(selectedAccountId) || selectedAccountId.includes(a.id))
      );
      
      if (fuzzyMatch) {
        console.log("VALIDATION - Found fuzzy match instead:", fuzzyMatch.name, fuzzyMatch.id);
        // Update the selected ID to use the fuzzy match
        setSelectedAccountId(fuzzyMatch.id);
        return true;
      }
      
      return false;
    }
    
    // Additional check: is it in the filtered accounts list?
    const isInFilteredList = filteredAccounts.some(a => a.id === selectedAccountId);
    console.log("VALIDATION - Account in filtered list:", isInFilteredList);
    
    // Check if the ID in the account object matches the selectedAccountId
    if (selectedAccount.id !== selectedAccountId) {
      console.log("VALIDATION - Account ID mismatch! Object has:", selectedAccount.id);
      // Fix by updating the selection to match what's in the object
      setSelectedAccountId(selectedAccount.id);
    }
    
    return true;
  };

  const handleSave = async () => {
    // Validate inputs
    console.log("Saving transaction with accountId:", selectedAccountId);
    console.log("Available accounts:", filteredAccounts);
    console.log("All accounts:", accounts);
    console.log("Currently selected account type:", isIncome ? "Income" : "Expense");
    console.log("Selected account details:", accounts.find(a => a.id === selectedAccountId));

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Extended account validation with more detailed error message
    if (!validateAccountSelection()) {
      console.log("ERROR: Invalid account selection!");
      Alert.alert(
        'Account Required', 
        'Please select a valid account for this transaction.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    try {
      setSavingTransaction(true);
      
      // Prepare amount value (negative for expenses, positive for income)
      let amountValue = parseFloat(amount);
      if (!isIncome) {
        amountValue = -Math.abs(amountValue); // Make sure expense is negative
      }
      
      // Get the current account object
      const selectedAccount = accounts.find(a => a.id === selectedAccountId);
      
      if (!selectedAccount) {
        console.error("Cannot create transaction: selected account not found");
        console.log("Available accounts:", accounts.map(a => ({ id: a.id, name: a.name })));
        console.log("Looking for account ID:", selectedAccountId);
        Alert.alert('Error', 'Selected account information could not be found.');
        return;
      }
      
      // Double-check that the ID is valid
      if (!selectedAccount.id) {
        console.error("Account ID is missing in the selected account object");
        Alert.alert('Error', 'Selected account has no valid ID. Please try selecting a different account.');
        return;
      }
      
      console.log("SAVE - Creating transaction with account:", selectedAccount.name, selectedAccount.id);
      
      // Create transaction object with explicit ID verification
      const transaction = {
        title: description,
        amount: amountValue,
        date: new Date(date),
        category: isIncome ? ExpenseCategory.OTHER : category, // Default income to "Other"
        notes: '',
        accountId: selectedAccount.id // Use the verified account ID
      };
      
      console.log("SAVE - Transaction data:", transaction);
      
      // Send to API
      await createTransaction(transaction);
      
      // Show success message and navigate back
      Alert.alert(
        'Success', 
        'Transaction added successfully', 
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error('Failed to save transaction:', error);
      
      // Provide more helpful error message based on the error
      let errorMessage = 'Failed to save transaction. Please try again.';
      
      if (error.message && error.message.includes('generated account ID')) {
        errorMessage = 'Cannot create transaction with this account. Please reload the app and select a valid account.';
      } else if (error.response && error.response.data && error.response.data.message) {
        // Extract error message from API response if available
        errorMessage = `Error: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      Alert.alert(
        'Transaction Failed', 
        errorMessage,
        [
          { 
            text: 'OK', 
            style: 'cancel' 
          },
          { 
            text: 'Reload Accounts', 
            onPress: () => {
              // Reload accounts
              setLoadingAccounts(true);
              getAccounts(false)
                .then(newAccounts => {
                  setAccounts(newAccounts);
                  if (newAccounts.length > 0) {
                    setSelectedAccountId(newAccounts[0].id);
                  }
                })
                .catch(err => {
                  console.error('Failed to reload accounts:', err);
                  Alert.alert('Error', 'Failed to reload accounts. Please restart the app.');
                })
                .finally(() => {
                  setLoadingAccounts(false);
                });
            } 
          }
        ]
      );
    } finally {
      setSavingTransaction(false);
    }
  };

  return (
    <AppLayout 
      toggleDarkMode={toggleDarkMode}
      showBack={true}
      onBackPress={handleBackPress}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Add Transaction</Text>
        
        <View style={styles.formContainer}>
          {/* Transaction type selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton, 
                isIncome ? styles.typeButtonInactive : styles.typeButtonActive,
                { borderColor: colors.border }
              ]}
              onPress={() => {
                setIsIncome(false);
                // Update account selection for expenses
                if (accounts.length > 0) {
                  const suitableAccount = accounts.find(a => 
                    a.type === 'Checking' || a.type === 'Savings' || a.type === 'Credit Card'
                  ) || accounts[0];
                  setSelectedAccountId(suitableAccount.id);
                  console.log("Switched to Expense, selected account:", suitableAccount.name);
                }
              }}
            >
              <Text style={[
                styles.typeButtonText, 
                { color: isIncome ? colors.secondary : colors.text }
              ]}>
                Expense
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton, 
                isIncome ? styles.typeButtonActive : styles.typeButtonInactive,
                { borderColor: colors.border }
              ]}
              onPress={() => {
                setIsIncome(true);
                // Update account selection for income
                if (accounts.length > 0) {
                  const suitableAccount = accounts.find(a => 
                    a.type === 'Checking' || a.type === 'Savings' || a.type === 'Bank'
                  ) || accounts[0];
                  setSelectedAccountId(suitableAccount.id);
                  console.log("Switched to Income, selected account:", suitableAccount.name);
                }
              }}
            >
              <Text style={[
                styles.typeButtonText, 
                { color: isIncome ? colors.text : colors.secondary }
              ]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Amount input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <View style={[styles.amountInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.secondary}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>
          
          {/* Description input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this for?"
              placeholderTextColor={colors.secondary}
              autoCapitalize="sentences"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
          
          {/* Category picker (only for expenses) */}
          {!isIncome && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue as ExpenseCategory)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  {Object.values(ExpenseCategory).map((cat, index) => (
                    <Picker.Item key={`category-${cat}-${index}`} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          
          {/* Account picker */}
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.label, { color: colors.text }]}>Account</Text>
              <TouchableOpacity 
                onPress={reloadAccounts} 
                disabled={loadingAccounts}
                style={{ padding: 8 }}
              >
                <Text style={{ color: colors.primary }}>
                  {loadingAccounts ? 'Loading...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              {loadingAccounts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.text }]}>Loading accounts...</Text>
                </View>
              ) : filteredAccounts.length === 0 ? (
                <Text style={[styles.noAccountsText, { color: colors.error }]}>
                  No compatible accounts found
                </Text>
              ) : (
                <>
                  {/* Account status info */}
                  <Text style={{ color: colors.primary, padding: 4, fontSize: 12 }}>
                    {accounts.length} accounts loaded • {filteredAccounts.length} compatible
                  </Text>
                  
                  <Picker
                    selectedValue={selectedAccountId || ""}
                    onValueChange={(itemValue) => {
                      console.log("PICKER - Account selected:", itemValue);
                      if (itemValue) {
                        setSelectedAccountId(itemValue.toString());
                      }
                    }}
                    style={[styles.picker, { color: colors.text }]}
                    dropdownIconColor={colors.text}
                    prompt="Select an account"
                  >
                    {/* No empty option - force a selection */}
                    {filteredAccounts.map((account, index) => {
                      // Ensure the account has a valid ID
                      if (!account.id) {
                        console.error("Account missing ID:", account.name);
                        return null;
                      }
                      
                      return (
                        <Picker.Item 
                          key={`account-${account.id || index}-${index}`} 
                          label={`${account.name} (${account.type}) - $${account.balance.toFixed(2)}`} 
                          value={account.id} 
                        />
                      );
                    })}
                  </Picker>
                </>
              )}
            </View>
          </View>

          {/* Date input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Date</Text>
            <TouchableOpacity 
              style={[styles.datePickerButton, { borderColor: colors.border, backgroundColor: colors.card }]}
              // Would normally open a date picker
            >
              <Text style={[styles.dateText, { color: colors.text }]}>{date}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveButton, 
              { backgroundColor: colors.primary },
              savingTransaction && { opacity: 0.7 }
            ]}
            onPress={handleSave}
            disabled={savingTransaction || loadingAccounts}
          >
            {savingTransaction ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="white" size="small" />
                <Text style={[styles.saveButtonText, { color: 'white', marginLeft: 8 }]}>Saving...</Text>
              </View>
            ) : (
              <Text style={[styles.saveButtonText, { color: 'white' }]}>Save Transaction</Text>
            )}
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  typeButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  typeButtonInactive: {
    backgroundColor: 'transparent',
  },
  typeButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  currencySymbol: {
    fontSize: 20,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 50,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Account selection styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  noAccountsText: {
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default AddTransactionScreen;
