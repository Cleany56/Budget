import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DebtItem as DebtItemType } from '../../types/debtTypes/index';

interface DebtItemProps {
  debt: DebtItemType;
  onRemove: (id: string) => void;
  colors: any;
}

const DebtItem: React.FC<DebtItemProps> = ({ debt, onRemove, colors }) => {
  return (
    <View style={[styles.debtItem, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.debtItemHeader}>
        <Text style={[styles.debtItemName, { color: colors.text }]}>{debt.name}</Text>
        <TouchableOpacity onPress={() => onRemove(debt.id)}>
          <Ionicons name="close-circle" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.debtItemDetails}>
        <View style={styles.debtDetailItem}>
          <Text style={[styles.debtDetailLabel, { color: colors.text }]}>Balance:</Text>
          <Text style={[styles.debtDetailValue, { color: colors.text }]}>
            ${debt.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </Text>
        </View>
        
        <View style={styles.debtDetailItem}>
          <Text style={[styles.debtDetailLabel, { color: colors.text }]}>Interest Rate:</Text>
          <Text style={[styles.debtDetailValue, { color: colors.text }]}>
            {debt.interestRate}%
          </Text>
        </View>
        
        <View style={styles.debtDetailItem}>
          <Text style={[styles.debtDetailLabel, { color: colors.text }]}>Min Payment:</Text>
          <Text style={[styles.debtDetailValue, { color: colors.text }]}>
            ${debt.minPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  debtItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  debtItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  debtItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  debtItemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  debtDetailItem: {
    marginRight: 12,
    marginBottom: 4,
  },
  debtDetailLabel: {
    fontSize: 12,
  },
  debtDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DebtItem;
