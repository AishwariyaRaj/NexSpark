# NexSpark Vehicle Rental System - Complete Summary

## System Overview

NexSpark is a full-stack microservices-based vehicle rental platform with:
- **Backend**: 6 Spring Boot microservices
- **Frontend**: React.js single-page application
- **Infrastructure**: Docker (PostgreSQL, Redis, Kafka, Zookeeper)

---

## Backend Architecture (6 Microservices)

### 1. API Gateway (Port 8080)
**Purpose**: Authentication and JWT token management

**Tech Stack**:
- Spring Boot 3.2.0
- Spring Security + JWT (io.jsonwebtoken)
- PostgreSQL (auth_db database)
- BCrypt password hashing

**Key Features**:
- User registration and login
- JWT token generation (24-hour expiry)
- Password encryption with BCrypt
- Token validation

**Endpoints**:
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login and get JWT token

---

### 2. Booking Service (Port 8081)
**Purpose**: Manage vehicle bookings with Redis locking

**Tech Stack**:
- Spring Boot 3.2.0
- PostgreSQL (booking_db database)
- Redis (distributed locking)
- Apache Kafka (event publishing)

**Key Features**:
- Create bookings with Redis vehicle locks (10-minute TTL)
- Confirm and cancel bookings
- Calculate total cost (daily rate × days)
- Publish Kafka events (booking_created, booking_confirmed, booking_cancelled)
- Automatic lock release on confirmation/cancellation

**Endpoints**:
- POST `/api/bookings` - Create booking (locks vehicle in Redis)
- POST `/api/bookings/{id}/confirm` - Confirm booking (releases lock, publishes event)
- GET `/api/bookings/user/{userId}` - Get user's bookings
- PUT `/api/bookings/{id}/cancel` - Cancel booking (releases lock, publishes event)

**Booking Statuses**: PENDING → CONFIRMED → CANCELLED

---

### 3. Availability Service (Port 8082)
**Purpose**: Check vehicle availability with caching

**Tech Stack**:
- Spring Boot 3.2.0
- PostgreSQL (availability_db database)
- Redis (vehicle caching, 1-hour TTL)
- Apache Kafka (booking event consumption)

**Key Features**:
- Search available vehicles by date range and location
- Redis caching for all vehicles (refreshed hourly)
- Check booking overlaps and Redis locks
- Listen to Kafka booking events to update availability
- Return vehicles with status: AVAILABLE or BOOKED

**Endpoints**:
- GET `/api/availability/search?startDate=&endDate=&location=` - Search available vehicles
- GET `/api/availability/vehicles` - Get all vehicles (cached)
- GET `/api/availability/vehicles/{id}` - Get vehicle by ID

**Kafka Integration**:
- Consumes `booking-events` topic
- Updates vehicle availability on booking changes

---

### 4. Payment Service (Port 8083)
**Purpose**: MVP payment processing (auto-success)

**Tech Stack**:
- Spring Boot 3.2.0
- PostgreSQL (payment_db database)
- Apache Kafka (event publishing)

**Key Features**:
- Process payments (auto-success for MVP)
- Generate transaction IDs (UUID)
- Refund payments
- Publish payment events (payment_completed, payment_failed, payment_refunded)

**Endpoints**:
- POST `/api/payments/process` - Process payment (auto-success)
- GET `/api/payments/{id}` - Get payment by ID
- GET `/api/payments/booking/{bookingId}` - Get booking payments
- POST `/api/payments/{id}/refund` - Refund payment

**Payment Statuses**: PENDING → COMPLETED / FAILED → REFUNDED

---

### 5. Notification Service (Port 8084)
**Purpose**: User notifications from Kafka events

**Tech Stack**:
- Spring Boot 3.2.0
- PostgreSQL (notification_db database)
- Apache Kafka (event consumption)

**Key Features**:
- Create notifications from booking and payment events
- Mark notifications as read/unread
- Delete notifications
- Store notification history

**Endpoints**:
- GET `/api/notifications/user/{userId}` - Get user notifications
- PUT `/api/notifications/{id}/read` - Mark as read
- DELETE `/api/notifications/{id}` - Delete notification

**Kafka Integration**:
- Consumes `booking-events` topic (booking_created, booking_confirmed, booking_cancelled)
- Consumes `payment-events` topic (payment_completed, payment_failed)
- Auto-creates notifications for users

