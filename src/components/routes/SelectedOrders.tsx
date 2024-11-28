import { X } from 'lucide-react';
import { Database } from '../../types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];

interface SelectedOrdersProps {
  orders: Order[];
  onRemoveOrder: (order: Order) => void;
  onClearOrders: () => void;
}

export default function SelectedOrders({
  orders,
  onRemoveOrder,
  onClearOrders,
}: SelectedOrdersProps) {
  if (orders.length === 0) return null;

  return (
    <div className="fixed right-6 top-24 w-80 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground">Selected Orders</h2>
        <button
          onClick={onClearOrders}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-accent/50 rounded-md"
          >
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-foreground truncate">
                {index + 1}. {order.customer_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {order.delivery_address}
              </p>
            </div>
            <button
              onClick={() => onRemoveOrder(order)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}