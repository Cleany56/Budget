import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

interface HorizontalBarChartProps {
  income: number;
  spend: number;
  width?: number;
  height?: number;
  incomeColor?: string;
  spendColor?: string;
  showValues?: boolean;
  maxValue?: number;
}

const BAR_HEIGHT = 16;
const BAR_GAP = 10;
const LABEL_WIDTH = 48;
const DEFAULT_WIDTH = 220;
const DEFAULT_HEIGHT = BAR_HEIGHT * 2 + BAR_GAP + 16;

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ income, spend, width, height = DEFAULT_HEIGHT, incomeColor, spendColor, showValues, maxValue }) => {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
  // Use maxValue prop for scaling, fallback to local max if not provided
  const scaleMax = maxValue && maxValue > 0 ? maxValue : Math.max(income, Math.abs(spend), 1);
  // Calculate barMaxWidth: if width prop, use it; else use measured container width
  const barMaxWidth = typeof width === 'number'
    ? width - LABEL_WIDTH - 24
    : containerWidth !== undefined
      ? containerWidth - LABEL_WIDTH - 24
      : undefined;

  const handleLayout = (e: any) => {
    if (!width) {
      setContainerWidth(e.nativeEvent.layout.width);
    }
  };

  const containerStyle = [styles.container, width ? { width, height } : { height }];

  return (
    <View style={containerStyle} onLayout={handleLayout}>
      {/* Income Bar */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Income</Text>
        <View style={{ flex: 1 }}>
          {barMaxWidth ? (
            <Svg height={BAR_HEIGHT} width={barMaxWidth} style={styles.barSvg}>
              <Rect x={0} y={0} width={(income / scaleMax) * barMaxWidth} height={BAR_HEIGHT} rx={6} fill={incomeColor || colors.primary || '#27ae60'} />
            </Svg>
          ) : null}
        </View>
        {/* No value label */}
      </View>
      {/* Spend Bar */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Spend</Text>
        <View style={{ flex: 1 }}>
          {barMaxWidth ? (
            <Svg height={BAR_HEIGHT} width={barMaxWidth} style={styles.barSvg}>
              <Rect x={0} y={0} width={(Math.abs(spend) / scaleMax) * barMaxWidth} height={BAR_HEIGHT} rx={6} fill={spendColor || colors.accent || '#e17055'} />
            </Svg>
          ) : null}
        </View>
        {/* No value label */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BAR_GAP,
  },
  label: {
    width: LABEL_WIDTH,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'left',
  },
  barSvg: {
    marginHorizontal: 6,
  },
});

export default HorizontalBarChart;
