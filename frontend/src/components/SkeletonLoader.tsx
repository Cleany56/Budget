import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
  borderRadius?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  width = '100%', 
  height = 20, 
  style = {}, 
  borderRadius = 4
}) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    // Create pulse animation for skeleton loaders
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      opacity.stopAnimation();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { 
          width, 
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity
        },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

/**
 * Transaction skeleton component to display while loading
 */
export const TransactionSkeleton: React.FC = () => {
  return (
    <View style={styles2.transactionItem}>
      <View style={styles2.iconPlaceholder}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
      </View>
      <View style={styles2.contentContainer}>
        <SkeletonLoader width="70%" height={18} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="50%" height={14} />
      </View>
      <View style={styles2.amountContainer}>
        <SkeletonLoader width={70} height={18} />
      </View>
    </View>
  );
};

/**
 * Account summary skeleton component
 */
export const AccountSummarySkeleton: React.FC = () => {
  return (
    <View style={styles2.accountSummaryContainer}>
      <SkeletonLoader width="40%" height={20} style={{ marginBottom: 16 }} />
      <SkeletonLoader width="100%" height={60} style={{ marginBottom: 16 }} borderRadius={8} />
      <SkeletonLoader width="100%" height={60} style={{ marginBottom: 16 }} borderRadius={8} />
      <SkeletonLoader width="100%" height={60} borderRadius={8} />
    </View>
  );
};

const styles2 = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  iconPlaceholder: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  accountSummaryContainer: {
    padding: 16,
  }
});

export default SkeletonLoader;
