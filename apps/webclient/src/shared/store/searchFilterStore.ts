import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchFilters, AreaRange } from '../types/search';

interface SearchFilterState {
  // Filter values
  filters: SearchFilters;
  areaValue: [number, number];
  areaRange: AreaRange;

  // Actions
  updateFilters: (updates: Partial<SearchFilters>) => void;
  updateAreaValue: (value: [number, number]) => void;
  setAreaRange: (range: AreaRange) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

const DEFAULT_FILTERS: SearchFilters = {
  isic: [],
  sector: '',
  region: '',
  location: '',
  minArea: 0,
  maxArea: 25000,
};

const DEFAULT_AREA_RANGE: AreaRange = { min: 0, max: 25000 };

export const useSearchFilterStore = create<SearchFilterState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: DEFAULT_FILTERS,
      areaValue: [DEFAULT_AREA_RANGE.min, DEFAULT_AREA_RANGE.max],
      areaRange: DEFAULT_AREA_RANGE,

      // Actions
      updateFilters: updates => {
        set(state => ({
          filters: { ...state.filters, ...updates },
        }));
      },

      updateAreaValue: value => {
        set({ areaValue: value });
      },

      setAreaRange: range => {
        set(state => {
          // If this is the first time setting the range (initial load from API)
          const isInitialLoad =
            state.areaRange.min === 0 && state.areaRange.max === 25000;

          if (isInitialLoad) {
            // Initialize with the full range
            return {
              areaRange: range,
              areaValue: [range.min, range.max],
              filters: {
                ...state.filters,
                minArea: range.min,
                maxArea: range.max,
              },
            };
          } else {
            // Update existing range, keeping current values if they're within bounds
            return {
              areaRange: range,
              areaValue: [
                Math.max(state.areaValue[0], range.min),
                Math.min(state.areaValue[1], range.max),
              ],
              filters: {
                ...state.filters,
                minArea: Math.max(state.filters.minArea, range.min),
                maxArea: Math.min(state.filters.maxArea, range.max),
              },
            };
          }
        });
      },

      clearFilters: () => {
        const { areaRange } = get();
        set({
          filters: {
            ...DEFAULT_FILTERS,
            minArea: areaRange.min,
            maxArea: areaRange.max,
          },
          areaValue: [areaRange.min, areaRange.max],
        });
      },

      hasActiveFilters: () => {
        const { filters, areaRange } = get();
        return (
          filters.isic.length > 0 ||
          (filters.sector && filters.sector !== '') ||
          (filters.region && filters.region !== '') ||
          (filters.location && filters.location !== '') ||
          filters.minArea !== areaRange.min ||
          filters.maxArea !== areaRange.max
        );
      },
    }),
    {
      name: 'compass-search-filters',
      partialize: state => ({
        filters: state.filters,
        areaValue: state.areaValue,
      }),
    },
  ),
);
