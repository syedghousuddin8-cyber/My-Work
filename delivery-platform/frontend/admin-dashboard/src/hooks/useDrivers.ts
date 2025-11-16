import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  documentsVerified: boolean;
  createdAt: string;
}

interface DriversParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface DriversResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchDrivers(params: DriversParams): Promise<DriversResponse> {
  const response = await api.get('/api/v1/drivers', { params });
  return response.data;
}

async function fetchDriverById(id: string): Promise<Driver> {
  const response = await api.get(`/api/v1/drivers/${id}`);
  return response.data;
}

async function updateDriverStatus(id: string, status: string) {
  const response = await api.patch(`/api/v1/admin/drivers/${id}/status`, { status });
  return response.data;
}

async function blockDriver(id: string, reason: string) {
  const response = await api.post(`/api/v1/admin/drivers/${id}/block`, { reason });
  return response.data;
}

async function verifyDocuments(id: string) {
  const response = await api.post(`/api/v1/admin/drivers/${id}/verify-documents`);
  return response.data;
}

export function useDrivers(params: DriversParams = {}) {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => fetchDrivers(params),
    keepPreviousData: true,
  });
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => fetchDriverById(id),
    enabled: !!id,
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateDriverStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update driver status');
    },
  });
}

export function useBlockDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      blockDriver(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block driver');
    },
  });
}

export function useVerifyDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => verifyDocuments(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Documents verified successfully');
    },
    onError: () => {
      toast.error('Failed to verify documents');
    },
  });
}
