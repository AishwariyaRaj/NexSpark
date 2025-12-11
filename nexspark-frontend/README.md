# NexSpark Vehicle Rentals - Frontend

React.js frontend application for the NexSpark vehicle rental system.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Vehicle Search**: Search available vehicles by date and location
- **Booking Management**: Create, view, and cancel bookings
- **Payment Processing**: Complete payment flow for bookings
- **Real-time Notifications**: WebSocket integration for live updates
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **React 18.2.0**: UI framework
- **React Router DOM 6.20.0**: Client-side routing
- **Axios 1.6.2**: HTTP client for API calls
- **Tailwind CSS 3.3.0**: Utility-first CSS framework
- **WebSocket**: Real-time updates

## Project Structure

```
nexspark-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BookingCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── NotificationItem.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── ToastNotification.jsx
│   │   └── VehicleCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── WebSocketContext.jsx
│   ├── pages/
│   │   ├── BookingDetail.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Payment.jsx
│   │   ├── Register.jsx
│   │   └── Search.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── notificationService.js
│   │   ├── paymentService.js
│   │   └── vehicleService.js
│   ├── utils/
│   │   ├── dateFormatter.js
│   │   ├── tokenStorage.js
│   │   └── websocket.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── .env
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Backend microservices running (API Gateway on port 8080)
- Docker infrastructure (PostgreSQL, Redis, Kafka)

### Installation

1. Navigate to the frontend directory:
```bash
cd nexspark-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Verify environment variables in `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8085
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_BASE_URL | Backend API Gateway URL | http://localhost:8080 |
| REACT_APP_WS_URL | WebSocket service URL | ws://localhost:8085 |

## Usage Flow

### 1. Authentication
- New users register at `/register`
- Existing users login at `/login`
- JWT token stored in localStorage
- Auto-redirect to dashboard on success

### 2. Search Vehicles
- Navigate to `/search`
- Apply filters (date range, location)
- View available vehicles
- Click "Book Now" on desired vehicle

### 3. Create Booking
- Select start and end dates
- Review total cost calculation
- Click "Confirm Booking"
- Redirects to payment page

### 4. Complete Payment
- Review booking summary
- Select payment method
- Click "Pay" button
- Booking status updates to CONFIRMED

### 5. Manage Bookings
- View all bookings at `/my-bookings`
- Filter by status (All, Pending, Confirmed, Cancelled)
- Cancel pending bookings

### 6. Real-time Updates
- WebSocket connection established on login
- Receive live notifications for:
  - Booking status changes
  - Payment confirmations
  - System notifications

## API Integration

All API calls go through the centralized Axios instance (`src/services/api.js`) which:
- Adds JWT token to Authorization header
- Handles 401 unauthorized responses
- Redirects to login on authentication failure

### Service Layer

- **authService**: Login, register, logout
- **vehicleService**: Search, get all, get by ID
- **bookingService**: Create, confirm, cancel, get user bookings
- **paymentService**: Process payment, get payment details
- **notificationService**: Get notifications, mark as read, delete

## Context Providers

### AuthContext
Manages authentication state and provides:
- `user`: Current user object
- `isAuthenticated`: Boolean authentication status
- `login()`: Login function
- `register()`: Register function
- `logout()`: Logout function

### WebSocketContext
Manages WebSocket connection and provides:
- `connected`: Boolean connection status
- `messages`: Array of received messages
- `sendMessage()`: Send message function
- `clearMessages()`: Clear messages function

### ToastContext
Manages toast notifications and provides:
- `toasts`: Array of active toasts
- `showToast()`: Display toast function
- `removeToast()`: Remove toast function

## Component Documentation

### ProtectedRoute
Wrapper component that requires authentication. Redirects to `/login` if user is not authenticated.

### Navbar
Main navigation bar with:
- Logo and branding
- Navigation links (conditional based on auth)
- Notification bell with unread count
- User info and logout button

### VehicleCard
Displays vehicle information:
- Vehicle name, type, location
- Daily rate and status badge
- "Book Now" button

### SearchFilters
Date and location filters:
- Start/end date pickers
- Location dropdown
- Search and reset buttons

### BookingCard
Shows booking details:
- Booking ID and vehicle ID
- Date range and duration
- Total cost and status badge
- Action buttons (view details, cancel)

### NotificationBell
Dropdown notification center:
- Bell icon with unread count badge
- Dropdown list of notifications
- Mark as read / delete actions

### ToastNotification
Toast notification system:
- Success, error, warning, info types
- Auto-dismiss after 5 seconds
- Custom icons per type

## Styling

The application uses **Tailwind CSS** with a custom color palette:

- **Primary (Blue)**: `primary-50` to `primary-900`
- **Secondary (Gray)**: `secondary-50` to `secondary-900`
- **Success (Green)**: `success-50` to `success-900`
- **Warning (Yellow)**: `warning-50` to `warning-900`
- **Danger (Red)**: `danger-50` to `danger-900`

Custom animations defined in `tailwind.config.js`:
- `slide-in`: For toast notifications

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The optimized production build will be in the `build/` directory

3. Deploy the `build/` folder to your hosting service (e.g., Netlify, Vercel, AWS S3)

## Troubleshooting

### Issue: CORS errors
**Solution**: Ensure API Gateway has CORS configuration for `http://localhost:3000`

### Issue: WebSocket connection failed
**Solution**: 
- Verify WebSocket service is running on port 8085
- Check WebSocket URL in `.env`
- Review browser console for connection errors

### Issue: Login redirects back to login
**Solution**:
- Check JWT token in localStorage (`nexspark_token`)
- Verify API Gateway authentication endpoint
- Check browser console for API errors

### Issue: Notifications not working
**Solution**:
- Verify Notification Service is running
- Check Kafka events are being published
- Review WebSocket connection status

## Integration with Backend

### Required Backend Services

1. **API Gateway** (Port 8080)
   - `/api/auth/register` - User registration
   - `/api/auth/login` - User login

2. **Booking Service** (Port 8081)
   - `/api/bookings` - Create booking
   - `/api/bookings/{id}/confirm` - Confirm booking
   - `/api/bookings/user/{userId}` - Get user bookings
   - `/api/bookings/{id}/cancel` - Cancel booking

3. **Availability Service** (Port 8082)
   - `/api/availability/search` - Search vehicles
   - `/api/availability/vehicles` - Get all vehicles
   - `/api/availability/vehicles/{id}` - Get vehicle by ID

4. **Payment Service** (Port 8083)
   - `/api/payments/process` - Process payment
   - `/api/payments/{id}` - Get payment details

5. **Notification Service** (Port 8084)
   - `/api/notifications/user/{userId}` - Get notifications
   - `/api/notifications/{id}/read` - Mark as read
   - `/api/notifications/{id}` - Delete notification

6. **WebSocket Service** (Port 8085)
   - `ws://localhost:8085/ws/bookings` - WebSocket endpoint

## Future Enhancements

- [ ] Add vehicle images
- [ ] Implement actual payment gateway integration
- [ ] Add booking history with pagination
- [ ] Vehicle ratings and reviews
- [ ] Advanced search filters (price range, vehicle type)
- [ ] User profile management
- [ ] Email notifications
- [ ] Booking reminders
- [ ] Dark mode support
- [ ] Multi-language support

## Support

For issues or questions, please refer to the main project README or create an issue in the repository.
