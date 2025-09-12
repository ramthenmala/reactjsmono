import { useEffect } from 'react';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { SearchFilters, AreaRange } from '../types/search';

interface UseSearchFiltersOptions {
  initialFilters?: Partial<SearchFilters>;
  onFiltersChange?: (filters: SearchFilters) => void;
  areaRange?: AreaRange;
}

/**
 * Hook that provides simplified application-level state management for search filters.
 * This replaces the reducer-based useSearchFilters hook with persistent Zustand store.
 */
export function useSearchFiltersStore(options: UseSearchFiltersOptions = {}) {
  const { initialFilters = {}, onFiltersChange, areaRange } = options;

  const {
    filters,
    areaValue,
    updateFilters,
    updateAreaValue,
    setAreaRange,
    clearFilters,
    hasActiveFilters,
  } = useSearchFilterStore();

  // Initialize filters from props if provided (only on mount)
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      updateFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Set area range when it's loaded from API
  useEffect(() => {
    if (areaRange) {
      setAreaRange(areaRange);
    }
  }, [areaRange, setAreaRange]);

  // Call onFiltersChange when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  // Enhanced updateFilters that handles region clearing location
  const handleUpdateFilters = (updates: Partial<SearchFilters>) => {
    // If region changed, clear location
    if (updates.region !== undefined && updates.region !== filters.region) {
      updateFilters({ ...updates, location: '' });
    } else {
      updateFilters(updates);
    }
  };

  return {
    filters,
    areaValue,
    updateFilters: handleUpdateFilters,
    updateAreaValue,
    clearFilters,
    hasActiveFilters,
  };
}
