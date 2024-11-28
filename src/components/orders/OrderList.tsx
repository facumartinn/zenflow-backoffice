import { format } from 'date-fns';
import { Database } from '../../types/supabase';
import OrderStatusBadge from './OrderStatusBadge';

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, status: Order['status']) => void;
}

export default function OrderList({ orders, onStatusChange }: OrderListProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm shadow overflow-hidden sm:rounded-lg border border-border">
      <ul className="divide-y divide-border">
        {orders.map((order) => (
          <li key={order.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm font-medium text-foreground">
                  {order.customer_name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.delivery_address}
                </p>
                <p className="mt-1 text-sm text-muted-foreground sm:hidden">
                  {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    onStatusChange(order.id, e.target.value as Order['status'])
                  }
                  className="block w-32 pl-3 pr-10 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </div>
            <div className="mt-2 sm:hidden">
              <OrderStatusBadge status={order.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}