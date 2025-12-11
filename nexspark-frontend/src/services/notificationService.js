import api from './api';

export const notificationService = {
  getUserNotifications: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  getNotification: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
