@echo off
echo ========================================
echo Stopping All Microservices
echo ========================================
echo.

echo Stopping Spring Boot services on ports 8080-8085...
echo.

for /L %%p in (8080,1,8085) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p ^| findstr LISTENING') do (
        echo   Stopping service on port %%p ^(PID: %%a^)
        taskkill /F /PID %%a >nul 2>&1
        if %errorlevel% equ 0 (
            echo   [OK] Service stopped
        ) else (
            echo   [INFO] Service may already be stopped
        )
    )
)

echo.
echo ========================================
echo All services stopped
echo ========================================
echo.
echo To stop Docker infrastructure, run:
echo   docker-compose down
echo.
pause
