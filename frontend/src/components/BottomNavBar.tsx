import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface BottomNavBarProps {
  onHomePress?: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onHomePress }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleHomePress = () => {
    navigation.navigate('Home');
  };
  
  const handleTransactionsPress = () => {
    navigation.navigate('Transactions');
  };
  
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.background }}>
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }] }>
        <Ionicons
          name="home-outline"
          size={28}
          color={colors.text}
          style={styles.navIcon}
          onPress={handleHomePress}
        />
        <Ionicons
          name="document-text-outline"
          size={28}
          color={colors.text}
          style={styles.navIcon}
          onPress={handleTransactionsPress}
        />
        <View style={[styles.plusWrapper, { backgroundColor: colors.background }]}> 
          <View style={[styles.plusCircle, { backgroundColor: colors.background, borderColor: colors.border }]}> 
            <Ionicons name="add" size={28} color={colors.text} style={styles.plusIcon} />
          </View>
        </View>
        <Ionicons name="pie-chart-outline" size={28} color={colors.text} style={styles.navIcon} />
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
  plusWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  plusIcon: {
    // No extra style needed
  },
});

export default BottomNavBar;
