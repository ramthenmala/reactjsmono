import { useSearchFilterStore } from '@/store/searchFilterStore';
import { SearchFilters, AreaRange } from '@/types/search';
import { renderHook, act } from '@testing-library/react';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: jest.fn((fn) => fn),
}));

describe('useSearchFilterStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    act(() => {
      useSearchFilterStore.getState().clearFilters();
      useSearchFilterStore.getState().setAreaRange({ min: 0, max: 25000 });
    });
  });

  describe('initial state', () => {
    it('should have correct default filters', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      expect(result.current.filters).toEqual({
        isic: [],
        sector: '',
        region: '',
        location: '',
        minArea: 0,
        maxArea: 25000,
      });
    });

    it('should have correct default areaValue', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      expect(result.current.areaValue).toEqual([0, 25000]);
    });

    it('should have correct default areaRange', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      expect(result.current.areaRange).toEqual({ min: 0, max: 25000 });
    });

    it('should have hasActiveFilters return false initially', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      expect(result.current.hasActiveFilters()).toBe(false);
    });
  });

  describe('updateFilters', () => {
    it('should update single filter property', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(result.current.filters.sector).toBe('technology');
      expect(result.current.filters.region).toBe('');
      expect(result.current.filters.location).toBe('');
    });

    it('should update multiple filter properties', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({
          sector: 'manufacturing',
          region: 'riyadh',
          minArea: 1000,
          maxArea: 5000,
        });
      });

      expect(result.current.filters.sector).toBe('manufacturing');
      expect(result.current.filters.region).toBe('riyadh');
      expect(result.current.filters.minArea).toBe(1000);
      expect(result.current.filters.maxArea).toBe(5000);
    });

    it('should update isic array filter', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ isic: ['1010', '2020', '3030'] });
      });

      expect(result.current.filters.isic).toEqual(['1010', '2020', '3030']);
    });

    it('should preserve other filters when updating', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'tech', region: 'east' });
      });

      act(() => {
        result.current.updateFilters({ location: 'dammam' });
      });

      expect(result.current.filters.sector).toBe('tech');
      expect(result.current.filters.region).toBe('east');
      expect(result.current.filters.location).toBe('dammam');
    });
  });

  describe('updateAreaValue', () => {
    it('should update area value', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateAreaValue([500, 10000]);
      });

      expect(result.current.areaValue).toEqual([500, 10000]);
    });

    it('should not affect filters when updating area value', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      const initialFilters = { ...result.current.filters };

      act(() => {
        result.current.updateAreaValue([1000, 15000]);
      });

      expect(result.current.filters).toEqual(initialFilters);
    });
  });

  describe('setAreaRange', () => {
    it('should set area range on initial load', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      const newRange: AreaRange = { min: 100, max: 50000 };

      act(() => {
        result.current.setAreaRange(newRange);
      });

      expect(result.current.areaRange).toEqual(newRange);
      expect(result.current.areaValue).toEqual([100, 50000]);
      expect(result.current.filters.minArea).toBe(100);
      expect(result.current.filters.maxArea).toBe(50000);
    });

    it('should update existing range and keep values within bounds', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      // Set initial non-default state
      act(() => {
        result.current.setAreaRange({ min: 100, max: 50000 });
      });

      // Set area value within bounds
      act(() => {
        result.current.updateAreaValue([1000, 20000]);
        result.current.updateFilters({ minArea: 1000, maxArea: 20000 });
      });

      // Update range to smaller bounds
      act(() => {
        result.current.setAreaRange({ min: 500, max: 15000 });
      });

      expect(result.current.areaRange).toEqual({ min: 500, max: 15000 });
      expect(result.current.areaValue[0]).toBe(1000); // within new bounds
      expect(result.current.areaValue[1]).toBe(15000); // clamped to new max
      expect(result.current.filters.minArea).toBe(1000);
      expect(result.current.filters.maxArea).toBe(15000);
    });

    it('should clamp values to new range bounds', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      // Set initial state
      act(() => {
        result.current.setAreaRange({ min: 0, max: 50000 });
      });

      act(() => {
        result.current.updateAreaValue([100, 40000]);
        result.current.updateFilters({ minArea: 100, maxArea: 40000 });
      });

      // Update to much smaller range
      act(() => {
        result.current.setAreaRange({ min: 1000, max: 5000 });
      });

      expect(result.current.areaValue).toEqual([1000, 5000]);
      expect(result.current.filters.minArea).toBe(1000);
      expect(result.current.filters.maxArea).toBe(5000);
    });
  });

  describe('clearFilters', () => {
    it('should reset filters to defaults with current area range', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      // Set some filters and area range
      act(() => {
        result.current.setAreaRange({ min: 100, max: 30000 });
        result.current.updateFilters({
          sector: 'technology',
          region: 'riyadh',
          location: 'city',
          isic: ['1010', '2020'],
          minArea: 5000,
          maxArea: 15000,
        });
        result.current.updateAreaValue([5000, 15000]);
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({
        isic: [],
        sector: '',
        region: '',
        location: '',
        minArea: 100,
        maxArea: 30000,
      });
      expect(result.current.areaValue).toEqual([100, 30000]);
    });

    it('should use default area range when no area range is set', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters.minArea).toBe(0);
      expect(result.current.filters.maxArea).toBe(25000);
      expect(result.current.areaValue).toEqual([0, 25000]);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should return true when isic codes are selected', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ isic: ['1010'] });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when sector is selected', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'technology' });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when region is selected', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when location is selected', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ location: 'dammam' });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return true when area values differ from range', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.setAreaRange({ min: 0, max: 25000 });
        result.current.updateFilters({ minArea: 1000 });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });

    it('should return false for empty strings', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: '', region: '', location: '' });
      });

      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should return false when area values match range exactly', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.setAreaRange({ min: 100, max: 30000 });
      });

      // Should be false since setAreaRange sets filters to match range
      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('should return true for multiple active filters', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({
          isic: ['1010', '2020'],
          sector: 'manufacturing',
          region: 'eastern',
          location: 'jubail',
          minArea: 5000,
        });
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });
  });

  describe('state persistence', () => {
    it('should maintain state across multiple updates', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
      });

      act(() => {
        result.current.updateAreaValue([1000, 20000]);
      });

      act(() => {
        result.current.updateFilters({ region: 'riyadh' });
      });

      expect(result.current.filters.sector).toBe('tech');
      expect(result.current.filters.region).toBe('riyadh');
      expect(result.current.areaValue).toEqual([1000, 20000]);
    });

    it('should handle complex state updates', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      const complexUpdate: Partial<SearchFilters> = {
        isic: ['1010', '2020', '3030'],
        sector: 'manufacturing',
        region: 'eastern',
        location: 'dammam',
        minArea: 2000,
        maxArea: 45000,
      };

      act(() => {
        result.current.updateFilters(complexUpdate);
      });

      Object.entries(complexUpdate).forEach(([key, value]) => {
        expect(result.current.filters[key as keyof SearchFilters]).toEqual(value);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined values in updateFilters', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateFilters({ sector: 'tech' });
      });

      act(() => {
        result.current.updateFilters({ sector: undefined } as any);
      });

      // Zustand will actually set undefined values, so we expect undefined here
      expect(result.current.filters.sector).toBe(undefined);
    });

    it('should handle zero area values correctly', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateAreaValue([0, 0]);
      });

      expect(result.current.areaValue).toEqual([0, 0]);
    });

    it('should handle negative area values', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      act(() => {
        result.current.updateAreaValue([-100, 5000]);
      });

      expect(result.current.areaValue).toEqual([-100, 5000]);
    });

    it('should handle very large area ranges', () => {
      const { result } = renderHook(() => useSearchFilterStore());

      const largeRange: AreaRange = { min: 0, max: 1000000 };

      act(() => {
        result.current.setAreaRange(largeRange);
      });

      expect(result.current.areaRange).toEqual(largeRange);
      expect(result.current.areaValue).toEqual([0, 1000000]);
    });
  });
});