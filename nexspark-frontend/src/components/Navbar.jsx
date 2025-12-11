import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/>
              </svg>
              <span className="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                NexSpark
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/search" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Search</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  My Bookings
                </Link>

                {/* Notification Bell */}
                <NotificationBell />

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">{user?.firstName ? `${user.firstName}` : user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
