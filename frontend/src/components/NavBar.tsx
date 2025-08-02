import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface NavBarProps {
  date?: string;
  onSettingsPress?: () => void;
  toggleDarkMode?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ date, onSettingsPress, toggleDarkMode }) => {
  const { darkMode, colors } = useTheme();
  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.background }] }>
      <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }] }>
        <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.date, { color: colors.text }]}>{date}</Text>
        <TouchableOpacity
          onPress={toggleDarkMode || (() => {})}
          style={styles.iconButton}
          accessibilityLabel="Toggle dark mode"
        >
          <Ionicons
            name={darkMode ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={darkMode ? '#ffd700' : colors.text}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconButton: {
    padding: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
});

export default NavBar;
