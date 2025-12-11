@echo off
REM Quick fix - Create postgres user role

echo ========================================
echo Creating Missing PostgreSQL User Role
echo ========================================
echo.

echo Step 1: Connecting as superuser to create role...
echo.

REM Try to connect with any available superuser
docker exec postgres psql -U postgres postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% equ 0 goto :create_with_postgres

REM If postgres doesn't work, try without specifying user (uses environment default)
echo Trying connection without explicit user...
docker exec postgres psql postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Created postgres user
    goto :create_databases
)

REM Last resort: try to use template1 database with postgres from environment
echo Trying with template1 database...
docker exec -e PGUSER=postgres postgres psql template1 -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Created postgres user
    goto :create_databases
)

echo.
echo [FAIL] Cannot create user. The database is in a corrupted state.
echo.
echo Recommended solution: Run fix-postgres.bat to recreate from scratch
echo.
pause
exit /b 1

:create_with_postgres
echo [INFO] Connected successfully
goto :create_databases

:create_databases
echo.
echo Step 2: Creating databases...
echo.

call :create_db auth_db
call :create_db booking_db
call :create_db availability_db
call :create_db payment_db
call :create_db notification_db

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
docker exec postgres psql -U postgres -c "\l"
exit /b 0

:create_db
set db_name=%1
echo Creating database: %db_name%... 
docker exec postgres psql -U postgres -c "CREATE DATABASE %db_name%;" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Created successfully
) else (
    echo [SKIP] May already exist or failed
)
exit /b 0
