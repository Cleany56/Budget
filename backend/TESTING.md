# ExpenseTracker Backend Testing Guide

This document provides instructions for testing the ExpenseTracker backend, which includes Realm local database, MongoDB Atlas sync, and encryption features.

## Prerequisites

- Node.js v14+ and npm installed
- MongoDB installed locally or MongoDB Atlas account for cloud testing
- Git repository cloned locally

## Setting Up the Test Environment

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string and other configuration

## Running Tests

### Running All Tests

```bash
npm test
```

### Running Specific Test Suites

```bash
# Test encryption utilities
npm test -- src/__tests__/utils/security.test.ts

# Test Realm configuration
npm test -- src/__tests__/config/realm.test.ts

# Test MongoDB configuration
npm test -- src/__tests__/config/mongodb.test.ts

# Test data synchronization
npm test -- src/__tests__/config/sync.test.ts
```

### Running Tests with Coverage

```bash
npm run test:coverage
```

## Test Categories

The test suite covers the following key areas:

### 1. Security & Encryption (utils/security.test.ts)

- AES-256-GCM encryption/decryption
- Sensitive data masking
- Object-level encryption for financial data

### 2. Local Database (config/realm.test.ts)

- Realm database initialization
- Encryption key management
- Schema validation

### 3. Cloud Database (config/mongodb.test.ts)

- MongoDB connection with Client-Side Field Level Encryption (CSFLE)
- Encrypted field configuration
- Connection pooling and lifecycle

### 4. Data Synchronization (config/sync.test.ts)

- Bidirectional sync between Realm and MongoDB
- User data isolation
- Transaction and account synchronization

## Manual Testing

For manual API testing, you can use tools like Postman or curl:

1. Start the server:

```bash
npm run dev
```

2. Test account endpoints:

```bash
# Create an account
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"Checking","type":"Bank","balance":1000,"currency":"USD","userId":"user123"}'

# Get accounts
curl -X GET http://localhost:5000/api/accounts?userId=user123
```

3. Test transaction endpoints:

```bash
# Create a transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","amount":50,"date":"2025-08-03","category":"Food","accountId":"acc123","userId":"user123"}'

# Get transactions
curl -X GET http://localhost:5000/api/transactions?userId=user123
```

## Verifying Encryption

To verify that encryption is working properly:

1. Check the Realm database file directly (using Realm Studio)
2. Examine MongoDB Atlas documents for encrypted fields
3. Run the security test suite which verifies encryption/decryption

## Troubleshooting

- If tests are failing with connection errors, check your MongoDB connection string
- For encryption errors, ensure the crypto module is properly configured
- If tests hang, there may be unresolved Promises or unclosed connections
