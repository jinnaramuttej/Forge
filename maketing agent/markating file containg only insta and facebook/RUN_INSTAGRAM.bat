@echo off
REM Instagram AI - Run Script

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     📸 Instagram AI - Starting Server              ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing/checking dependencies...
pip install flask flask-cors instagrapi >nul 2>&1

REM Run the API server
echo.
echo 🚀 Starting Instagram AI server...
echo.
echo 📱 Open: http://localhost:5000/instagram.html
echo 🏠 Home: http://localhost:5000/
echo.
echo Press Ctrl+C to stop
echo.

python instagram_api.py

pause
