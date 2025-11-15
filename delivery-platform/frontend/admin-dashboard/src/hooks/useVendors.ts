import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  isOnline: boolean;
  rating: number;
  totalOrders: number;
  revenue: number;
  address: string;
  createdAt: string;
}

interface VendorsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

async function fetchVendors(params: VendorsParams) {
  const response = await api.get('/api/v1/vendors', { params });
  return response.data;
}

async function fetchVendorById(id: string): Promise<Vendor> {
  const response = await api.get(`/api/v1/vendors/${id}`);
  return response.data;
}

async function updateVendorStatus(id: string, status: string) {
  const response = await api.patch(`/api/v1/admin/vendors/${id}/status`, { status });
  return response.data;
}

async function blockVendor(id: string, reason: string) {
  const response = await api.post(`/api/v1/admin/vendors/${id}/block`, { reason });
  return response.data;
}

export function useVendors(params: VendorsParams = {}) {
  return useQuery({
    queryKey: ['vendors', params],
    queryFn: () => fetchVendors(params),
    keepPreviousData: true,
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: () => fetchVendorById(id),
    enabled: !!id,
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update vendor status');
    },
  });
}

export function useBlockVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      blockVendor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block vendor');
    },
  });
}
