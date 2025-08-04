import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { ExpenseCategory } from '../types';

const AddTransactionScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isIncome, setIsIncome] = useState<boolean>(false);

  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleSave = () => {
    // Save transaction logic will go here
    // For now, just go back
    navigation.goBack();
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
              onPress={() => setIsIncome(false)}
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
              onPress={() => setIsIncome(true)}
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
                  {Object.values(ExpenseCategory).map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          
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
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: 'white' }]}>Save Transaction</Text>
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
});

export default AddTransactionScreen;