**Notification Statuses**: UNREAD → READ

---

### 6. WebSocket Service (Port 8085)
**Purpose**: Real-time booking updates via WebSocket

**Tech Stack**:
- Spring Boot 3.2.0
- Spring WebSocket
- Apache Kafka (event consumption)

**Key Features**:
- WebSocket endpoint for client connections
- Session management for connected clients
- Broadcast messages to all connected clients
- Auto-reconnect support with exponential backoff

**WebSocket Endpoint**:
- WS `/ws/bookings` - WebSocket connection

**Kafka Integration**:
- Consumes `booking-events` and `payment-events` topics
- Broadcasts events to all connected WebSocket clients
- Real-time notifications for booking/payment changes

---

## Frontend Architecture (React.js)

### Tech Stack
- React 18.2.0
- React Router DOM 6.20.0 (client-side routing)
- Axios 1.6.2 (HTTP client with interceptors)
- Tailwind CSS 3.3.0 (utility-first styling)
- WebSocket client (real-time updates)

### Project Structure

```
nexspark-frontend/
├── src/
│   ├── components/        # Reusable UI components (7 files)
│   ├── context/           # React Context providers (3 files)
│   ├── pages/             # Full page components (8 files)
│   ├── services/          # API integration layer (6 files)
│   ├── utils/             # Helper functions (3 files)
│   ├── App.jsx            # Main app with routing
│   └── index.jsx          # React entry point
├── public/
│   └── index.html         # HTML template
├── .env                   # Environment variables
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

### Components (7 files)
1. **Navbar.jsx** - Header with navigation, user info, notifications bell, logout
2. **VehicleCard.jsx** - Display vehicle with "Book Now" button
3. **SearchFilters.jsx** - Date/location filters for vehicle search
4. **BookingCard.jsx** - Booking details with cancel button
5. **NotificationBell.jsx** - Dropdown notification center with unread count
6. **NotificationItem.jsx** - Single notification with mark read/delete actions
7. **ToastNotification.jsx** - Toast alerts (success, error, warning, info)

### Pages (8 files)
1. **Home.jsx** - Landing page for non-authenticated users
2. **Login.jsx** - Login form with email/password
3. **Register.jsx** - Registration form with validation
4. **Dashboard.jsx** - User dashboard with stats, recent bookings, notifications
5. **Search.jsx** - Vehicle search with filters and results grid
6. **BookingDetail.jsx** - Vehicle details and booking form with cost calculation
7. **Payment.jsx** - Payment processing page with booking summary
8. **MyBookings.jsx** - List of user bookings with filter tabs

### Context Providers (3 files)
1. **AuthContext.jsx** - Authentication state management (user, login, logout, register)
2. **WebSocketContext.jsx** - WebSocket connection management (messages, send, connected)
3. **ToastContext.jsx** - Toast notification system (show, remove toasts)

### Services (6 files)
1. **api.js** - Axios instance with JWT interceptor and 401 handling
2. **authService.js** - register(), login(), logout(), getCurrentUser()
3. **bookingService.js** - createBooking(), confirmBooking(), getUserBookings(), cancelBooking()
4. **vehicleService.js** - searchVehicles(), getAllVehicles(), getVehicleById()
5. **paymentService.js** - processPayment(), getPayment(), refundPayment()
6. **notificationService.js** - getUserNotifications(), markAsRead(), deleteNotification()

### Utils (3 files)
1. **tokenStorage.js** - JWT and user data localStorage helpers
2. **dateFormatter.js** - formatDate(), formatCurrency(), calculateDays(), calculateTotalCost()
3. **websocket.js** - WebSocketClient class with auto-reconnect (exponential backoff)

### Routing
- **Public routes**: `/`, `/login`, `/register`
- **Protected routes**: `/dashboard`, `/search`, `/booking/:vehicleId`, `/payment/:bookingId`, `/my-bookings`
- **Authentication guard**: ProtectedRoute component redirects to `/login` if not authenticated

---

## Infrastructure (Docker)

### Docker Compose Services

**docker-compose.yml** includes:

1. **PostgreSQL 15 Alpine** (Port 5432)
   - 5 databases: auth_db, booking_db, availability_db, payment_db, notification_db
   - User: postgres
   - Password: postgres123
   - Volume: postgres_data

2. **Redis 7 Alpine** (Port 6379)
   - Used for caching and distributed locking
   - No authentication
   - Volume: redis_data

3. **Apache Kafka 3.5** (Port 9092)
   - Event streaming platform
   - Topics: booking-events, payment-events
   - Depends on Zookeeper

4. **Zookeeper** (Port 2181)
   - Kafka coordination service

**Start infrastructure:**
```powershell
docker-compose up -d
```

---

## Complete Startup Process

### 1. Start Docker Infrastructure
```powershell
cd d:\NM_Task
docker-compose up -d
```
Wait 10 seconds for containers to initialize.

### 2. Start Backend Microservices
```powershell
.\start-all-services.bat
```
This opens 6 CMD windows, each running one microservice with `mvn spring-boot:run`

Wait 30-60 seconds for all services to start.

### 3. Verify Backend
```powershell
.\check-services.bat
```
All services should show "OK" or "UP"

### 4. Start Frontend
```powershell
cd nexspark-frontend
npm install  # First time only
npm start
```
Browser opens at `http://localhost:3000`

