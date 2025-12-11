@echo off
echo ========================================
echo Microservices Health Check
echo ========================================
echo.

echo [1/3] Checking Docker Infrastructure...
echo ----------------------------------------
docker ps --format "table {{.Names}}\t{{.Status}}" | findstr "postgres redis kafka zookeeper"
if %errorlevel% neq 0 (
    echo [WARNING] Some Docker containers may not be running
)
echo.

echo [2/3] Checking PostgreSQL Databases...
echo ----------------------------------------
docker exec postgres psql -U postgres -lqt 2>nul | findstr "auth_db booking_db availability_db payment_db notification_db"
if %errorlevel% neq 0 (
    echo [WARNING] Some databases may not be created
)
echo.

echo [3/3] Checking Spring Boot Services...
echo ----------------------------------------

call :check_service "API Gateway" 8080
call :check_service "Booking Service" 8081
call :check_service "Availability Service" 8082
call :check_service "Payment Service" 8083
call :check_service "Notification Service" 8084
call :check_service "WebSocket Service" 8085

echo.
echo ========================================
echo Health Check Complete
echo ========================================
echo.
echo If all services show [OK], you can proceed to test the APIs.
echo Run: test-api.bat
echo.
pause
exit /b 0

:check_service
set SERVICE_NAME=%~1
set PORT=%~2
curl -s http://localhost:%PORT% >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] %SERVICE_NAME% ^(Port %PORT%^)
) else (
    echo [DOWN] %SERVICE_NAME% ^(Port %PORT%^)
)
exit /b 0
