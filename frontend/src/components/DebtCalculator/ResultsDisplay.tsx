import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultsDisplayProps {
  timeToPayoff: string | null;
  requiredPayment: string | null;
  totalInterest: string | null;
  calculationMode: 'payment' | 'timeframe';
  colors: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  timeToPayoff,
  requiredPayment,
  totalInterest,
  calculationMode,
  colors
}) => {
  if (!timeToPayoff && !totalInterest) {
    return null;
  }
  
  return (
    <View style={[styles.resultsContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.resultsTitle, { color: colors.text }]}>Results</Text>
      
      <View style={styles.resultItem}>
        <Text style={[styles.resultLabel, { color: colors.text }]}>Time to payoff:</Text>
        <Text style={[styles.resultValue, { color: colors.text }]}>{timeToPayoff}</Text>
      </View>
      
      {calculationMode === 'timeframe' && requiredPayment && (
        <View style={styles.resultItem}>
          <Text style={[styles.resultLabel, { color: colors.text }]}>Required monthly payment:</Text>
          <Text style={[styles.resultValue, { color: colors.text }]}>{requiredPayment}</Text>
        </View>
      )}
      
      <View style={styles.resultItem}>
        <Text style={[styles.resultLabel, { color: colors.text }]}>Total interest paid:</Text>
        <Text style={[styles.resultValue, { color: colors.text }]}>{totalInterest}</Text>
      </View>
      
      {/* Graph placeholder */}
      <View style={[styles.graphPlaceholder, { backgroundColor: colors.border }]}>
        <Text style={[styles.graphPlaceholderText, { color: colors.text }]}>
          Payoff timeline chart would appear here
        </Text>
      </View>
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
  },
  resultLabel: {
    fontSize: 16,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  graphPlaceholder: {
    height: 180,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphPlaceholderText: {
    fontSize: 14,
  }
});

export default ResultsDisplay;
