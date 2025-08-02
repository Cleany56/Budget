import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

interface BottomNavBarProps {
  onHomePress?: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onHomePress }) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.background }}>
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }] }>
        <Ionicons
          name="home-outline"
          size={28}
          color={colors.text}
          style={styles.navIcon}
          onPress={onHomePress}
        />
        <Ionicons name="pie-chart-outline" size={28} color={colors.text} style={styles.navIcon} />
        <Ionicons name="wallet-outline" size={28} color={colors.text} style={styles.navIcon} />
        <Ionicons name="person-outline" size={28} color={colors.text} style={styles.navIcon} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navIcon: {
    flex: 1,
    textAlign: 'center',
  },
});

export default BottomNavBar;