---

## User Flow

### Complete Booking Journey

1. **Register/Login**
   - User registers at `/register` with email and password
   - User logs in at `/login` to get JWT token
   - Token stored in localStorage as `nexspark_token`
   - Redirected to `/dashboard`

2. **Search Vehicles**
   - Navigate to `/search`
   - Enter date range and optional location
   - Frontend calls: `GET /api/availability/search?startDate=&endDate=&location=`
   - View available vehicles (not locked or booked)

3. **Create Booking**
   - Click "Book Now" on vehicle card
   - Redirected to `/booking/{vehicleId}`
   - Select dates, see cost calculation
   - Click "Confirm Booking"
   - Frontend calls: `POST /api/bookings` with {vehicleId, startDate, endDate}
   - Backend: Creates booking with status PENDING, locks vehicle in Redis
   - Kafka event published: `booking_created`
   - Redirected to `/payment/{bookingId}`

4. **Process Payment**
   - Review booking summary
   - Select payment method
   - Click "Pay"
   - Frontend calls: `POST /api/payments/process` with {bookingId, amount, paymentMethod}
   - Backend: Auto-succeeds payment, creates transaction ID
   - Kafka event published: `payment_completed`
   - Frontend calls: `POST /api/bookings/{id}/confirm`
   - Backend: Updates booking to CONFIRMED, releases Redis lock
   - Kafka event published: `booking_confirmed`
   - Redirected to `/my-bookings`

5. **View Bookings**
   - Navigate to `/my-bookings`
   - Frontend calls: `GET /api/bookings/user/{userId}`
   - View all bookings with status badges
   - Filter by: All / Pending / Confirmed / Cancelled

6. **Cancel Booking**
   - Click "Cancel" on pending booking
   - Frontend calls: `PUT /api/bookings/{id}/cancel`
   - Backend: Updates status to CANCELLED, releases Redis lock
   - Kafka event published: `booking_cancelled`
   - Booking list refreshes

7. **Real-time Notifications**
   - WebSocket connection established on login
   - Notification Service consumes Kafka events
   - Creates notifications in database (UNREAD status)
   - WebSocket Service broadcasts events to all clients
   - Frontend receives WebSocket messages
   - Toast notifications displayed
   - Notification bell shows unread count
   - User can mark as read or delete

---

## Management Scripts

### build-all-services.bat
Builds all 6 microservices with Maven:
```batch
mvn clean install -DskipTests
```

### start-all-services.bat
Opens 6 CMD windows, each running:
```batch
mvn spring-boot:run
```

### check-services.bat
Health checks for Docker containers and Spring Boot services:
- Docker containers: `docker ps`
- Spring Boot: `curl http://localhost:PORT/actuator/health`

### test-api.bat
End-to-end API testing:
1. Register user
2. Login and get JWT
3. Search vehicles
4. Create booking
5. Process payment
6. Confirm booking
7. Get notifications

### stop-all-services.bat
Kills processes on ports 8080-8085:
```batch
for /f "tokens=5" %a in ('netstat -ano ^| findstr :PORT') do taskkill /PID %a /F
```

### manage-project.bat
Interactive menu for all operations:
1. Build all services
2. Start all services
3. Stop all services
4. Check service status
5. Test APIs
6. View logs

