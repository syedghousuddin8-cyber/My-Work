import { apiClient } from './client';

export const vendorAPI = {
  search: async (params: {
    q?: string;
    category?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    priceRange?: string;
    rating?: number;
  }) => {
    const response = await apiClient.get('/vendors/search', { params });
    return response.data;
  },

  getVendor: async (vendorId: string) => {
    const response = await apiClient.get(`/vendors/${vendorId}`);
    return response.data;
  },

  getMenu: async (vendorId: string, filters?: { category?: string }) => {
    const response = await apiClient.get(`/vendors/${vendorId}/menu`, {
      params: filters,
    });
    return response.data;
  },

  getPopularItems: async (vendorId: string) => {
    const response = await apiClient.get(`/vendors/${vendorId}/popular-items`);
    return response.data;
  },

  searchMenuItems: async (query: string, filters?: any) => {
    const response = await apiClient.get('/vendors/menu-items/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },
};
