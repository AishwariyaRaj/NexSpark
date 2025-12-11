# Sample Data Insertion Scripts

## PostgreSQL Sample Data

### Insert Sample Vehicles

```sql
-- Connect to availability_db
\c availability_db

-- Insert sample vehicles
INSERT INTO vehicles (make, model, year, location, daily_rate, type) VALUES
('Toyota', 'Camry', 2023, 'NYC', 50.00, 'Sedan'),
('Honda', 'Civic', 2023, 'NYC', 45.00, 'Sedan'),
('Ford', 'Explorer', 2023, 'NYC', 75.00, 'SUV'),
('Tesla', 'Model 3', 2023, 'LA', 90.00, 'Electric'),
('Chevrolet', 'Tahoe', 2022, 'LA', 80.00, 'SUV'),
('BMW', 'X5', 2023, 'Chicago', 100.00, 'Luxury SUV'),
('Mercedes', 'E-Class', 2023, 'Chicago', 95.00, 'Luxury Sedan'),
('Jeep', 'Wrangler', 2023, 'Miami', 70.00, 'SUV'),
('Hyundai', 'Elantra', 2023, 'Miami', 40.00, 'Sedan'),
('Mazda', 'CX-5', 2023, 'Seattle', 65.00, 'SUV');

-- Verify insertion
SELECT * FROM vehicles;
```

### Using PowerShell to Insert Data

```powershell
# Insert sample vehicles
$sql = @"
INSERT INTO vehicles (make, model, year, location, daily_rate, type) VALUES
('Toyota', 'Camry', 2023, 'NYC', 50.00, 'Sedan'),
('Honda', 'Civic', 2023, 'NYC', 45.00, 'Sedan'),
('Ford', 'Explorer', 2023, 'NYC', 75.00, 'SUV'),
('Tesla', 'Model 3', 2023, 'LA', 90.00, 'Electric'),
('Chevrolet', 'Tahoe', 2022, 'LA', 80.00, 'SUV'),
('BMW', 'X5', 2023, 'Chicago', 100.00, 'Luxury SUV'),
('Mercedes', 'E-Class', 2023, 'Chicago', 95.00, 'Luxury Sedan'),
('Jeep', 'Wrangler', 2023, 'Miami', 70.00, 'SUV'),
('Hyundai', 'Elantra', 2023, 'Miami', 40.00, 'Sedan'),
('Mazda', 'CX-5', 2023, 'Seattle', 65.00, 'SUV');
"@

docker exec -it postgres psql -U postgres -d availability_db -c $sql
```

## Complete Test Workflow

### PowerShell Test Script

```powershell
# Complete test workflow script
Write-Host "=== Vehicle Rental System Test Workflow ===" -ForegroundColor Cyan

# Step 1: Register User
Write-Host "`n1. Registering new user..." -ForegroundColor Green
$registerBody = @{
    email = "alice@example.com"
    password = "password123"
    firstName = "Alice"
    lastName = "Smith"
    phone = "+1555123456"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.userId)"
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
}

# Step 2: Login
Write-Host "`n2. Logging in..." -ForegroundColor Green
$loginBody = @{
    email = "alice@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 50))..."
    $userId = $loginResponse.userId
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit
}

# Step 3: Search Available Vehicles
Write-Host "`n3. Searching available vehicles..." -ForegroundColor Green
try {
    $vehicles = Invoke-RestMethod -Uri "http://localhost:8082/availability/search?startDate=2025-12-10&endDate=2025-12-15&location=NYC" `
        -Method Get
    Write-Host "✓ Found $($vehicles.Count) available vehicles" -ForegroundColor Green
    if ($vehicles.Count -gt 0) {
        $vehicleId = $vehicles[0].id
        Write-Host "Selected Vehicle: $($vehicles[0].make) $($vehicles[0].model) - `$$($vehicles[0].dailyRate)/day"
    }
} catch {
    Write-Host "✗ Search failed: $_" -ForegroundColor Red
    exit
}

