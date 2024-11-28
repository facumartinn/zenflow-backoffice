import { Package, Truck } from 'lucide-react';
import { Database } from '../../types/supabase';
import DepotSelector from './DepotSelector';

type Driver = Database['public']['Tables']['drivers']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

interface RouteControlsProps {
  selectedOrders: Order[];
  availableDrivers: Driver[];
  selectedDriver: string;
  onDriverSelect: (driverId: string) => void;
  selectedDepot: google.maps.LatLngLiteral;
  onDepotChange: (depot: google.maps.LatLngLiteral) => void;
  onOptimizeRoute: () => void;
  onCreateRoute: () => void;
}

export default function RouteControls({
  selectedOrders,
  availableDrivers,
  selectedDriver,
  onDriverSelect,
  selectedDepot,
  onDepotChange,
  onOptimizeRoute,
  onCreateRoute,
}: RouteControlsProps) {
  return (
    <div className="fixed left-6 top-24 w-80 space-y-4 z-10">
      <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4">
        <h2 className="text-lg font-medium text-foreground mb-4">Route Configuration</h2>
        
        <DepotSelector
          selectedDepot={selectedDepot}
          onDepotChange={onDepotChange}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Assign Driver
          </label>
          <select
            value={selectedDriver}
            onChange={(e) => onDriverSelect(e.target.value)}
            className="w-full bg-accent/50 border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a driver...</option>
            {availableDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={onOptimizeRoute}
            disabled={selectedOrders.length < 2}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Package className="h-4 w-4 mr-2" />
            Optimize Route ({selectedOrders.length} orders)
          </button>
          
          <button
            onClick={onCreateRoute}
            disabled={!selectedDriver || selectedOrders.length === 0}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Truck className="h-4 w-4 mr-2" />
            Create Route
          </button>
        </div>
      </div>
    </div>
  );
}