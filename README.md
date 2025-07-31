# ExpenseTracker App

A full-stack mobile application with React Native frontend and Express backend to help users track and manage their expenses.

## Features

- Track daily expenses
- Categorize expenses
- View expense history
- Analyze spending patterns
- REST API for data management

## Project Structure

The project is organized into frontend and backend:

```
/
├── frontend/             # React Native + Expo app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── screens/      # App screens
│   │   ├── navigation/   # Navigation configuration
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript type definitions
│   │   └── services/     # API and client services
│   ├── assets/           # Images, fonts, etc.
│   └── App.tsx           # Main app component
│
├── backend/              # Express + MongoDB API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── config/       # Configuration
│   │   └── index.ts      # Entry point
│   └── .env              # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update with your MongoDB connection string

### Running the App

#### Start the backend server:
```bash
cd backend
npm run dev
```

#### Start the Expo frontend:
```bash
cd frontend
npm start
```

#### Using VS Code Tasks:
You can also use the VS Code tasks to run both frontend and backend:
- Press `Ctrl+Shift+P` and select "Tasks: Run Task"
- Choose "Start Both (Frontend & Backend)" to run both servers together
yarn start
```

4. Use Expo Go on your mobile device to scan the QR code or run on a simulator/emulator:

```bash
npm run ios
# or
npm run android
```

## Development

This project uses TypeScript for type safety. Make sure to define appropriate interfaces for your components and functions.

## License

This project is open source and available under the MIT License.
