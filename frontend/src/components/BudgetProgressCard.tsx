import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Budget } from '../types';

interface BudgetProgressCardProps {
  budget: Budget;
  colors: any;
}

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({ budget, colors }) => {
  const percentage = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
  
  // Determine color based on percentage of budget used
  let progressColor = colors.success;
  if (percentage > 90) {
    progressColor = colors.error;
  } else if (percentage > 75) {
    progressColor = colors.warning;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{budget.name}</Text>
        {budget.isRecurring && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>Recurring</Text>
          </View>
        )}
      </View>
      
      <View style={styles.amountsRow}>
        <Text style={[styles.spent, { color: colors.text }]}>
          ${budget.spent.toFixed(2)} <Text style={[styles.of, { color: colors.text }]}>of</Text> ${budget.amount.toFixed(2)}
        </Text>
        <Text style={[styles.remaining, { color: percentage > 90 ? colors.error : colors.text }]}>
          ${(budget.amount - budget.spent).toFixed(2)} left
        </Text>
      </View>
      
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`,
              backgroundColor: progressColor
            }
          ]} 
        />
      </View>
      
      {budget.month && (
        <Text style={[styles.month, { color: colors.text }]}>{budget.month}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spent: {
    fontSize: 14,
    fontWeight: '500',
  },
  of: {
    fontWeight: '400',
  },
  remaining: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  month: {
    fontSize: 12,
    marginTop: 4,
  }
});

export default BudgetProgressCard;
