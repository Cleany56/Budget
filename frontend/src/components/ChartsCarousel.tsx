// Shorten large numbers for y-axis labels (e.g., 10000 -> 10k)
function shortNumber(yValue: string): string {
  const num = Number(yValue);
  if (isNaN(num)) return yValue;
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const tileHorizontalPadding = 16 * 2 + 8 * 2; // tile padding + wrapper padding
const chartWidth = Dimensions.get('window').width - tileHorizontalPadding;
const chartHeight = 180;


import {
  INVESTMENT_BALANCES_2025,
  CHECKING_BALANCES_2025,
  SAVINGS_BALANCES_2025,
  CREDITCARD_BALANCES_2025,
  DUMMY_EXPENSES
} from '../utils/dummyData';
import { Expense } from '../types';

function getLast7DaysLabels() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
  }
  return days;
}

function getLast7MonthsLabels() {
  const months = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    months.push(d.toLocaleDateString(undefined, { month: 'short' }));
  }
  return months;
}

function getSpendingData(expenses: Expense[]) {
  const labels = getLast7DaysLabels();
  const today = new Date();
  const data = labels.map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - idx));
    return expenses
      .filter(e => e.date instanceof Date &&
        e.date.getFullYear() === d.getFullYear() &&
        e.date.getMonth() === d.getMonth() &&
        e.date.getDate() === d.getDate())
      .reduce((sum, e) => sum + e.amount, 0);
  });
  return { labels, data };
}

function getInvestmentsData() {
  // Use dummy monthly balances for 2025
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = INVESTMENT_BALANCES_2025;
  return { labels, data };
}

function getNetWorthData() {
  // Use dummy monthly balances for 2025
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = INVESTMENT_BALANCES_2025.map((inv, i) =>
    inv + CHECKING_BALANCES_2025[i] + SAVINGS_BALANCES_2025[i] - Math.abs(CREDITCARD_BALANCES_2025[i])
  );
  return { labels, data };
}

const ChartsCarousel: React.FC = () => {
  const investments = getInvestmentsData();
  const netWorth = getNetWorthData();
  // Use actual spending data for the Spending chart
  const spending = getSpendingData(DUMMY_EXPENSES);
  const chartData = [
    {
      title: 'Investments',
      data: investments.data,
      labels: investments.labels,
      color: '#0984e3',
      segments: 0,
      yLabelsOffset: 0,
      latest: investments.data[investments.data.length - 1],
    },
    {
      title: 'Net Worth',
      data: netWorth.data,
      labels: netWorth.labels,
      color: '#00b894',
      segments: 3,
      yLabelsOffset: 8,
      latest: netWorth.data[netWorth.data.length - 1],
    },
    {
      title: 'Spending',
      data: spending.data,
      labels: spending.labels,
      color: '#e17055',
      segments: 0,
      yLabelsOffset: 0,
      latest: spending.data[spending.data.length - 1] || 0,
    },
  ];
  return (
    <View style={styles.carouselContainer}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {chartData.map((chart, idx) => (
          <View key={chart.title} style={styles.chartWrapper}>
            <View style={styles.tile}>
              <Text style={styles.chartTitle}>{chart.title}</Text>
              <Text style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                Current: {shortNumber(String(chart.latest))}
              </Text>
              <LineChart
                data={{
                  labels: chart.labels,
                  datasets: [{ data: chart.data }],
                }}
                width={chartWidth}
                height={chartHeight}
                chartConfig={{
                  backgroundColor: '#f4f4f7',
                  backgroundGradientFrom: '#f4f4f7',
                  backgroundGradientTo: '#f4f4f7',
                  decimalPlaces: 0,
                  color: () => chart.color,
                  labelColor: () => '#888',
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: chart.color,
                  },
                  propsForLabels: {
                    fontSize: 12,
                  },
                  propsForBackgroundLines: {
                    stroke: '#888',
                    strokeDasharray: '4',
                  },
                }}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                withInnerLines={true}
                withOuterLines={false}
                yLabelsOffset={chart.yLabelsOffset}
                segments={chart.segments}
                fromZero={false}
                style={styles.chart}
                formatYLabel={shortNumber}
                withDots={false}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 16,
  },
  chartWrapper: {
    width: chartWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
    paddingLeft: 8,
    alignSelf: 'center',
  },
  tile: {
    backgroundColor: '#f4f4f7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 16,
    paddingRight: 48,
    color: '#222',
    textAlign: 'center',
    alignSelf: 'center',
  },
  chart: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
  },
});

export default ChartsCarousel;
