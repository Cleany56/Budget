import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ExpenseCategory } from '../../types';

interface CategoryBudgetInputsProps {
  categories: ExpenseCategory[];
  budgetAmounts: Record<ExpenseCategory, string>;
  handleBudgetChange: (category: ExpenseCategory, value: string) => void;
  colors: {
    text: string;
    border: string;
    card: string;
    primary: string;
    background: string;
    muted: string;
  };
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#4bcffa',
  [ExpenseCategory.TRANSPORT]: '#ffa801',
  [ExpenseCategory.ENTERTAINMENT]: '#a55eea',
  [ExpenseCategory.SHOPPING]: '#ff5e57',
  [ExpenseCategory.UTILITIES]: '#00b894',
  [ExpenseCategory.HEALTH]: '#fd79a8',
  [ExpenseCategory.HOUSING]: '#636e72',
  [ExpenseCategory.OTHER]: '#f7b731',
};

const CategoryBudgetInputs: React.FC<CategoryBudgetInputsProps> = ({
  categories,
  budgetAmounts,
  handleBudgetChange,
  colors
}) => {
  return (
    <>
      {categories.map((category) => (
        <View key={category} style={styles.categoryItem}>
          <View style={styles.categoryLabelContainer}>
            <View 
              style={[
                styles.categoryColor,
                { backgroundColor: CATEGORY_COLORS[category] }
              ]} 
            />
            <Text style={[styles.categoryLabel, { color: colors.text }]}>{category}</Text>
          </View>
          
          <View style={[styles.budgetInputContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.budgetInput, { color: colors.text }]}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              value={budgetAmounts[category]}
              onChangeText={(value) => handleBudgetChange(category, value)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 120,
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  budgetInput: {
    height: 40,
    fontSize: 16,
    flex: 1,
  },
});

export default CategoryBudgetInputs;
