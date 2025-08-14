import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface PayoffTimelineChartProps {
  paymentSchedule: Array<{
    month: number;
    debts: Array<{
      name: string;
      startBalance: number;
      endBalance: number;
      interest: number;
      payment: number;
    }>;
  }>;
  timeToPayoff: string;
  colors: any;
}

const PayoffTimelineChart: React.FC<PayoffTimelineChartProps> = ({ 
  paymentSchedule,
  timeToPayoff,
  colors 
}) => {
  // If no payment schedule data yet, show placeholder message
  if (!paymentSchedule || paymentSchedule.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Payoff Timeline
        </Text>
        <View style={[styles.placeholderContainer, { 
          borderColor: colors.border,
          backgroundColor: colors.background
        }]}>
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            Payoff timeline will appear here after calculation
          </Text>
        </View>
      </View>
    );
  }

  // Process payment schedule into chart data
  // We want to show the total debt balance over time
  const chartData = processPaymentSchedule(paymentSchedule);
  
  // Get the screen width
  const screenWidth = Dimensions.get('window').width - 40; // -40 for padding
  
  return (
    <View style={styles.chartContainer}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        Payoff Timeline
      </Text>
      <View style={[styles.chartWrapper, { 
        borderColor: colors.border,
        backgroundColor: colors.background
      }]}>
        <LineChart
          data={chartData}
          width={screenWidth - 20} // Adjust for padding
          height={180}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Keep the blue for the line
            labelColor: (opacity = 1) => colors.text ? `rgba(${parseColorForRgba(colors.text)}, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 8
            },
            propsForDots: {
              r: "3",
              strokeWidth: "2",
              stroke: "#2196F3"
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: colors.border ? parseColorWithOpacity(colors.border, 0.5) : '#e0e0e0',
              strokeWidth: 1
            },
            strokeWidth: 2,
            propsForLabels: {
              fontSize: "10"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 8
          }}
          formatYLabel={(value) => formatCurrency(parseFloat(value), true)}
          // Enhanced props for dark mode compatibility
          yAxisSuffix=""
          yAxisLabel=""
        />
      </View>
    </View>
  );
};

// Helper function to process payment schedule data for the chart
const processPaymentSchedule = (paymentSchedule: PayoffTimelineChartProps['paymentSchedule']) => {
  // Calculate the total debt remaining for each month
  const balanceByMonth = paymentSchedule.map(month => {
    const totalBalance = month.debts.reduce((sum, debt) => sum + debt.endBalance, 0);
    return { month: month.month, balance: totalBalance };
  });

  // Simplify chart display - choose specific points for better visualization
  const totalMonths = paymentSchedule.length;
  
  // Initialize arrays for chart data
  const dataPoints = [];
  const labels = [];
  
  // Add starting point (always show month 0)
  if (balanceByMonth.length > 0) {
    dataPoints.push(balanceByMonth[0].balance);
    labels.push("Start");
  }
  
  // Choose a reasonable number of points to display
  // For shorter timeframes: 3-4 points
  // For longer timeframes: 5-6 points
  const numPoints = totalMonths <= 12 ? 3 : 5;
  const interval = Math.max(1, Math.floor(totalMonths / numPoints));
  
  // Add intermediate points
  for (let i = interval; i < totalMonths - interval; i += interval) {
    if (i < balanceByMonth.length) {
      dataPoints.push(balanceByMonth[i].balance);
      
      // Simple labeling
      if (totalMonths > 24) {
        // Show in years for longer periods
        const years = Math.floor(i / 12);
        labels.push(`${years}y`);
      } else {
        // Show in months for shorter periods
        labels.push(`${i}m`);
      }
    }
  }
  
  // Always add the final point
  if (balanceByMonth.length > 1) {
    const lastIndex = balanceByMonth.length - 1;
    dataPoints.push(balanceByMonth[lastIndex].balance);
    labels.push("Paid");
  }
  
  // Ensure we have at least two points
  if (dataPoints.length < 2) {
    if (balanceByMonth.length > 1) {
      // Add midpoint
      const midIndex = Math.floor(balanceByMonth.length / 2);
      dataPoints.splice(1, 0, balanceByMonth[midIndex].balance);
      labels.splice(1, 0, `${midIndex}m`);
    } else {
      // Add zero if we only have one point
      dataPoints.push(0);
      labels.push("End");
    }
  }
  
  // Return the final chart data
  return {
    labels,
    datasets: [
      {
        data: dataPoints,
        color: () => '#2196F3', // Fixed blue color
        strokeWidth: 2
      }
    ],
    legend: ["Debt Balance"]
  };
};

// Helper to format currency
const formatCurrency = (amount: number, includeSymbol: boolean = true) => {
  const symbol = includeSymbol ? '$' : '';
  
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}k`;
  }
  return `${symbol}${amount.toFixed(0)}`;
};

// Helper functions for color handling
// Parse color for rgba format - handles hex colors and falls back to a default
const parseColorForRgba = (color: string) => {
  if (!color || typeof color !== 'string') {
    return '128, 128, 128'; // Default gray
  }
  
  try {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      // Handle both 3-digit and 6-digit hex
      const r = hex.length === 3 ? parseInt(hex[0] + hex[0], 16) : parseInt(hex.substring(0, 2), 16);
      const g = hex.length === 3 ? parseInt(hex[1] + hex[1], 16) : parseInt(hex.substring(2, 4), 16);
      const b = hex.length === 3 ? parseInt(hex[2] + hex[2], 16) : parseInt(hex.substring(4, 6), 16);
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return '128, 128, 128';
      }
      
      return `${r}, ${g}, ${b}`;
    }
    
    // Return default for other formats
    return '128, 128, 128';
  } catch (error) {
    // console.log('Error parsing color:', error);
    return '128, 128, 128';
  }
};

// Create a color with opacity
const parseColorWithOpacity = (color: string, opacity: number) => {
  if (color.startsWith('#')) {
    const rgbParts = parseColorForRgba(color);
    return `rgba(${rgbParts}, ${opacity})`;
  }
  
  // Return with default opacity if not a hex color
  return color;
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  chartWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    // No fixed background color here - we'll apply it dynamically based on theme
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContainer: {
    height: 180,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
  }
});

export default PayoffTimelineChart;
