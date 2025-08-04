/**
 * API Status Service
 * Provides utilities to check API connectivity
 */
import apiClient from './config';

/**
 * Check if the API is online
 * @returns Promise that resolves to true if API is online, false otherwise
 */
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
