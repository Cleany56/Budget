# Backend Integration Plan for ExpenseTracker Frontend

To integrate your backend with the current frontend, the following changes are needed:

## 1. Install Required Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Axios for API calls
npm install axios
```

## 2. Update Frontend to Use Real API

To replace dummy data with real API data, follow these steps for each component:

### Example for HomeScreen.tsx:

```typescript
// Before
const expenses: Expense[] = DUMMY_EXPENSES;
const accounts: AccountSummary[] = DUMMY_ACCOUNTS;

// After
const [expenses, setExpenses] = useState<Expense[]>([]);
const [accounts, setAccounts] = useState<AccountSummary[]>([]);

useEffect(() => {
  // Fetch data from API
  const fetchData = async () => {
    try {
      const accountsData = await getAccounts();
      const transactionsData = await getTransactions();
      
      setAccounts(accountsData);
      setExpenses(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to dummy data if API fails
      setAccounts(DUMMY_ACCOUNTS);
      setExpenses(DUMMY_EXPENSES);
    }
  };
  
  fetchData();
}, []);
```

## 3. Data Model Compatibility

The API services created handle data transformation between:

- Backend: `_id` → Frontend: `id`
- Backend date strings → Frontend Date objects
- Backend types → Frontend enums

## 4. Authentication Placeholder

For development, a placeholder user ID `user123` is used. In production:

1. Implement proper authentication screen
2. Store authentication tokens securely
3. Add token to API requests

## 5. Error Handling

Add proper error handling for API failures:

```typescript
try {
  const data = await apiCall();
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Handle unauthorized
    } else if (error.response?.status === 404) {
      // Handle not found
    } else {
      // Handle other errors
    }
  } else {
    // Handle non-Axios errors
  }
}
```

## 6. Optimistic Updates

For better user experience, implement optimistic updates:

```typescript
// Example: Optimistic delete
const handleDelete = async (id: string) => {
  // 1. Update UI immediately
  setItems(prevItems => prevItems.filter(item => item.id !== id));
  
  try {
    // 2. Actually delete from backend
    await deleteItem(id);
  } catch (error) {
    // 3. Restore on failure
    console.error('Failed to delete:', error);
    setItems(prevItems); // Restore previous state
    // Show error message
  }
};
```

## 7. Testing

Before full integration:

1. Start backend server: `npm run dev` in backend directory
2. Verify API endpoints with Postman or curl
3. Test each API service function in isolation
4. Gradually replace dummy data with API calls one screen at a time

## 8. Offline Support

For offline functionality, implement:

1. Data caching using AsyncStorage
2. Network status detection
3. Queue operations when offline
