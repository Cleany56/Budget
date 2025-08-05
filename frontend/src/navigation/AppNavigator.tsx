import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MonthDetailScreen from '../screens/MonthDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddOptionsScreen from '../screens/AddOptionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AddBudgetScreen from '../screens/AddBudgetScreen';
import AddGoalScreen from '../screens/AddGoalScreen';
import GoalsScreen from '../screens/GoalsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import DebtCalculatorScreen from '../screens/DebtCalculatorScreen';
import { useTheme } from '../theme/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Transactions: undefined;
  Reports: undefined;
  MonthDetail: { label: string; year: number; month: number };
  Profile: undefined;
  AddOptions: undefined;
  AddTransaction: undefined;
  AddBudget: undefined;
  AddGoal: { fromGoalsScreen?: boolean } | undefined;
  Goals: undefined;
  AddAccount: undefined;
  DebtCalculator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="MonthDetail" component={MonthDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AddOptions" component={AddOptionsScreen} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
        <Stack.Screen name="AddBudget" component={AddBudgetScreen} />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="AddAccount" component={AddAccountScreen} />
        <Stack.Screen name="DebtCalculator" component={DebtCalculatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
