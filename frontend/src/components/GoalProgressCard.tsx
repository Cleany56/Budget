import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Goal } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface GoalProgressCardProps {
  goal: Goal;
  colors: any;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, colors }) => {
  const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  
  // Format target date
  const targetDate = new Date(goal.targetDate);
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate days remaining
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Priority icon and color
  const getPriorityDetails = () => {
    switch (goal.priority) {
      case 'high':
        return { 
          icon: 'flag' as const,
          color: colors.error || '#ff5e57'
        };
      case 'medium':
        return { 
          icon: 'flag' as const,
          color: colors.warning || '#ffa801'
        };
      case 'low':
        return { 
          icon: 'flag' as const,
          color: colors.success || '#00b894'
        };
      default:
        return { 
          icon: 'flag-outline' as const,
          color: colors.secondary 
        };
    }
  };

  const priorityDetails = getPriorityDetails();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{goal.name}</Text>
        <Ionicons name={priorityDetails.icon} size={16} color={priorityDetails.color} />
      </View>
      
      <View style={styles.amountsRow}>
        <Text style={[styles.amount, { color: colors.text }]}>
          ${goal.currentAmount.toFixed(2)} <Text style={styles.of}>of</Text> ${goal.targetAmount.toFixed(2)}
        </Text>
        <Text style={[styles.target, { color: colors.primary }]}>
          {percentage}% complete
        </Text>
      </View>
      
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`,
              backgroundColor: colors.primary
            }
          ]} 
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.date, { color: colors.secondary }]}>
          Target: {formattedDate}
        </Text>
        <Text 
          style={[
            styles.days, 
            { 
              color: diffDays < 30 ? colors.error : colors.secondary
            }
          ]}
        >
          {diffDays > 0 ? `${diffDays} days left` : 'Past due'}
        </Text>
      </View>
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
    marginRight: 8,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
  },
  of: {
    fontWeight: '400',
  },
  target: {
    fontSize: 14,
    fontWeight: '600',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
  },
  days: {
    fontSize: 12,
    fontWeight: '500',
  }
});

export default GoalProgressCard;
