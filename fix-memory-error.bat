@echo off
echo ========================================
echo Memory Error Quick Fix
echo ========================================
echo.
echo This script will:
echo 1. Stop all Java processes
echo 2. Clear Maven cache
echo 3. Clean error log files
echo 4. Restart services with fixed memory settings
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/4] Stopping all Java processes...
taskkill /F /IM java.exe /T 2>nul
if %errorlevel% equ 0 (
    echo   ✓ Java processes stopped
) else (
    echo   ℹ No Java processes running
)
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Cleaning error log files...
del /Q api-gateway\hs_err_pid*.log 2>nul
del /Q api-gateway\replay_pid*.log 2>nul
del /Q booking-service\hs_err_pid*.log 2>nul
del /Q booking-service\replay_pid*.log 2>nul
del /Q availability-service\hs_err_pid*.log 2>nul
del /Q availability-service\replay_pid*.log 2>nul
del /Q payment-service\hs_err_pid*.log 2>nul
del /Q payment-service\replay_pid*.log 2>nul
del /Q notification-service\hs_err_pid*.log 2>nul
del /Q notification-service\replay_pid*.log 2>nul
del /Q websocket-service\hs_err_pid*.log 2>nul
del /Q websocket-service\replay_pid*.log 2>nul
echo   ✓ Error logs cleaned

echo.
echo [3/4] Clearing Maven build cache (optional)...
echo   This may take a moment...
REM Uncomment the next line if you want to clean all Maven builds
REM call mvn clean -q
echo   ℹ Skipped (uncomment in script to enable)

echo.
echo [4/4] Memory settings configured:
echo   - Initial Heap: 256 MB
echo   - Maximum Heap: 512 MB
echo   - Metaspace: 128-256 MB
echo   - Garbage Collector: G1GC
echo.
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC
echo   ✓ Memory settings applied

echo.
echo ========================================
echo Fix Applied Successfully!
echo ========================================
echo.
echo Choose an option:
echo   1. Start all services now (fixed)
echo   2. Start API Gateway only (for testing)
echo   3. Exit (manual start later)
echo.
choice /C 123 /N /M "Enter your choice (1, 2, or 3): "

if errorlevel 3 goto :exit
if errorlevel 2 goto :gateway
if errorlevel 1 goto :all

:all
echo.
echo Starting all services with memory fix...
call start-all-services.bat
goto :end

:gateway
echo.
echo Starting API Gateway only...
call start-api-gateway.bat
goto :end

:exit
echo.
echo To start services manually, use:
echo   - start-all-services.bat (all services)
echo   - start-api-gateway.bat (individual service)
echo.
goto :end

:end
echo.
echo Done!
pause
