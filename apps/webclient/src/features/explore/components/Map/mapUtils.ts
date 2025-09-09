import { IProperty } from '@/features/explore/types/explore';
import {
  IPlotPoint,
  TCityData,
  CITY_COORDINATES,
} from '@/features/explore/types/map';

// Types for plot and properties data
export interface PlotData {
  id?: string;
  title?: string;
  name?: string;
  city?: string;
  area?: number;
  price?: number;
  type?: string;
  image?: string;
  status?: string;
  electricity?: string;
  gas?: string;
  water?: string;
  [key: string]: unknown;
}

export interface FeatureProperties {
  id?: string;
  title?: string;
  name?: string;
  city?: string;
  type?: string;
  area?: number;
  electricity?: string;
  gas?: string;
  water?: string;
  status?: string;
  plotData?: PlotData;
  [key: string]: unknown;
}

export interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

// GeoJSON types for Mapbox compatibility
export interface MapboxGeoJSONFeature {
  type: 'Feature';
  geometry: PointGeometry;
  properties: FeatureProperties;
}

export interface MapboxGeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: MapboxGeoJSONFeature[];
}

// Helper function to convert plot data back to IProperty format
export const plotToProperty = (
  plot: PlotData,
  properties: FeatureProperties
): IProperty => {
  return {
    id: properties.id || plot?.id || 'unknown',
    slug: properties.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    title:
      properties.title ||
      properties.name ||
      plot?.title ||
      plot?.name ||
      'Untitled Plot',
    city: properties.city || plot?.city || 'Unknown City',
    area: properties.area || plot?.area || 0,
    electricity: properties.electricity || plot?.electricity,
    gas: properties.gas || plot?.gas,
    water: properties.water || plot?.water,
    image: plot?.image || '/assets/images/properties/placeholder.png',
    status: (properties.status || plot?.status || 'available') as
      | 'available'
      | 'sold'
      | 'reserved',
    featured: true, // Mark popup cards as featured for styling
  };
};

// Convert IProperty to TCityData format
export const convertPropertiesToTCityData = (
  properties: IProperty[]
): TCityData => {
  const grouped: TCityData = {};

  properties.forEach((property) => {
    const baseCoords = CITY_COORDINATES[property.city] || [46.7749, 24.6775];
    const lng =
      property.coordinates?.lng || baseCoords[0] + (Math.random() - 0.5) * 0.1;
    const lat =
      property.coordinates?.lat || baseCoords[1] + (Math.random() - 0.5) * 0.1;

    const plotPoint: IPlotPoint = {
      id: property.id || `${property.slug}-${Math.random()}`,
      city: property.city,
      latitude: lat,
      longitude: lng,
      title: property.title,
      address: `${property.title}, ${property.city}`,
      area: property.area,
      price: 0,
      type: 'industrial',
      status: 'available',
      image: property.image || '',
      description: '',
      amenities: [],
      electricity: property.electricity,
      gas: property.gas,
      water: property.water,
    };

    if (!grouped[property.city]) {
      grouped[property.city] = [];
    }
    grouped[property.city].push(plotPoint);
  });

  return grouped;
};

// Convert city data to city clusters GeoJSON
export const convertToCityClusters = (data: TCityData) => {
  const features = Object.entries(data)
    .map(([cityName, plotPoints]) => {
      if (plotPoints.length === 0) return null;

      // Calculate center point of all plots in the city
      const centerLat =
        plotPoints.reduce((sum, plot) => sum + plot.latitude, 0) /
        plotPoints.length;
      const centerLng =
        plotPoints.reduce((sum, plot) => sum + plot.longitude, 0) /
        plotPoints.length;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [centerLng, centerLat],
        },
        properties: {
          name: cityName,
          plotCount: plotPoints.length,
          city: cityName,
          type: 'city-cluster',
        },
      };
    })
    .filter(Boolean);

  return {
    type: 'FeatureCollection',
    features,
  };
};

// Convert to plot points for selected city
export const convertToIPlotPoints = (
  data: TCityData,
  selectedCity?: string
) => {
  if (!selectedCity || !data[selectedCity]) {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }

  const plotPoints = data[selectedCity];
  const features = plotPoints.map((plot) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [plot.longitude, plot.latitude],
    },
    properties: {
      id: plot.id,
      name: plot.title,
      title: plot.title,
      city: plot.city,
      area: plot.area,
      type: 'plot',
      status: plot.status,
      electricity: plot.electricity,
      gas: plot.gas,
      water: plot.water,
      plotData: {
        id: plot.id,
        title: plot.title,
        name: plot.title,
        city: plot.city,
        area: plot.area,
        type: plot.type,
        status: plot.status,
        electricity: plot.electricity,
        gas: plot.gas,
        water: plot.water,
        image: plot.image,
      },
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
  };
};
