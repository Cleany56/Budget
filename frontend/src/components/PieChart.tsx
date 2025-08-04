import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

export interface PieChartDataItem {
  name: string;
  amount: number;
  color: string;
  icon?: string; // Optional icon for category
}

interface PieChartProps {
  data: PieChartDataItem[];
  width: number;
  height: number;
  totalLabel?: string; // Optional label for the center text
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height, totalLabel = 'TOTAL SPEND' }) => {
  const { colors } = useTheme();
  
  // Filter out zero amounts
  const filtered = data.filter(item => item.amount > 0);
  
  // Calculate total for percentages
  const total = filtered.reduce((sum, item) => sum + item.amount, 0);
  
  // Format total as currency with commas and no cents
  const formattedTotal = `$${Math.round(total).toLocaleString('en-US')}`;
  
  // SVG dimensions
  const size = Math.min(width, height);
  const radius = size / 2;
  const cx = radius;
  const cy = radius;
  
  // Define inner and outer radius for donut chart
  const outerRadius = radius;
  const innerRadius = radius * 0.68; // 68% of outer radius for a thinner ring
  
  // Generate donut chart slices
  const generatePieSlices = () => {
    let slices = [];
    let startAngle = 0;
    
    for (let item of filtered) {
      if (item.amount <= 0 || total <= 0) continue;
      
      // Calculate the angle for this slice
      const angle = (item.amount / total) * 360;
      const endAngle = startAngle + angle;
      
      // Convert angles to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      // Calculate outer path coordinates
      const outerX1 = cx + outerRadius * Math.cos(startRad);
      const outerY1 = cy + outerRadius * Math.sin(startRad);
      const outerX2 = cx + outerRadius * Math.cos(endRad);
      const outerY2 = cy + outerRadius * Math.sin(endRad);
      
      // Calculate inner path coordinates
      const innerX1 = cx + innerRadius * Math.cos(endRad);
      const innerY1 = cy + innerRadius * Math.sin(endRad);
      const innerX2 = cx + innerRadius * Math.cos(startRad);
      const innerY2 = cy + innerRadius * Math.sin(startRad);
      
      // Path flag for large arcs (> 180 degrees)
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Generate SVG path for donut slice
      const path = `
        M ${outerX1} ${outerY1}
        A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}
        L ${innerX1} ${innerY1}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX2} ${innerY2}
        Z
      `;
      
      slices.push(
        <Path
          key={item.name}
          d={path}
          fill={item.color}
          stroke={colors.background} // Use background color instead of white for dark mode support
          strokeWidth={1}
        />
      );
      
      // Update start angle for next slice
      startAngle = endAngle;
    }
    
    return slices;
  };

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width,
      height,
    }}>
      <View style={{ 
        position: 'relative',
        backgroundColor: 'transparent', // Ensure background is transparent
      }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {generatePieSlices()}
            {/* No need for center circle as we're using a donut chart approach */}
          </G>
        </Svg>
        
        {/* Center text overlay */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: size * 0.06,
            color: colors.text, // Use text color for proper dark mode support
            opacity: 0.6, // Use opacity for secondary text instead of a fixed color
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: 6,
            letterSpacing: 0.5,
          }}>
            {totalLabel}
          </Text>
          <Text style={{
            fontSize: size * 0.13, // Reduced from 0.15 to make it slightly smaller
            color: colors.text,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 0.5,
          }}>
            {formattedTotal}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PieChart;
