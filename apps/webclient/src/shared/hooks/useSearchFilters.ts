import { useState, useCallback, useReducer } from 'react';
import { SearchFilters, SearchState, SearchAction } from '../types/search';

const DEFAULT_FILTERS: SearchFilters = {
  isic: [],
  sector: '',
  region: '',
  location: '',
  minArea: 0,
  maxArea: 25000,
};

const DEFAULT_AREA_RANGE = { min: 0, max: 25000 };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'SET_REGIONS':
      return { ...state, regions: action.payload };
    case 'SET_CITIES':
      return { ...state, cities: action.payload };
    case 'SET_SECTORS':
      return { ...state, sectors: action.payload };
    case 'SET_ISICS':
      return { ...state, isics: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: DEFAULT_FILTERS,
      };
    default:
      return state;
  }
}

interface UseSearchFiltersOptions {
  initialFilters?: Partial<SearchFilters>;
  onFiltersChange?: (filters: SearchFilters) => void;
}

interface UseSearchFiltersReturn {
  filters: SearchFilters;
  areaValue: [number, number];
  updateFilters: (updates: Partial<SearchFilters>) => void;
  updateAreaValue: (value: [number, number]) => void;
  clearFilters: () => void;
  setAreaFromFilters: () => void;
}

export function useSearchFilters(options: UseSearchFiltersOptions = {}): UseSearchFiltersReturn {
  const { initialFilters = {}, onFiltersChange } = options;
  
  const [state, dispatch] = useReducer(searchReducer, {
    filters: { ...DEFAULT_FILTERS, ...initialFilters },
    regions: [],
    cities: [],
    sectors: [],
    isics: [],
    areaRange: DEFAULT_AREA_RANGE,
    isLoading: false,
  });

  const [areaValue, setAreaValue] = useState<[number, number]>([
    initialFilters.minArea || DEFAULT_FILTERS.minArea,
    initialFilters.maxArea || DEFAULT_FILTERS.maxArea,
  ]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: updates });
    
    const newFilters = { ...state.filters, ...updates };
    onFiltersChange?.(newFilters);
    
    // If region changed, clear location
    if (updates.region !== undefined) {
      dispatch({ type: 'SET_FILTERS', payload: { location: '' } });
    }
  }, [state.filters, onFiltersChange]);

  const updateAreaValue = useCallback((value: [number, number]) => {
    setAreaValue(value);
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
    setAreaValue([DEFAULT_FILTERS.minArea, DEFAULT_FILTERS.maxArea]);
    onFiltersChange?.(DEFAULT_FILTERS);
  }, [onFiltersChange]);

  const setAreaFromFilters = useCallback(() => {
    setAreaValue([state.filters.minArea, state.filters.maxArea]);
  }, [state.filters.minArea, state.filters.maxArea]);

  return {
    filters: state.filters,
    areaValue,
    updateFilters,
    updateAreaValue,
    clearFilters,
    setAreaFromFilters,
  };
}