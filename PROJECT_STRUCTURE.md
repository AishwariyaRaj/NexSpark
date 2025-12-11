# Vehicle Rental Microservices - Project Structure

```
NM_Task/
│
├── api-gateway/                          # Port 8080 - Authentication Service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/gateway/
│   │   │   │   ├── ApiGatewayApplication.java      # Main application
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java         # Spring Security config
│   │   │   │   ├── controller/
│   │   │   │   │   └── AuthController.java         # Register/Login endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── RegisterRequest.java        # Registration DTO
│   │   │   │   │   ├── LoginRequest.java           # Login DTO
│   │   │   │   │   └── AuthResponse.java           # JWT response DTO
│   │   │   │   ├── entity/
│   │   │   │   │   └── User.java                   # User entity (JPA)
│   │   │   │   ├── repository/
│   │   │   │   │   └── UserRepository.java         # JPA repository
│   │   │   │   └── security/
│   │   │   │       ├── JwtTokenProvider.java       # JWT generation/validation
│   │   │   │       └── JwtAuthenticationFilter.java # JWT filter
│   │   │   └── resources/
│   │   │       └── application.yml                  # Config (DB, JWT)
│   │   └── test/                                    # Unit tests
│   └── pom.xml                                      # Maven dependencies
│
├── booking-service/                      # Port 8081 - Booking Management
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/booking/
│   │   │   │   ├── BookingServiceApplication.java  # Main application
│   │   │   │   ├── controller/
│   │   │   │   │   └── BookingController.java      # CRUD endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   └── CreateBookingRequest.java   # Booking request DTO
│   │   │   │   ├── entity/
│   │   │   │   │   └── Booking.java                # Booking entity
│   │   │   │   ├── kafka/
│   │   │   │   │   └── BookingEventProducer.java   # Kafka producer
│   │   │   │   ├── repository/
│   │   │   │   │   └── BookingRepository.java      # JPA repository
│   │   │   │   └── service/
│   │   │   │       ├── BookingService.java         # Business logic
│   │   │   │       └── RedisLockService.java       # Redis lock manager
│   │   │   └── resources/
│   │   │       └── application.yml                  # Config (DB, Redis, Kafka)
│   │   └── test/
│   └── pom.xml
│
├── availability-service/                 # Port 8082 - Vehicle Availability
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/availability/
│   │   │   │   ├── AvailabilityServiceApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── JacksonConfig.java          # JSON serialization
│   │   │   │   ├── controller/
│   │   │   │   │   └── AvailabilityController.java # Search/list endpoints
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Vehicle.java                # Vehicle entity
│   │   │   │   │   └── Booking.java                # Booking replica
│   │   │   │   ├── kafka/
│   │   │   │   │   └── BookingEventListener.java   # Kafka consumer
│   │   │   │   ├── repository/
│   │   │   │   │   ├── VehicleRepository.java      # Custom queries
│   │   │   │   │   └── BookingRepository.java      # Booking queries
│   │   │   │   └── service/
│   │   │   │       ├── AvailabilityService.java    # Availability logic
│   │   │   │       └── VehicleCacheService.java    # Redis cache manager
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── payment-service/                      # Port 8083 - Payment Processing
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/payment/
│   │   │   │   ├── PaymentServiceApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── PaymentController.java      # Payment endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   └── ProcessPaymentRequest.java  # Payment request DTO
│   │   │   │   ├── entity/
│   │   │   │   │   └── Payment.java                # Payment entity
│   │   │   │   ├── kafka/
│   │   │   │   │   └── PaymentEventProducer.java   # Kafka producer
│   │   │   │   ├── repository/
│   │   │   │   │   └── PaymentRepository.java      # JPA repository
│   │   │   │   └── service/
│   │   │   │       └── PaymentService.java         # Payment logic (auto-success)
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── notification-service/                 # Port 8084 - User Notifications
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/notification/
│   │   │   │   ├── NotificationServiceApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── JacksonConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── NotificationController.java # CRUD endpoints
│   │   │   │   ├── entity/
│   │   │   │   │   └── Notification.java           # Notification entity
│   │   │   │   ├── kafka/
│   │   │   │   │   ├── BookingEventListener.java   # Booking event consumer
│   │   │   │   │   └── PaymentEventListener.java   # Payment event consumer
│   │   │   │   ├── repository/
│   │   │   │   │   └── NotificationRepository.java # JPA repository
│   │   │   │   └── service/
│   │   │   │       └── NotificationService.java    # Notification logic
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── websocket-service/                    # Port 8085 - Real-time Updates
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/websocket/
│   │   │   │   ├── WebSocketServiceApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── WebSocketConfig.java        # WebSocket configuration
│   │   │   │   │   └── JacksonConfig.java
│   │   │   │   ├── handler/
│   │   │   │   │   └── BookingWebSocketHandler.java # WebSocket handler
│   │   │   │   ├── kafka/
│   │   │   │   │   └── BookingEventListener.java   # Kafka consumer (dual topics)
│   │   │   │   └── service/
│   │   │   │       ├── SessionManager.java         # WebSocket session tracker
│   │   │   │       └── WebSocketService.java       # Broadcast service
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── docker-compose.yml                    # Infrastructure (PostgreSQL, Redis, Kafka)
├── README.md                             # Main documentation
├── SETUP_GUIDE.md                        # Step-by-step setup
├── API_CHEATSHEET.md                     # Quick API reference
├── SAMPLE_DATA.md                        # Test data scripts
└── PROJECT_STRUCTURE.md                  # This file

```

