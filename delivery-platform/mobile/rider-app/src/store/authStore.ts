import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  token: string | null;
  driverId: string | null;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  driverId: null,
  isAuthenticated: false,

  initialize: async () => {
    const token = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');
    const driverId = await AsyncStorage.getItem('driverId');
    if (token && userStr) {
      set({ user: JSON.parse(userStr), token, driverId, isAuthenticated: true });
    }
  },

  login: async (email: string, password: string) => {
    const mockUser = { id: '1', email, role: 'driver' };
    const mockToken = 'mock-token';
    const mockDriverId = 'driver-123';

    await AsyncStorage.setItem('token', mockToken);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('driverId', mockDriverId);

    set({ user: mockUser, token: mockToken, driverId: mockDriverId, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user', 'driverId']);
    set({ user: null, token: null, driverId: null, isAuthenticated: false });
  },
}));
