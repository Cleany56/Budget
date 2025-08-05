import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MonthPickerProps {
  month: string;
  selectedMonth: number;
  selectedYear: number;
  showMonthPicker: boolean;
  setShowMonthPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleYearChange: (increment: number) => void;
  handleMonthSelection: (month: number) => void;
  colors: {
    text: string;
    border: string;
    card: string;
    primary: string;
    background: string;
    muted?: string;
  };
}

const MonthPicker: React.FC<MonthPickerProps> = ({
  month,
  selectedMonth,
  selectedYear,
  showMonthPicker,
  setShowMonthPicker,
  handleYearChange,
  handleMonthSelection,
  colors,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>Month</Text>
      <TouchableOpacity 
        style={[styles.monthSelector, { borderColor: colors.border, backgroundColor: colors.card }]}
        onPress={() => setShowMonthPicker(prev => !prev)}
      >
        <Text style={[styles.monthText, { color: colors.text }]}>{month}</Text>
        <Ionicons name="calendar-outline" size={20} color={colors.text} />
      </TouchableOpacity>
      
      {showMonthPicker && (
        <View style={[styles.monthPickerContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.yearSelector}>
            <TouchableOpacity onPress={() => handleYearChange(-1)}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.yearText, { color: colors.text }]}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => handleYearChange(1)}>
              <Ionicons name="chevron-forward" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.monthsGrid}>
            {Array.from({ length: 12 }, (_, i) => {
              const monthName = new Date(2000, i).toLocaleString('default', { month: 'short' });
              const isSelected = selectedMonth === i;
              return (
                <TouchableOpacity 
                  key={i}
                  style={[
                    styles.monthItem,
                    isSelected && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => handleMonthSelection(i)}
                >
                  <Text 
                    style={[
                      styles.monthItemText, 
                      { color: isSelected ? 'white' : colors.text }
                    ]}
                  >
                    {monthName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  monthText: {
    fontSize: 16,
  },
  monthPickerContainer: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthItem: {
    width: '30%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 8,
  },
  monthItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MonthPicker;
