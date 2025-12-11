# Vehicle Rental Microservices System

Complete microservices architecture for a vehicle rental system built with Spring Boot 3.2.0, Kafka, Redis, PostgreSQL, and WebSocket.

## Architecture Overview

This system consists of 6 microservices:

1. **API Gateway (Port 8080)** - Authentication service with JWT
2. **Booking Service (Port 8081)** - Booking management with Redis locks
3. **Availability Service (Port 8082)** - Vehicle availability and search
4. **Payment Service (Port 8083)** - Payment processing
5. **Notification Service (Port 8084)** - User notifications
6. **WebSocket Service (Port 8085)** - Real-time updates

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose (for PostgreSQL, Redis, Kafka)
- PostgreSQL 15+
- Redis 7+
- Apache Kafka 3.5+

## Quick Start

### 1. Start Infrastructure Services

```powershell
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Zookeeper (port 2181)
- Kafka (port 9092)

### 2. Create Databases

```powershell
docker exec -it postgres psql -U postgres -c "CREATE DATABASE auth_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE booking_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE availability_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE payment_db;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE notification_db;"
```

### 3. Build All Services

```powershell
cd api-gateway; mvn clean package; cd ..
cd booking-service; mvn clean package; cd ..
cd availability-service; mvn clean package; cd ..
cd payment-service; mvn clean package; cd ..
cd notification-service; mvn clean package; cd ..
cd websocket-service; mvn clean package; cd ..
```

### 4. Run All Services

Open separate terminals for each service:

```powershell
# Terminal 1 - API Gateway
cd api-gateway; mvn spring-boot:run

# Terminal 2 - Booking Service
cd booking-service; mvn spring-boot:run

# Terminal 3 - Availability Service
cd availability-service; mvn spring-boot:run

# Terminal 4 - Payment Service
cd payment-service; mvn spring-boot:run

# Terminal 5 - Notification Service
cd notification-service; mvn spring-boot:run

# Terminal 6 - WebSocket Service
cd websocket-service; mvn spring-boot:run
```

## API Documentation

### 1. API Gateway (Authentication Service)

**Base URL:** `http://localhost:8080`

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

### 2. Booking Service

**Base URL:** `http://localhost:8081`

#### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "vehicleId": 1,
  "userId": 1,
  "startDate": "2025-12-10",
  "endDate": "2025-12-15",
  "dailyRate": 50.00
}
```

**Response:** `201 Created`

#### Confirm Booking
```http
PUT /bookings/{id}/confirm
```

**Response:** `200 OK`

#### Cancel Booking
```http
DELETE /bookings/{id}
```

**Response:** `200 OK`

#### Get Booking
```http
GET /bookings/{id}
```

**Response:** `200 OK`

#### Get User Bookings
```http
GET /bookings/user/{userId}
```

**Response:** `200 OK`

### 3. Availability Service

**Base URL:** `http://localhost:8082`

#### List All Vehicles
```http
GET /availability/vehicles
```

**Response:** `200 OK`

#### Search Available Vehicles
```http
GET /availability/search?startDate=2025-12-10&endDate=2025-12-15&location=NYC
```

**Response:** `200 OK`

#### Get Vehicle Details
```http
GET /availability/vehicles/{vehicleId}
```

**Response:** `200 OK`

### 4. Payment Service

**Base URL:** `http://localhost:8083`

#### Process Payment
```http
POST /payments
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 250.00,
  "paymentMethod": "CREDIT_CARD"
}
```

**Response:** `201 Created`

#### Get Payment
```http
GET /payments/{paymentId}
```

**Response:** `200 OK`

#### Get Payments by Booking
```http
GET /payments/booking/{bookingId}
```

**Response:** `200 OK`

#### Refund Payment
```http
POST /payments/{paymentId}/refund
```

**Response:** `200 OK`

### 5. Notification Service

**Base URL:** `http://localhost:8084`

#### Get User Notifications
```http
GET /notifications/user/{userId}
```

**Response:** `200 OK`

#### Get Single Notification
```http
GET /notifications/{notificationId}
```

**Response:** `200 OK`

#### Mark as Read
```http
PUT /notifications/{notificationId}/read
```

**Response:** `200 OK`

