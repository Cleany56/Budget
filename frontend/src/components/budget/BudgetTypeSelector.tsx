import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BudgetType = 'monthly' | 'recurring';

interface BudgetTypeSelectorProps {
  budgetType: BudgetType;
  setBudgetType: (type: BudgetType) => void;
  colors: {
    text: string;
    border: string;
    card: string;
    primary: string;
    background: string;
    muted?: string;
  };
}

const BudgetTypeSelector: React.FC<BudgetTypeSelectorProps> = ({ 
  budgetType, 
  setBudgetType,
  colors 
}) => {
  return (
    <View style={styles.budgetTypeSelector}>
      <TouchableOpacity
        style={[
          styles.budgetTypeButton, 
          budgetType === 'monthly' ? [styles.budgetTypeButtonActive, { borderColor: colors.primary }] : { borderColor: colors.border },
          { backgroundColor: budgetType === 'monthly' ? colors.card : 'transparent' }
        ]}
        onPress={() => setBudgetType('monthly')}
      >
        <Ionicons 
          name="calendar-outline" 
          size={20} 
          color={budgetType === 'monthly' ? colors.primary : colors.text} 
          style={styles.budgetTypeIcon} 
        />
        <Text style={[
          styles.budgetTypeText, 
          { color: budgetType === 'monthly' ? colors.primary : colors.text }
        ]}>
          Monthly Budget
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.budgetTypeButton, 
          budgetType === 'recurring' ? [styles.budgetTypeButtonActive, { borderColor: colors.primary }] : { borderColor: colors.border },
          { backgroundColor: budgetType === 'recurring' ? colors.card : 'transparent' }
        ]}
        onPress={() => setBudgetType('recurring')}
      >
        <Ionicons 
          name="repeat-outline" 
          size={20} 
          color={budgetType === 'recurring' ? colors.primary : colors.text} 
          style={styles.budgetTypeIcon} 
        />
        <Text style={[
          styles.budgetTypeText, 
          { color: budgetType === 'recurring' ? colors.primary : colors.text }
        ]}>
          Recurring Budget
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  budgetTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  budgetTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
  },
  budgetTypeButtonActive: {
    borderWidth: 2,
  },
  budgetTypeIcon: {
    marginRight: 8,
  },
  budgetTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BudgetTypeSelector;
