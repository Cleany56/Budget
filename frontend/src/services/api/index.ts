/**
 * Main API service index
 * Export all API services from a single file
 */

// Export all services
export * from './accounts';
export * from './transactions';
export * from './budgets';
export * from './goals';

// Re-export the API client for direct use
export { default as apiClient } from './config';