## Technology Stack by Service

### 1. API Gateway (Authentication)
- **Framework:** Spring Boot 3.2.0
- **Security:** Spring Security + JWT (jjwt 0.12.3)
- **Database:** PostgreSQL (auth_db)
- **Password Hashing:** BCrypt
- **Validation:** Jakarta Validation
- **Token Expiry:** 24 hours

### 2. Booking Service
- **Framework:** Spring Boot 3.2.0
- **Database:** PostgreSQL (booking_db)
- **Cache:** Redis (vehicle locks, TTL: 10 min)
- **Messaging:** Kafka (booking-events topic)
- **ORM:** JPA/Hibernate

### 3. Availability Service
- **Framework:** Spring Boot 3.2.0
- **Database:** PostgreSQL (availability_db)
- **Cache:** Redis (vehicle list, TTL: 1 hour)
- **Messaging:** Kafka Consumer (booking-events)
- **Custom Queries:** JPQL for availability check

### 4. Payment Service
- **Framework:** Spring Boot 3.2.0
- **Database:** PostgreSQL (payment_db)
- **Messaging:** Kafka (payment-events topic)
- **Payment Logic:** Auto-success for MVP
- **Transaction IDs:** UUID-based

### 5. Notification Service
- **Framework:** Spring Boot 3.2.0
- **Database:** PostgreSQL (notification_db)
- **Messaging:** Kafka Consumer (booking-events, payment-events)
- **Dual Listeners:** Separate for booking and payment events

### 6. WebSocket Service
- **Framework:** Spring Boot 3.2.0
- **WebSocket:** Spring WebSocket
- **Messaging:** Kafka Consumer (both topics)
- **Session Management:** In-memory ConcurrentHashMap
- **Broadcasting:** Real-time push to all connected clients

## Data Flow Diagrams

### User Registration Flow
```
Client → POST /auth/register
         ↓
    AuthController
         ↓
    BCrypt Hash Password
         ↓
    UserRepository.save()
         ↓
    PostgreSQL (auth_db)
         ↓
    201 Created Response
```

