import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { useDebtCalculator } from '../hooks/useDebtCalculator';

// Components
import DebtItem from '../components/DebtCalculator/DebtItem';
import AddDebtForm from '../components/DebtCalculator/AddDebtForm';
import CalculationModeSelector from '../components/DebtCalculator/CalculationModeSelector';
import PaymentInput from '../components/DebtCalculator/PaymentInput';
import TimeframeInput from '../components/DebtCalculator/TimeframeInput';
import RepaymentStrategyPicker from '../components/DebtCalculator/RepaymentStrategyPicker';
import CalculateButton from '../components/DebtCalculator/CalculateButton';
import ResultsDisplay from '../components/DebtCalculator/ResultsDisplay';

const DebtCalculatorScreen: React.FC = () => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const {
    // Debt items state
    debts,
    removeDebt,
    
    // New debt form state
    newDebtName,
    newDebtBalance,
    newDebtInterestRate,
    newDebtMinPayment,
    setNewDebtName,
    setNewDebtBalance,
    setNewDebtInterestRate,
    setNewDebtMinPayment,
    
    // Calculation mode state
    calculationMode,
    setCalculationMode,
    
    // Payment input state
    monthlyPayment,
    setMonthlyPayment,
    
    // Timeframe input state
    repaymentYears,
    repaymentMonths,
    setRepaymentYears,
    setRepaymentMonths,
    
    // Repayment method state
    repaymentMethod,
    setRepaymentMethod,
    
    // Results state
    timeToPayoff,
    requiredPayment,
    totalInterest,
    
    // Actions
    calculateResults,
    handleAddDebt
  } = useDebtCalculator();
  
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
        <Text style={[styles.title, { color: colors.text }]}>Debt Repayment Calculator</Text>
        
        <View style={styles.formContainer}>
          {/* Repayment Strategy Selector */}
          <RepaymentStrategyPicker 
            repaymentMethod={repaymentMethod}
            setRepaymentMethod={setRepaymentMethod}
            colors={colors}
          />

          {/* Calculation Mode Selector */}
          <CalculationModeSelector 
            calculationMode={calculationMode}
            onSelectMode={setCalculationMode}
            colors={colors}
          />

          {/* Payment or Time Period Input */}
          {calculationMode === 'payment' ? (
            <PaymentInput 
              monthlyPayment={monthlyPayment}
              setMonthlyPayment={setMonthlyPayment}
              colors={colors}
            />
          ) : (
            <TimeframeInput 
              repaymentYears={repaymentYears}
              repaymentMonths={repaymentMonths}
              setRepaymentYears={setRepaymentYears}
              setRepaymentMonths={setRepaymentMonths}
              colors={colors}
            />
          )}

          {/* Debt List Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Debts</Text>
            
            {/* Render debt items */}
            {debts.map((debt) => (
              <DebtItem 
                key={debt.id}
                debt={debt}
                onRemove={removeDebt}
                colors={colors}
              />
            ))}
            
            {/* Add New Debt Form */}
            <AddDebtForm 
              newDebtName={newDebtName}
              newDebtBalance={newDebtBalance}
              newDebtInterestRate={newDebtInterestRate}
              newDebtMinPayment={newDebtMinPayment}
              setNewDebtName={setNewDebtName}
              setNewDebtBalance={setNewDebtBalance}
              setNewDebtInterestRate={setNewDebtInterestRate}
              setNewDebtMinPayment={setNewDebtMinPayment}
              onAddDebt={handleAddDebt}
              colors={colors}
            />
          </View>
          
          {/* Calculate button */}
          <CalculateButton 
            onPress={calculateResults}
            colors={colors}
          />
          
          {/* Results Section */}
          <ResultsDisplay 
            timeToPayoff={timeToPayoff}
            requiredPayment={requiredPayment}
            totalInterest={totalInterest}
            calculationMode={calculationMode}
            colors={colors}
          />
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  sectionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  }
});

export default DebtCalculatorScreen;
