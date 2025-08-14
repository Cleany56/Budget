import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { RepaymentMethod, MonthRecord } from '../../types/debtTypes/index';
import PayoffTimelineChart from './PayoffTimelineChart';

interface ResultsDisplayProps {
  timeToPayoff: string | null;
  requiredPayment: string | null;
  totalInterest: string | null;
  calculationMode: 'payment' | 'timeframe';
  repaymentMethod?: RepaymentMethod; // Use the proper type
  paymentSchedule?: MonthRecord[]; // Add payment schedule for chart
  colors: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  timeToPayoff,
  requiredPayment,
  totalInterest,
  calculationMode,
  repaymentMethod = 'avalanche',
  paymentSchedule = [],
  colors
}) => {
  if (!timeToPayoff && !totalInterest) {
    return null;
  }
  
  return (
    <View style={[styles.resultsContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.resultsTitle, { color: colors.text }]}>Results</Text>
      
      <View style={styles.resultItem}>
        <Text style={[styles.resultStrategy, { color: colors.primary }]}>
          Using {
            repaymentMethod === 'avalanche' ? 'Debt Avalanche' : 
            repaymentMethod === 'snowball' ? 'Debt Snowball' : 
            'Custom'
          } Method
        </Text>
      </View>
      
      <View style={styles.resultItem}>
        <Text style={[styles.resultLabel, { color: colors.text }]}>Time to payoff:</Text>
        <Text style={[styles.resultValue, { color: colors.text }]}>{timeToPayoff}</Text>
      </View>
      
      {calculationMode === 'timeframe' && requiredPayment && (
        <View style={styles.resultItem}>
          <Text style={[styles.resultLabel, { color: colors.text }]}>Required total monthly payment:</Text>
          <Text style={[styles.resultValue, { color: colors.text }]}>{requiredPayment}</Text>
          <Text style={[styles.resultNote, { color: colors.muted }]}>
            This includes all minimum payments plus extra to meet your timeframe
          </Text>
        </View>
      )}
      
      <View style={styles.resultItem}>
        <Text style={[styles.resultLabel, { color: colors.text }]}>Total interest paid:</Text>
        <Text style={[styles.resultValue, { color: colors.text }]}>{totalInterest}</Text>
      </View>
      
      {/* Payoff Timeline Chart */}
      <PayoffTimelineChart
        paymentSchedule={paymentSchedule}
        timeToPayoff={timeToPayoff || ''}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  resultNote: {
    fontSize: 13,
    width: '100%',
    marginTop: 4,
    fontStyle: 'italic',
  },
  resultStrategy: {
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ResultsDisplay;
