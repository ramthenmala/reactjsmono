import { renderHook, act } from '@testing-library/react';
import { useSearchFiltersStore } from '@/shared/hooks/useSearchFiltersStore';
import { useSearchFilterStore } from '@/store/searchFilterStore';
import { SearchFilters, AreaRange } from '@/types/search';

// Mock the store
jest.mock('@/store/searchFilterStore', () => ({
  useSearchFilterStore: jest.fn(),
}));

const mockUseSearchFilterStore = useSearchFilterStore as jest.MockedFunction<typeof useSearchFilterStore>;

describe('useSearchFiltersStore', () => {
  const mockStoreMethods = {
    filters: {
      isic: [],
      sector: '',
      region: '',
      location: '',
      minArea: 0,
      maxArea: 25000,
    },
    areaValue: [0, 25000] as [number, number],
    updateFilters: jest.fn(),
    updateAreaValue: jest.fn(),
    setAreaRange: jest.fn(),
    clearFilters: jest.fn(),
    hasActiveFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchFilterStore.mockReturnValue(mockStoreMethods);
    mockStoreMethods.hasActiveFilters.mockReturnValue(false);
  });

  describe('initialization', () => {
    it('should return store state and methods', () => {
      const { result } = renderHook(() => useSearchFiltersStore());

      expect(result.current.filters).toEqual(mockStoreMethods.filters);
      expect(result.current.areaValue).toEqual(mockStoreMethods.areaValue);
      expect(typeof result.current.updateFilters).toBe('function');
      expect(typeof result.current.updateAreaValue).toBe('function');
      expect(typeof result.current.clearFilters).toBe('function');
      expect(typeof result.current.hasActiveFilters).toBe('function');
    });

    it('should call setAreaRange when areaRange is provided', () => {
      const areaRange: AreaRange = { min: 100, max: 50000 };

      renderHook(() => useSearchFiltersStore({ areaRange }));

      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledWith(areaRange);
    });

    it('should not call setAreaRange when areaRange is not provided', () => {
      renderHook(() => useSearchFiltersStore());

      expect(mockStoreMethods.setAreaRange).not.toHaveBeenCalled();
    });
  });

  describe('initialFilters handling', () => {
    it('should call updateFilters with initialFilters on mount', () => {
      const initialFilters: Partial<SearchFilters> = {
        sector: 'technology',
        region: 'riyadh',
        isic: ['1010'],
      };

      renderHook(() => useSearchFiltersStore({ initialFilters }));

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith(initialFilters);
    });

    it('should not call updateFilters when initialFilters is empty', () => {
      renderHook(() => useSearchFiltersStore({ initialFilters: {} }));

      expect(mockStoreMethods.updateFilters).not.toHaveBeenCalled();
    });

    it('should only call updateFilters on mount, not on re-renders', () => {
      const initialFilters: Partial<SearchFilters> = {
        sector: 'technology',
      };

      const { rerender } = renderHook(() => useSearchFiltersStore({ initialFilters }));

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledTimes(1);

      rerender();

      // Should still be called only once
      expect(mockStoreMethods.updateFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('areaRange handling', () => {
    it('should update area range when it changes', () => {
      const areaRange1: AreaRange = { min: 100, max: 30000 };
      const { rerender } = renderHook(
        ({ areaRange }) => useSearchFiltersStore({ areaRange }),
        { initialProps: { areaRange: areaRange1 } }
      );

      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledWith(areaRange1);

      mockStoreMethods.setAreaRange.mockClear();

      const areaRange2: AreaRange = { min: 500, max: 50000 };
      rerender({ areaRange: areaRange2 });

      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledWith(areaRange2);
    });

    it('should not call setAreaRange repeatedly with same value', () => {
      const areaRange: AreaRange = { min: 100, max: 30000 };
      const { rerender } = renderHook(
        ({ areaRange }) => useSearchFiltersStore({ areaRange }),
        { initialProps: { areaRange } }
      );

      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledTimes(1);

      rerender({ areaRange });

      // Should still be called only once since dependency didn't change
      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onFiltersChange callback', () => {
    it('should call onFiltersChange when filters change', () => {
      const onFiltersChange = jest.fn();
      const mockFilters = {
        isic: ['1010'],
        sector: 'tech',
        region: '',
        location: '',
        minArea: 0,
        maxArea: 25000,
      };

      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: mockFilters,
      });

      renderHook(() => useSearchFiltersStore({ onFiltersChange }));

      expect(onFiltersChange).toHaveBeenCalledWith(mockFilters);
    });

    it('should call onFiltersChange when filters update', () => {
      const onFiltersChange = jest.fn();
      const initialFilters = { ...mockStoreMethods.filters };
      const updatedFilters = { ...mockStoreMethods.filters, sector: 'technology' };

      mockUseSearchFilterStore
        .mockReturnValueOnce({ ...mockStoreMethods, filters: initialFilters })
        .mockReturnValueOnce({ ...mockStoreMethods, filters: updatedFilters });

      const { rerender } = renderHook(() => useSearchFiltersStore({ onFiltersChange }));

      expect(onFiltersChange).toHaveBeenCalledWith(initialFilters);

      onFiltersChange.mockClear();
      rerender();

      expect(onFiltersChange).toHaveBeenCalledWith(updatedFilters);
    });

    it('should not call onFiltersChange when not provided', () => {
      // Should not throw even without onFiltersChange
      expect(() => {
        renderHook(() => useSearchFiltersStore());
      }).not.toThrow();
    });
  });

  describe('enhanced updateFilters', () => {
    it('should call store updateFilters when region is not changed', () => {
      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { sector: 'technology' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith(updates);
    });

    it('should clear location when region changes', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { region: 'riyadh' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith({
        region: 'riyadh',
        location: '',
      });
    });

    it('should not clear location when region remains the same', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { region: 'eastern', sector: 'technology' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith(updates);
    });

    it('should handle undefined region updates', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { sector: 'technology' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith(updates);
    });

    it('should clear location when region changes from empty to a value', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: '' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { region: 'riyadh' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith({
        region: 'riyadh',
        location: '',
      });
    });

    it('should clear location when region changes from a value to empty', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      const updates = { region: '' };

      act(() => {
        result.current.updateFilters(updates);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith({
        region: '',
        location: '',
      });
    });
  });

  describe('passthrough methods', () => {
    it('should call store updateAreaValue', () => {
      const { result } = renderHook(() => useSearchFiltersStore());

      const areaValue: [number, number] = [1000, 20000];

      act(() => {
        result.current.updateAreaValue(areaValue);
      });

      expect(mockStoreMethods.updateAreaValue).toHaveBeenCalledWith(areaValue);
    });

    it('should call store clearFilters', () => {
      const { result } = renderHook(() => useSearchFiltersStore());

      act(() => {
        result.current.clearFilters();
      });

      expect(mockStoreMethods.clearFilters).toHaveBeenCalled();
    });

    it('should call store hasActiveFilters', () => {
      mockStoreMethods.hasActiveFilters.mockReturnValue(true);

      const { result } = renderHook(() => useSearchFiltersStore());

      const hasActive = result.current.hasActiveFilters();

      expect(mockStoreMethods.hasActiveFilters).toHaveBeenCalled();
      expect(hasActive).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle full initialization with all options', () => {
      const initialFilters: Partial<SearchFilters> = {
        sector: 'manufacturing',
        isic: ['1010', '2020'],
      };
      const areaRange: AreaRange = { min: 500, max: 40000 };
      const onFiltersChange = jest.fn();

      const mockFilters = { ...mockStoreMethods.filters, ...initialFilters };
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: mockFilters,
      });

      renderHook(() => useSearchFiltersStore({
        initialFilters,
        areaRange,
        onFiltersChange,
      }));

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith(initialFilters);
      expect(mockStoreMethods.setAreaRange).toHaveBeenCalledWith(areaRange);
      expect(onFiltersChange).toHaveBeenCalledWith(mockFilters);
    });

    it('should handle multiple region changes correctly', () => {
      let currentRegion = '';
      
      mockUseSearchFilterStore.mockImplementation(() => ({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: currentRegion },
      }));

      const { result, rerender } = renderHook(() => useSearchFiltersStore());

      // Change from empty to riyadh
      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenLastCalledWith({
        region: 'riyadh',
        location: '',
      });

      // Update current region for next test
      currentRegion = 'riyadh';
      rerender();

      // Change from riyadh to eastern
      act(() => {
        result.current.updateFilters({ region: 'eastern' });
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenLastCalledWith({
        region: 'eastern',
        location: '',
      });

      // Update current region for next test
      currentRegion = 'eastern';
      rerender();

      // Update other field, should not clear location
      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenLastCalledWith({
        sector: 'technology',
      });
    });

    it('should handle rapid consecutive updates', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
        result.current.updateAreaValue([1000, 20000]);
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledTimes(2);
      expect(mockStoreMethods.updateAreaValue).toHaveBeenCalledWith([1000, 20000]);
      expect(mockStoreMethods.updateFilters).toHaveBeenLastCalledWith({
        region: 'riyadh',
        location: '',
      });
    });
  });

  describe('integration with store', () => {
    it('should reflect store state changes', () => {
      const initialState = {
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, sector: 'tech' },
        areaValue: [1000, 20000] as [number, number],
      };

      mockUseSearchFilterStore.mockReturnValue(initialState);

      const { result } = renderHook(() => useSearchFiltersStore());

      expect(result.current.filters.sector).toBe('tech');
      expect(result.current.areaValue).toEqual([1000, 20000]);
    });

    it('should work with hasActiveFilters from store', () => {
      mockStoreMethods.hasActiveFilters.mockReturnValue(true);

      const { result } = renderHook(() => useSearchFiltersStore());

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should maintain method references from store', () => {
      const { result } = renderHook(() => useSearchFiltersStore());

      expect(result.current.updateAreaValue).toBe(mockStoreMethods.updateAreaValue);
      expect(result.current.clearFilters).toBe(mockStoreMethods.clearFilters);
      expect(result.current.hasActiveFilters).toBe(mockStoreMethods.hasActiveFilters);
    });
  });

  describe('edge cases', () => {
    it('should handle missing options parameter', () => {
      expect(() => {
        renderHook(() => useSearchFiltersStore());
      }).not.toThrow();
    });

    it('should handle region changes with multiple fields in update', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      act(() => {
        result.current.updateFilters({
          region: 'riyadh',
          sector: 'technology',
          isic: ['1010', '2020'],
        });
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith({
        region: 'riyadh',
        sector: 'technology',
        isic: ['1010', '2020'],
        location: '',
      });
    });

    it('should handle null/undefined values in updates', () => {
      mockUseSearchFilterStore.mockReturnValue({
        ...mockStoreMethods,
        filters: { ...mockStoreMethods.filters, region: 'eastern' },
      });

      const { result } = renderHook(() => useSearchFiltersStore());

      act(() => {
        result.current.updateFilters({
          sector: undefined,
          region: null,
        } as any);
      });

      expect(mockStoreMethods.updateFilters).toHaveBeenCalledWith({
        sector: undefined,
        region: null,
        location: '',
      });
    });
  });
});