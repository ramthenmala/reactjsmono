import { useCallback, useState, useEffect } from 'react';
import { Button } from "@compass/shared-ui";
import { useNavigate } from 'react-router-dom';
import { useLocaleTranslation } from '../../../../shared/lib/i18n';
import { useCurrentLocale } from '../../../../shared/lib/router';
import { useSearchData, useSearchFilters } from '../../../../shared/hooks';
import { SearchFilters } from '../../../../shared/types';
import { createRouteUrl } from '../../../../shared/utils';
import { SearchForm } from './SearchForm';

interface SearchPanelProps {
  onSearch?: (searchParams?: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

export function SearchPanel({ onSearch, initialFilters }: SearchPanelProps) {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  // Use custom hooks for data and filters management
  const { regions, sectors, isics, cities, loadCities, isLoading: dataLoading } = useSearchData();
  const { 
    filters, 
    areaValue, 
    updateFilters, 
    updateAreaValue, 
    clearFilters 
  } = useSearchFilters({ 
    initialFilters,
    onFiltersChange: (newFilters) => {
      // Optional callback when filters change
      console.debug('Filters changed:', newFilters);
    }
  });

  // Load cities when region changes
  useEffect(() => {
    if (filters.region && filters.region !== 'all') {
      loadCities(filters.region);
    }
  }, [filters.region, loadCities]);

  // Handle search submission
  const handleSearch = useCallback(async () => {
    if (onSearch) {
      onSearch(filters);
      return;
    }

    setIsSearching(true);

    try {
      // Build the URL with search parameters
      const searchUrl = createRouteUrl('/explore/listing', currentLocale, filters);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate(searchUrl);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [onSearch, filters, currentLocale, navigate]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleAreaChangeEnd = useCallback((values: number[]) => {
    const [min, max] = values as [number, number];
    const sortedValues: [number, number] = [Math.min(min, max), Math.max(min, max)];
    updateFilters({ minArea: Math.round(sortedValues[0]), maxArea: Math.round(sortedValues[1]) });
  }, [updateFilters]);

  const isLoading = dataLoading || isSearching;

  return (
    <section className="relative z-10 -mt-32 mx-auto w-full max-w-7xl px-4">
      <div className="relative rounded-2xl border border-white/30 bg-gradient-to-r from-white/10 to-white/5 p-6 shadow-[0px_4px_8px_-2px_#1018281A,0_2px_4px_-2px_#1018280F] backdrop-blur-[15px] overflow-hidden">
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          <SearchForm
            filters={filters}
            areaValue={areaValue}
            regions={regions}
            sectors={sectors}
            isics={isics}
            cities={cities}
            onFiltersChange={updateFilters}
            onAreaValueChange={updateAreaValue}
            onAreaChangeEnd={handleAreaChangeEnd}
            isLoading={isLoading}
            t={t}
          />

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              size="lg"
              color="secondary"
              className="min-w-32"
              onClick={handleClearFilters}
              disabled={isLoading}
            >
              {t('common.clear') || 'Clear'}
            </Button>
            <Button
              size="lg"
              color="primary"
              className="h-12 rounded-xl px-[18px] text-white font-semibold text-base leading-6 tracking-normal shadow-sm transition bg-[linear-gradient(90deg,#5547B5_0%,#695DC2_100%)] hover:brightness-105 active:brightness-95"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isSearching 
                ? (t('common.searching') || 'Searching...') 
                : (t('navigation.explore') || 'Search')
              }
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}