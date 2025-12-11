import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  confirmBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  getUserBookings: async (userId) => {
    // If userId not provided, get it from localStorage
    if (!userId) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.userId || parsedUser.id;
      }
    }
    if (!userId) {
      throw new Error('User ID not found. Please login again.');
    }
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
};
