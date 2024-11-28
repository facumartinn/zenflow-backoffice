import { MapPin } from 'lucide-react';

interface DepotSelectorProps {
  selectedDepot: google.maps.LatLngLiteral;
  onDepotChange: (depot: google.maps.LatLngLiteral) => void;
}

export default function DepotSelector({ selectedDepot, onDepotChange }: DepotSelectorProps) {
  const depots = [
    { name: 'New York Main Depot', location: { lat: 40.7128, lng: -74.0060 } },
    { name: 'Brooklyn Depot', location: { lat: 40.6782, lng: -73.9442 } },
    { name: 'Queens Depot', location: { lat: 40.7282, lng: -73.7949 } },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Select Starting Depot
      </label>
      <div className="space-y-2">
        {depots.map((depot) => (
          <button
            key={depot.name}
            onClick={() => onDepotChange(depot.location)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
              selectedDepot.lat === depot.location.lat &&
              selectedDepot.lng === depot.location.lng
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent/50 text-foreground hover:bg-accent'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>{depot.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}