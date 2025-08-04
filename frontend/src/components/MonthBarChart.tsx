import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../theme/ThemeContext';
import { Dimensions } from 'react-native';

interface MonthBarChartProps {
  month: string;
  income: number;
  spend: number;
}

const chartConfig = (colors: any) => ({
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  fillShadowGradient: colors.primary || '#4e73df',
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => colors.text,
  labelColor: (opacity = 1) => colors.text,
  barPercentage: 0.7,
  decimalPlaces: 0,
});

const MonthBarChart: React.FC<MonthBarChartProps> = ({ month, income, spend }) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  return (
    <View style={{ alignItems: 'flex-start', width: '100%', marginBottom: 24 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8, color: colors.text }}>{month}</Text>
      <BarChart
        data={{
          labels: ['Income', 'Spend'],
          datasets: [
            {
              data: [income, Math.abs(spend)],
            },
          ],
        }}
        width={screenWidth - 64}
        height={120}
        fromZero
        showValuesOnTopOfBars
        withInnerLines={false}
        chartConfig={chartConfig(colors)}
        style={{ borderRadius: 12 }}
        yAxisLabel={"$"}
        yAxisSuffix={""}
        flatColor={true}
        segments={3}
        verticalLabelRotation={0}
        withHorizontalLabels={true}
        // withCustomBarColorFromData and barColors are not supported in this version
      />
    </View>
  );
};

export default MonthBarChart;
