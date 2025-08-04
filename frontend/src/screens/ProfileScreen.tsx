import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../theme/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { colors, darkMode, toggleDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'January 2023',
    profileImage: null // Would normally be a URL
  };

  const renderProfileOption = (icon: string, label: string, onPress: () => void) => (
    <TouchableOpacity 
      style={[styles.profileOption, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon as any} size={22} color={colors.text} />
      </View>
      <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.text} style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <AppLayout toggleDarkMode={toggleDarkMode}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        
        {/* User Info Card */}
        <View style={[styles.userInfoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.userAvatarContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.secondary }]}>{user.email}</Text>
            <Text style={[styles.userJoinDate, { color: colors.secondary }]}>Member since {user.joinDate}</Text>
          </View>
        </View>

        {/* Options Sections */}
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
          
          {renderProfileOption('person-outline', 'Edit Profile', () => {})}
          {renderProfileOption('notifications-outline', 'Notifications', () => {})}
          {renderProfileOption('lock-closed-outline', 'Privacy', () => {})}
          {renderProfileOption('shield-outline', 'Security', () => {})}
        </View>
        
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          {renderProfileOption('moon-outline', 'Dark Mode', toggleDarkMode)}
          {renderProfileOption('cash-outline', 'Currency', () => {})}
          {renderProfileOption('language-outline', 'Language', () => {})}
        </View>
        
        <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          
          {renderProfileOption('help-circle-outline', 'Help Center', () => {})}
          {renderProfileOption('information-circle-outline', 'About', () => {})}
          {renderProfileOption('log-out-outline', 'Logout', () => {})}
        </View>
        
        <Text style={[styles.versionText, { color: colors.secondary }]}>Version 1.0.0</Text>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'flex-start',
    width: '100%'
  },
  section: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
  },
  // User info card styles
  userInfoCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  userAvatarContainer: {
    marginRight: 16,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userAvatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userJoinDate: {
    fontSize: 12,
  },
  // Profile options
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    marginLeft: 8,
  },
  // Version text
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;
