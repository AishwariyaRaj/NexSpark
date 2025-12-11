@echo off
echo ========================================
echo Building All Microservices
echo ========================================
echo.
echo This will build all 6 Spring Boot services...
echo.

set SUCCESS=0
set FAILED=0

REM Set Maven memory options to prevent out of memory errors
set MAVEN_OPTS=-Xms256m -Xmx1024m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m

echo.
echo ========================================
echo Building API Gateway...
echo ========================================
cd api-gateway
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] API Gateway built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] API Gateway build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Building Booking Service...
echo ========================================
cd booking-service
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] Booking Service built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] Booking Service build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Building Availability Service...
echo ========================================
cd availability-service
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] Availability Service built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] Availability Service build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Building Payment Service...
echo ========================================
cd payment-service
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] Payment Service built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] Payment Service build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Building Notification Service...
echo ========================================
cd notification-service
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] Notification Service built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] Notification Service build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Building WebSocket Service...
echo ========================================
cd websocket-service
call mvn clean install -DskipTests
if %errorlevel% equ 0 (
    echo [OK] WebSocket Service built successfully
    set /a SUCCESS+=1
) else (
    echo [FAIL] WebSocket Service build failed
    set /a FAILED+=1
)
cd ..

echo.
echo ========================================
echo Build Summary
echo ========================================
echo Successfully built: %SUCCESS%/6 services
echo Failed: %FAILED%/6 services
echo.

if %FAILED% gtr 0 (
    echo Some builds failed. Please check the errors above.
    pause
    exit /b 1
) else (
    echo ========================================
    echo All services built successfully!
    echo ========================================
    echo.
    echo Next step: Run start-all-services.bat
    echo.
    pause
)
