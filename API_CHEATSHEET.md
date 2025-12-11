# API Quick Reference

## Service Ports
- **API Gateway:** 8080
- **Booking Service:** 8081
- **Availability Service:** 8082
- **Payment Service:** 8083
- **Notification Service:** 8084
- **WebSocket Service:** 8085

## Authentication Service (Port 8080)

### Register
```bash
POST http://localhost:8080/auth/register
{
  "email": "user@example.com",
  "password": "pass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
→ 201 Created | 409 Conflict
```

### Login
```bash
POST http://localhost:8080/auth/login
{
  "email": "user@example.com",
  "password": "pass123"
}
→ 200 OK {token, email, userId} | 400 Bad Request
```

## Booking Service (Port 8081)

### Create Booking
```bash
POST http://localhost:8081/bookings
{
  "vehicleId": 1,
  "userId": 1,
  "startDate": "2025-12-10",
  "endDate": "2025-12-15",
  "dailyRate": 50.00
}
→ 201 Created | 409 Conflict (locked)
```

### Confirm Booking
```bash
PUT http://localhost:8081/bookings/{id}/confirm
→ 200 OK | 404 Not Found
```

### Cancel Booking
```bash
DELETE http://localhost:8081/bookings/{id}
→ 200 OK | 404 Not Found
```

### Get Booking
```bash
GET http://localhost:8081/bookings/{id}
→ 200 OK | 404 Not Found
```

### Get User Bookings
```bash
GET http://localhost:8081/bookings/user/{userId}
→ 200 OK [array]
```

## Availability Service (Port 8082)

### List All Vehicles
```bash
GET http://localhost:8082/availability/vehicles
→ 200 OK [array]
```

### Search Available
```bash
GET http://localhost:8082/availability/search?startDate=2025-12-10&endDate=2025-12-15&location=NYC
→ 200 OK [array]
```

### Get Vehicle Details
```bash
GET http://localhost:8082/availability/vehicles/{id}
→ 200 OK | 404 Not Found
```

## Payment Service (Port 8083)

### Process Payment
```bash
POST http://localhost:8083/payments
{
  "bookingId": 1,
  "amount": 250.00,
  "paymentMethod": "CREDIT_CARD"
}
→ 201 Created | 400 Bad Request
```

### Get Payment
```bash
GET http://localhost:8083/payments/{id}
→ 200 OK | 404 Not Found
```

### Get Payments by Booking
```bash
GET http://localhost:8083/payments/booking/{bookingId}
→ 200 OK [array]
```

### Refund Payment
```bash
POST http://localhost:8083/payments/{id}/refund
→ 200 OK | 400 Bad Request
```

## Notification Service (Port 8084)

### Get User Notifications
```bash
GET http://localhost:8084/notifications/user/{userId}
→ 200 OK [array]
```

### Get Single Notification
```bash
GET http://localhost:8084/notifications/{id}
→ 200 OK | 404 Not Found
```

### Mark as Read
```bash
PUT http://localhost:8084/notifications/{id}/read
→ 200 OK | 404 Not Found
```

### Delete Notification
```bash
DELETE http://localhost:8084/notifications/{id}
→ 200 OK
```

## WebSocket Service (Port 8085)

### Connect
```javascript
ws://localhost:8085/ws/bookings
```

### Message Format
```json
{
  "type": "booking_status_update",
  "payload": {
    "bookingId": 1,
    "status": "CONFIRMED"
  },
  "timestamp": "2025-12-01T20:00:00Z"
}
```

## Event Types

### Kafka Topics

**booking-events:**
- `booking_created`
- `booking_confirmed`
- `booking_cancelled`

**payment-events:**
- `payment_completed`
- `payment_failed`
- `payment_refunded`

## Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request (validation error)
- **404** - Not Found
- **409** - Conflict (duplicate/locked)

## Redis Keys

- `vehicle:lock:{vehicleId}` - TTL: 600s
- `vehicles:all` - TTL: 3600s

## Database Schema

### User
```
id, email, password, firstName, lastName, phone
```

### Booking
```
id, vehicleId, userId, startDate, endDate, status, totalCost, createdAt
Status: PENDING | CONFIRMED | CANCELLED
```

### Vehicle
```
id, make, model, year, location, dailyRate, type
```

### Payment
```
id, bookingId, amount, status, paymentMethod, transactionId, createdAt
Status: PENDING | COMPLETED | FAILED | REFUNDED
```

### Notification
```
id, userId, type, message, status, createdAt
Status: UNREAD | READ
```

## Testing Flow

1. **Register** → POST /auth/register
2. **Login** → POST /auth/login (get JWT)
3. **Search Vehicles** → GET /availability/search
4. **Create Booking** → POST /bookings
5. **Process Payment** → POST /payments
6. **Confirm Booking** → PUT /bookings/{id}/confirm
7. **Check Notifications** → GET /notifications/user/{userId}
8. **WebSocket** → Connect to ws://localhost:8085/ws/bookings

## PowerShell Examples

```powershell
# Register
$body = @{email="test@test.com";password="pass";firstName="John";lastName="Doe";phone="123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body $body

# Login
$body = @{email="test@test.com";password="pass"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method Post -ContentType "application/json" -Body $body

# Search
Invoke-RestMethod -Uri "http://localhost:8082/availability/search?startDate=2025-12-10&endDate=2025-12-15&location=NYC"

# Create Booking
$body = @{vehicleId=1;userId=1;startDate="2025-12-10";endDate="2025-12-15";dailyRate=50} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/bookings" -Method Post -ContentType "application/json" -Body $body

# Process Payment
$body = @{bookingId=1;amount=250;paymentMethod="CREDIT_CARD"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8083/payments" -Method Post -ContentType "application/json" -Body $body
```

## Docker Commands

```powershell
# Start all
docker-compose up -d

# Stop all
docker-compose down

# View logs
docker logs postgres
docker logs redis
docker logs kafka

# Connect to databases
docker exec -it postgres psql -U postgres
docker exec -it redis redis-cli
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

## Useful Queries

```sql
-- Check all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- Check payments
SELECT * FROM payments ORDER BY created_at DESC;

-- Check notifications
SELECT * FROM notifications ORDER BY created_at DESC;

-- Check users
SELECT id, email, first_name, last_name FROM users;

-- Check vehicles
SELECT * FROM vehicles WHERE location = 'NYC';
```
