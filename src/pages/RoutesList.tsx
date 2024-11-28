import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '../services/routes';
import { format } from 'date-fns';
import { MapPin, Truck, Package, ChevronRight } from 'lucide-react';

export default function RoutesList() {
  const navigate = useNavigate();
  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes,
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Routes</h1>
        <button
          onClick={() => navigate('/routes/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Truck className="h-4 w-4 mr-2" />
          Create New Route
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading routes...</p>
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No routes found</h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first delivery route.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/routes/${route.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      route.status
                    )}`}
                  >
                    {route.status.replace('_', ' ')}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
                    <Package className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      {route.orders?.length || 0} orders
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      New York Main Depot
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Created {format(new Date(route.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}