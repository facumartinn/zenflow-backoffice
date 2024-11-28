import { ArrowLeft, MapPin, User, Route } from 'lucide-react';
import { Database } from '../../../types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

interface RouteDetailsProps {
  selectedOrders: Order[];
  selectedDriver: Driver | undefined;
  selectedDepot: google.maps.LatLngLiteral;
  onOptimizeRoute: () => void;
  onNext: () => void;
  onBack: () => void;
}

export default function RouteDetails({
  selectedOrders,
  selectedDriver,
  selectedDepot,
  onOptimizeRoute,
  onNext,
  onBack,
}: RouteDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Starting from New York Main Depot</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <User className="h-4 w-4 text-primary" />
          <span>Driver: {selectedDriver?.full_name}</span>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Route className="h-4 w-4 text-primary" />
          <span>{selectedOrders.length} stops in total</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Delivery Order</h3>
        <div className="space-y-2">
          {selectedOrders.map((order, index) => (
            <div
              key={order.id}
              className="p-3 bg-accent/50 rounded-md"
            >
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={onOptimizeRoute}
          className="flex-1 py-2 px-4 bg-primary/20 text-primary rounded-md font-medium hover:bg-primary/30"
        >
          Optimize Route
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}