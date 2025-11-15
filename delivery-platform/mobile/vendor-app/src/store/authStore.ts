import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  token: string | null;
  vendorId: string | null;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  vendorId: null,
  isAuthenticated: false,

  initialize: async () => {
    const token = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');
    const vendorId = await AsyncStorage.getItem('vendorId');

    if (token && userStr) {
      set({ user: JSON.parse(userStr), token, vendorId, isAuthenticated: true });
    }
  },

  login: async (email: string, password: string) => {
    // Mock login - replace with actual API call
    const mockUser = { id: '1', email, role: 'vendor' };
    const mockToken = 'mock-token';
    const mockVendorId = 'vendor-123';

    await AsyncStorage.setItem('token', mockToken);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('vendorId', mockVendorId);

    set({ user: mockUser, token: mockToken, vendorId: mockVendorId, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user', 'vendorId']);
    set({ user: null, token: null, vendorId: null, isAuthenticated: false });
  },
}));
