import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { useWebSocket } from './context/WebSocketContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ToastNotification from './components/ToastNotification';

// Chatbot Components
import ChatBot from './components/Chatbot/ChatBot';
import ChatIcon from './components/Chatbot/ChatIcon';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import BookingDetail from './pages/BookingDetail';
import BookingDetailsView from './pages/BookingDetailsView';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import VehicleTracking from './pages/VehicleTracking';

// WebSocket Message Handler Component
const WebSocketMessageHandler = ({ children }) => {
  const { messages } = useWebSocket();

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      // Display WebSocket messages as toasts using react-hot-toast
      if (latestMessage.type === 'BOOKING_UPDATE') {
        toast(latestMessage.message || 'Booking updated', {
          icon: 'ℹ️',
        });
      } else if (latestMessage.type === 'PAYMENT_UPDATE') {
        toast.success(latestMessage.message || 'Payment processed');
      } else if (latestMessage.message) {
        toast(latestMessage.message, {
          icon: 'ℹ️',
        });
      }
    }
  }, [messages]);

  return children;
};

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <WebSocketProvider>
            <WebSocketMessageHandler>
              <div className="min-h-screen bg-secondary-100">
                <Navbar />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      padding: '16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                <ToastNotification />
                
                {/* Chatbot Components */}
                <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                {!isChatOpen && <ChatIcon onClick={() => setIsChatOpen(true)} />}
                
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking/:vehicleId"
                    element={
                      <ProtectedRoute>
                        <BookingDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking-details/:bookingId"
                    element={
                      <ProtectedRoute>
                        <BookingDetailsView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/:bookingId"
                    element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Vehicle Tracking */}
                  <Route
                    path="/tracking"
                    element={
                      <ProtectedRoute>
                        <VehicleTracking />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    }
                  />

                  {/* Public Information Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Redirect unknown routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </WebSocketMessageHandler>
          </WebSocketProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
