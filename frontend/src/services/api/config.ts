/**
 * API configuration and base setup
 */
import axios from 'axios';
import { Platform } from 'react-native';

// Base API configuration
// Use 10.0.2.2 instead of localhost for Android emulator
// 10.0.2.2 is a special IP that the Android emulator uses to communicate with the host machine
const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api'
  : 'http://localhost:5000/api';

// Create an axios instance for our API
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a temporary userId for development
// In production, this would come from authentication
const DEV_USER_ID = 'user123';

// Request interceptor to add userId to all requests
apiClient.interceptors.request.use((config) => {
  // For GET requests, add userId as query param
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      userId: DEV_USER_ID,
    };
  }
  
  // For POST requests, add userId to the request body if it doesn't exist
  if (config.method === 'post' || config.method === 'put') {
    if (config.data) {
      // Parse string data if necessary
      let data = config.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing request data:', e);
        }
      }
      
      // Add userId if it doesn't exist
      if (!data.userId) {
        data.userId = DEV_USER_ID;
        // Convert back to string only if it was a string originally
        config.data = typeof config.data === 'string' ? JSON.stringify(data) : data;
      }
    } else if (!config.data) {
      config.data = { userId: DEV_USER_ID };
    }
  }
  
  return config;
});

// Response interceptor to transform data from backend to frontend format
apiClient.interceptors.response.use((response) => {
  const processItem = (item: any) => {
    // Handle ID transformation
    const result = item._id && !item.id ? {
      id: item._id,
      ...item,
      _id: undefined // Remove _id to avoid confusion
    } : {...item};
    
    // Handle currency/balance values
    // Ensure they're always numbers, not strings
    if (typeof result.balance === 'string') {
      result.balance = parseFloat(result.balance);
    }
    if (typeof result.amount === 'string') {
      result.amount = parseFloat(result.amount);
    }
    
    // Ensure all numeric values that need formatting are valid numbers
    ['balance', 'amount', 'spent', 'targetAmount', 'currentAmount'].forEach(field => {
      if (result[field] !== undefined && !isNaN(parseFloat(result[field]))) {
        result[field] = parseFloat(result[field]);
      }
    });
    
    return result;
  };

  // Transform array data
  if (Array.isArray(response.data)) {
    response.data = response.data.map(processItem);
  } 
  // Transform single object data
  else if (response.data && typeof response.data === 'object') {
    response.data = processItem(response.data);
  }
  
  return response;
});

export default apiClient;
