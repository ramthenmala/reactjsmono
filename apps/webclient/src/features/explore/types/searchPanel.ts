import { SearchFilters } from '@/shared/types';

export interface ISearchPanelProps {
  onSearch?: (searchParams?: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  'data-qa-id'?: string;
}
