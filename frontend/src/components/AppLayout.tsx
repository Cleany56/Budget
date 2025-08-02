import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import { useTheme } from '../theme/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
  date?: string;
  toggleDarkMode: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  date,
  toggleDarkMode 
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavBar date={date} toggleDarkMode={toggleDarkMode} />
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
