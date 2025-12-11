# NexSpark Services Startup Script with Memory Management
# Starts all microservices with optimized JVM memory settings

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NexSpark Microservices Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Maven memory options for all Java services
$env:MAVEN_OPTS = "-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC"

Write-Host "Memory Settings Configured:" -ForegroundColor Green
Write-Host "  Initial Heap: 256 MB" -ForegroundColor Gray
Write-Host "  Max Heap: 512 MB" -ForegroundColor Gray
Write-Host "  Metaspace: 128-256 MB" -ForegroundColor Gray
Write-Host "  GC: G1 Garbage Collector" -ForegroundColor Gray
Write-Host ""

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Port,
        [string]$Directory,
        [string]$Command
    )
    
    Write-Host "Starting $ServiceName (Port $Port)..." -ForegroundColor Yellow
    
    $scriptBlock = {
        param($dir, $cmd, $opts)
        Set-Location $dir
        $env:MAVEN_OPTS = $opts
        Invoke-Expression $cmd
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$Directory'; `$env:MAVEN_OPTS='$env:MAVEN_OPTS'; $Command}" -WindowStyle Normal
    
    Write-Host "  ✓ $ServiceName started" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

# Get project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Java Microservices..." -ForegroundColor Cyan
Write-Host ""

# Start services in order
Start-Service -ServiceName "API Gateway" -Port "8080" -Directory "$projectRoot\api-gateway" -Command "mvn spring-boot:run"
Start-Sleep -Seconds 5

Start-Service -ServiceName "Booking Service" -Port "8081" -Directory "$projectRoot\booking-service" -Command "mvn spring-boot:run"
Start-Service -ServiceName "Availability Service" -Port "8082" -Directory "$projectRoot\availability-service" -Command "mvn spring-boot:run"
Start-Service -ServiceName "Payment Service" -Port "8083" -Directory "$projectRoot\payment-service" -Command "mvn spring-boot:run"
Start-Service -ServiceName "Notification Service" -Port "8084" -Directory "$projectRoot\notification-service" -Command "mvn spring-boot:run"
Start-Service -ServiceName "WebSocket Service" -Port "8085" -Directory "$projectRoot\websocket-service" -Command "mvn spring-boot:run"

Write-Host ""
Write-Host "Starting Node.js Services..." -ForegroundColor Cyan
Write-Host ""

# Start Chatbot Service
Write-Host "Starting Chatbot Service (Port 8086)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\chatbot-service'; npm start" -WindowStyle Normal
Write-Host "  ✓ Chatbot Service started" -ForegroundColor Green
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend React App (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\nexspark-frontend'; npm start" -WindowStyle Normal
Write-Host "  ✓ Frontend started" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All Services Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Status:" -ForegroundColor White
Write-Host "  1. API Gateway         - http://localhost:8080" -ForegroundColor Gray
Write-Host "  2. Booking Service     - http://localhost:8081" -ForegroundColor Gray
Write-Host "  3. Availability Service- http://localhost:8082" -ForegroundColor Gray
Write-Host "  4. Payment Service     - http://localhost:8083" -ForegroundColor Gray
Write-Host "  5. Notification Service- http://localhost:8084" -ForegroundColor Gray
Write-Host "  6. WebSocket Service   - http://localhost:8085" -ForegroundColor Gray
Write-Host "  7. Chatbot Service     - http://localhost:8086" -ForegroundColor Gray
Write-Host "  8. Frontend React App  - http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Each service is running in its own window." -ForegroundColor Yellow
Write-Host "Check each window for startup status and logs." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
