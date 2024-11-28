import { useQuery } from '@tanstack/react-query';
import { Package, Truck, MapPin, AlertCircle } from 'lucide-react';
import { getOrders } from '../services/orders';
import { getRoutes } from '../services/routes';
import { format } from 'date-fns';
import { Order } from '../types';
import DashboardCard from '../components/DashboardCard';

export default function Dashboard() {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const { data: routes } = useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes,
  });

  const stats = {
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(order => order.status === 'PENDING').length || 0,
    activeRoutes: routes?.filter(route => route.status === 'IN_PROGRESS').length || 0,
    completedToday: orders?.filter(order => 
      order.status === 'DELIVERED' && 
      new Date(order.created_at).toDateString() === new Date().toDateString()
    ).length || 0,
  };

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="blue"
        />
        <DashboardCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={AlertCircle}
          color="yellow"
        />
        <DashboardCard
          title="Active Routes"
          value={stats.activeRoutes}
          icon={Truck}
          color="green"
        />
        <DashboardCard
          title="Completed Today"
          value={stats.completedToday}
          icon={MapPin}
          color="indigo"
        />
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-lg shadow border border-border overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-foreground">Recent Orders</h3>
        </div>
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Address
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-foreground">
                          {order.delivery_address}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                        {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    IN_TRANSIT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
      {status.toLowerCase().replace('_', ' ')}
    </span>
  );
}