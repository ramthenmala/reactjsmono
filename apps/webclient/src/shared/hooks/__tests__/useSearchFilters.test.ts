import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchFilters } from '@/shared/hooks/useSearchFilters';
import { SearchFilters, AreaRange } from '@/types/search';

describe('useSearchFilters', () => {
  const defaultFilters: SearchFilters = {
    isic: [],
    sector: '',
    region: '',
    location: '',
    minArea: 0,
    maxArea: 25000,
  };

  const defaultAreaRange: AreaRange = { min: 0, max: 25000 };

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useSearchFilters());

      expect(result.current.filters).toEqual(defaultFilters);
      expect(result.current.areaValue).toEqual([0, 25000]);
    });

    it('should initialize with custom initial filters', () => {
      const initialFilters: Partial<SearchFilters> = {
        sector: 'technology',
        region: 'riyadh',
        isic: ['1010', '2020'],
      };

      const { result } = renderHook(() => useSearchFilters({ initialFilters }));

      expect(result.current.filters).toEqual({
        ...defaultFilters,
        ...initialFilters,
      });
    });

    it('should initialize with custom area values from initial filters', () => {
      const initialFilters: Partial<SearchFilters> = {
        minArea: 1000,
        maxArea: 15000,
      };

      const { result } = renderHook(() => useSearchFilters({ initialFilters }));

      expect(result.current.areaValue).toEqual([1000, 15000]);
      expect(result.current.filters.minArea).toBe(1000);
      expect(result.current.filters.maxArea).toBe(15000);
    });

    it('should initialize with custom area range', () => {
      const areaRange: AreaRange = { min: 100, max: 50000 };

      const { result } = renderHook(() => useSearchFilters({ areaRange }));

      expect(result.current.areaValue).toEqual([100, 50000]);
      expect(result.current.filters.minArea).toBe(100);
      expect(result.current.filters.maxArea).toBe(50000);
    });

    it('should not override initial area values with area range', () => {
      const initialFilters: Partial<SearchFilters> = {
        minArea: 5000,
        maxArea: 20000,
      };
      const areaRange: AreaRange = { min: 100, max: 50000 };

      const { result } = renderHook(() => useSearchFilters({ initialFilters, areaRange }));

      expect(result.current.areaValue).toEqual([5000, 20000]);
      expect(result.current.filters.minArea).toBe(5000);
      expect(result.current.filters.maxArea).toBe(20000);
    });
  });

  describe('updateFilters', () => {
    it('should update single filter', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(result.current.filters.sector).toBe('technology');
      expect(result.current.filters.region).toBe('');
    });

    it('should update multiple filters', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateFilters({
          sector: 'manufacturing',
          region: 'eastern',
          isic: ['1010', '2020'],
        });
      });

      expect(result.current.filters.sector).toBe('manufacturing');
      expect(result.current.filters.region).toBe('eastern');
      expect(result.current.filters.isic).toEqual(['1010', '2020']);
    });

    it('should call onFiltersChange callback', () => {
      const onFiltersChange = jest.fn();
      const { result } = renderHook(() => useSearchFilters({ onFiltersChange }));

      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        sector: 'technology',
      });
    });

    it('should clear location when region changes', () => {
      const { result } = renderHook(() => useSearchFilters());

      // Set initial location
      act(() => {
        result.current.updateFilters({ location: 'dammam' });
      });
      expect(result.current.filters.location).toBe('dammam');

      // Change region should clear location
      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(result.current.filters.region).toBe('riyadh');
      expect(result.current.filters.location).toBe('');
    });

    it('should not clear location when region is not changed', () => {
      const { result } = renderHook(() => useSearchFilters());

      // First, set initial values separately to avoid region clearing logic
      act(() => {
        result.current.updateFilters({ region: 'eastern' });
      });

      act(() => {
        result.current.updateFilters({ location: 'dammam' });
      });

      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(result.current.filters.location).toBe('dammam');
    });

    it('should preserve other filters when updating', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateFilters({
          sector: 'tech',
          region: 'east',
          isic: ['1010'],
        });
      });

      act(() => {
        result.current.updateFilters({ location: 'city' });
      });

      expect(result.current.filters.sector).toBe('tech');
      expect(result.current.filters.region).toBe('east');
      expect(result.current.filters.isic).toEqual(['1010']);
      expect(result.current.filters.location).toBe('city');
    });
  });

  describe('updateAreaValue', () => {
    it('should update area value', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateAreaValue([1000, 15000]);
      });

      expect(result.current.areaValue).toEqual([1000, 15000]);
    });

    it('should not affect filters when updating area value', () => {
      const { result } = renderHook(() => useSearchFilters());

      const initialFilters = { ...result.current.filters };

      act(() => {
        result.current.updateAreaValue([2000, 20000]);
      });

      expect(result.current.filters).toEqual(initialFilters);
    });

    it('should handle zero values', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateAreaValue([0, 0]);
      });

      expect(result.current.areaValue).toEqual([0, 0]);
    });

    it('should handle maximum values', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateAreaValue([0, 100000]);
      });

      expect(result.current.areaValue).toEqual([0, 100000]);
    });
  });

  describe('clearFilters', () => {
    it('should reset filters to default with default area range', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateFilters({
          sector: 'tech',
          region: 'east',
          location: 'city',
          isic: ['1010'],
        });
        result.current.updateAreaValue([5000, 20000]);
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual(defaultFilters);
      expect(result.current.areaValue).toEqual([0, 25000]);
    });

    it('should reset filters with custom area range', async () => {
      const areaRange: AreaRange = { min: 100, max: 50000 };
      const { result } = renderHook(() => useSearchFilters({ areaRange }));

      // Wait for the area range effect to complete
      await waitFor(() => {
        expect(result.current.filters.minArea).toBe(100);
        expect(result.current.filters.maxArea).toBe(50000);
      });

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
      });

      act(() => {
        result.current.clearFilters();
      });

      // The reducer resets to DEFAULT_FILTERS, but area value is updated separately
      expect(result.current.filters).toEqual(defaultFilters);
      expect(result.current.areaValue).toEqual([100, 50000]);
    });

    it('should call onFiltersChange when clearing', () => {
      const onFiltersChange = jest.fn();
      const areaRange: AreaRange = { min: 200, max: 40000 };
      const { result } = renderHook(() => useSearchFilters({ onFiltersChange, areaRange }));

      // Clear initial callback call
      onFiltersChange.mockClear();

      act(() => {
        result.current.clearFilters();
      });

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        minArea: 200,
        maxArea: 40000,
      });
    });
  });

  describe('setAreaFromFilters', () => {
    it('should set area value from current filters', () => {
      const { result } = renderHook(() => useSearchFilters());

      act(() => {
        result.current.updateFilters({ minArea: 3000, maxArea: 18000 });
      });

      act(() => {
        result.current.setAreaFromFilters();
      });

      expect(result.current.areaValue).toEqual([3000, 18000]);
    });

    it('should update area value even when filters have not changed', () => {
      const { result } = renderHook(() => useSearchFilters({
        initialFilters: { minArea: 5000, maxArea: 25000 }
      }));

      // Manually change area value
      act(() => {
        result.current.updateAreaValue([1000, 10000]);
      });

      // Reset to filter values
      act(() => {
        result.current.setAreaFromFilters();
      });

      expect(result.current.areaValue).toEqual([5000, 25000]);
    });
  });

  describe('area range updates', () => {
    it('should update area values when area range changes and no initial values set', () => {
      const { result, rerender } = renderHook(
        ({ areaRange }) => useSearchFilters({ areaRange }),
        { initialProps: { areaRange: defaultAreaRange } }
      );

      const newAreaRange: AreaRange = { min: 500, max: 30000 };

      rerender({ areaRange: newAreaRange });

      expect(result.current.areaValue).toEqual([500, 30000]);
      expect(result.current.filters.minArea).toBe(500);
      expect(result.current.filters.maxArea).toBe(30000);
    });

    it('should not update area values when initial values are provided', () => {
      const initialFilters: Partial<SearchFilters> = {
        minArea: 2000,
        maxArea: 20000,
      };

      const { result, rerender } = renderHook(
        ({ areaRange }) => useSearchFilters({ areaRange, initialFilters }),
        { initialProps: { areaRange: defaultAreaRange } }
      );

      const newAreaRange: AreaRange = { min: 500, max: 30000 };

      rerender({ areaRange: newAreaRange });

      // Should keep initial values
      expect(result.current.areaValue).toEqual([2000, 20000]);
      expect(result.current.filters.minArea).toBe(2000);
      expect(result.current.filters.maxArea).toBe(20000);
    });
  });

  describe('callback consistency', () => {
    it('should maintain callback stability', () => {
      const { result, rerender } = renderHook(() => useSearchFilters());

      const initialCallbacks = {
        updateFilters: result.current.updateFilters,
        updateAreaValue: result.current.updateAreaValue,
        clearFilters: result.current.clearFilters,
        setAreaFromFilters: result.current.setAreaFromFilters,
      };

      rerender();

      expect(result.current.updateFilters).toBe(initialCallbacks.updateFilters);
      expect(result.current.updateAreaValue).toBe(initialCallbacks.updateAreaValue);
      expect(result.current.clearFilters).toBe(initialCallbacks.clearFilters);
      expect(result.current.setAreaFromFilters).toBe(initialCallbacks.setAreaFromFilters);
    });

    it('should update callback when dependencies change', () => {
      const onFiltersChange1 = jest.fn();
      const onFiltersChange2 = jest.fn();

      const { result, rerender } = renderHook(
        ({ onFiltersChange }) => useSearchFilters({ onFiltersChange }),
        { initialProps: { onFiltersChange: onFiltersChange1 } }
      );

      const initialUpdateFilters = result.current.updateFilters;

      rerender({ onFiltersChange: onFiltersChange2 });

      // updateFilters should change because onFiltersChange dependency changed
      expect(result.current.updateFilters).not.toBe(initialUpdateFilters);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple rapid updates', () => {
      const onFiltersChange = jest.fn();
      const { result } = renderHook(() => useSearchFilters({ onFiltersChange }));

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
        result.current.updateFilters({ region: 'riyadh' });
        result.current.updateFilters({ isic: ['1010'] });
        result.current.updateAreaValue([1000, 20000]);
      });

      expect(result.current.filters.sector).toBe('tech');
      expect(result.current.filters.region).toBe('riyadh');
      expect(result.current.filters.isic).toEqual(['1010']);
      expect(result.current.areaValue).toEqual([1000, 20000]);
      expect(onFiltersChange).toHaveBeenCalledTimes(3); // Once for each updateFilters call
    });

    it('should handle region changes with location clearing', () => {
      const onFiltersChange = jest.fn();
      const { result } = renderHook(() => useSearchFilters({ onFiltersChange }));

      onFiltersChange.mockClear();

      act(() => {
        result.current.updateFilters({
          region: 'eastern',
          location: 'dammam',
        });
      });

      expect(onFiltersChange).toHaveBeenCalledTimes(1);
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          region: 'eastern',
          location: 'dammam',
        })
      );

      onFiltersChange.mockClear();

      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(onFiltersChange).toHaveBeenCalledTimes(1);
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          region: 'riyadh',
          location: '', // Should be cleared
        })
      );
    });

    it('should handle full workflow scenario', async () => {
      const areaRange: AreaRange = { min: 100, max: 50000 };
      const onFiltersChange = jest.fn();
      const { result } = renderHook(() => useSearchFilters({ areaRange, onFiltersChange }));

      // Wait for area range to be applied
      await waitFor(() => {
        expect(result.current.filters.minArea).toBe(100);
        expect(result.current.filters.maxArea).toBe(50000);
      });

      // Set initial filters - do region first, then location to avoid clearing
      act(() => {
        result.current.updateFilters({
          sector: 'manufacturing',
          region: 'eastern',
          isic: ['1010', '2020', '3030'],
        });
      });

      act(() => {
        result.current.updateFilters({
          location: 'jubail',
        });
      });

      // Update area
      act(() => {
        result.current.updateAreaValue([5000, 25000]);
      });

      // Verify state
      expect(result.current.filters).toMatchObject({
        isic: ['1010', '2020', '3030'],
        sector: 'manufacturing',
        region: 'eastern',
        location: 'jubail',
      });
      // Area values should be set from the range
      expect(result.current.filters.minArea).toBe(100);
      expect(result.current.filters.maxArea).toBe(50000);
      expect(result.current.areaValue).toEqual([5000, 25000]);

      // Change region (should clear location)
      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(result.current.filters.region).toBe('riyadh');
      expect(result.current.filters.location).toBe('');

      // Clear all filters
      act(() => {
        result.current.clearFilters();
      });

      // The reducer resets to DEFAULT_FILTERS, but area value is updated separately
      expect(result.current.filters).toEqual(defaultFilters);
      expect(result.current.areaValue).toEqual([100, 50000]);
    });
  });
});