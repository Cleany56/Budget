import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { normalizeCurrencyInput } from '../../utils/formatters';

interface PaymentInputProps {
  monthlyPayment: string;
  setMonthlyPayment: (value: string) => void;
  colors: any;
}

const PaymentInput: React.FC<PaymentInputProps> = ({ 
  monthlyPayment, 
  setMonthlyPayment,
  colors 
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Total Monthly Payment</Text>
      <Text style={[styles.description, { color: colors.muted }]}>
        This should be the total amount you can afford to pay toward all debts each month (including minimum payments)
      </Text>
      <View style={[styles.amountInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: colors.text }]}
          value={monthlyPayment}
          onChangeText={(value) => setMonthlyPayment(normalizeCurrencyInput(value))}
          keyboardType="numeric"
          placeholder="500.00"
          placeholderTextColor={colors.text}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          blurOnSubmit={true}
        />
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
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
    marginHorizontal: 6,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 20,
  },
});

export default PaymentInput;
