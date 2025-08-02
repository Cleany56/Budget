import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import BottomNavBar from './src/components/BottomNavBar';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';


function AppContent() {
  const { darkMode, colors, toggleDarkMode } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <HomeScreen toggleDarkMode={toggleDarkMode} />
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <BottomNavBar />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is set via theme
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    // borderTopColor and backgroundColor should use theme
  },
  navIcon: {
    flex: 1,
    textAlign: 'center',
  },
});
