import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  activeVendors: number;
  vendorsChange: number;
  activeDrivers: number;
  driversChange: number;
  pendingApprovals: {
    vendors: number;
    drivers: number;
  };
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  vendorName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/api/v1/admin/stats');
  return response.data;
}

async function fetchRecentOrders(): Promise<RecentOrder[]> {
  const response = await api.get('/api/v1/admin/orders/recent?limit=10');
  return response.data;
}

async function fetchRevenueChart(days: number = 7): Promise<RevenueData[]> {
  const response = await api.get(`/api/v1/admin/analytics/revenue?days=${days}`);
  return response.data;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: fetchRecentOrders,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

export function useRevenueChart(days: number = 7) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => fetchRevenueChart(days),
    refetchInterval: 60000, // Refetch every minute
  });
}
