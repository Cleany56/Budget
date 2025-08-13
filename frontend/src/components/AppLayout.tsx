import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import { useTheme } from '../theme/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
  date?: string;
  toggleDarkMode: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  date,
  toggleDarkMode,
  showBack,
  onBackPress
}) => {
  const { colors } = useTheme();
  
  // Simple function to handle dark mode toggle
  const handleToggleDarkMode = () => {
    toggleDarkMode();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar date={date} toggleDarkMode={handleToggleDarkMode} showBack={showBack} onBackPress={onBackPress} />
      <View style={styles.content}>
        {children}
      </View>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
