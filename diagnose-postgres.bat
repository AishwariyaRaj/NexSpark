@echo off
REM PostgreSQL Connection Diagnostic Script

echo ========================================
echo PostgreSQL Connection Diagnostics
echo ========================================
echo.

echo Step 1: Checking if container is running...
docker ps | findstr postgres
if %errorlevel% neq 0 (
    echo [FAIL] PostgreSQL container is not running!
    echo.
    echo Starting container...
    docker start postgres
    timeout /t 5 /nobreak >nul
    echo.
)
echo.

echo Step 2: Checking container environment variables...
docker exec postgres env | findstr POSTGRES
echo.

echo Step 3: Checking PostgreSQL process...
docker exec postgres ps aux | findstr postgres
echo.

echo Step 4: Checking PostgreSQL logs...
echo Last 20 lines of PostgreSQL logs:
docker logs postgres --tail 20
echo.

echo Step 5: Testing different connection methods...
echo.

echo Trying with detected username 'postgre'...
docker exec postgres psql -U postgre -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Connected with username: postgre
    set POSTGRES_USER=postgre
    goto :create_databases
)
echo [FAIL] Could not connect with 'postgre'
echo.

echo Trying with default username 'postgres'...
docker exec postgres psql -U postgres -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Connected with username: postgres
    set POSTGRES_USER=postgres
    goto :create_databases
)
echo [FAIL] Could not connect with 'postgres'
echo.

echo Trying to connect as any user to list databases...
docker exec postgres psql -l 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Connected without specifying user
    echo.
    echo Checking what users exist...
    docker exec postgres psql -c "\du" 2>nul
    echo.
)

echo.
echo ========================================
echo Issue: PostgreSQL is not ready yet OR
echo       needs initialization
echo ========================================
echo.
echo Recommendations:
echo 1. Wait 10-30 seconds for PostgreSQL to fully start
echo 2. Check docker logs: docker logs postgres
echo 3. Restart container: docker restart postgres
echo.
pause
exit /b 1

:create_databases
echo.
echo ========================================
echo Creating Databases with user: %POSTGRES_USER%
echo ========================================
echo.

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
