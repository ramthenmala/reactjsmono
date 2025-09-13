import {
  plotToProperty,
  convertPropertiesToTCityData,
  convertToCityClusters,
  convertToIPlotPoints,
  PlotData,
  FeatureProperties,
} from '../mapUtils';
import { IProperty } from '@/features/explore/types/explore';
import { CITY_COORDINATES } from '@/features/explore/types/map';

describe('mapUtils', () => {
  describe('plotToProperty', () => {
    it('should convert plot and properties to IProperty with all fields', () => {
      const plot: PlotData = {
        id: 'plot-1',
        title: 'Industrial Plot 1',
        name: 'Plot Name',
        city: 'Riyadh',
        area: 1000,
        price: 50000,
        type: 'industrial',
        image: '/image.jpg',
        status: 'available',
        electricity: '100 MW',
        gas: '50 MMSCFD',
        water: '1000 m3/day',
      };

      const properties: FeatureProperties = {
        id: 'prop-1',
        title: 'Property Title',
        name: 'Property Name',
        city: 'Riyadh',
        area: 1200,
        type: 'industrial',
        status: 'sold',
        electricity: '120 MW',
        gas: '60 MMSCFD',
        water: '1200 m3/day',
      };

      const result = plotToProperty(plot, properties);

      expect(result).toEqual({
        id: 'prop-1',
        slug: 'property-name',
        title: 'Property Title',
        city: 'Riyadh',
        area: 1200,
        electricity: '120 MW',
        gas: '60 MMSCFD',
        water: '1200 m3/day',
        image: '/image.jpg',
        status: 'sold',
        featured: true,
      });
    });

    it('should use fallback values when properties are missing', () => {
      const plot: PlotData = {
        id: 'plot-1',
        title: 'Plot Title',
        city: 'Jeddah',
        area: 800,
      };

      const properties: FeatureProperties = {};

      const result = plotToProperty(plot, properties);

      expect(result).toEqual({
        id: 'plot-1',
        slug: 'unknown',
        title: 'Plot Title',
        city: 'Jeddah',
        area: 800,
        electricity: undefined,
        gas: undefined,
        water: undefined,
        image: '/assets/images/properties/placeholder.png',
        status: 'available',
        featured: true,
      });
    });

    it('should handle completely empty inputs', () => {
      const result = plotToProperty({}, {});

      expect(result).toEqual({
        id: 'unknown',
        slug: 'unknown',
        title: 'Untitled Plot',
        city: 'Unknown City',
        area: 0,
        electricity: undefined,
        gas: undefined,
        water: undefined,
        image: '/assets/images/properties/placeholder.png',
        status: 'available',
        featured: true,
      });
    });

    it('should properly generate slug from property name', () => {
      const plot: PlotData = { title: 'Complex Property Name' };
      const properties: FeatureProperties = { name: 'Test Property With Spaces' };

      const result = plotToProperty(plot, properties);

      expect(result.slug).toBe('test-property-with-spaces');
    });

    it('should prioritize properties over plot data', () => {
      const plot: PlotData = {
        id: 'plot-id',
        title: 'Plot Title',
        city: 'Plot City',
        area: 500,
      };

      const properties: FeatureProperties = {
        id: 'prop-id',
        title: 'Prop Title',
        city: 'Prop City',
        area: 1000,
      };

      const result = plotToProperty(plot, properties);

      expect(result.id).toBe('prop-id');
      expect(result.title).toBe('Prop Title');
      expect(result.city).toBe('Prop City');
      expect(result.area).toBe(1000);
    });

    it('should handle null and undefined values gracefully', () => {
      const plot: PlotData = {
        id: null as any,
        title: undefined as any,
        area: null as any,
      };

      const properties: FeatureProperties = {
        id: undefined as any,
        area: undefined as any,
      };

      const result = plotToProperty(plot, properties);

      expect(result.id).toBe('unknown');
      expect(result.title).toBe('Untitled Plot');
      expect(result.area).toBe(0);
    });
  });

  describe('convertPropertiesToTCityData', () => {
    it('should group properties by city correctly', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
        },
        {
          id: '2',
          slug: 'prop-2',
          title: 'Property 2',
          city: 'Riyadh',
          area: 1500,
          status: 'sold',
        },
        {
          id: '3',
          slug: 'prop-3',
          title: 'Property 3',
          city: 'Jeddah',
          area: 2000,
          status: 'reserved',
        },
      ];

      const result = convertPropertiesToTCityData(properties);

      expect(Object.keys(result)).toContain('Riyadh');
      expect(Object.keys(result)).toContain('Jeddah');
      expect(result.Riyadh).toHaveLength(2);
      expect(result.Jeddah).toHaveLength(1);
    });

    it('should use provided coordinates when available', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
          coordinates: { lat: 25.0, lng: 47.0 },
        },
      ];

      const result = convertPropertiesToTCityData(properties);

      expect(result.Riyadh[0].latitude).toBe(25.0);
      expect(result.Riyadh[0].longitude).toBe(47.0);
    });

    it('should use city coordinates with random offset when coordinates not provided', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
        },
      ];

      const result = convertPropertiesToTCityData(properties);
      const riyadhCoords = CITY_COORDINATES.Riyadh;

      // Should be close to Riyadh coordinates but with some random offset
      expect(result.Riyadh[0].latitude).toBeCloseTo(riyadhCoords[1], 0);
      expect(result.Riyadh[0].longitude).toBeCloseTo(riyadhCoords[0], 0);
    });

    it('should handle unknown cities with default coordinates', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Unknown City',
          area: 1000,
          status: 'available',
        },
      ];

      const result = convertPropertiesToTCityData(properties);

      expect(result['Unknown City']).toHaveLength(1);
      // Should use default coordinates [46.7749, 24.6775] with random offset
      expect(result['Unknown City'][0].latitude).toBeCloseTo(24.6775, 0);
      expect(result['Unknown City'][0].longitude).toBeCloseTo(46.7749, 0);
    });

    it('should generate proper IPlotPoint structure', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Test Property',
          city: 'Riyadh',
          area: 1500,
          status: 'available',
          electricity: '100 MW',
          gas: '50 MMSCFD',
          water: '1000 m3/day',
          image: '/test-image.jpg',
        },
      ];

      const result = convertPropertiesToTCityData(properties);
      const plotPoint = result.Riyadh[0];

      expect(plotPoint).toMatchObject({
        id: '1',
        city: 'Riyadh',
        title: 'Test Property',
        address: 'Test Property, Riyadh',
        area: 1500,
        price: 0,
        type: 'industrial',
        status: 'available',
        image: '/test-image.jpg',
        description: '',
        amenities: [],
        electricity: '100 MW',
        gas: '50 MMSCFD',
        water: '1000 m3/day',
      });
    });

    it('should handle empty properties array', () => {
      const result = convertPropertiesToTCityData([]);
      expect(result).toEqual({});
    });

    it('should generate fallback ID when property ID is missing', () => {
      const properties: IProperty[] = [
        {
          id: '',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
        },
      ];

      const result = convertPropertiesToTCityData(properties);
      
      expect(result.Riyadh[0].id).toMatch(/^prop-1-\d/);
    });

    it('should handle missing optional fields gracefully', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
          // Missing electricity, gas, water, image
        },
      ];

      const result = convertPropertiesToTCityData(properties);
      const plotPoint = result.Riyadh[0];

      expect(plotPoint.electricity).toBeUndefined();
      expect(plotPoint.gas).toBeUndefined();
      expect(plotPoint.water).toBeUndefined();
      expect(plotPoint.image).toBe('');
    });
  });

  describe('convertToCityClusters', () => {
    it('should create city clusters from city data', () => {
      const cityData = {
        Riyadh: [
          {
            id: '1',
            city: 'Riyadh',
            latitude: 24.7,
            longitude: 46.7,
            title: 'Plot 1',
            address: 'Address 1',
            area: 1000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
          {
            id: '2',
            city: 'Riyadh',
            latitude: 24.8,
            longitude: 46.8,
            title: 'Plot 2',
            address: 'Address 2',
            area: 1500,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
        Jeddah: [
          {
            id: '3',
            city: 'Jeddah',
            latitude: 21.5,
            longitude: 39.2,
            title: 'Plot 3',
            address: 'Address 3',
            area: 2000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
      };

      const result = convertToCityClusters(cityData);

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(2);
      
      const riyadhCluster = result.features.find(f => f.properties.name === 'Riyadh');
      expect(riyadhCluster).toBeDefined();
      expect(riyadhCluster?.properties.plotCount).toBe(2);
      expect(riyadhCluster?.geometry.coordinates).toEqual([46.75, 24.75]); // Average of coordinates
      
      const jeddahCluster = result.features.find(f => f.properties.name === 'Jeddah');
      expect(jeddahCluster).toBeDefined();
      expect(jeddahCluster?.properties.plotCount).toBe(1);
    });

    it('should filter out cities with no plots', () => {
      const cityData = {
        Riyadh: [],
        Jeddah: [
          {
            id: '1',
            city: 'Jeddah',
            latitude: 21.5,
            longitude: 39.2,
            title: 'Plot 1',
            address: 'Address 1',
            area: 1000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
      };

      const result = convertToCityClusters(cityData);

      expect(result.features).toHaveLength(1);
      expect(result.features[0].properties.name).toBe('Jeddah');
    });

    it('should handle empty city data', () => {
      const result = convertToCityClusters({});
      
      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should calculate correct center coordinates for multiple plots', () => {
      const cityData = {
        TestCity: [
          {
            id: '1',
            city: 'TestCity',
            latitude: 20.0,
            longitude: 40.0,
            title: 'Plot 1',
            address: 'Address 1',
            area: 1000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
          {
            id: '2',
            city: 'TestCity',
            latitude: 30.0,
            longitude: 50.0,
            title: 'Plot 2',
            address: 'Address 2',
            area: 1000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
      };

      const result = convertToCityClusters(cityData);

      expect(result.features[0].geometry.coordinates).toEqual([45.0, 25.0]); // Average
    });

    it('should create proper GeoJSON feature structure', () => {
      const cityData = {
        TestCity: [
          {
            id: '1',
            city: 'TestCity',
            latitude: 24.7,
            longitude: 46.7,
            title: 'Plot 1',
            address: 'Address 1',
            area: 1000,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
      };

      const result = convertToCityClusters(cityData);
      const feature = result.features[0];

      expect(feature.type).toBe('Feature');
      expect(feature.geometry.type).toBe('Point');
      expect(feature.properties.type).toBe('city-cluster');
      expect(feature.properties.name).toBe('TestCity');
      expect(feature.properties.city).toBe('TestCity');
    });
  });

  describe('convertToIPlotPoints', () => {
    const sampleCityData = {
      Riyadh: [
        {
          id: '1',
          city: 'Riyadh',
          latitude: 24.7,
          longitude: 46.7,
          title: 'Plot 1',
          address: 'Address 1',
          area: 1000,
          price: 0,
          type: 'industrial' as const,
          status: 'available' as const,
          image: '/image1.jpg',
          description: 'Description 1',
          amenities: ['parking'],
          electricity: '100 MW',
          gas: '50 MMSCFD',
          water: '1000 m3/day',
        },
        {
          id: '2',
          city: 'Riyadh',
          latitude: 24.8,
          longitude: 46.8,
          title: 'Plot 2',
          address: 'Address 2',
          area: 1500,
          price: 0,
          type: 'industrial' as const,
          status: 'sold' as const,
          image: '/image2.jpg',
          description: 'Description 2',
          amenities: ['security'],
          electricity: '120 MW',
          gas: '60 MMSCFD',
          water: '1200 m3/day',
        },
      ],
      Jeddah: [
        {
          id: '3',
          city: 'Jeddah',
          latitude: 21.5,
          longitude: 39.2,
          title: 'Plot 3',
          address: 'Address 3',
          area: 2000,
          price: 0,
          type: 'industrial' as const,
          status: 'reserved' as const,
          image: '/image3.jpg',
          description: 'Description 3',
          amenities: ['utilities'],
        },
      ],
    };

    it('should convert plots for selected city', () => {
      const result = convertToIPlotPoints(sampleCityData, 'Riyadh');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(2);
      
      const feature1 = result.features[0];
      expect(feature1.type).toBe('Feature');
      expect(feature1.geometry.type).toBe('Point');
      expect(feature1.geometry.coordinates).toEqual([46.7, 24.7]);
      expect(feature1.properties.type).toBe('plot');
    });

    it('should return empty collection when city not found', () => {
      const result = convertToIPlotPoints(sampleCityData, 'NonExistentCity');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should return empty collection when selectedCity is undefined', () => {
      const result = convertToIPlotPoints(sampleCityData, undefined);

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should return empty collection when selectedCity is null', () => {
      const result = convertToIPlotPoints(sampleCityData, null as any);

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should include complete plot data in properties', () => {
      const result = convertToIPlotPoints(sampleCityData, 'Riyadh');
      const feature = result.features[0];

      expect(feature.properties).toMatchObject({
        id: '1',
        name: 'Plot 1',
        title: 'Plot 1',
        city: 'Riyadh',
        area: 1000,
        type: 'plot',
        status: 'available',
        electricity: '100 MW',
        gas: '50 MMSCFD',
        water: '1000 m3/day',
      });

      expect(feature.properties.plotData).toMatchObject({
        id: '1',
        title: 'Plot 1',
        name: 'Plot 1',
        city: 'Riyadh',
        area: 1000,
        type: 'industrial',
        status: 'available',
        electricity: '100 MW',
        gas: '50 MMSCFD',
        water: '1000 m3/day',
        image: '/image1.jpg',
      });
    });

    it('should handle empty city data', () => {
      const result = convertToIPlotPoints({}, 'AnyCity');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should handle city with no plots', () => {
      const emptyCity = { EmptyCity: [] };
      const result = convertToIPlotPoints(emptyCity, 'EmptyCity');

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
    });

    it('should preserve coordinate order (lng, lat)', () => {
      const result = convertToIPlotPoints(sampleCityData, 'Jeddah');
      const coordinates = result.features[0].geometry.coordinates;

      expect(coordinates).toEqual([39.2, 21.5]); // [longitude, latitude]
    });

    it('should handle plots with minimal data', () => {
      const minimalData = {
        TestCity: [
          {
            id: '1',
            city: 'TestCity',
            latitude: 24.0,
            longitude: 46.0,
            title: 'Minimal Plot',
            address: 'Address',
            area: 500,
            price: 0,
            type: 'industrial' as const,
            status: 'available' as const,
            image: '',
            description: '',
            amenities: [],
          },
        ],
      };

      const result = convertToIPlotPoints(minimalData, 'TestCity');

      expect(result.features).toHaveLength(1);
      expect(result.features[0].properties.electricity).toBeUndefined();
      expect(result.features[0].properties.gas).toBeUndefined();
      expect(result.features[0].properties.water).toBeUndefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle Math.random in convertPropertiesToTCityData consistently', () => {
      const properties: IProperty[] = [
        {
          id: '1',
          slug: 'prop-1',
          title: 'Property 1',
          city: 'Riyadh',
          area: 1000,
          status: 'available',
        },
      ];

      // Run multiple times to ensure randomness is handled
      const results = Array.from({ length: 5 }, () => 
        convertPropertiesToTCityData(properties)
      );

      results.forEach(result => {
        expect(result.Riyadh).toHaveLength(1);
        expect(result.Riyadh[0].latitude).toBeCloseTo(24.6775, 0);
        expect(result.Riyadh[0].longitude).toBeCloseTo(46.7749, 0);
      });
    });

    it('should handle very large datasets efficiently', () => {
      const largePropertySet: IProperty[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `prop-${i}`,
        slug: `prop-${i}`,
        title: `Property ${i}`,
        city: i % 2 === 0 ? 'Riyadh' : 'Jeddah',
        area: 1000 + i,
        status: 'available' as const,
      }));

      const result = convertPropertiesToTCityData(largePropertySet);

      expect(result.Riyadh).toHaveLength(500);
      expect(result.Jeddah).toHaveLength(500);
    });
  });
});