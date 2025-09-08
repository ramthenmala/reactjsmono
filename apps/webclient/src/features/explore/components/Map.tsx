import React, { useRef, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { IProperty } from '../types/explore';
import { PropertyCard } from './PropertyCard';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// GeoJSON Feature type for better type safety
interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Record<string, unknown>;
}

// GeoJSON FeatureCollection type
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface PlotPoint {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  area: number;
  price: number;
  type: "industrial" | "residential" | "commercial" | "logistics";
  status: "available" | "sold" | "reserved";
  image: string;
  description: string;
  amenities: string[];
  electricity?: string;
  gas?: string;
  water?: string;
}

interface CityData {
  [cityName: string]: PlotPoint[];
}

interface MapProps {
  points?: IProperty[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMarkerClick?: (point: IProperty) => void;
}

// Helper function to convert plot data back to IProperty format
const plotToProperty = (plot: any, properties: any): IProperty => {
  return {
    id: properties.id || plot?.id || 'unknown',
    slug: properties.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    title: properties.title || properties.name || plot?.title || plot?.name || 'Untitled Plot',
    city: properties.city || plot?.city || 'Unknown City',
    area: properties.area || plot?.area || 0,
    electricity: properties.electricity || plot?.electricity,
    gas: properties.gas || plot?.gas,
    water: properties.water || plot?.water,
    image: plot?.image || '/assets/images/properties/placeholder.png',
    featured: true // Mark popup cards as featured for styling
  };
};

// Convert IProperty to CityData format
const convertPropertiesToCityData = (properties: IProperty[]): CityData => {
  const grouped: CityData = {};
  
  properties.forEach((property) => {
    const cityCoordinates: { [key: string]: [number, number] } = {
      "Riyadh": [46.7749, 24.6775],
      "Jeddah": [39.2083, 21.5433],
      "Dammam": [50.0888, 26.4282],
      "Yanbu": [38.0618, 24.0895],
      "Jubail": [49.6583, 27.0174]
    };

    const baseCoords = cityCoordinates[property.city] || [46.7749, 24.6775];
    const lng = property.coordinates?.lng || baseCoords[0] + (Math.random() - 0.5) * 0.1;
    const lat = property.coordinates?.lat || baseCoords[1] + (Math.random() - 0.5) * 0.1;

    const plotPoint: PlotPoint = {
      id: property.id || `${property.slug}-${Math.random()}`,
      city: property.city,
      latitude: lat,
      longitude: lng,
      title: property.title,
      address: `${property.title}, ${property.city}`,
      area: property.area,
      price: 0,
      type: "industrial",
      status: "available",
      image: "",
      description: "",
      amenities: [],
      electricity: property.electricity,
      gas: property.gas,
      water: property.water
    };

    if (!grouped[property.city]) {
      grouped[property.city] = [];
    }
    grouped[property.city].push(plotPoint);
  });

  return grouped;
};

export function Map({ 
  points = [], 
  className = "w-full h-96",
  onMarkerClick 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);
  const [lng] = useState(44.5); // Center of Saudi Arabia
  const [lat] = useState(24.5);
  const [zoom] = useState(5); // Zoomed out to show all points
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [popupProperty, setPopupProperty] = useState<IProperty | null>(null);
  const [popupContainer, setPopupContainer] = useState<HTMLDivElement | null>(null);

  const hasToken = !!mapboxgl.accessToken;
  
  // Convert data outside useEffect so it can be a proper dependency
  const data = useMemo(() => {
    return convertPropertiesToCityData(points);
  }, [points]);

  // Convert data to GeoJSON format for city clusters
  const convertToCityClusters = (cityData: CityData): GeoJSONFeatureCollection => {
    const features: GeoJSONFeature[] = [];

    Object.entries(cityData).forEach(([cityName, plots]) => {
      // Calculate city center from all plots
      const totalLat = plots.reduce((sum, plot) => sum + plot.latitude, 0);
      const totalLng = plots.reduce((sum, plot) => sum + plot.longitude, 0);
      const centerLat = totalLat / plots.length;
      const centerLng = totalLng / plots.length;

      // Add city cluster point
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [centerLng, centerLat]
        },
        properties: {
          id: `city-${cityName}`,
          name: cityName,
          type: "city-cluster",
          count: plots.length,
          plots: plots
        }
      });
    });

    return {
      type: "FeatureCollection",
      features: features
    };
  };

  // Convert data to GeoJSON format for individual plots
  const convertToPlotPoints = (cityData: CityData, cityName?: string): GeoJSONFeatureCollection => {
    const features: GeoJSONFeature[] = [];

    if (cityName && cityData[cityName]) {
      // Show only plots for the selected city
      cityData[cityName].forEach(plot => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [plot.longitude, plot.latitude]
          },
          properties: {
            id: plot.id,
            name: plot.title,
            type: "plot",
            plotType: plot.type,
            plotData: plot,
            city: plot.city,
            address: plot.address,
            area: plot.area,
            electricity: plot.electricity,
            gas: plot.gas,
            water: plot.water
          }
        });
      });
    }

    return {
      type: "FeatureCollection",
      features: features
    };
  };

  useEffect(() => {
    if (map.current) {
      return; // Initialize map only once
    }

    if (mapContainer.current && hasToken) {
      // Saudi Arabia bounds
      const saudiBounds = new mapboxgl.LngLatBounds(
        [34.5, 16.0], // Southwest coordinates (lng, lat)
        [55.7, 32.2]  // Northeast coordinates (lng, lat)
      );

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11", // Clean light theme
        center: [lng, lat],
        zoom: zoom,
        minZoom: 4,  // Prevent zooming out too much
        maxZoom: 16, // Allow detailed zoom
        maxBounds: saudiBounds, // Restrict panning to Saudi Arabia
        attributionControl: false,
        dragPan: true,     // Enable dragging (default: true)
        scrollZoom: true,  // Enable zoom with scroll
        doubleClickZoom: true,
        touchZoomRotate: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

      // Wait for map to load before adding sources and layers
      map.current.on("load", () => {
        if (!map.current) return;

        // Convert data to GeoJSON for city clusters
        const cityClustersData = convertToCityClusters(data);

        // Calculate bounds to fit all city clusters
        if (cityClustersData.features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          cityClustersData.features.forEach((feature) => {
            bounds.extend(feature.geometry.coordinates);
          });

          // Fit map to bounds with padding
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 8
          });

          // Keep Saudi Arabia bounds instead of tight city bounds
          // (Saudi bounds are already set in map initialization)
        }

        // Generate dynamic city cluster markers with counts
        const cityClusterMarkers = Object.entries(data).map(([cityName, plots]) => {
          const count = plots.length;
          return {
            name: `city-cluster-${cityName}`,
            url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#695DC2"/>
                <text x="20" y="24" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${count}</text>
              </svg>
            `)
          };
        });

        // Add plot marker image - single design for all types
        const plotMarkers = [
          {
            name: "plot", url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.1">
                <rect width="40" height="40" rx="20" fill="#695DC2"/>
              </g>
              <g opacity="0.2">
                <rect x="8" y="8" width="24" height="24" rx="12" fill="#695DC2"/>
              </g>
              <rect x="15" y="15" width="10" height="10" rx="5" fill="#695DC2"/>
            </svg>
          `)
          }
        ];

        const allMarkers = [...cityClusterMarkers, ...plotMarkers];

        // Wait for images to load before adding layers
        Promise.all(allMarkers.map(({ name, url }) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              if (map.current) {
                map.current.addImage(name, img);
              }
              resolve();
            };
            img.src = url;
          });
        })).then(() => {
          // Add layers after images are loaded
          if (!map.current) return;

          // Add city cluster layer
          map.current.addLayer({
            id: "city-clusters",
            type: "symbol",
            source: "city-clusters",
            filter: ["!=", ["get", "name"], selectedCity || ""],
            layout: {
              "icon-image": ["concat", "city-cluster-", ["get", "name"]],
              "icon-size": 1,
              "icon-allow-overlap": true
            }
          });

          // Add plot points layer
          console.log("Adding plot-points layer");
          map.current.addLayer({
            id: "plot-points",
            type: "symbol",
            source: "plot-points",
            layout: {
              "icon-image": "plot",
              "icon-size": 1,
              "icon-allow-overlap": true
            }
          });

          // Add event handlers
          // City cluster click handler
          map.current.on("click", "city-clusters", (e) => {
            if (!e.features?.[0]) return;

            const properties = e.features[0].properties;
            if (!properties || properties.type !== "city-cluster") return;

            const cityName = properties.name;
            setSelectedCity(cityName);

            // Hide all city clusters when a city is selected
            if (map.current) {
              map.current.setFilter("city-clusters", ["==", ["get", "name"], ""]);
            }

            // Show individual plots
            const plotPointsData = convertToPlotPoints(data, cityName);
            const source = map.current?.getSource("plot-points") as mapboxgl.GeoJSONSource;
            if (source) {
              source.setData(plotPointsData);
            }

            // Zoom to city with bounds calculation to show all plots
            const cityPlots = data[cityName];
            if (cityPlots && cityPlots.length > 0) {
              const bounds = new mapboxgl.LngLatBounds();
              cityPlots.forEach(plot => {
                bounds.extend([plot.longitude, plot.latitude]);
              });

              map.current?.fitBounds(bounds, {
                padding: 50,
                maxZoom: 14,
                duration: 1000
              });
            } else {
              // Fallback to center zoom if no plots found
              const geometry = e.features[0].geometry as mapboxgl.GeoJSONGeometry;
              const coordinates = (geometry as { coordinates: [number, number] }).coordinates;
              map.current?.easeTo({
                center: coordinates,
                zoom: 12,
                duration: 1000
              });
            }
          });

          // Plot point click handler
          map.current.on("click", "plot-points", (e) => {
            if (!e.features?.[0]) return;

            const geometry = e.features[0].geometry as mapboxgl.GeoJSONGeometry;
            const coordinates = (geometry as { coordinates: [number, number] }).coordinates.slice() as [number, number];
            const properties = e.features[0].properties;

            if (!properties || properties.type !== "plot") return;

            const plot = properties.plotData;
            
            // Convert to IProperty format
            const property = plotToProperty(plot, properties);
            
            // Close any existing popup
            if (currentPopup.current) {
              currentPopup.current.remove();
            }

            // Create a simple container for the React portal
            const popupDiv = document.createElement('div');
            popupDiv.id = 'map-popup-container';
            popupDiv.style.width = '380px';
            popupDiv.style.minWidth = '380px';
            popupDiv.style.maxWidth = '380px';

            // Create and show popup with empty container
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false, // We'll handle this ourselves
              className: 'property-card-popup',
              maxWidth: '380px' // Increased to 380px for better content fit
            })
              .setLngLat(coordinates)
              .setDOMContent(popupDiv)
              .addTo(map.current!);

            // Store references
            currentPopup.current = popup;
            setPopupContainer(popupDiv);
            setPopupProperty(property);
          });

          // Add hover effects
          map.current.on("mouseenter", "city-clusters", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "pointer";
            }
          });

          map.current.on("mouseleave", "city-clusters", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "";
            }
          });

          map.current.on("mouseenter", "plot-points", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "pointer";
            }
          });

          map.current.on("mouseleave", "plot-points", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "";
            }
          });
        });

        // Add GeoJSON source for city clusters
        console.log("Adding city-clusters source");
        map.current.addSource("city-clusters", {
          type: "geojson",
          data: cityClustersData
        });

        // Add GeoJSON source for plot points (initially empty)
        console.log("Adding plot-points source");
        map.current.addSource("plot-points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom, data, hasToken]);

  // Add resize handler for map container
  useEffect(() => {
    if (!map.current || !mapContainer.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        // Small delay to ensure DOM has finished updating
        setTimeout(() => {
          map.current!.resize();
        }, 100);
      }
    });

    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleBackToCities = () => {
    // Close any open popup
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }
    setPopupProperty(null);
    setPopupContainer(null);

    setSelectedCity(null);
    if (map.current) {
      // Show all city clusters by removing the filter
      map.current.setFilter("city-clusters", null);

      // Clear plot points
      const source = map.current.getSource("plot-points") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: []
        });
      }

      // Fit bounds to show all cities
      const cityClustersData = convertToCityClusters(data);
      if (cityClustersData.features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        cityClustersData.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates);
        });

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 8
        });
      }
    }
  };

  // Close popup handler
  const closePopup = () => {
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }
    setPopupProperty(null);
    setPopupContainer(null);
  };

  // Conditional rendering after all hooks
  if (!hasToken) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-xl`}>
        <div className="text-center p-6">
          <p className="text-red-600 mb-2">Mapbox configuration required</p>
          <p className="text-sm text-gray-500">Please set VITE_MAPBOX_ACCESS_TOKEN in .env file</p>
          <p className="text-xs text-gray-400 mt-2">Token: {mapboxgl.accessToken ? "Present" : "Missing"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className || 'h-96'}`}>
      <div ref={mapContainer} className="w-full h-full rounded-xl" />

      {/* Back button when a city is selected */}
      {selectedCity && (
        <div className="absolute top-2 left-12 z-10 border-2 border-gray-300 rounded-lg">
          <button
            onClick={handleBackToCities}
            className="bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Cities
          </button>
        </div>
      )}

      {/* React Portal for PropertyCard popup */}
      {popupProperty && popupContainer && createPortal(
        <div className="relative w-full">
          <div className="w-full min-w-[380px]">
            <PropertyCard
              property={popupProperty}
              hideDistance={true}
              onView={() => {
                closePopup();
                onMarkerClick?.(popupProperty);
              }}
              onCompare={() => {
                // Handle compare functionality
              }}
            />
          </div>
          <button
            onClick={closePopup}
            className="absolute top-3 right-3 z-50 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-all cursor-pointer shadow-md"
          >
            ×
          </button>
        </div>,
        popupContainer
      )}
    </div>
  );
}