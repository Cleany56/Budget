import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import apiClient from '../services/api/config';
import { getAccounts } from '../services/api';

/**
 * Debug panel for development purposes
 * This component provides buttons to add test data to the app
 */
interface DevToolbarProps {
  onDataChanged?: () => void;
}

const DevToolbar: React.FC<DevToolbarProps> = ({ onDataChanged }) => {
  const { colors } = useTheme();
  
  const addTestAccounts = async () => {
    try {
      // Use consistent userId with the rest of the app
      console.log('Adding test accounts...');
      const response = await apiClient.post('/test-accounts/add-test-accounts?userId=user123');
      console.log('Test accounts added response:', response.data);
      
      // Force a short delay before triggering data refresh to ensure backend completes processing
      setTimeout(() => {
        console.log('Triggering data refresh after account creation');
        if (onDataChanged) {
          onDataChanged();
        }
      }, 300);
      
      Alert.alert('Success', 'Test accounts added successfully');
    } catch (error) {
      console.error('Failed to add test accounts:', error);
      Alert.alert('Error', 'Failed to add test accounts');
    }
  };
  
  const clearAccounts = async () => {
    try {
      // Show confirmation before proceeding
      Alert.alert(
        'Clear All Accounts',
        'This will mark all accounts as deleted. Are you sure?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: async () => {
              console.log('Clearing all accounts...');
              const response = await apiClient.post('/test-accounts/clear-accounts?userId=user123');
              console.log('Accounts cleared response:', response.data);
              
              // Force a short delay before triggering data refresh to ensure backend completes processing
              setTimeout(() => {
                console.log('Triggering data refresh after account deletion');
                if (onDataChanged) {
                  onDataChanged();
                }
              }, 300);
              
              Alert.alert('Success', 'All accounts have been cleared');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to clear accounts:', error);
      Alert.alert('Error', 'Failed to clear accounts');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Developer Tools</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={addTestAccounts}
        >
          <Text style={styles.buttonText}>Add Test Accounts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#ff6347' }]} 
          onPress={clearAccounts}
        >
          <Text style={styles.buttonText}>Clear Accounts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default DevToolbar;
