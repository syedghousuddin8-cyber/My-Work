import { apiClient } from './client';

export const orderAPI = {
  createOrder: async (orderData: {
    vendorId: string;
    items: any[];
    deliveryAddress: any;
    paymentMethod: string;
    scheduledFor?: Date;
  }) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (userId: string, params?: { status?: string; limit?: number }) => {
    const response = await apiClient.get(`/orders/user/${userId}`, { params });
    return response.data;
  },

  cancelOrder: async (orderId: string, reason: string) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  trackOrder: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  rateOrder: async (orderId: string, ratings: {
    vendorRating: number;
    driverRating: number;
    vendorReview?: string;
    driverReview?: string;
  }) => {
    const response = await apiClient.post(`/orders/${orderId}/rate`, ratings);
    return response.data;
  },
};
