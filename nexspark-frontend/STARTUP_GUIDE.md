# NexSpark Frontend - Quick Start Guide

## Complete Setup Instructions

### Step 1: Install Node.js (if not already installed)
1. Download Node.js 16+ from https://nodejs.org/
2. Run the installer and follow the prompts
3. Verify installation:
```powershell
node --version
npm --version
```

### Step 2: Install Frontend Dependencies
```powershell
cd d:\NM_Task\nexspark-frontend
npm install
```

This will install all required packages:
- react & react-dom (18.2.0)
- react-router-dom (6.20.0)
- axios (1.6.2)
- tailwindcss (3.3.0)
- autoprefixer & postcss

**Expected output**: Dependencies installed successfully in `node_modules/` folder

### Step 3: Verify Backend is Running
Before starting the frontend, ensure all backend services are running:

```powershell
# Start Docker infrastructure (from d:\NM_Task)
cd d:\NM_Task
docker-compose up -d

# Start all Spring Boot microservices
.\start-all-services.bat
```

**Wait 30-60 seconds** for all services to start.

Verify services are running:
```powershell
.\check-services.bat
```

You should see:
- ✅ API Gateway: http://localhost:8080
- ✅ Booking Service: http://localhost:8081
- ✅ Availability Service: http://localhost:8082
- ✅ Payment Service: http://localhost:8083
- ✅ Notification Service: http://localhost:8084
- ✅ WebSocket Service: http://localhost:8085

### Step 4: Start Frontend Development Server
```powershell
cd d:\NM_Task\nexspark-frontend
npm start
```

**Expected output**:
```
Compiled successfully!

You can now view nexspark-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The browser will automatically open to `http://localhost:3000`

### Step 5: Test the Application

#### 5.1 Register a New User
1. Click "Register" or "Get Started"
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. You'll be redirected to the login page

#### 5.2 Login
1. Enter credentials:
   - Email: john@example.com
   - Password: password123
2. Click "Sign in"
3. You'll be redirected to the Dashboard

#### 5.3 Search for Vehicles
1. Click "Search Vehicles" in the navigation bar
2. Fill in search filters:
   - Start Date: Tomorrow's date
   - End Date: 3 days from tomorrow
   - Location: New York (or leave empty for all)
3. Click "Search Vehicles"
4. View available vehicles

#### 5.4 Create a Booking
1. Click "Book Now" on any available vehicle
2. Select start and end dates
3. Review the total cost calculation
4. Click "Confirm Booking"
5. You'll be redirected to the payment page

#### 5.5 Complete Payment
1. Review booking summary
2. Select a payment method (e.g., Credit Card)
3. Click "Pay $XXX.XX"
4. Payment will be processed automatically (MVP mode)
5. Booking status updates to CONFIRMED
6. You'll be redirected to "My Bookings"

#### 5.6 View Bookings
1. Go to "My Bookings" in navigation
2. See all your bookings with status badges
3. Filter by status: All / Pending / Confirmed / Cancelled
4. Click "Cancel" on pending bookings if needed

#### 5.7 Check Notifications
1. Click the bell icon in the navigation bar
2. See notifications for:
   - Booking created
   - Payment processed
   - Booking confirmed
3. Click "Mark as Read" or "Delete"

#### 5.8 Test Real-time Updates
1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see: "WebSocket connected"
4. Create a new booking
5. Watch for real-time toast notifications

## Daily Startup Commands

### Full Stack Startup (Backend + Frontend)

**Option 1: Using provided scripts**
```powershell
# Terminal 1: Start infrastructure
cd d:\NM_Task
docker-compose up -d

# Terminal 2: Start backend services
.\start-all-services.bat

# Terminal 3: Start frontend (wait 30 seconds after backend)
cd nexspark-frontend
npm start
```

**Option 2: Manual step-by-step**
```powershell
# 1. Start Docker
docker-compose up -d

# 2. Wait for Docker containers to be healthy
timeout /t 10

# 3. Start backend (opens 6 CMD windows)
.\start-all-services.bat

# 4. Wait for services to initialize
timeout /t 30

# 5. Start frontend
cd nexspark-frontend
npm start
```

## Stopping the Application

### Stop Frontend
In the terminal where `npm start` is running:
- Press `Ctrl + C`
- Confirm with `Y`

### Stop Backend Services
```powershell
cd d:\NM_Task
.\stop-all-services.bat
```

### Stop Docker Infrastructure
```powershell
docker-compose down
```

## Troubleshooting

### Issue 1: "Module not found" errors
**Solution:**
```powershell
cd d:\NM_Task\nexspark-frontend
rm -r node_modules
rm package-lock.json
npm install
```