# Step 4: Create Booking
Write-Host "`n4. Creating booking..." -ForegroundColor Green
$bookingBody = @{
    vehicleId = $vehicleId
    userId = $userId
    startDate = "2025-12-10"
    endDate = "2025-12-15"
    dailyRate = $vehicles[0].dailyRate
} | ConvertTo-Json

try {
    $booking = Invoke-RestMethod -Uri "http://localhost:8081/bookings" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bookingBody
    Write-Host "✓ Booking created successfully" -ForegroundColor Green
    Write-Host "Booking ID: $($booking.id)"
    Write-Host "Total Cost: `$$($booking.totalCost)"
    Write-Host "Status: $($booking.status)"
    $bookingId = $booking.id
} catch {
    Write-Host "✗ Booking creation failed: $_" -ForegroundColor Red
    exit
}

# Step 5: Process Payment
Write-Host "`n5. Processing payment..." -ForegroundColor Green
$paymentBody = @{
    bookingId = $bookingId
    amount = $booking.totalCost
    paymentMethod = "CREDIT_CARD"
} | ConvertTo-Json

try {
    $payment = Invoke-RestMethod -Uri "http://localhost:8083/payments" `
        -Method Post `
        -ContentType "application/json" `
        -Body $paymentBody
    Write-Host "✓ Payment processed successfully" -ForegroundColor Green
    Write-Host "Payment ID: $($payment.id)"
    Write-Host "Transaction ID: $($payment.transactionId)"
    Write-Host "Status: $($payment.status)"
} catch {
    Write-Host "✗ Payment failed: $_" -ForegroundColor Red
}

# Step 6: Confirm Booking
Write-Host "`n6. Confirming booking..." -ForegroundColor Green
try {
    $confirmedBooking = Invoke-RestMethod -Uri "http://localhost:8081/bookings/$bookingId/confirm" `
        -Method Put
    Write-Host "✓ Booking confirmed" -ForegroundColor Green
    Write-Host "Status: $($confirmedBooking.status)"
} catch {
    Write-Host "✗ Booking confirmation failed: $_" -ForegroundColor Red
}

# Step 7: Check Notifications
Write-Host "`n7. Checking notifications..." -ForegroundColor Green
Start-Sleep -Seconds 2  # Wait for async processing
try {
    $notifications = Invoke-RestMethod -Uri "http://localhost:8084/notifications/user/$userId" `
        -Method Get
    Write-Host "✓ Retrieved $($notifications.Count) notifications" -ForegroundColor Green
    foreach ($notif in $notifications) {
        Write-Host "  - [$($notif.type)] $($notif.message)"
    }
} catch {
    Write-Host "✗ Notification retrieval failed: $_" -ForegroundColor Red
}

# Step 8: Get User Bookings
Write-Host "`n8. Getting user bookings..." -ForegroundColor Green
try {
    $userBookings = Invoke-RestMethod -Uri "http://localhost:8081/bookings/user/$userId" `
        -Method Get
    Write-Host "✓ User has $($userBookings.Count) booking(s)" -ForegroundColor Green
    foreach ($b in $userBookings) {
        Write-Host "  - Booking #$($b.id): $($b.status) - `$$($b.totalCost)"
    }
} catch {
    Write-Host "✗ Booking retrieval failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Workflow Completed ===" -ForegroundColor Cyan
```

## Kafka Testing

### Check Kafka Topics

```powershell
# List all topics
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# Describe booking-events topic
docker exec -it kafka kafka-topics --describe --topic booking-events --bootstrap-server localhost:9092

# Describe payment-events topic
docker exec -it kafka kafka-topics --describe --topic payment-events --bootstrap-server localhost:9092
```

### Consume Kafka Messages

```powershell
# Listen to booking events
docker exec -it kafka kafka-console-consumer `
    --topic booking-events `
    --bootstrap-server localhost:9092 `
    --from-beginning

# In another terminal, listen to payment events
docker exec -it kafka kafka-console-consumer `
    --topic payment-events `
    --bootstrap-server localhost:9092 `
    --from-beginning
```

## Redis Testing

### Check Redis Keys

```powershell
# Connect to Redis CLI
docker exec -it redis redis-cli

# Inside Redis CLI:
# Show all keys
KEYS *

# Check vehicle lock
GET vehicle:lock:1

# Check vehicles cache
GET vehicles:all

# Check TTL of a key
TTL vehicle:lock:1

# Exit Redis CLI
exit
```

### Test Redis Lock Mechanism

```powershell
# Check if vehicle is locked
docker exec -it redis redis-cli GET vehicle:lock:1

# Manually set a lock (for testing)
docker exec -it redis redis-cli SETEX vehicle:lock:1 600 "locked"

# Verify lock exists
docker exec -it redis redis-cli EXISTS vehicle:lock:1

# Delete lock
docker exec -it redis redis-cli DEL vehicle:lock:1
```

## Database Queries

### Check Booking Status

```powershell
# Query bookings
docker exec -it postgres psql -U postgres -d booking_db -c "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;"
```

### Check Payment Records

```powershell
# Query payments
docker exec -it postgres psql -U postgres -d payment_db -c "SELECT id, booking_id, amount, status, payment_method, transaction_id FROM payments ORDER BY created_at DESC LIMIT 5;"
```

### Check Notifications

```powershell
# Query notifications
docker exec -it postgres psql -U postgres -d notification_db -c "SELECT id, user_id, type, message, status FROM notifications ORDER BY created_at DESC LIMIT 10;"
```

### Check Users

```powershell
# Query users (passwords are hashed)
docker exec -it postgres psql -U postgres -d auth_db -c "SELECT id, email, first_name, last_name, phone FROM users;"
```

## Performance Testing

### Apache Bench (Simple Load Test)

```powershell
# Test registration endpoint (if ab is installed)
ab -n 100 -c 10 -p register.json -T application/json http://localhost:8080/auth/register
```

### Postman Collection

Create a Postman collection with:
1. Register User
2. Login User (save token)
3. Search Vehicles
4. Create Booking
5. Process Payment
6. Confirm Booking
7. Get Notifications
8. Get User Bookings

Use Postman Runner for automated testing.

## Monitoring Commands

### Check Service Health

```powershell
$services = @(
    @{Name="API Gateway"; Port=8080},
    @{Name="Booking Service"; Port=8081},
    @{Name="Availability Service"; Port=8082},
    @{Name="Payment Service"; Port=8083},
    @{Name="Notification Service"; Port=8084},
    @{Name="WebSocket Service"; Port=8085}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/actuator/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ $($service.Name) is UP" -ForegroundColor Green
        }
    } catch {
        Write-Host "✗ $($service.Name) is DOWN" -ForegroundColor Red
    }
}
```

### Monitor Docker Containers

```powershell
# Show running containers
docker ps

# Show container stats
docker stats

# Check logs
docker logs postgres --tail 50
docker logs redis --tail 50
docker logs kafka --tail 50
```

## Cleanup Scripts

### Clear All Test Data

```powershell
# Truncate all tables
docker exec -it postgres psql -U postgres -d booking_db -c "TRUNCATE TABLE bookings RESTART IDENTITY CASCADE;"
docker exec -it postgres psql -U postgres -d payment_db -c "TRUNCATE TABLE payments RESTART IDENTITY CASCADE;"
docker exec -it postgres psql -U postgres -d notification_db -c "TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;"
docker exec -it postgres psql -U postgres -d auth_db -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"

# Clear Redis
docker exec -it redis redis-cli FLUSHALL

Write-Host "All test data cleared!" -ForegroundColor Green
```

## Save Scripts

Save the test workflow script as `test-workflow.ps1` and run:

```powershell
.\test-workflow.ps1
```
