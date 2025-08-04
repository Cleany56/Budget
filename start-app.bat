@echo off
echo ===== STARTING APP WITH FRONTEND-BACKEND INTEGRATION =====
echo This script will start both backend and frontend servers

echo.
echo Step 1: Starting backend server in a new terminal window...
start cmd /k "cd %~dp0\backend && npm run dev"

echo.
echo Step 2: Starting frontend in a new terminal window...
start cmd /k "cd %~dp0\frontend && npx expo start --clear"

echo.
echo Started both servers. Check the terminal windows for logs.
echo Backend: http://localhost:3000
echo Frontend: Using Expo Go app
