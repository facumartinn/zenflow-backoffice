import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Database } from '../../../types/supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

interface RouteConfirmationProps {
  selectedOrders: Order[];
  selectedDriver: Driver | undefined;
  selectedDepot: google.maps.LatLngLiteral;
  onCreateRoute: () => void;
  onBack: () => void;
}

export default function RouteConfirmation({
  selectedOrders,
  selectedDriver,
  selectedDepot,
  onCreateRoute,
  onBack,
}: RouteConfirmationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">Ready to Create Route</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please review the details below before creating the route
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-accent/50 rounded-md">
          <h4 className="text-sm font-medium text-foreground mb-1">Driver</h4>
          <p className="text-sm text-muted-foreground">{selectedDriver?.full_name}</p>
        </div>

        <div className="p-3 bg-accent/50 rounded-md">
          <h4 className="text-sm font-medium text-foreground mb-1">Starting Point</h4>
          <p className="text-sm text-muted-foreground">New York Main Depot</p>
        </div>

        <div className="p-3 bg-accent/50 rounded-md">
          <h4 className="text-sm font-medium text-foreground mb-1">Orders</h4>
          <p className="text-sm text-muted-foreground">{selectedOrders.length} deliveries</p>
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
          onClick={onCreateRoute}
          className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
        >
          Create Route
        </button>
      </div>
    </div>
  );
}