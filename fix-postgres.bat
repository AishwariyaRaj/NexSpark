@echo off
REM Fix PostgreSQL - Recreate with fresh data

echo ========================================
echo PostgreSQL Fix Script
echo ========================================
echo.
echo This will:
echo 1. Stop and remove the current PostgreSQL container
echo 2. Remove the corrupted database volume
echo 3. Start fresh PostgreSQL container
echo 4. Create all required databases
echo.
echo WARNING: This will delete all existing PostgreSQL data!
echo.
set /p confirm="Continue? (yes/no): "
if /i not "%confirm%"=="yes" (
    echo Aborted.
    exit /b 0
)

echo.
echo Step 1: Stopping PostgreSQL container...
docker stop postgres
echo [OK] Container stopped
echo.

echo Step 2: Removing PostgreSQL container...
docker rm postgres
echo [OK] Container removed
echo.

echo Step 3: Removing corrupted volume...
docker volume rm nm_task_postgres_data 2>nul
echo [OK] Volume removed
echo.

echo Step 4: Starting fresh PostgreSQL container...
docker-compose up -d postgres
echo [OK] Container started
echo.

echo Step 5: Waiting 15 seconds for PostgreSQL to initialize...
timeout /t 15 /nobreak >nul
echo [OK] Wait complete
echo.

echo Step 6: Verifying connection...
docker exec postgres psql -U postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Still cannot connect. Waiting another 10 seconds...
    timeout /t 10 /nobreak >nul
    docker exec postgres psql -U postgres -c "SELECT version();" >nul 2>&1
    if %errorlevel% neq 0 (
        echo [FAIL] Connection failed. Check logs: docker logs postgres
        exit /b 1
    )
)
echo [OK] Successfully connected to PostgreSQL
echo.

echo Step 7: Creating databases...
echo.

call :create_db auth_db
call :create_db booking_db
call :create_db availability_db
call :create_db payment_db
call :create_db notification_db

echo.
echo ========================================
echo PostgreSQL Fixed Successfully!
echo ========================================
echo.
echo Listing all databases:
docker exec postgres psql -U postgres -c "\l"
echo.
echo You can now start your Spring Boot services.
echo.
exit /b 0

:create_db
set db_name=%1
echo Creating database: %db_name%... 

REM Check if database exists
for /f %%i in ('docker exec postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='%db_name%'" 2^>nul') do set DB_EXISTS=%%i

if "%DB_EXISTS%"=="1" (
    echo [SKIP] Already exists
) else (
    docker exec postgres psql -U postgres -c "CREATE DATABASE %db_name%;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Created successfully
    ) else (
        echo [FAIL] Failed to create
    )
)
set DB_EXISTS=
exit /b 0
