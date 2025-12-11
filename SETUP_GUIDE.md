# Vehicle Rental Microservices - Setup Guide

## Step-by-Step Setup Instructions

### Step 1: Start Infrastructure Services

```powershell
# Start PostgreSQL, Redis, Kafka, and Zookeeper
docker-compose up -d

# Verify all services are running
docker ps
```

You should see 4 containers running:
- postgres
- redis
- zookeeper
- kafka

### Step 2: Create Databases

```powershell
# Wait 10 seconds for PostgreSQL to fully start
Start-Sleep -Seconds 10

# Create all databases
docker exec -it postgres psql -U postgres -c "CREATE DATABASE auth_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE booking_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE availability_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE payment_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE notification_db;"

# Verify databases were created
docker exec -it postgres psql -U postgres -c "\l"
```

### Step 3: Build All Services

```powershell
# Build each service (this will download dependencies)
Write-Host "Building API Gateway..." -ForegroundColor Green
cd api-gateway
mvn clean package -DskipTests
cd ..

Write-Host "Building Booking Service..." -ForegroundColor Green
cd booking-service
mvn clean package -DskipTests
cd ..

Write-Host "Building Availability Service..." -ForegroundColor Green
cd availability-service
mvn clean package -DskipTests
cd ..

Write-Host "Building Payment Service..." -ForegroundColor Green
cd payment-service
mvn clean package -DskipTests
cd ..

Write-Host "Building Notification Service..." -ForegroundColor Green
cd notification-service
mvn clean package -DskipTests
cd ..

Write-Host "Building WebSocket Service..." -ForegroundColor Green
cd websocket-service
mvn clean package -DskipTests
cd ..

Write-Host "All services built successfully!" -ForegroundColor Green
```

### Step 4: Start All Services

You need to open 6 separate PowerShell terminals and run each command:

**Terminal 1 - API Gateway (Authentication)**
```powershell
cd api-gateway
mvn spring-boot:run
```
Wait for: "Started ApiGatewayApplication"

**Terminal 2 - Booking Service**
```powershell
cd booking-service
mvn spring-boot:run
```
Wait for: "Started BookingServiceApplication"

**Terminal 3 - Availability Service**
```powershell
cd availability-service
mvn spring-boot:run
```
Wait for: "Started AvailabilityServiceApplication"

**Terminal 4 - Payment Service**
```powershell
cd payment-service
mvn spring-boot:run
```
Wait for: "Started PaymentServiceApplication"

**Terminal 5 - Notification Service**
```powershell
cd notification-service
mvn spring-boot:run
```
Wait for: "Started NotificationServiceApplication"

**Terminal 6 - WebSocket Service**
```powershell
cd websocket-service
mvn spring-boot:run
```
Wait for: "Started WebSocketServiceApplication"

### Step 5: Verify Services Are Running

```powershell
# Check API Gateway
curl http://localhost:8080/actuator/health

# Check Booking Service
curl http://localhost:8081/actuator/health

# Check Availability Service
curl http://localhost:8082/actuator/health

# Check Payment Service
curl http://localhost:8083/actuator/health

# Check Notification Service
curl http://localhost:8084/actuator/health

# Check WebSocket Service
curl http://localhost:8085/actuator/health
```

### Step 6: Test the System

#### 6.1 Register a User

```powershell
$registerBody = @{
    email = "john.doe@example.com"
    password = "securePassword123"
    firstName = "John"
    lastName = "Doe"
    phone = "+1234567890"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $registerBody
```

#### 6.2 Login

```powershell
$loginBody = @{
    email = "john.doe@example.com"
    password = "securePassword123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.token
Write-Host "JWT Token: $token"
```

#### 6.3 Create Sample Vehicle Data

First, manually insert a vehicle into the database:

```powershell
docker exec -it postgres psql -U postgres -d availability_db -c "
INSERT INTO vehicles (make, model, year, location, daily_rate, type) 
VALUES ('Toyota', 'Camry', 2023, 'NYC', 50.00, 'Sedan');"
```

#### 6.4 Search Available Vehicles

```powershell
Invoke-RestMethod -Uri "http://localhost:8082/availability/search?startDate=2025-12-10&endDate=2025-12-15&location=NYC" `
    -Method Get
