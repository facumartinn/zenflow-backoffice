import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRoute } from '../services/routes';
import { format } from 'date-fns';
import { MapPin, Truck, Package, ArrowLeft, Clock } from 'lucide-react';

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: route, isLoading } = useQuery({
    queryKey: ['routes', id],
    queryFn: () => getRoute(id!),
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading route details...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Route not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/routes')}
          className="inline-flex items-center px-3 py-2 border border-border rounded-md hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Routes
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Route Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Route Information</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                route.status
              )}`}
            >
              {route.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {route.driver?.full_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {route.driver?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">New York Main Depot</p>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Created {format(new Date(route.created_at), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Orders</h2>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {route.orders?.length || 0} orders
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {route.orders?.map((order, index) => (
              <div
                key={order.id}
                className="flex items-start space-x-3 p-3 bg-accent/50 rounded-md"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}