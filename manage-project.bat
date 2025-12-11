@echo off
echo ========================================
echo Complete Project Management Script
echo ========================================
echo.
echo What would you like to do?
echo.
echo 1. Start Docker Infrastructure (PostgreSQL, Redis, Kafka)
echo 2. Create PostgreSQL Databases
echo 3. Build All Services
echo 4. Start All Services
echo 5. Check Service Health
echo 6. Test APIs
echo 7. Stop All Services
echo 8. Stop Docker Infrastructure
echo 9. View Logs
echo 0. Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto start_docker
if "%choice%"=="2" goto create_databases
if "%choice%"=="3" goto build_services
if "%choice%"=="4" goto start_services
if "%choice%"=="5" goto check_health
if "%choice%"=="6" goto test_apis
if "%choice%"=="7" goto stop_services
if "%choice%"=="8" goto stop_docker
if "%choice%"=="9" goto view_logs
if "%choice%"=="0" goto end
goto menu

:start_docker
echo.
echo Starting Docker infrastructure...
docker-compose up -d
echo.
echo Waiting 15 seconds for services to initialize...
timeout /t 15 /nobreak >nul
echo [OK] Docker infrastructure started
pause
goto menu

:create_databases
echo.
call setup-databases.bat
pause
goto menu

:build_services
echo.
call build-all-services.bat
goto menu

:start_services
echo.
call start-all-services.bat
goto menu

:check_health
echo.
call check-services.bat
goto menu

:test_apis
echo.
call test-api.bat
goto menu

:stop_services
echo.
call stop-all-services.bat
goto menu

:stop_docker
echo.
echo Stopping Docker infrastructure...
docker-compose down
echo [OK] Docker infrastructure stopped
pause
goto menu

:view_logs
echo.
echo Available log options:
echo 1. API Gateway
echo 2. Booking Service
echo 3. Availability Service
echo 4. Payment Service
echo 5. Notification Service
echo 6. WebSocket Service
echo 7. PostgreSQL
echo 8. Redis
echo 9. Kafka
echo 0. Back to main menu
echo.
set /p log_choice="Select log to view (0-9): "

if "%log_choice%"=="1" echo [INFO] Check the API Gateway terminal window
if "%log_choice%"=="2" echo [INFO] Check the Booking Service terminal window
if "%log_choice%"=="3" echo [INFO] Check the Availability Service terminal window
if "%log_choice%"=="4" echo [INFO] Check the Payment Service terminal window
if "%log_choice%"=="5" echo [INFO] Check the Notification Service terminal window
if "%log_choice%"=="6" echo [INFO] Check the WebSocket Service terminal window
if "%log_choice%"=="7" docker logs postgres --tail 50
if "%log_choice%"=="8" docker logs redis --tail 50
if "%log_choice%"=="9" docker logs kafka --tail 50
if "%log_choice%"=="0" goto menu

pause
goto menu

:menu
cls
echo ========================================
echo Complete Project Management Script
echo ========================================
echo.
echo What would you like to do?
echo.
echo 1. Start Docker Infrastructure (PostgreSQL, Redis, Kafka)
echo 2. Create PostgreSQL Databases
echo 3. Build All Services
echo 4. Start All Services
echo 5. Check Service Health
echo 6. Test APIs
echo 7. Stop All Services
echo 8. Stop Docker Infrastructure
echo 9. View Logs
echo 0. Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto start_docker
if "%choice%"=="2" goto create_databases
if "%choice%"=="3" goto build_services
if "%choice%"=="4" goto start_services
if "%choice%"=="5" goto check_health
if "%choice%"=="6" goto test_apis
if "%choice%"=="7" goto stop_services
if "%choice%"=="8" goto stop_docker
if "%choice%"=="9" goto view_logs
if "%choice%"=="0" goto end
goto menu

:end
echo.
echo Goodbye!
exit /b 0
