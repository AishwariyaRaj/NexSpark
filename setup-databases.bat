@echo off
REM PostgreSQL Database Setup Script for Windows CMD
echo ========================================
echo PostgreSQL Database Setup Script
echo ========================================
echo.

REM Step 1: Detect PostgreSQL username
echo Step 1: Detecting PostgreSQL username from container...

REM Get environment variable from container
for /f "tokens=2 delims==" %%i in ('docker exec postgres env 2^>nul ^| findstr POSTGRES_USER') do set POSTGRES_USER=%%i

REM Remove any carriage return/line feed
set POSTGRES_USER=%POSTGRES_USER:~0,-1%

if "%POSTGRES_USER%"=="" (
    echo WARNING: Could not detect username, defaulting to 'postgres'
    set POSTGRES_USER=postgres
)

REM Step 2: Print detected username
echo [OK] Detected PostgreSQL Username: %POSTGRES_USER%
echo.

REM Step 3: Verify connection
echo Step 2: Verifying connection to PostgreSQL...
docker exec postgres psql -U %POSTGRES_USER% -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Failed to connect to PostgreSQL
    echo Please check if the container is running: docker ps ^| findstr postgres
    exit /b 1
)
echo [OK] Successfully connected to PostgreSQL
echo.

REM Step 4: Create databases
echo Step 3: Creating databases...

call :create_db auth_db
call :create_db booking_db
call :create_db availability_db
call :create_db payment_db
call :create_db notification_db

echo.
echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Listing all databases:
docker exec postgres psql -U %POSTGRES_USER% -c "\l"
echo.
echo Connection string format:
echo jdbc:postgresql://localhost:5432/^<database_name^>?user=%POSTGRES_USER%^&password=^<your_password^>

exit /b 0

:create_db
set db_name=%1
echo Creating database: %db_name%... 

REM Check if database exists
for /f %%i in ('docker exec postgres psql -U %POSTGRES_USER% -tAc "SELECT 1 FROM pg_database WHERE datname='%db_name%'" 2^>nul') do set DB_EXISTS=%%i

if "%DB_EXISTS%"=="1" (
    echo [SKIP] Already exists
) else (
    docker exec postgres psql -U %POSTGRES_USER% -c "CREATE DATABASE %db_name%;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Created successfully
    ) else (
        echo [FAIL] Failed to create
    )
)
set DB_EXISTS=
exit /b 0
