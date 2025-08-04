@echo off
echo ===== CLEANING CACHE AND STARTING APP WITH BOTH BACKEND AND FRONTEND =====
echo This script will clean the cache and start the app with backend API

echo.
echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM expo-cli 2>nul

echo.
echo Step 2: Clearing Metro bundler cache...
cd frontend
rd /s /q node_modules\.cache 2>nul
rd /s /q .expo 2>nul

echo.
echo Step 3: Starting backend server in new terminal...
start cmd /k "cd %~dp0\backend && npm run dev"

echo.
echo Step 4: Starting the frontend with clean cache...
cd %~dp0\frontend && npx expo start --clear
