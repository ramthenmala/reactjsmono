import { filterOptionsService } from '@/services/filterOptionsService';
import { apiFetch } from '@/lib/api/client';
import { IFilteroptionsResponse, IFilterOptionsData } from '@/types';

// Mock the apiFetch function
jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe('filterOptionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getFilterData', () => {
    const mockApiResponse: IFilteroptionsResponse = {
      data: {
        isicCodes: [{ id: '1', code: 1010 }],
        regions: [{ id: 'region1', name: 'Region 1' }],
        sectors: [{ id: 'sector1', name: 'Sector 1' }],
        areaRange: { min: 0, max: 25000 },
        cities: [{ id: 'city1', name: 'City 1' }],
      },
    };

    it('should fetch filter data successfully without query parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await filterOptionsService.getFilterData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/filter-options', {
        acceptLanguage: undefined,
        queryParams: undefined,
      });

      expect(result).toEqual({
        isicCodes: mockApiResponse.data.isicCodes,
        regions: mockApiResponse.data.regions,
        sectors: mockApiResponse.data.sectors,
        areaRange: mockApiResponse.data.areaRange,
        cities: mockApiResponse.data.cities,
      });
    });

    it('should fetch filter data successfully with acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await filterOptionsService.getFilterData('en');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/filter-options', {
        acceptLanguage: 'en',
        queryParams: undefined,
      });

      expect(result).toEqual({
        isicCodes: mockApiResponse.data.isicCodes,
        regions: mockApiResponse.data.regions,
        sectors: mockApiResponse.data.sectors,
        areaRange: mockApiResponse.data.areaRange,
        cities: mockApiResponse.data.cities,
      });
    });

    it('should fetch filter data successfully with type parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await filterOptionsService.getFilterData('en', 'isic');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/filter-options', {
        acceptLanguage: 'en',
        queryParams: { type: 'isic' },
      });

      expect(result).toEqual({
        isicCodes: mockApiResponse.data.isicCodes,
        regions: mockApiResponse.data.regions,
        sectors: mockApiResponse.data.sectors,
        areaRange: mockApiResponse.data.areaRange,
        cities: mockApiResponse.data.cities,
      });
    });

    it('should fetch filter data successfully with regionId parameter', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await filterOptionsService.getFilterData('en', 'city', 'region1');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/filter-options', {
        acceptLanguage: 'en',
        queryParams: { type: 'city', regionId: 'region1' },
      });

      expect(result).toEqual({
        isicCodes: mockApiResponse.data.isicCodes,
        regions: mockApiResponse.data.regions,
        sectors: mockApiResponse.data.sectors,
        areaRange: mockApiResponse.data.areaRange,
        cities: mockApiResponse.data.cities,
      });
    });

    it('should fetch filter data successfully with all parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await filterOptionsService.getFilterData('es', 'sector', 'region2');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/filter-options', {
        acceptLanguage: 'es',
        queryParams: { type: 'sector', regionId: 'region2' },
      });

      expect(result).toEqual({
        isicCodes: mockApiResponse.data.isicCodes,
        regions: mockApiResponse.data.regions,
        sectors: mockApiResponse.data.sectors,
        areaRange: mockApiResponse.data.areaRange,
        cities: mockApiResponse.data.cities,
      });
    });

    it('should handle missing data properties gracefully', async () => {
      const incompleteResponse: IFilteroptionsResponse = {
        data: {
          isicCodes: [{ id: '1', code: 1010 }],
          // Missing other properties
        },
      };

      mockApiFetch.mockResolvedValue(incompleteResponse);

      const result = await filterOptionsService.getFilterData();

      expect(result).toEqual({
        isicCodes: incompleteResponse.data.isicCodes,
        regions: undefined,
        sectors: undefined,
        areaRange: undefined,
        cities: undefined,
      });
    });

    it('should handle empty data object', async () => {
      const emptyResponse: IFilteroptionsResponse = {
        data: {},
      };

      mockApiFetch.mockResolvedValue(emptyResponse);

      const result = await filterOptionsService.getFilterData();

      expect(result).toEqual({
        isicCodes: undefined,
        regions: undefined,
        sectors: undefined,
        areaRange: undefined,
        cities: undefined,
      });
    });

    it('should handle null/undefined data', async () => {
      const nullDataResponse: IFilteroptionsResponse = {
        data: {} as IFilterOptionsData,
      };

      mockApiFetch.mockResolvedValue(nullDataResponse);

      const result = await filterOptionsService.getFilterData();

      expect(result).toEqual({
        isicCodes: undefined,
        regions: undefined,
        sectors: undefined,
        areaRange: undefined,
        cities: undefined,
      });
    });

    it('should handle API errors and log them', async () => {
      const mockError = new Error('API Error');
      mockApiFetch.mockRejectedValue(mockError);

      await expect(filterOptionsService.getFilterData()).rejects.toThrow('API Error');

      expect(console.error).toHaveBeenCalledWith('Error fetching filter options data:', mockError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockApiFetch.mockRejectedValue(networkError);

      await expect(filterOptionsService.getFilterData('en', 'sector')).rejects.toThrow('Network Error');

      expect(console.error).toHaveBeenCalledWith('Error fetching filter options data:', networkError);
    });

    it('should only include queryParams when parameters are provided', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      // Test with only type
      await filterOptionsService.getFilterData(undefined, 'isic');
      expect(mockApiFetch).toHaveBeenLastCalledWith('/v1/search/filter-options', {
        acceptLanguage: undefined,
        queryParams: { type: 'isic' },
      });

      // Test with only regionId (should be ignored without type)
      await filterOptionsService.getFilterData(undefined, undefined, 'region1');
      expect(mockApiFetch).toHaveBeenLastCalledWith('/v1/search/filter-options', {
        acceptLanguage: undefined,
        queryParams: { regionId: 'region1' },
      });
    });

    it('should preserve exact structure of IFilterOptionsData', async () => {
      const expectedStructure: IFilterOptionsData = {
        isicCodes: [{ id: '1', code: 1010 }, { id: '2', code: 2020 }],
        regions: [{ id: 'r1', name: 'Region 1' }, { id: 'r2', name: 'Region 2' }],
        sectors: [{ id: 's1', name: 'Sector 1' }],
        areaRange: { min: 100, max: 50000 },
        cities: [{ id: 'c1', name: 'City 1' }],
      };

      mockApiFetch.mockResolvedValue({ data: expectedStructure });

      const result = await filterOptionsService.getFilterData();

      expect(result).toEqual(expectedStructure);
      expect(result.isicCodes).toHaveLength(2);
      expect(result.regions).toHaveLength(2);
      expect(result.sectors).toHaveLength(1);
      expect(result.cities).toHaveLength(1);
      expect(result.areaRange).toEqual({ min: 100, max: 50000 });
    });
  });
});