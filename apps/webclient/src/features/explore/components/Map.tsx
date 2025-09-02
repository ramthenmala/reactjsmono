import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IPlotPoint } from '../types/map';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapProps {
  points?: IPlotPoint[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (point: IPlotPoint) => void;
}

export function Map({ 
  points = [], 
  center = [46.6753, 24.7136], // Riyadh coordinates
  zoom = 6, 
  className = "w-full h-96",
  onMarkerClick 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom,
        attributionControl: true,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Set map loaded state
      map.current.on('load', () => {
        setIsMapLoaded(true);
      });

      // Cleanup on unmount
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }
  }, [center, zoom]);

  // Update markers when points change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    points.forEach(point => {
      if (!point.coordinates) return;

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div class="w-8 h-8 bg-[#5547B5] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-4 h-4 bg-white rounded-full"></div>
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([point.coordinates.lng, point.coordinates.lat])
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false 
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2 text-[#171B23]">${point.property?.title || 'Industrial Plot'}</h3>
          <p class="text-sm text-gray-600 mb-2">${point.property?.city || 'Location'}</p>
          ${point.property?.area ? `<p class="text-sm text-gray-500">Area: ${point.property.area.toLocaleString()} m²</p>` : ''}
          <div class="mt-3">
            <button class="bg-[#5547B5] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4A3FA0] transition-colors">
              View Details
            </button>
          </div>
        </div>
      `);

      // Add click handlers
      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) {
          onMarkerClick(point);
        }
        marker.setPopup(popup).togglePopup();
      });

      markers.current.push(marker);
    });

    // Fit map to bounds if there are markers
    if (points.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach(point => {
        if (point.coordinates) {
          bounds.extend([point.coordinates.lng, point.coordinates.lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [points, isMapLoaded, onMarkerClick]);

  // Show loading state or error if Mapbox token is missing
  if (!mapboxgl.accessToken) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">Mapbox configuration required</p>
          <p className="text-sm text-gray-500">Please set VITE_MAPBOX_ACCESS_TOKEN</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5547B5]" />
          <span className="ml-2 text-gray-600">Loading map...</span>
        </div>
      )}
    </div>
  );
}