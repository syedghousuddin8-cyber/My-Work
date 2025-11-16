import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  driverId?: string;
  driverName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchOrders(params: OrdersParams): Promise<OrdersResponse> {
  const response = await api.get('/api/v1/admin/orders', { params });
  return response.data;
}

async function fetchOrderById(id: string): Promise<Order> {
  const response = await api.get(`/api/v1/admin/orders/${id}`);
  return response.data;
}

async function cancelOrder(id: string, reason: string) {
  const response = await api.post(`/api/v1/admin/orders/${id}/cancel`, { reason });
  return response.data;
}

async function refundOrder(id: string, amount?: number) {
  const response = await api.post(`/api/v1/admin/orders/${id}/refund`, { amount });
  return response.data;
}

export function useOrders(params: OrdersParams = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => fetchOrders(params),
    keepPreviousData: true,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel order');
    },
  });
}

export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount?: number }) =>
      refundOrder(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Refund processed successfully');
    },
    onError: () => {
      toast.error('Failed to process refund');
    },
  });
}
