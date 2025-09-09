/**
 * Map Component Styles
 * Consolidated styles for all Map-related components
 */

export const mapStyles = {
  // Main map container
  container: {
    wrapper: (className: string) => `relative w-full ${className || 'h-96'}`,
    mapbox: 'w-full h-full rounded-xl',
    errorContainer: (className: string) =>
      `${className} bg-gray-100 flex items-center justify-center rounded-xl`,
    errorContent: 'text-center p-6',
    errorMessage: 'text-red-600 mb-2',
    errorDescription: 'text-sm text-gray-500',
    errorToken: 'text-xs text-gray-400 mt-2',
  },

  // Map controls (zoom and style)
  controls: {
    container: 'absolute top-4 right-4 z-10 flex gap-2 items-start',
    layerButton:
      'bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center',
    layerDropdown: {
      container:
        'absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20',
      button: (isActive: boolean) =>
        `w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors ${
          isActive ? 'bg-blue-50 text-blue-600' : ''
        }`,
      label: 'text-sm font-medium',
    },
    zoomGroup: 'bg-white shadow-lg',
  },

  // Back to cities button
  backButton: {
    container: 'absolute top-4 left-4 z-10 border-2 border-gray-300 rounded-lg',
    button:
      'bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer',
  },

  // Map legend
  legend: {
    container: 'absolute bottom-4 right-4 z-10',
    group: 'bg-white/95 backdrop-blur-sm',
    item: {
      wrapper: 'flex items-center gap-2',
      dot: (color: string) => `w-2 h-2 rounded-full ${color}`,
      colors: {
        industrial: 'bg-purple-600',
        competitors: 'bg-orange-500',
        suppliers: 'bg-blue-500',
        consumers: 'bg-teal-500',
      },
    },
  },

  // Map popup
  popup: {
    container: 'relative w-full',
    content: 'w-full min-w-[380px]',
    closeButton:
      'absolute top-3 right-3 z-50 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-all cursor-pointer shadow-md',
  },

  // Map icon SVG styles
  icons: {
    layers: {
      width: '16',
      height: '16',
      viewBox: '0 0 16 16',
    },
    zoom: {
      width: '16',
      height: '16',
      viewBox: '0 0 16 16',
    },
    back: {
      width: '16',
      height: '16',
      viewBox: '0 0 16 16',
    },
    streetView: {
      width: '20',
      height: '20',
      viewBox: '0 0 20 20',
    },
    satelliteView: {
      width: '20',
      height: '20',
      viewBox: '0 0 20 20',
    },
  },

  // Mapbox configuration
  mapbox: {
    defaultCenter: {
      lng: 44.5,
      lat: 24.5,
    },
    defaultZoom: 5,
    minZoom: 4,
    maxZoom: 16,
    saudiBounds: {
      southwest: [34.5, 16.0] as [number, number],
      northeast: [55.7, 32.2] as [number, number],
    },
    styles: {
      streets: 'mapbox://styles/mapbox/light-v11',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    },
    fitBoundsPadding: 50,
    fitBoundsMaxZoom: 8,
    animationDuration: 1000,
  },

  // Marker styles
  markers: {
    cityCluster: {
      fill: '#695DC2',
      size: 40,
    },
    plot: {
      fill: '#695DC2',
      size: 40,
      innerSize: 10,
    },
  },
};
