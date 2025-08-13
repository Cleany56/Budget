import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Reusable error message component with retry option
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  onRetry
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.errorText, { color: colors.error }]}>Error: {message}</Text>
      {onRetry && (
        <Text 
          style={[styles.errorRetry, { color: colors.primary }]}
          onPress={onRetry}
        >
          Tap to retry
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor is set inline from colors.card
  },
  errorText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    // color is set inline from colors.error
  },
  errorRetry: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textDecorationLine: 'underline',
    // color is set inline from colors.primary
  },
});
