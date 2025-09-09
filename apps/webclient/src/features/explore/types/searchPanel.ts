import { SearchFilters } from '@/shared/types';

export interface SearchPanelProps {
  onSearch?: (searchParams?: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}
