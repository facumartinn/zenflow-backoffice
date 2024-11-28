'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, UserCheck, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getDrivers, createDriver, updateDriverStatus } from '@/services/drivers';
import { toast } from 'react-hot-toast';
import { Database } from '@/types/supabase';

type Driver = Database['public']['Tables']['drivers']['Row'];
type DriverInsert = Database['public']['Tables']['drivers']['Insert'];

export default function DriversPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: getDrivers,
  });

  const createDriverMutation = useMutation({
    mutationFn: (data: Omit<DriverInsert, 'id' | 'created_at'>) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setShowCreateModal(false);
      toast.success('Driver created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create driver');
    },
  });

  const updateDriverStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Driver['status'] }) =>
      updateDriverStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update driver status');
    },
  });

  const filteredDrivers = drivers?.filter(driver =>
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Drivers</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Driver
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredDrivers?.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {driver.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{driver.email}</div>
                    <div className="text-sm text-muted-foreground">{driver.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {driver.license_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {driver.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <button
                      onClick={() =>
                        updateDriverStatusMutation.mutate({
                          id: driver.id,
                          status: driver.status === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE',
                        })
                      }
                      className="text-primary hover:text-primary/80"
                    >
                      {driver.status === 'AVAILABLE' ? (
                        <UserX className="h-5 w-5" />
                      ) : (
                        <UserCheck className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateDriverModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createDriverMutation.mutate(data)}
        />
      )}
    </div>
  );
}

function CreateDriverModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<DriverInsert, 'id' | 'created_at'>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<DriverInsert, 'id' | 'created_at'>>();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border shadow-lg">
        <h3 className="text-lg font-medium text-foreground mb-4">Add New Driver</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              {...register('full_name', { required: 'Full name is required' })}
              className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              License Number
            </label>
            <input
              type="text"
              {...register('license_number', {
                required: 'License number is required',
              })}
              className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.license_number && (
              <p className="mt-1 text-sm text-destructive">
                {errors.license_number.message}
              </p>
            )}
          </div>

          <div className="mt-5 sm:mt-6 space-x-3">
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Driver
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}