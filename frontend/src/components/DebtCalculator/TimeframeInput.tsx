import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formatWholeNumber } from '../../utils/formatters';

interface TimeframeInputProps {
  repaymentYears: string;
  repaymentMonths: string;
  setRepaymentYears: (value: string) => void;
  setRepaymentMonths: (value: string) => void;
  colors: any;
}

const TimeframeInput: React.FC<TimeframeInputProps> = ({ 
  repaymentYears,
  repaymentMonths,
  setRepaymentYears,
  setRepaymentMonths,
  colors 
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Payoff Period</Text>
      <View style={styles.timeInputRow}>
        <View style={[styles.timeInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.timeInput, { color: colors.text }]}
            value={repaymentYears}
            onChangeText={(value) => setRepaymentYears(formatWholeNumber(value))}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor={colors.text}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <Text style={[styles.timeUnit, { color: colors.text }]}>years</Text>
        </View>
        
        <View style={[styles.timeInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.timeInput, { color: colors.text }]}
            value={repaymentMonths}
            onChangeText={(value) => {
              const formatted = formatWholeNumber(value);
              // Ensure months are between 0 and 11
              if (formatted === '' || parseInt(formatted) <= 11) {
                setRepaymentMonths(formatted);
              }
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.text}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit={true}
          />
          <Text style={[styles.timeUnit, { color: colors.text }]}>months</Text>
        </View>
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
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    width: '48%',
  },
  timeInput: {
    flex: 1,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
  },
  timeUnit: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default TimeframeInput;