### Issue 2: "Port 3000 is already in use"
**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
set PORT=3001
npm start
```

### Issue 3: "CORS policy" errors in browser console
**Cause:** API Gateway CORS not configured for localhost:3000

**Solution:**
Add to `api-gateway/src/main/java/com/nexspark/gateway/config/SecurityConfig.java`:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:3000");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Issue 4: "Failed to fetch" or network errors
**Check backend services:**
```powershell
.\check-services.bat
```

All services should return "OK" or "UP"

If any service is down:
```powershell
# Restart all services
.\stop-all-services.bat
.\start-all-services.bat
```

### Issue 5: WebSocket connection failed
**Symptoms:** No real-time notifications, console shows WebSocket error

**Solution:**
1. Verify WebSocket service is running:
```powershell
curl http://localhost:8085/actuator/health
```

2. Check `.env` file:
```
REACT_APP_WS_URL=ws://localhost:8085
```

3. Restart WebSocket service

### Issue 6: Login works but immediately logs out
**Cause:** JWT token not being stored or retrieved correctly

**Solution:**
1. Open browser DevTools → Application → Local Storage
2. Check for `nexspark_token` and `nexspark_user` keys
3. If missing, check browser console for errors
4. Clear local storage and try again:
```javascript
localStorage.clear()
```

### Issue 7: Blank page after npm start
**Solution:**
1. Check browser console (F12) for errors
2. Verify all files are created:
```powershell
ls src\
ls src\components\
ls src\pages\
ls src\services\
ls src\context\
ls src\utils\
```

3. Try clearing React cache:
```powershell
rm -r node_modules/.cache
npm start
```

## Project Structure Overview

```
nexspark-frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BookingCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── NotificationItem.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── ToastNotification.jsx
│   │   └── VehicleCard.jsx
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── ToastContext.jsx    # Toast notifications
│   │   └── WebSocketContext.jsx # WebSocket connection
│   ├── pages/                  # Full page components
│   │   ├── BookingDetail.jsx   # Vehicle booking page
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page
│   │   ├── MyBookings.jsx     # User's bookings list
│   │   ├── Payment.jsx        # Payment processing
│   │   ├── Register.jsx       # Registration page
│   │   └── Search.jsx         # Vehicle search
│   ├── services/               # API integration layer
│   │   ├── api.js             # Axios instance
│   │   ├── authService.js     # Authentication APIs
│   │   ├── bookingService.js  # Booking APIs
│   │   ├── notificationService.js # Notification APIs
│   │   ├── paymentService.js  # Payment APIs
│   │   └── vehicleService.js  # Vehicle APIs
│   ├── utils/                  # Utility functions
│   │   ├── dateFormatter.js   # Date/currency formatters
│   │   ├── tokenStorage.js    # LocalStorage helpers
│   │   └── websocket.js       # WebSocket client
│   ├── App.jsx                 # Main app component with routing
│   ├── index.jsx              # React entry point
│   └── index.css              # Global styles
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                   # Documentation
```

## Environment Configuration

### .env File
Located at: `d:\NM_Task\nexspark-frontend\.env`

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8085
```

**Important:**
- All environment variables must start with `REACT_APP_`
- Restart development server after changing `.env`
- Never commit sensitive data to `.env`

## API Endpoints Reference

### Authentication (API Gateway - 8080)
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user

### Vehicles (Availability Service - 8082)
- GET `/api/availability/vehicles` - Get all vehicles
- GET `/api/availability/vehicles/{id}` - Get vehicle by ID
- GET `/api/availability/search?startDate=&endDate=&location=` - Search vehicles

### Bookings (Booking Service - 8081)
- POST `/api/bookings` - Create booking
- POST `/api/bookings/{id}/confirm` - Confirm booking
- GET `/api/bookings/user/{userId}` - Get user bookings
- PUT `/api/bookings/{id}/cancel` - Cancel booking

### Payments (Payment Service - 8083)
- POST `/api/payments/process` - Process payment
- GET `/api/payments/{id}` - Get payment by ID
- GET `/api/payments/booking/{bookingId}` - Get payment by booking

### Notifications (Notification Service - 8084)
- GET `/api/notifications/user/{userId}` - Get user notifications
- PUT `/api/notifications/{id}/read` - Mark as read
- DELETE `/api/notifications/{id}` - Delete notification

### WebSocket (WebSocket Service - 8085)
- WS `/ws/bookings` - Real-time updates connection

## Performance Tips

### Development Mode
- Uses unoptimized builds with hot reloading
- Slower than production but better for debugging
- Source maps enabled

### Production Build
```powershell
npm run build
```
- Creates optimized build in `build/` folder
- Minified and bundled
- Ready for deployment

### Caching
- React automatically caches between reloads
- API calls cached in browser
- WebSocket reconnects automatically

## Next Steps

After successful setup:

1. **Explore the codebase**
   - Read component files in `src/components/`
   - Understand service layer in `src/services/`
   - Review context providers in `src/context/`

2. **Customize the application**
   - Update colors in `tailwind.config.js`
   - Modify API endpoints in service files
   - Add new components or pages

3. **Add features**
   - Vehicle images
   - User profile editing
   - Booking history pagination
   - Advanced search filters
   - Reviews and ratings

4. **Deploy to production**
   - Build optimized version: `npm run build`
   - Deploy `build/` folder to hosting service
   - Update `.env` with production API URLs
   - Configure CORS on production backend

## Support & Resources

- **React Documentation**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Axios**: https://axios-http.com/docs/intro

For project-specific issues, refer to the main README.md or backend documentation.

---

**Happy Coding! 🚀**
