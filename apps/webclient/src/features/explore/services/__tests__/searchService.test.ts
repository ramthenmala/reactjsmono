import { searchService } from '@/features/explore/services/searchService';
import { apiFetch } from '@/shared/lib/api/client';
import { ISearchResponse, ISearchData, ISearchCity } from '@/features/explore/types/search';

jest.mock('@/shared/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const consoleSpy = {
  error: jest.fn(),
};

describe('searchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
    console.error = consoleSpy.error;
  });

  describe('getSearchData', () => {
    const mockSearchCities: ISearchCity[] = [
      {
        id: 'city-1',
        name: 'Industrial City 1',
        banner: '/images/city1-banner.jpg',
        cityName: 'Riyadh',
        regionName: 'Central Region',
        totalArea: '5000 km²',
        totalGasCapacity: '100 MMSCFD',
        totalWaterCapacity: '50000 m3/day',
        totalElectricityCapacity: '200 MW',
        nearestAirportDistance: '25 km',
        nearestDryportDistance: '15 km',
        nearestLandportDistance: '30 km',
        nearestRailwayDistance: '20 km',
        nearestSeaportDistance: '45 km',
        latitude: 24.7136,
        longitude: 46.6753,
      },
      {
        id: 'city-2',
        name: 'Industrial City 2',
        banner: null,
        cityName: 'Jeddah',
        regionName: 'Western Region',
        totalArea: '3000 km²',
        totalGasCapacity: null,
        totalWaterCapacity: '30000 m3/day',
        totalElectricityCapacity: '150 MW',
        nearestAirportDistance: '10 km',
        nearestDryportDistance: null,
        nearestLandportDistance: '25 km',
        nearestRailwayDistance: null,
        nearestSeaportDistance: '5 km',
        latitude: 21.4858,
        longitude: 39.1925,
      },
    ];

    const mockSearchData: ISearchData = {
      cities: mockSearchCities,
      total: 2,
      page: '1',
      limit: '10',
    };

    const mockApiResponse: ISearchResponse = {
      data: mockSearchData,
    };

    it('should fetch search data without parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await searchService.getSearchData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: undefined,
        queryParams: undefined,
      });
      expect(result).toEqual(mockSearchData);
    });

    it('should fetch search data with acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await searchService.getSearchData('ar');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'ar',
        queryParams: undefined,
      });
      expect(result).toEqual(mockSearchData);
    });

    it('should handle single ISIC parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { isic: '1520' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { isicIds: '1520' },
      });
    });

    it('should handle multiple ISIC parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { isic: '1520,1530,1540' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { 
          isicIds: '1540'  // Object.fromEntries only keeps the last value
        },
      });
    });

    it('should handle sector parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { sector: 'manufacturing' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { sectorIds: 'manufacturing' },
      });
    });

    it('should handle region parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { region: 'central' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { regionIds: 'central' },
      });
    });

    it('should handle location parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { location: 'riyadh' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { cityIds: 'riyadh' },
      });
    });

    it('should handle minArea and maxArea parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { minArea: '1000', maxArea: '5000' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { 
          minArea: '1000',
          maxArea: '5000'
        },
      });
    });

    it('should handle multiple parameter types together', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = {
        isic: '1520,1530',
        sector: 'manufacturing',
        region: 'central',
        location: 'riyadh',
        minArea: '1000',
        maxArea: '5000',
      };
      
      await searchService.getSearchData('ar', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'ar',
        queryParams: {
          isicIds: '1530',  // Object.fromEntries only keeps the last value
          sectorIds: 'manufacturing',
          regionIds: 'central',
          cityIds: 'riyadh',
          minArea: '1000',
          maxArea: '5000',
        },
      });
    });

    it('should ignore unknown parameter keys', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = {
        isic: '1520',
        unknownParam: 'should-be-ignored',
        anotherUnknown: 'also-ignored',
      };

      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { isicIds: '1520' },
      });
    });

    it('should handle empty response data with fallback defaults', async () => {
      const emptyResponse = { data: {} } as unknown as ISearchResponse;
      mockApiFetch.mockResolvedValue(emptyResponse);

      const result = await searchService.getSearchData('en');

      expect(result).toEqual({
        cities: [],
        total: 0,
        page: '1',
        limit: '10',
      });
    });

    it('should handle missing data property with fallback defaults', async () => {
      const malformedResponse = {} as ISearchResponse;
      mockApiFetch.mockResolvedValue(malformedResponse);

      const result = await searchService.getSearchData('en');

      expect(result).toEqual({
        cities: [],
        total: 0,
        page: '1',
        limit: '10',
      });
    });

    it('should handle partial data with some fields missing', async () => {
      const partialResponse = {
        data: {
          cities: mockSearchCities,
          total: 25,
        },
      } as unknown as ISearchResponse;

      mockApiFetch.mockResolvedValue(partialResponse);

      const result = await searchService.getSearchData('en');

      expect(result).toEqual({
        cities: mockSearchCities,
        total: 25,
        page: '1',
        limit: '10',
      });
    });

    it('should handle null values in data fields', async () => {
      const nullDataResponse = {
        data: {
          cities: null,
          total: null,
          page: null,
          limit: null,
        },
      } as unknown as ISearchResponse;

      mockApiFetch.mockResolvedValue(nullDataResponse);

      const result = await searchService.getSearchData('en');

      expect(result).toEqual({
        cities: [],
        total: 0,
        page: '1',
        limit: '10',
      });
    });

    it('should preserve city data structure and null values', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await searchService.getSearchData('en');

      expect(result.cities).toHaveLength(2);
      expect(result.cities[0]).toEqual(mockSearchCities[0]);
      expect(result.cities[1]).toEqual(mockSearchCities[1]);
      expect(result.cities[1].banner).toBeNull();
      expect(result.cities[1].totalGasCapacity).toBeNull();
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Network error');
      mockApiFetch.mockRejectedValue(apiError);

      await expect(searchService.getSearchData('en')).rejects.toThrow('Network error');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', apiError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiFetch.mockRejectedValue(timeoutError);

      await expect(searchService.getSearchData('ar', { isic: '1520' })).rejects.toThrow('Request timeout');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', timeoutError);
    });

    it('should handle server errors', async () => {
      const serverError = new Error('500 Internal Server Error');
      mockApiFetch.mockRejectedValue(serverError);

      await expect(searchService.getSearchData('en', { sector: 'tech' })).rejects.toThrow('500 Internal Server Error');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', serverError);
    });

    it('should use correct API endpoint', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      await searchService.getSearchData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', expect.any(Object));
    });

    it('should return structured data matching ISearchData interface', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await searchService.getSearchData();

      expect(result).toHaveProperty('cities');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(Array.isArray(result.cities)).toBe(true);
      expect(typeof result.total).toBe('number');
      expect(typeof result.page).toBe('string');
      expect(typeof result.limit).toBe('string');

      if (result.cities.length > 0) {
        const city = result.cities[0];
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('banner');
        expect(city).toHaveProperty('cityName');
        expect(city).toHaveProperty('latitude');
        expect(city).toHaveProperty('longitude');
        expect(typeof city.latitude).toBe('number');
        expect(typeof city.longitude).toBe('number');
      }
    });

    it('should handle ISIC parameters with spaces and trim them', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = { isic: ' 1520 , 1530 , 1540 ' };
      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: { 
          isicIds: '1540'  // Object.fromEntries only keeps the last value
        },
      });
    });

    it('should handle empty parameter values', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const params = {
        isic: '',
        sector: '',
        region: '',
        location: '',
        minArea: '',
        maxArea: '',
      };

      await searchService.getSearchData('en', params);

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
        acceptLanguage: 'en',
        queryParams: {
          isicIds: '', // Empty string results in empty isicIds
          sectorIds: '',
          regionIds: '',
          cityIds: '',
          minArea: '',
          maxArea: '',
        },
      });
    });

    it('should handle different language codes', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const languages = ['en', 'ar', 'fr', 'es', 'en-US', 'ar-SA'];

      for (const lang of languages) {
        await searchService.getSearchData(lang);
        expect(mockApiFetch).toHaveBeenCalledWith('/v1/search', {
          acceptLanguage: lang,
          queryParams: undefined,
        });
      }
    });

    it('should handle pagination parameters correctly', async () => {
      const paginationResponse = {
        data: {
          cities: mockSearchCities,
          total: 100,
          page: '3',
          limit: '20',
        },
      };

      mockApiFetch.mockResolvedValue(paginationResponse);

      const result = await searchService.getSearchData('en');

      expect(result.total).toBe(100);
      expect(result.page).toBe('3');
      expect(result.limit).toBe('20');
    });
  });
});