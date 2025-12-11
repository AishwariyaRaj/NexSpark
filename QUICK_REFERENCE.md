# NexSpark - Quick Reference Card

## 🚀 Daily Startup (3 Commands)

```powershell
# 1. Start Docker (Terminal 1)
cd d:\NM_Task
docker-compose up -d

# 2. Start Backend (Terminal 2) - Wait 10 seconds after step 1
.\start-all-services.bat

# 3. Start Frontend (Terminal 3) - Wait 30 seconds after step 2
cd nexspark-frontend
npm start
```

**Result**: 
- Backend: 6 services running on ports 8080-8085
- Frontend: React app at http://localhost:3000
- Infrastructure: PostgreSQL, Redis, Kafka ready

---

## 🛑 Daily Shutdown (3 Commands)

```powershell
# 1. Stop Frontend: Ctrl+C in npm start terminal

# 2. Stop Backend
cd d:\NM_Task
.\stop-all-services.bat

# 3. Stop Docker
docker-compose down
```

---

## 🔍 Health Check

```powershell
cd d:\NM_Task
.\check-services.bat
```

Expected output:
```
✅ API Gateway (8080): OK
✅ Booking Service (8081): OK
✅ Availability Service (8082): OK
✅ Payment Service (8083): OK
✅ Notification Service (8084): OK
✅ WebSocket Service (8085): OK
✅ PostgreSQL: Running
✅ Redis: Running
✅ Kafka: Running
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│                  http://localhost:3000                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ HTTP + WebSocket
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (8080)                         │
│                   Authentication + JWT                        │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Booking    │   │ Availability │   │   Payment    │
│  Service     │   │   Service    │   │   Service    │
│   (8081)     │   │    (8082)    │   │   (8083)     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│Notification  │   │  WebSocket   │   │    Kafka     │
│  Service     │   │   Service    │   │   (9092)     │
│   (8084)     │   │   (8085)     │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  PostgreSQL  │   │    Redis     │   │  Zookeeper   │
│   (5432)     │   │   (6379)     │   │   (2181)     │
│  5 Databases │   │ Cache + Lock │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## 🎯 User Journey (6 Steps)

1. **Register**: `/register` → Enter email/password → Click "Create Account"
2. **Login**: `/login` → Enter credentials → Redirected to dashboard
3. **Search**: `/search` → Set dates/location → View available vehicles
4. **Book**: Click "Book Now" → Select dates → "Confirm Booking"
5. **Pay**: Review summary → Select payment → Click "Pay"
6. **Manage**: `/my-bookings` → View bookings → Cancel if needed

---

## 🌐 API Endpoints

### Authentication (8080)
- POST `/auth/register` - Register user
- POST `/auth/login` - Login (returns JWT)

### Vehicles (8082)
- GET `/api/availability/search?startDate=&endDate=&location=` - Search
- GET `/api/availability/vehicles` - Get all
- GET `/api/availability/vehicles/{id}` - Get by ID

### Bookings (8081)
- POST `/api/bookings` - Create booking
- POST `/api/bookings/{id}/confirm` - Confirm
- GET `/api/bookings/user/{userId}` - Get user bookings
- PUT `/api/bookings/{id}/cancel` - Cancel

### Payments (8083)
- POST `/api/payments/process` - Process payment
- GET `/api/payments/{id}` - Get payment

### Notifications (8084)
- GET `/api/notifications/user/{userId}` - Get notifications
- PUT `/api/notifications/{id}/read` - Mark as read
- DELETE `/api/notifications/{id}` - Delete

### WebSocket (8085)
- WS `/ws/bookings` - Real-time connection

---

## 💾 Databases

| Database | Service | Purpose |
|----------|---------|---------|
| auth_db | API Gateway | User accounts |
| booking_db | Booking | Booking records |
| availability_db | Availability | Vehicles & availability |
| payment_db | Payment | Payment transactions |
| notification_db | Notification | User notifications |

**Credentials**: User: `postgres`, Password: `postgres123`

---

## 🔐 Security

- **JWT Tokens**: 24-hour expiry
- **Password**: BCrypt hashed
- **Storage**: localStorage (`nexspark_token`, `nexspark_user`)
- **Header**: `Authorization: Bearer <token>`

---

## 📦 Tech Stack

### Backend
- Spring Boot 3.2.0
- Spring Security + JWT
- PostgreSQL 15
- Redis 7
- Apache Kafka 3.5

### Frontend
- React 18.2.0
- React Router DOM 6
- Axios 1.6.2
- Tailwind CSS 3.3.0

---

## 🔧 Troubleshooting

### Backend Won't Start
```powershell
# Stop all services
.\stop-all-services.bat

# Restart Docker
docker-compose down
docker-compose up -d

# Wait 10 seconds, then start backend
.\start-all-services.bat
```

### Frontend Errors
```powershell
cd nexspark-frontend
rm -r node_modules
npm install
npm start
```

### Database Issues
```powershell
docker-compose restart postgres
.\setup-databases.bat
```

### Redis/Kafka Issues
```powershell
docker-compose restart redis kafka zookeeper
```

---

## 📁 Project Structure

```
d:\NM_Task\
├── api-gateway\              # Auth service (8080)
├── booking-service\          # Booking management (8081)
├── availability-service\     # Vehicle search (8082)
├── payment-service\          # Payments (8083)
├── notification-service\     # Notifications (8084)
├── websocket-service\        # Real-time updates (8085)
├── nexspark-frontend\        # React app (3000)
│   ├── src\
│   │   ├── components\       # UI components
│   │   ├── pages\            # Full pages
│   │   ├── services\         # API calls
│   │   ├── context\          # State management
│   │   └── utils\            # Helpers
│   └── public\
├── docker-compose.yml        # Infrastructure
├── start-all-services.bat    # Start backend
├── stop-all-services.bat     # Stop backend
├── check-services.bat        # Health check
└── manage-project.bat        # Interactive menu
```

---

## 🎨 Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/login` | Login form | No |
| `/register` | Registration | No |
| `/dashboard` | User dashboard | Yes |
| `/search` | Vehicle search | Yes |
| `/booking/:vehicleId` | Booking form | Yes |
| `/payment/:bookingId` | Payment page | Yes |
| `/my-bookings` | Booking list | Yes |

---

## ⚡ Quick Commands

```powershell
# Build all backend services
.\build-all-services.bat

# Test all APIs
.\test-api.bat

# Interactive menu
.\manage-project.bat

# Frontend build
cd nexspark-frontend
npm run build

# View Docker logs
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f kafka
```

---

## 📚 Documentation

1. **README.md** - Project overview
2. **SETUP_GUIDE.md** - Backend setup
3. **COMPLETE_SUMMARY.md** - Full system documentation
4. **nexspark-frontend/README.md** - Frontend overview
5. **nexspark-frontend/STARTUP_GUIDE.md** - Frontend setup

---

## 🎉 Success Checklist

- [x] 6 Spring Boot microservices running
- [x] React frontend accessible at localhost:3000
- [x] PostgreSQL with 5 databases created
- [x] Redis caching and locking operational
- [x] Kafka event streaming working
- [x] WebSocket real-time updates active
- [x] JWT authentication functional
- [x] End-to-end booking flow tested

---

## 🆘 Support

**Check logs**: Look at CMD windows from `start-all-services.bat`  
**Browser console**: F12 → Console (for frontend errors)  
**Health check**: `.\check-services.bat`  
**Restart**: Stop all → Start all

---

**Quick Access URLs**:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Backend Health: http://localhost:8080/actuator/health

---

**Keep this card handy for daily operations! 📌**
