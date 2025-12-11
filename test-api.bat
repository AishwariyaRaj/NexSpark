@echo off
setlocal enabledelayedexpansion
echo ========================================
echo API Testing Script
echo ========================================
echo.
echo This will test the complete user flow:
echo 1. Register user
echo 2. Login and get JWT token
echo 3. Search vehicles
echo 4. Create booking
echo 5. Process payment
echo 6. Check notifications
echo.
pause

echo.
echo ========================================
echo [Step 1] Registering a new user...
echo ========================================
curl -X POST http://localhost:8080/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"+1234567890\"}"
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 2] Logging in...
echo ========================================
curl -X POST http://localhost:8080/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\"}"
echo.
echo.

echo NOTE: Copy the JWT token from the response above.
echo.
set /p JWT_TOKEN="Paste the JWT token here (or press Enter to skip authenticated requests): "
echo.

echo.
echo ========================================
echo [Step 3] Adding sample vehicle data...
echo ========================================
docker exec postgres psql -U postgres -d availability_db -c "INSERT INTO vehicles (make, model, year, location, daily_rate, type) VALUES ('Toyota', 'Camry', 2024, 'Mumbai', 2500.00, 'Sedan') ON CONFLICT DO NOTHING;"
echo [OK] Sample vehicle added
echo.

echo.
echo ========================================
echo [Step 4] Searching available vehicles...
echo ========================================
curl "http://localhost:8082/availability/search?startDate=2025-12-10&endDate=2025-12-15&location=Mumbai"
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 5] Listing all vehicles...
echo ========================================
curl http://localhost:8082/availability/vehicles
echo.
echo.
timeout /t 2 /nobreak >nul

if "%JWT_TOKEN%"=="" (
    echo.
    echo ========================================
    echo Skipping authenticated requests
    echo ========================================
    echo You can manually test booking/payment with the JWT token.
    goto :end
)

echo.
echo ========================================
echo [Step 6] Creating a booking...
echo ========================================
curl -X POST http://localhost:8081/bookings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %JWT_TOKEN%" ^
  -d "{\"vehicleId\":1,\"userId\":1,\"startDate\":\"2025-12-10\",\"endDate\":\"2025-12-15\",\"dailyRate\":2500.00}"
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 7] Processing payment...
echo ========================================
curl -X POST http://localhost:8083/payments ^
  -H "Content-Type: application/json" ^
  -d "{\"bookingId\":1,\"amount\":12500.00,\"paymentMethod\":\"CREDIT_CARD\"}"
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 8] Confirming booking...
echo ========================================
curl -X PUT http://localhost:8081/bookings/1/confirm ^
  -H "Authorization: Bearer %JWT_TOKEN%"
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 9] Getting user bookings...
echo ========================================
curl http://localhost:8081/bookings/user/1
echo.
echo.
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo [Step 10] Getting user notifications...
echo ========================================
curl http://localhost:8084/notifications/user/1
echo.
echo.

:end
echo.
echo ========================================
echo API Testing Complete
echo ========================================
echo.
echo All major endpoints have been tested!
echo Check the responses above for any errors.
echo.
pause
