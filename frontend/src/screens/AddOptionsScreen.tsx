import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';

const AddOptionsScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Define option accent colors - these are kept as static colors for visual distinction
  const optionAccentColors = {
    transaction: '#4bcffa',
    budget: '#a55eea',
    goal: '#2ecc71',
    account: '#0984e3',
    debt: '#ff5e57'
  };

  const optionItems = [
    {
      id: 'transaction',
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: 'cash-outline',
      color: optionAccentColors.transaction,
      onPress: () => {
        navigation.navigate('AddTransaction');
      }
    },
    {
      id: 'account',
      title: 'Add Account',
      description: 'Connect a bank, credit card, or investment account',
      icon: 'card-outline',
      color: optionAccentColors.account,
      onPress: () => {
        navigation.navigate('AddAccount');
      }
    },
    {
      id: 'budget',
      title: 'Create Budget',
      description: 'Set up monthly spending limits by category',
      icon: 'wallet-outline',
      color: optionAccentColors.budget,
      onPress: () => {
        navigation.navigate('AddBudget');
      }
    },
    {
      id: 'goal',
      title: 'Set Financial Goal',
      description: 'Define savings targets and track your progress',
      icon: 'flag-outline',
      color: optionAccentColors.goal,
      onPress: () => {
        navigation.navigate('AddGoal');
      }
    },
    {
      id: 'debt',
      title: 'Debt Repayment Calculator',
      description: 'Plan your debt repayment strategy',
      icon: 'calculator-outline',
      color: optionAccentColors.debt,
      onPress: () => {
        navigation.navigate('DebtCalculator');
      }
    }
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <AppLayout 
      toggleDarkMode={toggleDarkMode}
      showBack={true}
      onBackPress={handleBackPress}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Add New</Text>
        
        <View style={styles.optionsContainer}>
          {optionItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }
              ]}
              onPress={item.onPress}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={28} color="white" />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.muted }]}>
                  {item.description}
                </Text>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={colors.text} 
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  chevron: {
    marginLeft: 8,
  }
});

export default AddOptionsScreen;
