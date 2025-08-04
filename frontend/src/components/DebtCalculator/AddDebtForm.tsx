import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { formatCurrency, formatInterestRate } from '../../utils/formatters/index';

interface AddDebtFormProps {
  newDebtName: string;
  newDebtBalance: string;
  newDebtInterestRate: string;
  newDebtMinPayment: string;
  setNewDebtName: (value: string) => void;
  setNewDebtBalance: (value: string) => void;
  setNewDebtInterestRate: (value: string) => void;
  setNewDebtMinPayment: (value: string) => void;
  onAddDebt: () => void;
  colors: any;
}

const AddDebtForm: React.FC<AddDebtFormProps> = ({
  newDebtName,
  newDebtBalance,
  newDebtInterestRate,
  newDebtMinPayment,
  setNewDebtName,
  setNewDebtBalance,
  setNewDebtInterestRate,
  setNewDebtMinPayment,
  onAddDebt,
  colors
}) => {
  return (
    <View style={[styles.addDebtSection, { borderColor: colors.border }]}>
      <Text style={[styles.addDebtTitle, { color: colors.text }]}>Add New Debt</Text>
      
      <View style={styles.addDebtForm}>
        <View style={styles.addDebtRow}>
          <TextInput
            style={[styles.addDebtInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
            placeholder="Debt Name"
            placeholderTextColor={colors.text}
            value={newDebtName}
            onChangeText={setNewDebtName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </View>
        
        <View style={styles.addDebtRow}>
          <View style={styles.addDebtInputHalf}>
            <Text style={[styles.addDebtInputPrefix, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.addDebtInputText, { color: colors.text }]}
              placeholder="Balance"
              placeholderTextColor={colors.text}
              value={newDebtBalance}
              onChangeText={(value) => setNewDebtBalance(formatCurrency(value))}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.addDebtInputHalf}>
            <TextInput
              style={[styles.addDebtInputText, { color: colors.text }]}
              placeholder="Interest %"
              placeholderTextColor={colors.text}
              value={newDebtInterestRate}
              onChangeText={(value) => setNewDebtInterestRate(formatInterestRate(value))}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <Text style={[styles.addDebtInputSuffix, { color: colors.text }]}>%</Text>
          </View>
        </View>
        
        <View style={styles.addDebtRow}>
          <View style={styles.addDebtInputFull}>
            <Text style={[styles.addDebtInputPrefix, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.addDebtInputText, { color: colors.text }]}
              placeholder="Minimum Payment"
              placeholderTextColor={colors.text}
              value={newDebtMinPayment}
              onChangeText={(value) => setNewDebtMinPayment(formatCurrency(value))}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={onAddDebt}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.addDebtButton, { backgroundColor: colors.primary }]}
          onPress={onAddDebt}
        >
          <Text style={styles.addDebtButtonText}>Add Debt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addDebtSection: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 10,
  },
  addDebtTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addDebtForm: {
    width: '100%',
  },
  addDebtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addDebtInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addDebtInputHalf: {
    width: '48%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addDebtInputFull: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addDebtInputPrefix: {
    marginRight: 5,
  },
  addDebtInputSuffix: {
    marginLeft: 5,
  },
  addDebtInputText: {
    flex: 1,
    height: 40,
  },
  addDebtButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addDebtButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AddDebtForm;
