import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLayout from '../components/AppLayout';
import GoalProgressCard from '../components/GoalProgressCard';
import { getGoals } from '../services/api/goals';
import { deleteGoal } from '../utils/dataManagement';
import { Goal } from '../types';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from '../navigation/AppNavigator';

const GoalsScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load goals when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGoals = await getGoals();
      setGoals(fetchedGoals);
    } catch (err) {
      console.error('Failed to load goals:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    navigation.navigate('AddGoal', { fromGoalsScreen: true });
  };

  const handleEditGoal = (goal: Goal) => {
    // In a real app, you'd navigate to an edit screen
    // For now, let's just alert
    Alert.alert('Edit Goal', 'Edit functionality to be implemented.');
  };

  const handleDeleteGoal = async (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(goalId);
              await deleteGoal(goalId);
              setGoals(goals.filter((goal) => goal.id !== goalId));
            } catch (err) {
              console.error('Failed to delete goal:', err);
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const renderGoalItem = ({ item }: { item: Goal }) => {
    const isDeleting = deleting === item.id;
    
    return (
      <View style={styles.goalItemContainer}>
        <GoalProgressCard goal={item} colors={colors} />
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => handleEditGoal(item)}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: isDeleting ? colors.secondary : '#e74c3c' }]}
            onPress={() => handleDeleteGoal(item.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <AppLayout toggleDarkMode={toggleDarkMode}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Financial Goals</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddGoal}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading goals...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredContent}>
            <Ionicons name="warning-outline" size={48} color={colors.text} />
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadGoals}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : goals.length === 0 ? (
          <View style={styles.centeredContent}>
            <Ionicons name="flag-outline" size={48} color={colors.text} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No goals yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
              Tap the + button to add your first financial goal
            </Text>
          </View>
        ) : (
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.goalList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalList: {
    paddingBottom: 16,
  },
  goalItemContainer: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoalsScreen;
