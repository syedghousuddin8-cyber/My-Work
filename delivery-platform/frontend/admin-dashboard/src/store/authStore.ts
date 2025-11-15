import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Verify user has admin role
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        set({ isLoading: false });
        return;
      }

      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success('Login successful!');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    toast.success('Logged out successfully');
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
  },
}));
