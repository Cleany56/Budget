import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import PieChart from '../components/PieChart';
import { DUMMY_EXPENSES } from '../utils/dummyData';
import { ExpenseCategory } from '../types';
import { getTransactionIconComponent } from '../utils/transactionIcons';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';

// Pie chart colors for each category
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#4bcffa',
  [ExpenseCategory.TRANSPORT]: '#ffa801',
  [ExpenseCategory.ENTERTAINMENT]: '#a55eea',
  [ExpenseCategory.SHOPPING]: '#ff5e57',
  [ExpenseCategory.UTILITIES]: '#00b894',
  [ExpenseCategory.HEALTH]: '#fd79a8',
  [ExpenseCategory.HOUSING]: '#636e72',
  [ExpenseCategory.OTHER]: '#f7b731',
};

const MonthDetailScreen: React.FC<any> = ({ route }) => {
  const { colors, toggleDarkMode } = useTheme();
  const navigation = useNavigation();
  const { year, month, label } = route.params;
  
  // Filter expenses for this month and only spending (amount < 0)
  const spendingByCategory = useMemo(() => {
    const map: Record<ExpenseCategory, number> = {
      [ExpenseCategory.FOOD]: 0,
      [ExpenseCategory.TRANSPORT]: 0,
      [ExpenseCategory.ENTERTAINMENT]: 0,
      [ExpenseCategory.SHOPPING]: 0,
      [ExpenseCategory.UTILITIES]: 0,
      [ExpenseCategory.HEALTH]: 0,
      [ExpenseCategory.HOUSING]: 0,
      [ExpenseCategory.OTHER]: 0,
    };
    
    DUMMY_EXPENSES.forEach(exp => {
      if (
        exp.amount < 0 &&
        exp.date.getFullYear() === year &&
        exp.date.getMonth() === month
      ) {
        map[exp.category] += Math.abs(exp.amount);
      }
    });
    
    return map;
  }, [year, month]);

  // Convert to pie chart data format
  const pieData = Object.entries(spendingByCategory)
    .map(([cat, amt]) => ({
      name: cat,
      amount: amt as number,
      color: CATEGORY_COLORS[cat as ExpenseCategory] || '#888',
    }));
    
  // Calculate chart size based on available space
  const screenWidth = Dimensions.get('window').width;

  // Calculate total spending
  const totalSpending = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Calculate income and net for this month
  const monthIncome = useMemo(() => {
    return DUMMY_EXPENSES.reduce((sum, exp) => {
      if (exp.amount > 0 && exp.date.getFullYear() === year && exp.date.getMonth() === month) {
        return sum + exp.amount;
      }
      return sum;
    }, 0);
  }, [year, month]);
  
  // Net = Income - Spending
  const netIncome = monthIncome - totalSpending;
  
  // Calculate percentage of income left after spending
  const percentageLeft = monthIncome > 0 
    ? Math.max(0, Math.round((netIncome / monthIncome) * 100)) 
    : 0;
  
  // Format currency for better readability
  const formatCurrency = (amount: number, showSign = false) => {
    // Round to nearest dollar
    const roundedAmount = Math.round(Math.abs(amount));
    const value = `$${roundedAmount}`;
    if (showSign) {
      return amount >= 0 ? `+${value}` : `-${value}`;
    }
    return value;
  };
  
  // Get category icon component
  const getCategoryIcon = (category: ExpenseCategory, color: string, size = 20) => {
    switch (category) {
      case ExpenseCategory.FOOD:
        return <MaterialCommunityIcons name="food" size={size} color={color} />;
      case ExpenseCategory.TRANSPORT:
        return <FontAwesome5 name="car" size={size} color={color} />;
      case ExpenseCategory.ENTERTAINMENT:
        return <Ionicons name="game-controller" size={size} color={color} />;
      case ExpenseCategory.SHOPPING:
        return <Entypo name="shopping-bag" size={size} color={color} />;
      case ExpenseCategory.UTILITIES:
        return <MaterialIcons name="lightbulb" size={size} color={color} />;
      case ExpenseCategory.HEALTH:
        return <FontAwesome5 name="hospital" size={size} color={color} />;
      case ExpenseCategory.HOUSING:
        return <Ionicons name="home" size={size} color={color} />;
      case ExpenseCategory.OTHER:
        return <MaterialIcons name="attach-money" size={size} color={color} />;
      default:
        return <MaterialIcons name="attach-money" size={size} color={color} />;
    }
  };

  return (
    <AppLayout toggleDarkMode={toggleDarkMode} showBack onBackPress={() => navigation.goBack()}>
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={true}
      >
        <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
        
        {/* Financial summary section */}
        <View style={[styles.summaryContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text, opacity: 0.7 }]}>Income</Text>
            <Text style={[styles.summaryValue, { color: '#00b894' }]}>{formatCurrency(monthIncome)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text, opacity: 0.7 }]}>Total Spend</Text>
            <Text style={[styles.summaryValue, { color: '#ff5e57' }]}>{formatCurrency(totalSpending)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text, opacity: 0.7 }]}>Net Income</Text>
            <Text style={[styles.summaryValue, { color: netIncome >= 0 ? '#00b894' : '#ff5e57' }]}>
              {formatCurrency(netIncome, true)}
              {netIncome < 0 ? ' 🔻' : ' ✓'}
            </Text>
          </View>
        </View>
        
        {/* Savings percentage section */}
        <View style={[styles.savingsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.savingsLabel, { color: colors.text }]}>
            Income Left After Spending
          </Text>
          <View style={styles.savingsRow}>
            <Text style={[styles.savingsPercentage, { 
              color: percentageLeft >= 0 ? '#00b894' : '#ff5e57',
              fontSize: 22,
            }]}>
              {percentageLeft}%
            </Text>
            <Text style={[styles.savingsDescription, { color: colors.text }]}>
              {percentageLeft >= 20 ? 'Available for savings & debt' : 
               percentageLeft > 0 ? 'Limited amount for savings' : 
               'No funds left for savings'}
            </Text>
          </View>
        </View>
        
        <View style={styles.chartCardContainer}>
          <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <PieChart 
              data={pieData} 
              width={280}
              height={280}
              totalLabel="TOTAL SPEND"
            />
          </View>
          
          {/* Section divider and Legend title */}
          <View style={[styles.sectionDivider, { borderColor: colors.border }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legend</Text>
          
          {/* Category legends with icons */}
          <View style={styles.legendContainer}>
            {pieData.filter(item => item.amount > 0).map((item, index, filteredItems) => (
              <View key={`category-legend-${item.name}-${index}`} style={[
                styles.legendItem, 
                { 
                  // Only show bottom border if not the last item
                  borderBottomColor: colors.border, 
                  borderBottomWidth: index === filteredItems.length - 1 ? 0 : 1
                }
              ]}>
                <View style={styles.iconContainer}>
                  {getCategoryIcon(item.name as ExpenseCategory, item.color, 24)}
                </View>
                <View style={styles.legendTextContainer}>
                  <Text style={[styles.legendCategoryText, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.legendPercentText, { color: colors.text, opacity: 0.7 }]}>
                    {((item.amount / totalSpending) * 100).toFixed(0)}%
                  </Text>
                </View>
                <Text style={[styles.legendAmountText, { color: colors.text }]}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Consistent with other screens
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16, // Reduced to accommodate summary section
    textAlign: 'center', // Center the title
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  savingsContainer: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsPercentage: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  savingsDescription: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  chartCardContainer: {
    alignItems: 'center', // Center horizontally
    justifyContent: 'flex-start', // Start from top
    paddingTop: 0, // No extra padding needed with multiple sections above
    marginBottom: 20, // Add some space at the bottom
  },
  chartCard: {
    width: 320, // Further increased width
    height: 320, // Further increased height
    borderRadius: 14, // Consistent with other UI elements
    borderWidth: 1,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    // Shadow for card-like appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 10, // Space between chart and legends
  },
  // Removed legendScrollContainer as we're using full page scrolling
  legendContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 30, // Add padding at the bottom for better scrolling
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    // borderBottomWidth and borderBottomColor are applied inline
    // No borderRadius or background to avoid box appearance in dark mode
  },
  colorSquare: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendTextContainer: {
    flex: 1,
    marginLeft: 4,
    justifyContent: 'center',
  },
  legendCategoryText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendPercentText: {
    fontSize: 13,
    fontWeight: '400',
  },
  legendAmountText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'right',
    marginLeft: 10,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 10,
    textAlign: 'left',
  },
  iconContainer: {
    marginRight: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    // No background color - completely transparent in both modes
  }
});

export default MonthDetailScreen;

