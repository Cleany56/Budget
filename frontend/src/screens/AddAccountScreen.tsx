import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/formatters/index';

type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Investment' | 'Other';

const AddAccountScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Account connection mode
  const [connectionMode, setConnectionMode] = useState<'manual' | 'automatic'>('manual');
  
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Checking');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [institution, setInstitution] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBalanceChange = (text: string) => {
    // Remove non-numeric characters except for the decimal point
    const formattedValue = text.replace(/[^0-9.]/g, '');
    setBalance(formattedValue);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    if (!balance) {
      Alert.alert('Error', 'Please enter a starting balance');
      return;
    }

    // Here you would typically save the account to your data store
    // For now, just show an alert and navigate back
    Alert.alert(
      'Success', 
      `Account "${accountName}" created successfully!`,
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <AppLayout 
      toggleDarkMode={toggleDarkMode}
      showBack={true}
      onBackPress={handleBackPress}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Add New Account</Text>
        
        <View style={styles.formContainer}>
          {/* Connection Mode Selection */}
          <View style={styles.connectionModeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                connectionMode === 'manual' && [styles.selectedMode, { borderColor: colors.primary }]
              ]}
              onPress={() => setConnectionMode('manual')}
            >
              <Ionicons name="create-outline" size={24} color={connectionMode === 'manual' ? colors.primary : colors.muted} />
              <Text style={[
                styles.modeButtonText,
                { color: connectionMode === 'manual' ? colors.primary : colors.text }
              ]}>
                Manual Entry
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeButton,
                connectionMode === 'automatic' && [styles.selectedMode, { borderColor: colors.primary }]
              ]}
              onPress={() => setConnectionMode('automatic')}
            >
              <Ionicons name="link-outline" size={24} color={connectionMode === 'automatic' ? colors.primary : colors.muted} />
              <Text style={[
                styles.modeButtonText,
                { color: connectionMode === 'automatic' ? colors.primary : colors.text }
              ]}>
                Connect Bank
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Coming Soon message for automatic connection */}
          {connectionMode === 'automatic' && (
            <View style={[styles.comingSoonContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={40} color={colors.primary} />
              <Text style={[styles.comingSoonTitle, { color: colors.text }]}>Coming Soon!</Text>
              <Text style={[styles.comingSoonText, { color: colors.muted }]}>
                Secure bank connection will be available in an upcoming update. 
                This feature will allow you to automatically import transactions and balances.
              </Text>
              <TouchableOpacity 
                style={[styles.switchButton, { backgroundColor: colors.primary }]}
                onPress={() => setConnectionMode('manual')}
              >
                <Text style={styles.switchButtonText}>Switch to Manual Entry</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Manual Entry Form */}
          {connectionMode === 'manual' && (
            <>
              {/* Account Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Account Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
                  ]}
                  placeholder="e.g. Primary Checking"
                  placeholderTextColor={colors.muted}
                  value={accountName}
                  onChangeText={setAccountName}
                />
              </View>

              {/* Institution */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Financial Institution</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
                  ]}
                  placeholder="e.g. Bank of America"
                  placeholderTextColor={colors.muted}
                  value={institution}
                  onChangeText={setInstitution}
                />
              </View>

              {/* Account Type */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Account Type</Text>
                <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Picker
                    selectedValue={accountType}
                    onValueChange={(value) => setAccountType(value as AccountType)}
                    style={[styles.picker, { color: colors.text }]}
                    dropdownIconColor={colors.text}
                  >
                    <Picker.Item label="Checking" value="Checking" />
                    <Picker.Item label="Savings" value="Savings" />
                    <Picker.Item label="Credit Card" value="Credit Card" />
                    <Picker.Item label="Investment" value="Investment" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>

              {/* Currency */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Currency</Text>
                <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Picker
                    selectedValue={currency}
                    onValueChange={(value) => setCurrency(value)}
                    style={[styles.picker, { color: colors.text }]}
                    dropdownIconColor={colors.text}
                  >
                    <Picker.Item label="USD ($)" value="USD" />
                    <Picker.Item label="EUR (€)" value="EUR" />
                    <Picker.Item label="GBP (£)" value="GBP" />
                    <Picker.Item label="CAD (C$)" value="CAD" />
                    <Picker.Item label="AUD (A$)" value="AUD" />
                    <Picker.Item label="JPY (¥)" value="JPY" />
                  </Picker>
                </View>
              </View>

              {/* Initial Balance */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Starting Balance</Text>
                <View style={styles.balanceContainer}>
                  <Text style={[styles.currencySymbol, { color: colors.text }]}>
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}
                  </Text>
                  <TextInput
                    style={[
                      styles.balanceInput,
                      { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    value={balance}
                    onChangeText={handleBalanceChange}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={[styles.note, { color: colors.muted }]}>
                  {accountType === 'Credit Card' ? 'For credit cards, enter a negative number for balance owed' : ''}
                </Text>
              </View>

              {/* Add Account Button */}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
              >
                <Text style={styles.addButtonText}>Add Account</Text>
              </TouchableOpacity>
            </>
          )}
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
  connectionModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  selectedMode: {
    borderWidth: 2,
  },
  modeButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  comingSoonContainer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  switchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  switchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
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
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  balanceInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  note: {
    marginTop: 4,
    fontSize: 12,
    fontStyle: 'italic',
  },
  addButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAccountScreen;
