# 🚀 Quick Start Guide - Running NexSpark Project

## Prerequisites
- ✅ Java 17+ installed
- ✅ Maven installed
- ✅ Node.js 14+ installed
- ✅ PostgreSQL running (Docker or local)

## Option 1: Start Everything (Recommended)

### Windows
```bash
# Double-click or run:
start-all-services.bat
```

This will open **8 terminal windows**:
1. API Gateway (Port 8080)
2. Booking Service (Port 8081)
3. Availability Service (Port 8082)
4. Payment Service (Port 8083)
5. Notification Service (Port 8084)
6. WebSocket Service (Port 8085)
7. Chatbot Service (Port 8086)
8. Frontend React App (Port 3000)

**Wait Time:**
- Frontend & Chatbot: 30-60 seconds
- Backend Services: 2-3 minutes each

### Check Services Status
```bash
check-services.bat
```

### Stop All Services
```bash
stop-all-services.bat
```

---

## Option 2: Manual Start (Step by Step)

### Step 1: Start Database (if not running)
```bash
docker-compose up -d postgres
```

### Step 2: Start Backend Services
Open separate terminals for each:

```bash
# Terminal 1: API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 2: Booking Service
cd booking-service
mvn spring-boot:run

# Terminal 3: Availability Service
cd availability-service
mvn spring-boot:run

# Terminal 4: Payment Service
cd payment-service
mvn spring-boot:run

# Terminal 5: Notification Service
cd notification-service
mvn spring-boot:run

# Terminal 6: WebSocket Service
cd websocket-service
mvn spring-boot:run
```

### Step 3: Start Chatbot Service
```bash
# Terminal 7: Chatbot Service
cd chatbot-service
npm start
```

### Step 4: Start Frontend
```bash
# Terminal 8: Frontend
cd nexspark-frontend
npm start
```

---

## Option 3: Start Only Frontend + Chatbot (Quick Testing)

If backend services are already running:

```bash
# Terminal 1: Chatbot
cd chatbot-service
npm start

# Terminal 2: Frontend
cd nexspark-frontend
npm start
```

---

## Accessing the Application

### Frontend
- **URL:** http://localhost:3000
- **Features:** 
  - Home page
  - Login/Register
  - Vehicle search
  - Booking system
  - **Chatbot** (bottom-right corner) 🤖

### Backend APIs
- **API Gateway:** http://localhost:8080
- **Booking API:** http://localhost:8081
- **Availability API:** http://localhost:8082
- **Payment API:** http://localhost:8083
- **Notification API:** http://localhost:8084
- **WebSocket:** ws://localhost:8085
- **Chatbot API:** http://localhost:8086

### Chatbot
- **Click the blue chat icon** at the bottom-right
- Try messages like:
  - "How do I book a vehicle?"
  - "What types of vehicles do you have?"
  - "Tell me about pricing"

---

## Startup Order (Best Practice)

1. **Database First** (PostgreSQL)
2. **Backend Services** (wait 2-3 min for each)
3. **Chatbot Service** (waits 10 seconds)
4. **Frontend** (last, so all APIs are ready)

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using a port
netstat -ano | findstr :3000

# Kill process
taskkill /F /PID <process_id>
```

### Backend Not Starting
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart postgres
```

### Chatbot Not Responding
```bash
# Check if service is running
netstat -ano | findstr :8086

# Restart chatbot
cd chatbot-service
npm start
```

### Frontend Build Errors
```bash
# Clear and reinstall
cd nexspark-frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Test

After starting all services:

1. Open http://localhost:3000
2. Click **Sign In** (or Register)
3. Try the **Search** feature
4. Click the **Chatbot icon** 🤖
5. Send a message: "What can you help me with?"

---

## Stopping Services

### Stop All (Windows)
```bash
stop-all-services.bat
```

### Stop Individual Service
- Close the terminal window
- Or press `Ctrl+C` in the terminal

### Force Stop All Node Processes
```bash
taskkill /F /IM node.exe
```

### Force Stop All Java Processes
```bash
taskkill /F /IM java.exe
```

---

## Service Health Checks

```bash
# Backend Services
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health

# Chatbot Service
curl http://localhost:8086/api/health

# Frontend
curl http://localhost:3000
```

---

## Tips

✅ **Start services in order** (database → backend → chatbot → frontend)  
✅ **Wait for each service** to fully start before the next  
✅ **Check logs** in each terminal window for errors  
✅ **Use check-services.bat** to verify all ports are listening  
✅ **Keep terminals open** while using the app  

---

## Need Help?

- **Installation Issues:** See CHATBOT_INSTALLATION.md
- **Chatbot Issues:** See CHATBOT_INTEGRATION_GUIDE.md
- **Backend Issues:** See SETUP_GUIDE.md
- **API Reference:** See API_CHEATSHEET.md

---

**🎉 Happy Developing!**
