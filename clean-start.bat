@echo off
echo ===== CLEANING CACHE AND STARTING APP =====
echo This script will clean the cache and start the app

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
echo Step 3: Starting the app with clean cache...
npx expo start --clear
