import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalculationMode } from '../../types/debtTypes';

interface CalculationModeSelectorProps {
  calculationMode: CalculationMode;
  onSelectMode: (mode: CalculationMode) => void;
  colors: any;
}

const CalculationModeSelector: React.FC<CalculationModeSelectorProps> = ({ 
  calculationMode, 
  onSelectMode,
  colors
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Calculation Method</Text>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton, 
            { 
              backgroundColor: calculationMode === 'payment' ? colors.primary : 'transparent',
              borderColor: calculationMode === 'payment' ? colors.primary : colors.border
            }
          ]}
          onPress={() => onSelectMode('payment')}
        >
          <Text style={[
            styles.modeButtonText, 
            { color: calculationMode === 'payment' ? 'white' : colors.text }
          ]}>
            Set Monthly Payment
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeButton, 
            { 
              backgroundColor: calculationMode === 'timeframe' ? colors.primary : 'transparent',
              borderColor: calculationMode === 'timeframe' ? colors.primary : colors.border
            }
          ]}
          onPress={() => onSelectMode('timeframe')}
        >
          <Text style={[
            styles.modeButtonText, 
            { color: calculationMode === 'timeframe' ? 'white' : colors.text }
          ]}>
            Set Time Period
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CalculationModeSelector;
