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
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Repayment Strategy</Text>
      <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Picker
          selectedValue={repaymentMethod}
          onValueChange={(value) => setRepaymentMethod(value as RepaymentMethod)}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <Picker.Item label="Debt Avalanche (Highest Interest First)" value="avalanche" />
          <Picker.Item label="Debt Snowball (Smallest Balance First)" value="snowball" />
        </Picker>
      </View>
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
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
});

export default RepaymentStrategyPicker;
