@echo off
echo ========================================
echo Starting All Microservices
echo ========================================
echo.
echo This will open 6 terminal windows, one for each service.
echo Each service will start on its designated port.
echo.
echo Services:
echo   1. API Gateway         - Port 8080
echo   2. Booking Service     - Port 8081
echo   3. Availability Service- Port 8082
echo   4. Payment Service     - Port 8083
echo   5. Notification Service- Port 8084
echo   6. WebSocket Service   - Port 8085
echo   7. Chatbot Service     - Port 8086
echo   8. Frontend React App  - Port 3000
echo.
echo Press any key to start all services...
pause >nul

echo.
echo Starting API Gateway (Port 8080)...
start "API Gateway (8080)" cmd /k "cd /d %~dp0api-gateway && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo Starting Booking Service (Port 8081)...
start "Booking Service (8081)" cmd /k "cd /d %~dp0booking-service && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 3 /nobreak >nul

echo Starting Availability Service (Port 8082)...
start "Availability Service (8082)" cmd /k "cd /d %~dp0availability-service && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 3 /nobreak >nul

echo Starting Payment Service (Port 8083)...
start "Payment Service (8083)" cmd /k "cd /d %~dp0payment-service && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 3 /nobreak >nul

echo Starting Notification Service (Port 8084)...
start "Notification Service (8084)" cmd /k "cd /d %~dp0notification-service && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 3 /nobreak >nul

echo Starting WebSocket Service (Port 8085)...
start "WebSocket Service (8085)" cmd /k "cd /d %~dp0websocket-service && set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m && mvn spring-boot:run"
timeout /t 3 /nobreak >nul

echo Starting Chatbot Service (Port 8086)...
start "Chatbot Service (8086)" cmd /k "cd /d %~dp0chatbot-service && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend React App (Port 3000)...
start "Frontend React (3000)" cmd /k "cd /d %~dp0nexspark-frontend && npm start"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Please wait 2-3 minutes for all services to fully start.
echo Backend services will take longer (Java Spring Boot).
echo Frontend and Chatbot will be ready in 30-60 seconds.
echo.
echo Check each window for the message:
echo   "Started [ServiceName]Application in X.XXX seconds"
echo.
echo Once all services show as started, run:
echo   check-services.bat
echo.
echo To stop all services, close each window or run:
echo   stop-all-services.bat
echo.
pause