---

## Database Schemas

### auth_db (API Gateway)
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- BCrypt hashed
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### booking_db (Booking Service)
```sql
CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  vehicle_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_cost DECIMAL(10,2),
  status VARCHAR(20),  -- PENDING, CONFIRMED, CANCELLED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### availability_db (Availability Service)
```sql
CREATE TABLE vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(100),  -- SUV, Sedan, Truck
  location VARCHAR(255),
  daily_rate DECIMAL(10,2),
  status VARCHAR(20),  -- AVAILABLE, BOOKED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20)
);
```

### payment_db (Payment Service)
```sql
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  booking_id INTEGER UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),  -- CREDIT_CARD, DEBIT_CARD, PAYPAL
  transaction_id VARCHAR(255) UNIQUE,  -- UUID
  status VARCHAR(20),  -- PENDING, COMPLETED, FAILED, REFUNDED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### notification_db (Notification Service)
```sql
CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20),  -- UNREAD, READ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Redis Keys

### Distributed Locks (Booking Service)
- **Key pattern**: `vehicle:lock:{vehicleId}`
- **TTL**: 10 minutes
- **Purpose**: Prevent double booking during transaction
- **Value**: Booking ID or timestamp

### Vehicle Cache (Availability Service)
- **Key pattern**: `vehicles:all`
- **TTL**: 1 hour
- **Purpose**: Cache all vehicles to reduce DB queries
- **Value**: JSON array of all vehicles

---

## Kafka Topics

### booking-events
**Producer**: Booking Service  
**Consumers**: Availability Service, Notification Service, WebSocket Service

**Event Types**:
- `booking_created`: New booking created (status: PENDING)
- `booking_confirmed`: Booking confirmed after payment (status: CONFIRMED)
- `booking_cancelled`: Booking cancelled by user (status: CANCELLED)

**Event Payload**:
```json
{
  "eventType": "booking_created",
  "bookingId": 123,
  "userId": 456,
  "vehicleId": 789,
  "startDate": "2024-01-15",
  "endDate": "2024-01-18",
  "totalCost": 300.00,
  "status": "PENDING"
}
```

### payment-events
**Producer**: Payment Service  
**Consumers**: Notification Service, WebSocket Service

**Event Types**:
- `payment_completed`: Payment processed successfully
- `payment_failed`: Payment processing failed
- `payment_refunded`: Payment refunded

**Event Payload**:
```json
{
  "eventType": "payment_completed",
  "paymentId": 123,
  "bookingId": 456,
  "amount": 300.00,
  "transactionId": "uuid-here",
  "status": "COMPLETED"
}
```

---

## API Authentication

### JWT Token
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: `nexspark_secret_key_2024_secure_token_generation` (256+ bits)
- **Expiry**: 24 hours
- **Header**: `Authorization: Bearer <token>`

### Token Payload
```json
{
  "sub": "user@example.com",
  "userId": 123,
  "iat": 1704096000,
  "exp": 1704182400
}
```

### Frontend Token Storage
- Stored in localStorage as `nexspark_token`
- Axios interceptor adds to every request
- Auto-redirect to login on 401 Unauthorized

---

## Key Technologies

### Backend
- **Spring Boot 3.2.0**: Microservices framework
- **Spring Security**: JWT authentication
- **Spring Data JPA**: Database access
- **Spring Kafka**: Event streaming
- **Spring WebSocket**: Real-time communication
- **PostgreSQL 15**: Relational database
- **Redis 7**: Caching and locking
- **Maven**: Build tool
- **Lombok**: Reduce boilerplate code

### Frontend
- **React 18.2.0**: UI library
- **React Router DOM 6**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS 3**: Utility-first CSS
- **WebSocket**: Real-time updates
- **LocalStorage**: Token persistence

### Infrastructure
- **Docker Compose**: Container orchestration
- **Apache Kafka**: Event streaming
- **Zookeeper**: Kafka coordination

---

## Port Allocation

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8080 | Authentication & JWT |
| Booking Service | 8081 | Booking management |
| Availability Service | 8082 | Vehicle availability |
| Payment Service | 8083 | Payment processing |
| Notification Service | 8084 | User notifications |
| WebSocket Service | 8085 | Real-time updates |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Caching & locking |
| Kafka | 9092 | Event streaming |
| Zookeeper | 2181 | Kafka coordination |
| React Frontend | 3000 | User interface |

---

## Production Deployment Checklist

### Backend
- [ ] Update JWT secret key (use environment variable)
- [ ] Configure PostgreSQL with production credentials
- [ ] Set up Redis with authentication
- [ ] Configure Kafka with multiple brokers
- [ ] Enable HTTPS/SSL
- [ ] Set up API Gateway rate limiting
- [ ] Configure CORS for production frontend domain
- [ ] Set up logging (ELK stack or CloudWatch)
- [ ] Configure health checks and monitoring
- [ ] Set up CI/CD pipeline

### Frontend
- [ ] Build production bundle: `npm run build`
- [ ] Update `.env` with production API URLs
- [ ] Enable production error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Enable GZIP compression
- [ ] Set up HTTPS
- [ ] Configure caching headers
- [ ] Optimize images and assets
- [ ] Set up analytics (Google Analytics)

### Infrastructure
- [ ] Deploy Docker containers to cloud (AWS ECS, GCP Cloud Run)
- [ ] Set up managed database (RDS, Cloud SQL)
- [ ] Configure managed Redis (ElastiCache, Cloud Memorystore)
- [ ] Set up managed Kafka (MSK, Confluent Cloud)
- [ ] Configure load balancers
- [ ] Set up auto-scaling
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring and alerting
- [ ] Configure firewall and security groups

---

## Troubleshooting Guide

### Backend Issues

**Issue**: "Port already in use"
```powershell
.\stop-all-services.bat
```

**Issue**: "Database connection failed"
```powershell
docker-compose restart postgres
.\setup-databases.bat
```

**Issue**: "Kafka not available"
```powershell
docker-compose restart kafka zookeeper
```

**Issue**: "Redis connection refused"
```powershell
docker-compose restart redis
```

### Frontend Issues

**Issue**: "Module not found"
```powershell
cd nexspark-frontend
rm -r node_modules
rm package-lock.json
npm install
```

**Issue**: "CORS policy error"
- Add CORS configuration to API Gateway SecurityConfig

**Issue**: "WebSocket connection failed"
- Verify WebSocket service is running on port 8085
- Check `.env` has correct WebSocket URL

**Issue**: "Login redirects back to login"
- Clear localStorage: `localStorage.clear()`
- Check JWT token in browser DevTools → Application → Local Storage

---

## Documentation Files

1. **README.md** - Main project overview
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **API_CHEATSHEET.md** - API endpoint reference
4. **SAMPLE_DATA.md** - Sample data for testing
5. **PROJECT_STRUCTURE.md** - Codebase structure
6. **nexspark-frontend/README.md** - Frontend documentation
7. **nexspark-frontend/STARTUP_GUIDE.md** - Frontend setup guide

---

## Quick Commands Reference

### Daily Startup
```powershell
# 1. Start Docker
docker-compose up -d

