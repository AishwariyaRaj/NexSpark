# 🚀 NexSpark - Quick Command Reference

## Start Everything

### Windows (Batch)
```bash
start-all-services.bat
```

### Windows (PowerShell)
```powershell
.\start-all-services.ps1
```

---

## Individual Services

### Backend Services (Java)
```bash
# API Gateway
cd api-gateway && mvn spring-boot:run

# Booking
cd booking-service && mvn spring-boot:run

# Availability
cd availability-service && mvn spring-boot:run

# Payment
cd payment-service && mvn spring-boot:run

# Notification
cd notification-service && mvn spring-boot:run

# WebSocket
cd websocket-service && mvn spring-boot:run
```

### Frontend & Chatbot (Node.js)
```bash
# Chatbot Service
cd chatbot-service && npm start

# Frontend React App
cd nexspark-frontend && npm start
```

---

## Check Services

```bash
# Check all ports
check-services.bat

# Or manually
netstat -ano | findstr "8080 8081 8082 8083 8084 8085 8086 3000"
```

---

## Stop Services

```bash
# Stop all
stop-all-services.bat

# Or manually close terminals

# Force stop all Node
taskkill /F /IM node.exe

# Force stop all Java
taskkill /F /IM java.exe
```

---

## Quick Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Chatbot UI** | Bottom-right icon | Click to chat |
| API Gateway | http://localhost:8080 | Gateway service |
| Booking API | http://localhost:8081 | Booking endpoints |
| Availability API | http://localhost:8082 | Vehicle search |
| Payment API | http://localhost:8083 | Payment processing |
| Notification API | http://localhost:8084 | Notifications |
| WebSocket | ws://localhost:8085 | Real-time updates |
| Chatbot API | http://localhost:8086 | AI chatbot backend |

---

## Common Tasks

### First Time Setup
```bash
# Install frontend dependencies
cd nexspark-frontend
npm install

# Install chatbot dependencies
cd chatbot-service
npm install

# Build backend services (if needed)
cd api-gateway
mvn clean install
```

### Run Database Only
```bash
docker-compose up -d postgres
```

### Test Chatbot API
```powershell
$body = @{message="Hello"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8086/api/chat" -Method POST -Body $body -ContentType "application/json"
```

### Clear Frontend Cache
```bash
cd nexspark-frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Startup Sequence (Recommended)

1. **Database** → `docker-compose up -d postgres`
2. **Backend Services** → Wait 2-3 min each
3. **Chatbot** → `cd chatbot-service && npm start`
4. **Frontend** → `cd nexspark-frontend && npm start`

---

## Port Reference

| Port | Service | Type |
|------|---------|------|
| 3000 | Frontend | React |
| 8080 | API Gateway | Spring Boot |
| 8081 | Booking | Spring Boot |
| 8082 | Availability | Spring Boot |
| 8083 | Payment | Spring Boot |
| 8084 | Notification | Spring Boot |
| 8085 | WebSocket | Spring Boot |
| 8086 | Chatbot | Node.js |
| 5432 | PostgreSQL | Database |

---

## Troubleshooting Commands

```bash
# Check if port is in use
netstat -ano | findstr :3000

# Kill process by PID
taskkill /F /PID <process_id>

# View all Java processes
tasklist | findstr java

# View all Node processes
tasklist | findstr node

# Check Docker containers
docker ps
```

---

## Quick Test

After starting all services:

```bash
# 1. Open browser
start http://localhost:3000

# 2. Login/Register
# 3. Click chatbot icon (bottom-right)
# 4. Type: "How do I book a vehicle?"
```

---

## Documentation

- 📖 Full Guide: **HOW_TO_RUN.md**
- 🤖 Chatbot Setup: **CHATBOT_QUICK_START.md**
- 🔧 Installation: **SETUP_GUIDE.md**
- 📋 API Reference: **API_CHEATSHEET.md**

---

**💡 Tip:** Keep all terminal windows open while using the app!
