import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Database } from '../types/supabase';
import { useDepot } from '../contexts/DepotContext';

type Order = Database['public']['Tables']['orders']['Row'];

interface GoogleMapProps {
  selectedOrders: Order[];
  pendingOrders: Order[];
  onOrderSelect: (order: Order) => void;
  zoom?: number;
}

const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

export default function GoogleMap({
  selectedOrders,
  pendingOrders,
  onOrderSelect,
  zoom = 12,
}: GoogleMapProps) {
  const { selectedDepot } = useDepot();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const depotMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing');
      return;
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then(() => {
      if (mapContainerRef.current && !mapRef.current) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: selectedDepot.location,
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'all',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ],
        });

        mapRef.current = map;
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#4F46E5',
            strokeWeight: 4,
          },
        });

        setIsMapReady(true);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      depotMarkerRef.current?.setMap(null);
      directionsRendererRef.current?.setMap(null);
    };
  }, []);

  // Update depot marker when depot changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (depotMarkerRef.current) {
      depotMarkerRef.current.setMap(null);
    }

    depotMarkerRef.current = new google.maps.Marker({
      position: selectedDepot.location,
      map: mapRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4F46E5',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
      },
      title: selectedDepot.name,
    });

    mapRef.current.panTo(selectedDepot.location);
  }, [selectedDepot]);

  // Add order markers
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();

    // Add markers for pending orders
    pendingOrders.forEach(order => {
      const isSelected = selectedOrders.some(o => o.id === order.id);
      const marker = new google.maps.Marker({
        position: { lat: order.latitude, lng: order.longitude },
        map: mapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: isSelected ? '#22C55E' : '#EAB308',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
        title: order.customer_name,
      });

      marker.addListener('click', () => {
        onOrderSelect(order);
      });

      markersRef.current.set(order.id, marker);
    });

    // Fit bounds to show all markers
    if (pendingOrders.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      pendingOrders.forEach(order => {
        bounds.extend({ lat: order.latitude, lng: order.longitude });
      });
      bounds.extend(selectedDepot.location);
      mapRef.current.fitBounds(bounds);
    }
  }, [isMapReady, pendingOrders, selectedOrders]);

  // Update route display when selected orders change
  useEffect(() => {
    if (!mapRef.current || !directionsRendererRef.current || selectedOrders.length === 0) {
      directionsRendererRef.current?.setDirections(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const waypoints = selectedOrders.map(order => ({
      location: { lat: order.latitude, lng: order.longitude },
      stopover: true,
    }));

    directionsService.route(
      {
        origin: selectedDepot.location,
        destination: selectedDepot.location,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current?.setDirections(result);
        }
      }
    );
  }, [selectedOrders, selectedDepot]);

  return (
    <div className="w-full h-full bg-white">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}