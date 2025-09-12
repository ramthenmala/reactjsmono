import { renderHook, waitFor } from '@testing-library/react';
import { useSearchData } from '@/shared/hooks/useSearchData';
import { filterOptionsService } from '@/services';
import { useCurrentLocale } from '@/lib';
import { IFilterOptionsData } from '@/types';

// Mock dependencies
jest.mock('../../services', () => ({
  filterOptionsService: {
    getFilterData: jest.fn(),
  },
}));

jest.mock('../../lib', () => ({
  useCurrentLocale: jest.fn(),
}));

const mockFilterOptionsService = filterOptionsService.getFilterData as jest.MockedFunction<typeof filterOptionsService.getFilterData>;
const mockUseCurrentLocale = useCurrentLocale as jest.MockedFunction<typeof useCurrentLocale>;

describe('useSearchData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentLocale.mockReturnValue('en');
    
    // Mock console.error to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockData: Record<string, IFilterOptionsData> = {
    isic: {
      isicCodes: [
        { id: '1', code: 1010 },
        { id: '2', code: 2020 },
      ],
    },
    sector: {
      sectors: [
        { id: 'tech', name: 'Technology' },
        { id: 'manu', name: 'Manufacturing' },
      ],
    },
    region: {
      regions: [
        { id: 'riyadh', name: 'Riyadh' },
        { id: 'eastern', name: 'Eastern Province' },
      ],
    },
    area: {
      areaRange: { min: 100, max: 50000 },
    },
    city: {
      cities: [
        { id: 'ruh', name: 'Riyadh City' },
        { id: 'dam', name: 'Dammam' },
      ],
    },
  };

  describe('initial state', () => {
    it('should have correct initial values', async () => {
      // Mock the service calls to prevent initial loading
      mockFilterOptionsService.mockResolvedValue({});

      const { result } = renderHook(() => useSearchData());

      expect(result.current.isics).toEqual([]);
      expect(result.current.sectors).toEqual([]);
      expect(result.current.regions).toEqual([]);
      expect(result.current.cities).toEqual([]);
      expect(result.current.areaRange).toEqual({ min: 0, max: 25000 });
      expect(typeof result.current.loadCities).toBe('function');
      
      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('initial data loading', () => {
    it('should load all initial data successfully', async () => {
      mockFilterOptionsService
        .mockResolvedValueOnce(mockData.isic)
        .mockResolvedValueOnce(mockData.sector)
        .mockResolvedValueOnce(mockData.region)
        .mockResolvedValueOnce(mockData.area);

      const { result } = renderHook(() => useSearchData());

      // Should be loading initially
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFilterOptionsService).toHaveBeenCalledTimes(4);
      expect(mockFilterOptionsService).toHaveBeenNthCalledWith(1, 'en', 'isicCode');
      expect(mockFilterOptionsService).toHaveBeenNthCalledWith(2, 'en', 'sector');
      expect(mockFilterOptionsService).toHaveBeenNthCalledWith(3, 'en', 'region');
      expect(mockFilterOptionsService).toHaveBeenNthCalledWith(4, 'en', 'area');

      expect(result.current.isics).toEqual(mockData.isic.isicCodes);
      expect(result.current.sectors).toEqual(mockData.sector.sectors);
      expect(result.current.regions).toEqual(mockData.region.regions);
      expect(result.current.areaRange).toEqual(mockData.area.areaRange);
    });

    it('should handle missing data gracefully', async () => {
      const incompleteData: IFilterOptionsData = {
        isicCodes: undefined,
        sectors: mockData.sector.sectors,
        regions: undefined,
        areaRange: mockData.area.areaRange,
      };

      mockFilterOptionsService
        .mockResolvedValueOnce(incompleteData)
        .mockResolvedValueOnce(incompleteData)
        .mockResolvedValueOnce(incompleteData)
        .mockResolvedValueOnce(incompleteData);

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isics).toEqual([]);
      expect(result.current.sectors).toEqual(mockData.sector.sectors);
      expect(result.current.regions).toEqual([]);
      expect(result.current.areaRange).toEqual(mockData.area.areaRange);
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('API Error');
      mockFilterOptionsService.mockRejectedValue(apiError);

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith('Failed to load search data:', apiError);
      
      // Should maintain default values
      expect(result.current.isics).toEqual([]);
      expect(result.current.sectors).toEqual([]);
      expect(result.current.regions).toEqual([]);
      expect(result.current.areaRange).toEqual({ min: 0, max: 25000 });
    });

    it('should use default area range when API returns undefined', async () => {
      mockFilterOptionsService
        .mockResolvedValueOnce({ isicCodes: [] })
        .mockResolvedValueOnce({ sectors: [] })
        .mockResolvedValueOnce({ regions: [] })
        .mockResolvedValueOnce({ areaRange: undefined });

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.areaRange).toEqual({ min: 0, max: 25000 });
    });
  });

  describe('locale dependency', () => {
    it('should reload data when locale changes', async () => {
      const { rerender } = renderHook(() => useSearchData());

      // Initial call with 'en'
      await waitFor(() => {
        expect(mockFilterOptionsService).toHaveBeenCalledTimes(4);
      });

      // Change locale
      mockUseCurrentLocale.mockReturnValue('ar');
      mockFilterOptionsService.mockClear();

      rerender();

      // Should call API again with new locale
      await waitFor(() => {
        expect(mockFilterOptionsService).toHaveBeenCalledTimes(4);
        expect(mockFilterOptionsService).toHaveBeenCalledWith('ar', 'isicCode');
        expect(mockFilterOptionsService).toHaveBeenCalledWith('ar', 'sector');
        expect(mockFilterOptionsService).toHaveBeenCalledWith('ar', 'region');
        expect(mockFilterOptionsService).toHaveBeenCalledWith('ar', 'area');
      });
    });

    it('should handle different locales correctly', async () => {
      const locales = ['en', 'ar', 'es', 'fr'];

      for (const locale of locales) {
        mockUseCurrentLocale.mockReturnValue(locale);
        mockFilterOptionsService.mockClear();

        renderHook(() => useSearchData());

        await waitFor(() => {
          expect(mockFilterOptionsService).toHaveBeenCalledWith(locale, 'isicCode');
        });
      }
    });
  });

  describe('loadCities function', () => {
    it('should load cities for a valid region', async () => {
      // Mock initial loading calls first
      mockFilterOptionsService
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Now mock the cities call
      mockFilterOptionsService.mockResolvedValueOnce(mockData.city);

      await result.current.loadCities('riyadh');

      expect(mockFilterOptionsService).toHaveBeenLastCalledWith('en', 'city', 'riyadh');
      
      await waitFor(() => {
        expect(result.current.cities).toEqual(mockData.city.cities);
      });
    });

    it('should clear cities when regionId is empty', async () => {
      // Mock initial loading calls first
      mockFilterOptionsService
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock and set some initial cities
      mockFilterOptionsService.mockResolvedValueOnce(mockData.city);
      await result.current.loadCities('riyadh');
      
      await waitFor(() => {
        expect(result.current.cities).toEqual(mockData.city.cities);
      });

      // Clear cities
      mockFilterOptionsService.mockClear();
      await result.current.loadCities('');

      expect(mockFilterOptionsService).not.toHaveBeenCalled();
      
      await waitFor(() => {
        expect(result.current.cities).toEqual([]);
      });
    });

    it('should clear cities when regionId is "all"', async () => {
      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFilterOptionsService.mockClear();
      await result.current.loadCities('all');

      expect(mockFilterOptionsService).not.toHaveBeenCalled();
      expect(result.current.cities).toEqual([]);
    });

    it('should handle loadCities API errors gracefully', async () => {
      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const cityError = new Error('City API Error');
      mockFilterOptionsService.mockRejectedValue(cityError);

      await result.current.loadCities('riyadh');

      expect(console.error).toHaveBeenCalledWith('Failed to load cities:', cityError);
      expect(result.current.cities).toEqual([]);
    });

    it('should set loading state during city loading', async () => {
      // Mock initial loading calls first
      mockFilterOptionsService
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock a delayed response
      let resolvePromise: (value: IFilterOptionsData) => void;
      const delayedPromise = new Promise<IFilterOptionsData>(resolve => {
        resolvePromise = resolve;
      });
      mockFilterOptionsService.mockReturnValueOnce(delayedPromise);

      const loadPromise = result.current.loadCities('riyadh');

      // Should be loading immediately
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Resolve the promise
      resolvePromise!(mockData.city);
      await loadPromise;

      // Should not be loading anymore
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle missing cities data', async () => {
      mockFilterOptionsService.mockResolvedValue({ cities: undefined });

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.loadCities('riyadh');

      expect(result.current.cities).toEqual([]);
    });

    it('should use current locale for city loading', async () => {
      mockUseCurrentLocale.mockReturnValue('ar');
      mockFilterOptionsService.mockResolvedValue(mockData.city);

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Clear initial calls
      mockFilterOptionsService.mockClear();

      await result.current.loadCities('riyadh');

      expect(mockFilterOptionsService).toHaveBeenCalledWith('ar', 'city', 'riyadh');
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple concurrent loadCities calls', async () => {
      mockFilterOptionsService.mockResolvedValue(mockData.city);

      const { result } = renderHook(() => useSearchData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFilterOptionsService.mockClear();

      // Make concurrent calls
      const promise1 = result.current.loadCities('riyadh');
      const promise2 = result.current.loadCities('eastern');

      await Promise.all([promise1, promise2]);

      // Should have been called twice
      expect(mockFilterOptionsService).toHaveBeenCalledTimes(2);
      expect(mockFilterOptionsService).toHaveBeenCalledWith('en', 'city', 'riyadh');
      expect(mockFilterOptionsService).toHaveBeenCalledWith('en', 'city', 'eastern');
    });

    it('should handle loadCities during initial data loading', async () => {
      // Delay the initial loading
      let resolveInitialPromises: (value: IFilterOptionsData) => void[] = [];
      const delayedPromises = Array(4).fill(0).map(() => 
        new Promise<IFilterOptionsData>(resolve => {
          resolveInitialPromises.push(resolve);
        })
      );

      mockFilterOptionsService
        .mockReturnValueOnce(delayedPromises[0])
        .mockReturnValueOnce(delayedPromises[1])
        .mockReturnValueOnce(delayedPromises[2])
        .mockReturnValueOnce(delayedPromises[3]);

      const { result } = renderHook(() => useSearchData());

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      // Try to load cities while initial data is loading
      mockFilterOptionsService.mockResolvedValue(mockData.city);
      const cityPromise = result.current.loadCities('riyadh');

      // Resolve initial promises
      resolveInitialPromises.forEach((resolve, index) => {
        resolve(Object.values(mockData)[index]);
      });

      await cityPromise;

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cities).toEqual(mockData.city.cities);
    });
  });

  describe('memory and cleanup', () => {
    it('should maintain consistent function references', () => {
      const { result, rerender } = renderHook(() => useSearchData());

      const initialLoadCities = result.current.loadCities;

      rerender();

      // loadCities should be the same reference due to useCallback
      expect(result.current.loadCities).toBe(initialLoadCities);
    });

    it('should handle component unmounting during async operations', async () => {
      let resolvePromise: (value: IFilterOptionsData) => void;
      const delayedPromise = new Promise<IFilterOptionsData>(resolve => {
        resolvePromise = resolve;
      });
      mockFilterOptionsService.mockReturnValue(delayedPromise);

      const { result, unmount } = renderHook(() => useSearchData());

      // Start loading cities
      result.current.loadCities('riyadh');

      // Unmount before promise resolves
      unmount();

      // Resolve the promise after unmounting
      resolvePromise!(mockData.city);

      // Should not throw any errors
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });
});