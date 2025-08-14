import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RepaymentMethod } from '../../types/debtTypes';

interface RepaymentStrategyPickerProps {
  repaymentMethod: RepaymentMethod;
  setRepaymentMethod: (method: RepaymentMethod) => void;
  colors: any;
}

const RepaymentStrategyPicker: React.FC<RepaymentStrategyPickerProps> = ({ 
  repaymentMethod,
  setRepaymentMethod,
  colors
}) => {
  // Handle repayment method change
  const handleRepaymentMethodChange = (value: RepaymentMethod) => {
    // console.log(`Changing repayment method to: ${value}`);
    
    // Update the repayment method
    setRepaymentMethod(value);
    
    // Note: Results will auto-update via useEffect in the hook
    // The hook watches for changes to repaymentMethod and recalculates
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Repayment Strategy</Text>
      <Text style={[styles.description, { color: colors.muted }]}>
        Choose which debts to prioritize - results update automatically
      </Text>
      <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Picker
          selectedValue={repaymentMethod}
          onValueChange={handleRepaymentMethodChange}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
          accessibilityLabel="Select repayment strategy"
        >
          <Picker.Item key="avalanche" label="Debt Avalanche (Highest Interest First)" value="avalanche" />
          <Picker.Item key="snowball" label="Debt Snowball (Smallest Balance First)" value="snowball" />
        </Picker>
      </View>
      
      <Text style={[styles.infoText, { color: colors.muted }]}>
        Note: When the smallest balance debt also has the highest interest rate, 
        both methods will yield identical results.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default RepaymentStrategyPicker;
