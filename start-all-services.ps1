# Start All NexSpark Services
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting All NexSpark Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Services to be started:" -ForegroundColor Yellow
Write-Host "  1. API Gateway         - Port 8080" -ForegroundColor White
Write-Host "  2. Booking Service     - Port 8081" -ForegroundColor White
Write-Host "  3. Availability Service- Port 8082" -ForegroundColor White
Write-Host "  4. Payment Service     - Port 8083" -ForegroundColor White
Write-Host "  5. Notification Service- Port 8084" -ForegroundColor White
Write-Host "  6. WebSocket Service   - Port 8085" -ForegroundColor White
Write-Host "  7. Chatbot Service     - Port 8086" -ForegroundColor Green
Write-Host "  8. Frontend React App  - Port 3000" -ForegroundColor Green
Write-Host ""

$response = Read-Host "Press ENTER to start all services (or Ctrl+C to cancel)"

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Starting API Gateway (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\api-gateway'; mvn spring-boot:run"
Start-Sleep -Seconds 5

Write-Host "Starting Booking Service (Port 8081)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\booking-service'; mvn spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "Starting Availability Service (Port 8082)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\availability-service'; mvn spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "Starting Payment Service (Port 8083)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\payment-service'; mvn spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "Starting Notification Service (Port 8084)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\notification-service'; mvn spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "Starting WebSocket Service (Port 8085)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\websocket-service'; mvn spring-boot:run"
Start-Sleep -Seconds 3

Write-Host "Starting Chatbot Service (Port 8086)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\chatbot-service'; npm start"
Start-Sleep -Seconds 3

Write-Host "Starting Frontend React App (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\nexspark-frontend'; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services are starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait 2-3 minutes for all services to fully start." -ForegroundColor Yellow
Write-Host "📦 Backend services will take longer (Java Spring Boot)." -ForegroundColor Yellow
Write-Host "⚡ Frontend and Chatbot will be ready in 30-60 seconds." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Once ready, open: http://localhost:3000" -ForegroundColor Green
Write-Host "🤖 Look for the chatbot icon at bottom-right!" -ForegroundColor Green
Write-Host ""
Write-Host "To check status: ./check-services.bat" -ForegroundColor White
Write-Host "To stop all: Close each window or run ./stop-all-services.bat" -ForegroundColor White
Write-Host ""
