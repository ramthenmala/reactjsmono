export interface SearchFilters {
  isic: string[];
  sector: string;
  region: string;
  location: string;
  minArea: number;
  maxArea: number;
}

export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

export interface AreaRange {
  min: number;
  max: number;
}

export interface SearchState {
  filters: SearchFilters;
  regions: SelectOption[];
  cities: SelectOption[];
  sectors: SelectOption[];
  isics: SelectOption[];
  areaRange: AreaRange;
  isLoading: boolean;
}

export type SearchAction =
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'SET_REGIONS'; payload: SelectOption[] }
  | { type: 'SET_CITIES'; payload: SelectOption[] }
  | { type: 'SET_SECTORS'; payload: SelectOption[] }
  | { type: 'SET_ISICS'; payload: SelectOption[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_FILTERS' };
