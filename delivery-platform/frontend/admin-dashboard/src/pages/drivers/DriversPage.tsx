import { useState } from 'react';
import { useDrivers, useUpdateDriverStatus, useBlockDriver, useVerifyDocuments } from '@/hooks/useDrivers';
import { formatCurrency, formatDate, getStatusColor, cn, debounce } from '@/lib/utils';
import {
  Search,
  Filter,
  Check,
  X,
  Ban,
  Star,
  Car,
  FileCheck,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDrivers({
    page,
    limit: 20,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
  });

  const updateStatus = useUpdateDriverStatus();
  const blockDriver = useBlockDriver();
  const verifyDocuments = useVerifyDocuments();

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleApprove = (driverId: string) => {
    if (window.confirm('Are you sure you want to approve this driver?')) {
      updateStatus.mutate({ id: driverId, status: 'approved' });
    }
  };

  const handleReject = (driverId: string) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      updateStatus.mutate({ id: driverId, status: 'rejected' });
    }
  };

  const handleBlock = (driverId: string) => {
    const reason = window.prompt('Please provide a reason for blocking this driver:');
    if (reason) {
      blockDriver.mutate({ id: driverId, reason });
    }
  };

  const handleVerifyDocuments = (driverId: string) => {
    if (window.confirm('Are you sure you want to verify the documents for this driver?')) {
      verifyDocuments.mutate(driverId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <p className="text-gray-600 mt-1">Manage driver registrations and verifications</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers by name, email, or phone..."
              className="input w-full pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="input pl-10 pr-10"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : data?.drivers?.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No drivers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.drivers?.map((driver: any) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{driver.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {driver.email}
                        </div>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {driver.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <Car className="w-3 h-3 mr-1 text-gray-400" />
                          {driver.vehicleType}
                        </div>
                        <div className="text-gray-500 mt-1">{driver.vehicleNumber}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          License: {driver.licenseNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {driver.documentsVerified ? (
                        <div className="flex items-center text-sm text-green-600">
                          <FileCheck className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900">
                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                          {driver.rating?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {driver.totalDeliveries || 0} deliveries
                        </div>
                        <div className="font-medium text-gray-900 mt-1">
                          {formatCurrency(driver.earnings || 0)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={cn(
                            'inline-block px-2 py-1 text-xs font-medium rounded-full',
                            getStatusColor(driver.status)
                          )}
                        >
                          {driver.status}
                        </span>
                        {driver.isOnline && driver.status === 'approved' && (
                          <div className="flex items-center text-xs text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            Online
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(driver.createdAt, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!driver.documentsVerified && driver.status === 'pending' && (
                          <button
                            onClick={() => handleVerifyDocuments(driver.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Verify Documents"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                        )}
                        {driver.status === 'pending' && driver.documentsVerified && (
                          <>
                            <button
                              onClick={() => handleApprove(driver.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(driver.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {driver.status === 'approved' && (
                          <button
                            onClick={() => handleBlock(driver.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Block"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)} of{' '}
              {data.pagination.total} drivers
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
