'use client';

import { createContext, useContext, useState } from 'react';

interface Depot {
  name: string;
  location: google.maps.LatLngLiteral;
}

export const AVAILABLE_DEPOTS: Depot[] = [
  { name: 'New York Main Depot', location: { lat: 40.7128, lng: -74.0060 } },
  { name: 'Brooklyn Depot', location: { lat: 40.6782, lng: -73.9442 } },
  { name: 'Queens Depot', location: { lat: 40.7282, lng: -73.7949 } },
];

interface DepotContextType {
  selectedDepot: Depot;
  setSelectedDepot: (depot: Depot) => void;
}

const DepotContext = createContext<DepotContextType | undefined>(undefined);

export function DepotProvider({ children }: { children: React.ReactNode }) {
  const [selectedDepot, setSelectedDepot] = useState<Depot>(AVAILABLE_DEPOTS[0]);

  return (
    <DepotContext.Provider value={{ selectedDepot, setSelectedDepot }}>
      {children}
    </DepotContext.Provider>
  );
}

export function useDepot() {
  const context = useContext(DepotContext);
  if (context === undefined) {
    throw new Error('useDepot must be used within a DepotProvider');
  }
  return context;
}