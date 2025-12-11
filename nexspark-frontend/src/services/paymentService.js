import api from './api';

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  getPaymentsByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  refundPayment: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/refund`);
    return response.data;
  },
};
