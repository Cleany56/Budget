<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ExpenseTracker App

This is a React Native TypeScript Expo application for tracking expenses. The app uses:

- React Native with TypeScript for mobile development
- Expo for testing and development workflows
- Component-based architecture with organized folder structure
- Type definitions for expense data modeling
- Backend with Express.js, MongoDB, and Realm

When suggesting code improvements or features, consider:

1. Maintaining type safety and using TypeScript features appropriately
2. Following React Native best practices for performance
3. Maintaining the existing folder structure:
   - components: UI components
   - screens: Full app screens
   - utils: Helper functions and utilities
   - types: TypeScript type definitions
   - navigation: Navigation setup
   - hooks: Custom React hooks
   - services: API and storage services

## Authentication Implementation Notes

Currently, the app uses a hardcoded user ID for development purposes:
- The user ID `'user123'` is defined in `frontend/src/services/api/config.ts` as `DEV_USER_ID`
- This ID is automatically added to all API requests via Axios interceptors
- Backend controllers use this ID as a fallback with comments indicating it's for development only

### To Replace Hardcoded User ID with Google Authentication:

1. **Frontend Changes:**
   - Install packages: `expo-auth-session`, `expo-random`, `expo-web-browser`, `@react-native-async-storage/async-storage`
   - Create an AuthContext to manage authentication state
   - Set up Google OAuth credentials in Google Cloud Console
   - Implement sign-in flow using Expo's AuthSession
   - Store authentication tokens in AsyncStorage
   - Replace the Axios interceptor in `config.ts` to use the real user ID from auth

2. **Backend Changes:**
   - Add JWT validation middleware
   - Update controllers to extract user ID from authenticated requests
   - Remove fallback hardcoded IDs like `'user123'`
   - Add user management endpoints (signup, login, etc.)

3. **User Data Management:**
   - Create a user profile screen
   - Implement secure token refresh logic
   - Add sign-out functionality

## Security Risks and Fixes

The current implementation has several security vulnerabilities that should be addressed:

### Critical Security Issues:

1. **Authentication Vulnerabilities:**
   - Hardcoded user ID (`user123`) used throughout the application
   - No authentication mechanism to verify user identity
   - No protection against unauthorized API access

2. **Data Security Issues:**
   - Encryption keys stored in the same location as encrypted data (`data/keys/realm_key.bin`)
   - Insecure storage of sensitive financial information
   - MongoDB using locally generated encryption keys instead of securely managed ones

3. **API Security:**
   - Development/test routes (`/api/test-accounts`, `/api/test-data`) accessible in production
   - Insufficient input validation across endpoints
   - Unlimited CORS access (`app.use(cors())` without restrictions)
   - Sensitive error details exposed in API responses

### Recommended Security Fixes:

1. **Authentication Improvements:**
   - Complete Google Authentication implementation per above plan
   - Use Expo SecureStore instead of AsyncStorage for token storage
   - Implement proper session management with token expiration

2. **Data Protection:**
   - Move encryption keys to a secure key management service
   - Enable HTTPS for all API communication
   - Implement proper field-level encryption for sensitive data

3. **API Security Enhancements:**
   - Add input validation using Joi or Express-validator
   - Restrict CORS to trusted domains only
   - Remove or secure development routes in production
   - Implement rate limiting on API endpoints
   - Use Helmet.js for secure HTTP headers

## React Key Warnings

The app is experiencing React key warnings in certain list components. When the following warning appears:

```
Each child in a list should have a unique "key" prop.
See https://react.dev/link/warning-keys for more information.
Check the render method of `VirtualizedList`.
```

To fix this issue, ensure all list rendering components follow these best practices:

1. **For FlatList and SectionList components:** Always use the `keyExtractor` prop:
   ```jsx
   keyExtractor={(item) => item.id || item.uniqueIdentifier}
   ```

2. **For .map() functions:** Add a unique `key` prop to the outermost component in the returned JSX:
   ```jsx
   {items.map((item) => (
     <View key={item.id || `${item.name}-${index}`}>
       {/* content */}
     </View>
   ))}
   ```

3. **For nested lists:** Ensure each level has its own unique keys:
   ```jsx
   {outerItems.map(outerItem => (
     <View key={outerItem.id}>
       {outerItem.innerItems.map(innerItem => (
         <Text key={`${outerItem.id}-${innerItem.id}`}>{innerItem.name}</Text>
       ))}
     </View>
   ))}
   ```

4. **When using components from third-party libraries:** Check if they accept key-related props and ensure those are properly set.
