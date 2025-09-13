import { SearchFilters, SelectOption, AreaRange } from '@/shared/types';

export interface SearchFormProps {
  filters: SearchFilters;
  areaValue: [number, number];
  areaRange: AreaRange;
  regions: SelectOption[];
  sectors: SelectOption[];
  isics: SelectOption[];
  cities: SelectOption[];
  onFiltersChange: (updates: Partial<SearchFilters>) => void;
  onAreaValueChange: (value: [number, number]) => void;
  onAreaChangeEnd: (value: number | number[]) => void;
  isLoading: boolean;
  t: (key: string) => string;
  onSearch: () => void;
  onClear: () => void;
  isSearching?: boolean;
  'data-qa-id'?: string;
}