### Booking Creation Flow
```
Client → POST /bookings
         ↓
    BookingController
         ↓
    RedisLockService.acquireLock() → Redis (vehicle:lock:{id})
         ↓
    Calculate totalCost
         ↓
    BookingRepository.save() → PostgreSQL (booking_db)
         ↓
    BookingEventProducer.publishBookingCreated() → Kafka
         ↓                                              ↓
    201 Response                          ┌─────────────┴────────────┐
                                          ↓                           ↓
                               AvailabilityService         NotificationService
                               (refresh cache)             (create notification)
                                          ↓                           ↓
                               WebSocketService            PostgreSQL
                               (broadcast update)          (notification_db)
```

### Payment Processing Flow
```
Client → POST /payments
         ↓
    PaymentController
         ↓
    PaymentService.processPayment()
         ↓
    Auto-success logic
         ↓
    PaymentRepository.save() → PostgreSQL (payment_db)
         ↓
    PaymentEventProducer.publishPaymentCompleted() → Kafka
         ↓                                                ↓
    201 Response                          ┌──────────────┴────────────┐
                                          ↓                            ↓
                               NotificationService          WebSocketService
                               (create notification)        (broadcast update)
```

## Database Tables

### auth_db.users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL
);
```

### booking_db.bookings
```sql
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

### availability_db.vehicles
```sql
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    type VARCHAR(50) NOT NULL
);
```

### payment_db.payments
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

### notification_db.notifications
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    message VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

## Kafka Event Schemas

### booking-events
```json
{
  "event": "booking_created|booking_confirmed|booking_cancelled",
  "bookingId": 1,
  "vehicleId": 1,
  "userId": 1
}
```

### payment-events
```json
{
  "event": "payment_completed|payment_failed|payment_refunded",
  "paymentId": 1,
  "bookingId": 1
}
```

## WebSocket Message Schema
```json
{
  "type": "booking_status_update|payment_status_update",
  "payload": {
    "bookingId": 1,
    "status": "CONFIRMED",
    "paymentId": 1
  },
  "timestamp": "2025-12-01T20:00:00Z"
}
```

## Inter-Service Communication

```
API Gateway (8080)
    ↓ (User authenticates)
    
Booking Service (8081)
    ↓ (Creates booking)
    → Redis (Lock vehicle)
    → Kafka (Publish event)
    
Availability Service (8082)
    ← Kafka (Consumes booking events)
    → Redis (Update cache)
    
Payment Service (8083)
    → Kafka (Publish payment events)
    
Notification Service (8084)
    ← Kafka (Consumes both event types)
    → PostgreSQL (Store notifications)
    
WebSocket Service (8085)
    ← Kafka (Consumes both event types)
    → WebSocket (Broadcast to clients)
```

## Key Features by Service

### API Gateway
✓ JWT-based authentication
✓ BCrypt password hashing
✓ User registration & login
✓ 24-hour token expiration
✓ Spring Security integration

### Booking Service
✓ Redis-based vehicle locking (10 min TTL)
✓ Automatic cost calculation
✓ Booking lifecycle management
✓ Kafka event publishing
✓ Transaction support

### Availability Service
✓ Real-time availability checking
✓ Redis caching with 1-hour TTL
✓ Location-based search
✓ Date range filtering
✓ Kafka event consumption

### Payment Service
✓ Auto-success payment processing
✓ UUID-based transaction IDs
✓ Refund capability
✓ Kafka event publishing
✓ Payment history tracking

### Notification Service
✓ Dual Kafka consumers
✓ Event-to-notification mapping
✓ CRUD operations
✓ Read/unread status
✓ User-specific filtering

### WebSocket Service
✓ Real-time broadcasting
✓ Session management
✓ Dual Kafka consumers
✓ Auto-reconnection support
✓ JSON message formatting

## Development Guidelines

### Adding a New Endpoint
1. Create DTO in `dto/` package
2. Add method to Controller
3. Implement logic in Service
4. Add repository method if needed
5. Update documentation

### Adding a New Event
1. Define event schema
2. Add producer method in `kafka/` package
3. Add consumer in listening services
4. Update event handlers
5. Test end-to-end flow

### Database Changes
1. Update entity class
2. Let Hibernate update schema (dev)
3. Create migration script (prod)
4. Update documentation
5. Test with sample data