#### Delete Notification
```http
DELETE /notifications/{notificationId}
```

**Response:** `200 OK`

### 6. WebSocket Service

**WebSocket URL:** `ws://localhost:8085/ws/bookings`

#### Connect to WebSocket

```javascript
const socket = new WebSocket('ws://localhost:8085/ws/bookings');

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
  // {
  //   "type": "booking_status_update",
  //   "payload": {
  //     "bookingId": 1,
  //     "status": "CONFIRMED"
  //   },
  //   "timestamp": "2025-12-01T20:00:00Z"
  // }
};
```

## Event Flow

### Booking Flow
1. User creates booking → Booking Service locks vehicle in Redis (10 min)
2. Booking Service publishes `booking_created` event to Kafka
3. Availability Service updates cache
4. Notification Service creates notification for user
5. WebSocket Service broadcasts real-time update

### Payment Flow
1. User processes payment → Payment Service creates payment (auto-success)
2. Payment Service publishes `payment_completed` event
3. Notification Service creates payment notification
4. WebSocket Service broadcasts payment update

## Kafka Topics

- `booking-events` - Booking lifecycle events
- `payment-events` - Payment lifecycle events

## Redis Keys

- `vehicle:lock:{vehicleId}` - Vehicle lock (TTL: 600s)
- `vehicles:all` - Cached vehicles list (TTL: 3600s)

## Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Message Broker:** Apache Kafka 3.5
- **Security:** Spring Security + JWT
- **WebSocket:** Spring WebSocket
- **Build Tool:** Maven

## Project Structure

```
NM_Task/
├── api-gateway/          # Authentication service
├── booking-service/      # Booking management
├── availability-service/ # Vehicle availability
├── payment-service/      # Payment processing
├── notification-service/ # Notifications
├── websocket-service/    # Real-time updates
├── docker-compose.yml    # Infrastructure
└── README.md            # This file
```

## Configuration

Each service has its own `application.yml` in `src/main/resources/`:

- Database connection settings
- Kafka bootstrap servers
- Redis connection
- Service ports
- JWT settings (API Gateway only)

## Testing the System

### 1. Register and Login
```powershell
# Register
curl -X POST http://localhost:8080/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"pass123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"1234567890\"}'

# Login
curl -X POST http://localhost:8080/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"pass123\"}'
```

### 2. Create Booking
```powershell
curl -X POST http://localhost:8081/bookings `
  -H "Content-Type: application/json" `
  -d '{\"vehicleId\":1,\"userId\":1,\"startDate\":\"2025-12-10\",\"endDate\":\"2025-12-15\",\"dailyRate\":50.00}'
```

### 3. Process Payment
```powershell
curl -X POST http://localhost:8083/payments `
  -H "Content-Type: application/json" `
  -d '{\"bookingId\":1,\"amount\":250.00,\"paymentMethod\":\"CREDIT_CARD\"}'
```

## Production Considerations

This is an MVP implementation. For production:

1. **Security**
   - Add API Gateway authentication to all services
   - Implement proper JWT validation across services
   - Use HTTPS/WSS
   - Add rate limiting

2. **Resilience**
   - Add circuit breakers (Resilience4j)
   - Implement retry logic
   - Add health checks
   - Configure timeouts

3. **Monitoring**
   - Add Spring Boot Actuator
   - Implement distributed tracing (Zipkin/Jaeger)
   - Add metrics (Prometheus)
   - Configure logging aggregation (ELK)

4. **Scalability**
   - Use Kubernetes for orchestration
   - Implement service mesh (Istio)
   - Add load balancers
   - Configure auto-scaling

5. **Database**
   - Implement connection pooling
   - Add database migrations (Flyway/Liquibase)
   - Configure replication
   - Add backup strategies

## Troubleshooting

### Services won't start
- Check if ports 8080-8085 are available
- Ensure PostgreSQL, Redis, Kafka are running
- Verify databases are created

### Kafka connection issues
- Check Kafka is running: `docker ps`
- Verify Kafka advertised listeners
- Check topics exist

### Redis lock issues
- Verify Redis is running
- Check Redis connection in logs
- Ensure TTL is configured correctly

## License

MIT License

## Author

NM_Task - Vehicle Rental Microservices System
