import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Database } from '../../../types/supabase';
import CapacityBar from './CapacityBar';

type Order = Database['public']['Tables']['orders']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

interface OrderSelectionProps {
  pendingOrders: Order[];
  selectedOrders: Order[];
  selectedDriver: Driver | undefined;
  onOrderSelect: (order: Order) => void;
  onNext: () => void;
}

export default function OrderSelection({
  pendingOrders,
  selectedOrders,
  selectedDriver,
  onOrderSelect,
  onNext,
}: OrderSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = pendingOrders.filter(
    order =>
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVolume = selectedOrders.reduce((sum, order) => sum + (order.volume || 0), 0);
  const vehicleCapacity = selectedDriver?.vehicle_capacity || 0;

  return (
    <div className="space-y-4">
      {selectedDriver && (
        <CapacityBar
          currentVolume={totalVolume}
          maxCapacity={vehicleCapacity}
        />
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-accent/50 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredOrders.map(order => {
          const isSelected = selectedOrders.some(o => o.id === order.id);
          const wouldExceedCapacity = !isSelected && totalVolume + (order.volume || 0) > vehicleCapacity;
          
          return (
            <button
              key={order.id}
              onClick={() => onOrderSelect(order)}
              disabled={!isSelected && wouldExceedCapacity && selectedDriver}
              className={`w-full p-3 rounded-md text-left transition-colors ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : wouldExceedCapacity && selectedDriver
                  ? 'bg-destructive/10 text-muted-foreground cursor-not-allowed'
                  : 'bg-accent/50 text-foreground hover:bg-accent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm">{order.delivery_address}</p>
                  <p className="text-xs text-muted-foreground">
                    Volume: {order.volume?.toFixed(1)} m³
                  </p>
                </div>
                <Package className={`h-5 w-5 ${
                  isSelected ? 'text-primary-foreground' : 
                  wouldExceedCapacity && selectedDriver ? 'text-muted-foreground' : 
                  'text-muted-foreground'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selectedOrders.length === 0 || (selectedDriver && totalVolume > vehicleCapacity)}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedOrders.length} orders
      </button>
    </div>
  );
}