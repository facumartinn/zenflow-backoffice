import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutes, createRoute } from '../services/routes';
import { getAvailableDrivers } from '../services/drivers';
import { getPendingOrders } from '../services/orders';
import { toast } from 'react-hot-toast';
import { Database } from '../types/supabase';
import GoogleMap from '../components/GoogleMap';
import RouteWizard from '../components/routes/RouteWizard';

type Order = Database['public']['Tables']['orders']['Row'];

export default function Routes() {
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  const queryClient = useQueryClient();

  const { data: availableDrivers = [] } = useQuery({
    queryKey: ['drivers', 'available'],
    queryFn: getAvailableDrivers,
  });

  const { data: pendingOrders = [] } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: getPendingOrders,
  });

  const createRouteMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setSelectedOrders([]);
      setSelectedDriver('');
      toast.success('Route created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create route');
    },
  });

  const handleOrderSelect = (order: Order) => {
    setSelectedOrders(prev => {
      const isSelected = prev.some(o => o.id === order.id);
      if (isSelected) {
        return prev.filter(o => o.id !== order.id);
      }
      return [...prev, order];
    });
  };

  const handleOptimizeRoute = () => {
    toast.success('Route optimized successfully');
  };

  const handleCreateRoute = () => {
    if (!selectedDriver || selectedOrders.length === 0) return;

    createRouteMutation.mutate({
      driver_id: selectedDriver,
      order_ids: selectedOrders.map(order => order.id),
    });
  };

  return (
    <div className="absolute inset-0 bg-background">
      <div className="absolute inset-0 bg-white">
        <GoogleMap
          selectedOrders={selectedOrders}
          pendingOrders={pendingOrders}
          onOrderSelect={handleOrderSelect}
        />
      </div>

      <RouteWizard
        pendingOrders={pendingOrders}
        availableDrivers={availableDrivers}
        selectedOrders={selectedOrders}
        onOrderSelect={handleOrderSelect}
        selectedDriver={selectedDriver}
        onDriverSelect={setSelectedDriver}
        onCreateRoute={handleCreateRoute}
        onOptimizeRoute={handleOptimizeRoute}
      />
    </div>
  );
}