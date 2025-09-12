import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { IProperty } from '@/features/explore/types/explore';
import { IMapProps, IPlotPoint } from '@/features/explore/types/map';
import { MapControls } from './MapControls';
//import { MapLegend } from './MapLegend';
import { MapPopup } from './MapPopup';
import { MapBackButton } from './MapBackButton';
import {
  convertPropertiesToTCityData,
  convertToCityClusters,
  convertToIPlotPoints,
  plotToProperty,
  PointGeometry,
} from './mapUtils';
import { mapStyles } from './styles';

// Lazy load Mapbox CSS only when this component is used
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// Map component with extracted subcomponents

export function Map({
  points = [],
  className = 'w-full h-96',
  onMarkerClick,
}: IMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);
  const [lng] = useState(44.5); // Center of Saudi Arabia
  const [lat] = useState(24.5);
  const [zoom] = useState(5); // Zoomed out to show all points
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [popupProperty, setPopupProperty] = useState<IProperty | null>(null);
  const [popupContainer, setPopupContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const [activeMapStyle, setActiveMapStyle] = useState('streets');

  const hasToken = !!mapboxgl.accessToken;

  // Convert data outside useEffect so it can be a proper dependency
  const data = useMemo(() => {
    return convertPropertiesToTCityData(points);
  }, [points]);

  // Utility functions are now imported from mapUtils

  useEffect(() => {
    if (map.current) {
      return; // Initialize map only once
    }

    if (mapContainer.current && hasToken) {
      // Saudi Arabia bounds
      const saudiBounds = new mapboxgl.LngLatBounds(
        [34.5, 16.0], // Southwest coordinates (lng, lat)
        [55.7, 32.2], // Northeast coordinates (lng, lat)
      );

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Clean light theme
        center: [lng, lat],
        zoom,
        minZoom: 4, // Prevent zooming out too much
        maxZoom: 16, // Allow detailed zoom
        maxBounds: saudiBounds, // Restrict panning to Saudi Arabia
        attributionControl: false,
        dragPan: true, // Enable dragging (default: true)
        scrollZoom: true, // Enable zoom with scroll
        doubleClickZoom: true,
        touchZoomRotate: true,
      });

      // Wait for map to load before adding sources and layers
      map.current.on('load', () => {
        if (!map.current) return;

        // Convert data to GeoJSON for city clusters
        const cityClustersData = convertToCityClusters(data);

        // Calculate bounds to fit all city clusters
        if (cityClustersData.features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          cityClustersData.features.forEach(feature => {
            if (feature) {
              bounds.extend(feature.geometry.coordinates as [number, number]);
            }
          });

          // Fit map to bounds with padding
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 8,
          });

          // Keep Saudi Arabia bounds instead of tight city bounds
          // (Saudi bounds are already set in map initialization)
        }

        // Generate dynamic city cluster markers with counts
        const cityClusterMarkers = Object.entries(data).map(
          ([cityName, plots]) => {
            const count = plots.length;
            return {
              name: `city-cluster-${cityName}`,
              url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#695DC2"/>
                <text x="20" y="24" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${count}</text>
              </svg>
            `)}`,
            };
          },
        );

        // Add plot marker image - single design for all types
        const plotMarkers = [
          {
            name: 'plot',
            url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.1">
                <rect width="40" height="40" rx="20" fill="#695DC2"/>
              </g>
              <g opacity="0.2">
                <rect x="8" y="8" width="24" height="24" rx="12" fill="#695DC2"/>
              </g>
              <rect x="15" y="15" width="10" height="10" rx="5" fill="#695DC2"/>
            </svg>
          `)}`,
          },
        ];

        const allMarkers = [...cityClusterMarkers, ...plotMarkers];

        // Add GeoJSON sources first (before images)
        map.current.addSource('city-clusters', {
          type: 'geojson',
          data: cityClustersData as any,
        });

        map.current.addSource('plot-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // Wait for images to load before adding layers
        Promise.all(
          allMarkers.map(({ name, url }) => {
            return new Promise<void>(resolve => {
              const img = new Image();
              img.onload = () => {
                if (map.current) {
                  map.current.addImage(name, img);
                }
                resolve();
              };
              img.src = url;
            });
          }),
        ).then(() => {
          // Add layers after images are loaded
          if (!map.current) return;

          // Add city cluster layer
          map.current.addLayer({
            id: 'city-clusters',
            type: 'symbol',
            source: 'city-clusters',
            layout: {
              'icon-image': ['concat', 'city-cluster-', ['get', 'name']],
              'icon-size': 1,
              'icon-allow-overlap': true,
            },
          });

          // Add plot points layer
          map.current.addLayer({
            id: 'plot-points',
            type: 'symbol',
            source: 'plot-points',
            layout: {
              'icon-image': 'plot',
              'icon-size': 1,
              'icon-allow-overlap': true,
            },
          });

          // Add event handlers
          // City cluster click handler
          map.current.on('click', 'city-clusters', e => {
            if (!e.features?.[0]) return;

            const properties = e.features[0].properties;
            if (!properties || properties.type !== 'city-cluster') return;

            const cityName = properties.name;
            setSelectedCity(cityName);
          });

          // Plot point click handler
          map.current.on('click', 'plot-points', e => {
            if (!e.features?.[0]) return;

            const geometry = e.features[0].geometry as PointGeometry;
            const coordinates = (
              geometry as { coordinates: [number, number] }
            ).coordinates.slice() as [number, number];
            const properties = e.features[0].properties;

            if (!properties || properties.type !== 'plot') return;

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
              maxWidth: '380px', // Increased to 380px for better content fit
            })
              .setLngLat(coordinates)
              .setDOMContent(popupDiv)
              .addTo(map.current as mapboxgl.Map);

            // Store references
            currentPopup.current = popup;
            setPopupContainer(popupDiv);
            setPopupProperty(property);
          });

          // Add hover effects
          map.current.on('mouseenter', 'city-clusters', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'city-clusters', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });

          map.current.on('mouseenter', 'plot-points', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
            }
          });

          map.current.on('mouseleave', 'plot-points', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom, data, hasToken]); // Intentionally exclude selectedCity to prevent re-initialization

  // Handle selectedCity changes separately
  useEffect(() => {
    if (!map.current) return;

    // Wait for map to be loaded before manipulating layers
    const updateMapForSelectedCity = () => {
      if (selectedCity) {
        // Hide city clusters when a city is selected
        if (map.current?.getLayer('city-clusters')) {
          map.current.setFilter('city-clusters', ['==', ['get', 'name'], '']);
        }

        // Update plot points for the selected city
        const plotGeoJSON = convertToIPlotPoints(data, selectedCity);

        const source = map.current?.getSource(
          'plot-points',
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(plotGeoJSON as any);
        }

        // Zoom to selected city
        const cityPlots = data[selectedCity] || [];
        if (cityPlots.length > 0 && map.current) {
          const bounds = new mapboxgl.LngLatBounds();
          cityPlots.forEach((plot: IPlotPoint) => {
            bounds.extend([plot.longitude, plot.latitude]);
          });
          map.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
          });
        }
      } else {
        // Show all city clusters when no city is selected
        if (map.current?.getLayer('city-clusters')) {
          map.current.setFilter('city-clusters', null);
        }

        // Clear plot points
        const source = map.current?.getSource(
          'plot-points',
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'FeatureCollection',
            features: [],
          });
        }

        // Zoom back to show all cities
        if (map.current) {
          const cityClustersData = convertToCityClusters(data);
          if (cityClustersData.features.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            cityClustersData.features.forEach(feature => {
              if (feature) {
                const coords = (feature.geometry as PointGeometry).coordinates;
                bounds.extend(coords);
              }
            });
            map.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 8,
              duration: 1000,
            });
          }
        }
      }
    };

    // Check if map is loaded, if not wait for it
    if (map.current.isStyleLoaded()) {
      updateMapForSelectedCity();
    } else {
      map.current.once('load', updateMapForSelectedCity);
    }
  }, [selectedCity, data]);

  // Add resize handler for map container
  useEffect(() => {
    if (!map.current || !mapContainer.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        // Small delay to ensure DOM has finished updating
        setTimeout(() => {
          map.current?.resize();
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

    // Simply set selectedCity to null - the useEffect will handle the rest
    setSelectedCity(null);
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

  // Zoom handlers
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  // Map style handler
  const handleMapStyleChange = (style: string) => {
    if (map.current) {
      const styleUrl =
        style === 'satellite'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/light-v11';
      map.current.setStyle(styleUrl);
      setActiveMapStyle(style);
    }
  };

  // Conditional rendering after all hooks
  if (!hasToken) {
    return (
      <div className={mapStyles.container.errorContainer(className)}>
        <div className={mapStyles.container.errorContent}>
          <p className={mapStyles.container.errorMessage}>
            Mapbox configuration required
          </p>
          <p className={mapStyles.container.errorDescription}>
            Please set VITE_MAPBOX_ACCESS_TOKEN in .env file
          </p>
          <p className={mapStyles.container.errorToken}>
            Token: {mapboxgl.accessToken ? 'Present' : 'Missing'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={mapStyles.container.wrapper(className)}>
      <div ref={mapContainer} className={mapStyles.container.mapbox} />

      {/* Map Controls Component */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onStyleChange={handleMapStyleChange}
        activeMapStyle={activeMapStyle}
      />

      {/* Back Button Component */}
      <MapBackButton
        selectedCity={selectedCity}
        onBackToCities={handleBackToCities}
      />

      {/* Todo: Map Legend Component */}
      {/* <MapLegend /> */}

      {/* Map Popup Component */}
      <MapPopup
        property={popupProperty}
        container={popupContainer}
        onClose={closePopup}
        onView={onMarkerClick}
      />
    </div>
  );
}
