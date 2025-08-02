import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { TransactionFilters } from './TransactionFilterModal';

interface TransactionFilterDropdownProps {
  onPress?: () => void;
  activeFilters?: TransactionFilters;
  filtersCount?: number;
}

const TransactionFilterDropdown: React.FC<TransactionFilterDropdownProps> = ({ 
  onPress, 
  activeFilters,
  filtersCount = 0
}) => {
  const { colors } = useTheme();
  const hasActiveFilters = filtersCount > 0;
  
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          borderColor: hasActiveFilters ? colors.primary : colors.border, 
          backgroundColor: hasActiveFilters ? colors.primary + '20' : colors.card 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel="Filter transactions"
    >
      <Ionicons 
        name="filter" 
        size={22} 
        color={hasActiveFilters ? colors.primary : colors.text} 
      />
      
      {hasActiveFilters && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{filtersCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TransactionFilterDropdown;
