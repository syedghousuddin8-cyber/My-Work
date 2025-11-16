import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, Loader2, DollarSign, Percent, Clock, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/api/v1/admin/settings');
      return response.data;
    },
  });

  const [formData, setFormData] = useState({
    platformFeePercent: settings?.platformFeePercent || 10,
    deliveryBaseFee: settings?.deliveryBaseFee || 5,
    deliveryFeePerKm: settings?.deliveryFeePerKm || 1.5,
    taxPercent: settings?.taxPercent || 8,
    minOrderAmount: settings?.minOrderAmount || 10,
    maxDeliveryRadius: settings?.maxDeliveryRadius || 20,
    autoApproveVendors: settings?.autoApproveVendors || false,
    autoApproveDrivers: settings?.autoApproveDrivers || false,
    enableSurgepricing: settings?.enableSurgepricing || false,
    surgePricingMultiplier: settings?.surgePricingMultiplier || 1.5,
  });

  const updateSettings = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.put('/api/v1/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform-wide settings and policies</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pricing Settings */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Pricing Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Fee (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="input w-full pl-10"
                  value={formData.platformFeePercent}
                  onChange={(e) =>
                    setFormData({ ...formData, platformFeePercent: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Percentage charged on each order
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="input w-full pl-10"
                  value={formData.taxPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, taxPercent: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tax percentage applied to orders
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Base Fee ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="input w-full pl-10"
                  value={formData.deliveryBaseFee}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryBaseFee: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Flat delivery fee for all orders
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee per KM ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="input w-full pl-10"
                  value={formData.deliveryFeePerKm}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryFeePerKm: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Additional fee per kilometer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="input w-full pl-10"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum order value required
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Delivery Radius (KM)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step="1"
                  min="1"
                  className="input w-full pl-10"
                  value={formData.maxDeliveryRadius}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDeliveryRadius: parseFloat(e.target.value) })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum delivery distance allowed
              </p>
            </div>
          </div>
        </div>

        {/* Surge Pricing */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Surge Pricing</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Enable Surge Pricing
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically increase prices during peak demand
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.enableSurgepricing}
                  onChange={(e) =>
                    setFormData({ ...formData, enableSurgepricing: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {formData.enableSurgepricing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surge Pricing Multiplier
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="input w-full"
                  value={formData.surgePricingMultiplier}
                  onChange={(e) =>
                    setFormData({ ...formData, surgePricingMultiplier: parseFloat(e.target.value) })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Price multiplier during surge (e.g., 1.5x = 50% increase)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Approval Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Auto-Approve Vendors
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically approve vendor registrations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.autoApproveVendors}
                  onChange={(e) =>
                    setFormData({ ...formData, autoApproveVendors: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Auto-Approve Drivers
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically approve driver registrations after document verification
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.autoApproveDrivers}
                  onChange={(e) =>
                    setFormData({ ...formData, autoApproveDrivers: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
