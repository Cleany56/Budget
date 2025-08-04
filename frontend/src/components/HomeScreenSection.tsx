import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import HomeSection from './HomeSection';
import { Budget, Goal } from '../types';

// Utility types to help with proper typing
type NavigateToType = 'AddBudget' | 'AddGoal';
type IconType = 'add';

interface SectionProps {
  title: string;
  navigateTo: NavigateToType;
  loading: boolean;
  error: string | null;
  colors: any;
  data: Budget[] | Goal[];
  icon?: IconType;
  dataType: 'budgets' | 'goals';
  onRetry?: () => void;
}

/**
 * Reusable section component for home screen that handles loading, error, and content states
 */
export const HomeScreenSection: React.FC<SectionProps> = ({
  title,
  navigateTo,
  loading,
  error,
  colors,
  data,
  icon = 'add',
  dataType,
  onRetry
}) => {
  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <LoadingIndicator />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <ErrorMessage message={error} onRetry={onRetry} />
      </View>
    );
  }
  
  return (
    <HomeSection
      title={title}
      navigateTo={navigateTo}
      icon={icon}
      colors={colors}
      // Pass the right prop based on data type
      {...{ [dataType]: data }}
    />
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
