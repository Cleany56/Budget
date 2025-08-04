import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { addGoal, createNewGoal } from '../utils/dataManagement';
import { handleCurrencyInput, formatCurrencyOnBlur, normalizeCurrencyInput } from '../utils/formatters';

const AddGoalScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleSaveGoal = () => {
    // Validate inputs
    if (!goalName.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }
    
    if (!targetAmount || parseFloat(targetAmount.replace(/,/g, '')) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }
    
    if (!targetDate) {
      Alert.alert('Error', 'Please select a target date');
      return;
    }
    
    // Parse numeric values
    const parsedTargetAmount = parseFloat(targetAmount.replace(/,/g, ''));
    const parsedCurrentAmount = currentAmount ? parseFloat(currentAmount.replace(/,/g, '')) : 0;
    
    // Create and save the new goal
    const newGoal = createNewGoal(
      goalName,
      parsedTargetAmount,
      parsedCurrentAmount,
      targetDate,
      priority
    );
    
    addGoal(newGoal);
    
    // Navigate back
    navigation.goBack();
  };

  return (
    <AppLayout 
      toggleDarkMode={toggleDarkMode}
      showBack={true}
      onBackPress={handleBackPress}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Set Financial Goal</Text>
        
        <View style={styles.formContainer}>
          {/* Goal Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Goal Name</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="e.g., New Car, Vacation, Emergency Fund"
              placeholderTextColor={colors.secondary}
              autoCapitalize="words"
              autoCorrect={true}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          
          {/* Target Amount */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Target Amount</Text>
            <View style={[styles.amountInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={targetAmount}
                onChangeText={(text) => handleCurrencyInput(text, setTargetAmount)}
                onBlur={() => formatCurrencyOnBlur(targetAmount, setTargetAmount)}
                keyboardType="numeric"
                placeholder="5,000.00"
                placeholderTextColor={colors.secondary}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>
          </View>
          
          {/* Current Savings */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Current Savings</Text>
            <View style={[styles.amountInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={currentAmount}
                onChangeText={(text) => handleCurrencyInput(text, setCurrentAmount)}
                onBlur={() => formatCurrencyOnBlur(currentAmount, setCurrentAmount)}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.secondary}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          </View>
          
          {/* Target Date */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Target Date</Text>
            <TouchableOpacity 
              style={[styles.datePickerButton, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => {
                // For demo purposes, just set a date 6 months from now
                // In a real app, this would open a date picker
                const today = new Date();
                const sixMonthsFromNow = new Date(today);
                sixMonthsFromNow.setMonth(today.getMonth() + 6);
                
                const formattedDate = sixMonthsFromNow.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                
                setTargetDate(formattedDate);
              }}
            >
              <Text 
                style={[
                  styles.dateText, 
                  { color: targetDate ? colors.text : colors.secondary }
                ]}
              >
                {targetDate || 'Select a target date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Goal Priority */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Picker
                style={[styles.picker, { color: colors.text }]}
                dropdownIconColor={colors.text}
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue as 'high' | 'medium' | 'low')}
              >
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Low" value="low" />
              </Picker>
            </View>
          </View>
          
          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveGoal}
          >
            <Text style={[styles.saveButtonText, { color: 'white' }]}>Save Goal</Text>
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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 50,
    fontSize: 16,
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
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

export default AddGoalScreen;
