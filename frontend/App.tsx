import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <ThemeProvider>
      <AppNavigator />
      <StatusBar style={darkMode ? 'light' : 'dark'} />
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
