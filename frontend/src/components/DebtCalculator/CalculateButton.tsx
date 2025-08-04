import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CalculateButtonProps {
  onPress: () => void;
  colors: any;
}

const CalculateButton: React.FC<CalculateButtonProps> = ({ onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[styles.calculateButton, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text style={styles.calculateButtonText}>Calculate Repayment Plan</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calculateButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default CalculateButton;
