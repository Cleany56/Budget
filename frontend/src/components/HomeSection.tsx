import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Budget, Goal } from '../types';
import BudgetProgressCard from './BudgetProgressCard';
import GoalProgressCard from './GoalProgressCard';

interface HomeSectionProps {
  title: string;
  navigateTo: 'AddBudget' | 'AddGoal';
  icon: 'add';
  colors: any;
  budgets?: Budget[];
  goals?: Goal[];
}

const HomeSection: React.FC<HomeSectionProps> = ({ 
  title, 
  navigateTo, 
  icon, 
  colors,
  budgets,
  goals
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate(navigateTo)}
        >
          <Ionicons name={icon} size={16} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {budgets && budgets.length > 0 && (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BudgetProgressCard budget={item} colors={colors} />}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.cardList}
        />
      )}
      
      {goals && goals.length > 0 && (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GoalProgressCard goal={item} colors={colors} />}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.cardList}
        />
      )}
      
      {((budgets && budgets.length === 0) || (goals && goals.length === 0)) && (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Ionicons 
            name={navigateTo === 'AddBudget' ? 'wallet-outline' : 'flag-outline'} 
            size={24} 
            color={colors.text} 
          />
          <Text style={[styles.emptyText, { color: colors.text }]}> 
            {navigateTo === 'AddBudget' 
              ? 'No budgets yet. Add your first budget!' 
              : 'No goals yet. Add your first goal!'
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  cardList: {
    width: '100%',
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  }
});

export default HomeSection;
