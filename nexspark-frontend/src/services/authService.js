import api from './api';
import { saveToken, saveUser, getUser, removeToken, removeUser, getToken } from '../utils/tokenStorage';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, userId, email: userEmail, firstName, lastName } = response.data;

    // Store token and user info
    saveToken(token);
    saveUser({ userId, email: userEmail || email, firstName, lastName });

    return response.data;
  },

  logout: () => {
    removeToken();
    removeUser();
  },

  getCurrentUser: () => {
    return getUser();
  },

  isAuthenticated: () => {
    return !!getToken();
  },
};
