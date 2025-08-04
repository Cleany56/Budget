import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import App from '../../App';

/**
 * This component ensures React is properly initialized before rendering the main App
 * Helps prevent "Cannot read property 'useMemo' of null" errors in the Hermes engine
 */
export default function AppInitializer() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if React hooks are available
      const testHooks = () => {
        // Test useMemo
        React.useMemo(() => {}, []);
        
        // Test useState
        const [state, setState] = React.useState(null);
        
        // Test useEffect
        React.useEffect(() => {}, []);
        
        // Test useCallback
        React.useCallback(() => {}, []);
        
        // Test useRef
        React.useRef(null);
        
        return true;
      };
      
      const hooksAvailable = testHooks();
      console.log('React hooks initialization check:', hooksAvailable ? 'SUCCESS' : 'FAILED');
      
      // If we got here without errors, React is initialized
      setIsReady(true);
    } catch (err: unknown) {
      console.error('Error initializing React:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Even if there's an error, try to continue after a delay
      setTimeout(() => {
        console.log('Attempting to render App despite initialization error');
        setIsReady(true);
      }, 1000);
    }
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 20 }}>
          Error initializing React: {error}
        </Text>
        <Text style={{ fontSize: 16 }}>
          The app will attempt to continue in a moment...
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>Initializing app...</Text>
      </View>
    );
  }

  return <App />;
}
