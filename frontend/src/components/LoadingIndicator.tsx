import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { TransactionSkeleton, AccountSummarySkeleton } from './SkeletonLoader';

interface LoadingIndicatorProps {
  type?: 'transaction' | 'account' | 'default' | 'data';
}

/**
 * Reusable loading indicator with skeleton UI options
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({ 
  type = "default" 
}) => {
  const { colors } = useTheme();
  
  // Show skeleton UI based on type for better perceived performance
  if (type === "transaction") {
    // Precompute the array to avoid recreating on each render
    const skeletonItems = useMemo(() => {
      return [...Array(3)].map((_, i) => (
        <TransactionSkeleton key={`tx-skeleton-${i}`} />
      ));
    }, []);
    
    return (
      <View style={styles.loadingContainer}>
        {skeletonItems}
      </View>
    );
  } else if (type === "account") {
    return <AccountSummarySkeleton />;
  }
  
  // Default loader
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.text }]}>Loading data...</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    // color is set inline from colors.text
  },
});
