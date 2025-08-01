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


import { Expense, AccountSummary } from '../types';

type ChartsCarouselProps = {
  accounts: AccountSummary[];
  expenses: Expense[];
};

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

function getInvestmentsData(accounts: AccountSummary[]) {
  const labels = getLast7MonthsLabels();
  const investment = accounts.filter(a => a.type === 'Investment');
  const current = investment.reduce((sum, a) => sum + a.balance, 0);
  let data = labels.map(() => current);
  if (data.every(v => v === current) && current !== 0) {
    data[0] = current / 2;
  }
  return { labels, data };
}

function getNetWorthData(accounts: AccountSummary[]) {
  const labels = getLast7MonthsLabels();
  const getNetWorth = () => {
    const investment = accounts.filter(a => a.type === 'Investment').reduce((sum, a) => sum + a.balance, 0);
    const checking = accounts.filter(a => a.type === 'Checking').reduce((sum, a) => sum + a.balance, 0);
    const savings = accounts.filter(a => a.type === 'Savings').reduce((sum, a) => sum + a.balance, 0);
    const card = accounts.filter(a => a.type === 'Credit Card').reduce((sum, a) => sum + a.balance, 0);
    return investment + checking + savings - Math.abs(card);
  };
  const netWorth = getNetWorth();
  let data = labels.map(() => netWorth);
  if (data.every(v => v === netWorth) && netWorth !== 0) {
    data[0] = netWorth / 2;
  }
  return { labels, data };
}

const ChartsCarousel: React.FC<ChartsCarouselProps> = ({ accounts, expenses }) => {
  const spending = getSpendingData(expenses);
  const investments = getInvestmentsData(accounts);
  const netWorth = getNetWorthData(accounts);
  const chartData = [
    {
      title: 'Spending',
      data: spending.data,
      labels: spending.labels,
      color: '#e17055',
      segments: 0,
      yLabelsOffset: 0,
    },
    {
      title: 'Investments',
      data: investments.data,
      labels: investments.labels,
      color: '#0984e3',
      segments: 0,
      yLabelsOffset: 0,
    },
    {
      title: 'Net Worth',
      data: netWorth.data,
      labels: netWorth.labels,
      color: '#00b894',
      segments: 3,
      yLabelsOffset: 8,
    },
  ];
  return (
    <View style={styles.carouselContainer}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {chartData.map((chart, idx) => (
          <View key={chart.title} style={styles.chartWrapper}>
            <View style={styles.tile}>
              <Text style={styles.chartTitle}>{chart.title}</Text>
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
                bezier
                style={styles.chart}
                formatYLabel={shortNumber}
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
    marginBottom: 8,
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