# 2. Start backend (wait 10 seconds first)
.\start-all-services.bat

# 3. Start frontend (wait 30 seconds after backend)
cd nexspark-frontend
npm start
```

### Daily Shutdown
```powershell
# 1. Stop frontend: Ctrl+C in terminal

# 2. Stop backend
.\stop-all-services.bat

# 3. Stop Docker
docker-compose down
```

### Testing
```powershell
# Health check
.\check-services.bat

# End-to-end API test
.\test-api.bat

# Build all services
.\build-all-services.bat
```

---

## Success Metrics

✅ **Backend**: 6 microservices running on ports 8080-8085  
✅ **Infrastructure**: PostgreSQL, Redis, Kafka containers healthy  
✅ **Frontend**: React app running on port 3000  
✅ **Integration**: All services communicating via REST APIs and Kafka  
✅ **Real-time**: WebSocket connection established  
✅ **Database**: 5 PostgreSQL databases created and accessible  

**Total Files Created**: 100+ files across backend, frontend, and documentation

---

## Support

For issues or questions:
1. Check service health: `.\check-services.bat`
2. Review logs in CMD windows (backend) or browser console (frontend)
3. Refer to SETUP_GUIDE.md or STARTUP_GUIDE.md
4. Check troubleshooting sections in documentation

---

**Project Complete! 🎉**

You now have a fully functional vehicle rental platform with microservices architecture, real-time updates, and a modern React frontend.