```

#### 6.5 Create a Booking

```powershell
$bookingBody = @{
    vehicleId = 1
    userId = 1
    startDate = "2025-12-10"
    endDate = "2025-12-15"
    dailyRate = 50.00
} | ConvertTo-Json

$booking = Invoke-RestMethod -Uri "http://localhost:8081/bookings" `
    -Method Post `
    -ContentType "application/json" `
    -Body $bookingBody

Write-Host "Booking ID: $($booking.id)"
```

#### 6.6 Process Payment

```powershell
$paymentBody = @{
    bookingId = 1
    amount = 250.00
    paymentMethod = "CREDIT_CARD"
} | ConvertTo-Json

$payment = Invoke-RestMethod -Uri "http://localhost:8083/payments" `
    -Method Post `
    -ContentType "application/json" `
    -Body $paymentBody

Write-Host "Payment ID: $($payment.id)"
Write-Host "Transaction ID: $($payment.transactionId)"
```

#### 6.7 Check Notifications

```powershell
Invoke-RestMethod -Uri "http://localhost:8084/notifications/user/1" `
    -Method Get
```

#### 6.8 Test WebSocket Connection

Create a simple HTML file to test WebSocket:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Test</title>
</head>
<body>
    <h1>WebSocket Connection Test</h1>
    <div id="messages"></div>
    
    <script>
        const socket = new WebSocket('ws://localhost:8085/ws/bookings');
        const messagesDiv = document.getElementById('messages');
        
        socket.onopen = () => {
            messagesDiv.innerHTML += '<p style="color: green;">Connected to WebSocket!</p>';
        };
        
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            messagesDiv.innerHTML += `<p><strong>${message.type}:</strong> ${JSON.stringify(message.payload)}</p>`;
        };
        
        socket.onerror = (error) => {
            messagesDiv.innerHTML += `<p style="color: red;">Error: ${error}</p>`;
        };
        
        socket.onclose = () => {
            messagesDiv.innerHTML += '<p style="color: orange;">Disconnected</p>';
        };
    </script>
</body>
</html>
```

Save as `websocket-test.html` and open in browser.

## Troubleshooting

### Issue: Services won't start

**Solution:**
```powershell
# Check if ports are in use
netstat -ano | findstr "8080"
netstat -ano | findstr "8081"
netstat -ano | findstr "8082"
netstat -ano | findstr "8083"
netstat -ano | findstr "8084"
netstat -ano | findstr "8085"

# Kill process if needed
Stop-Process -Id <PID> -Force
```

### Issue: Kafka connection errors

**Solution:**
```powershell
# Restart Kafka
docker-compose restart kafka

# Check Kafka logs
docker logs kafka

# Create topics manually
docker exec -it kafka kafka-topics --create --topic booking-events --bootstrap-server localhost:9092
docker exec -it kafka kafka-topics --create --topic payment-events --bootstrap-server localhost:9092
```

### Issue: Database connection errors

**Solution:**
```powershell
# Check PostgreSQL logs
docker logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Verify connection
docker exec -it postgres psql -U postgres -c "SELECT version();"
```

### Issue: Redis connection errors

**Solution:**
```powershell
# Check Redis
docker exec -it redis redis-cli ping

# Should return: PONG

# Restart Redis
docker-compose restart redis
```

## Stopping Services

### Stop Spring Boot Services
Press `Ctrl+C` in each terminal window

### Stop Infrastructure
```powershell
docker-compose down

# To also remove volumes (data will be lost)
docker-compose down -v
```

## Complete Cleanup

```powershell
# Stop all containers
docker-compose down -v

# Remove all built artifacts
cd api-gateway; mvn clean; cd ..
cd booking-service; mvn clean; cd ..
cd availability-service; mvn clean; cd ..
cd payment-service; mvn clean; cd ..
cd notification-service; mvn clean; cd ..
cd websocket-service; mvn clean; cd ..
```

## Next Steps

After successful setup, refer to the main README.md for:
- Complete API documentation
- Architecture details
- Production considerations
- Advanced configuration

## Support

If you encounter issues not covered here:
1. Check service logs for error messages
2. Verify all prerequisites are installed
3. Ensure no firewall is blocking ports
4. Check Docker Desktop is running (Windows)
