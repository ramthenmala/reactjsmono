import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocaleTranslation } from '@/i18n';
import { useCurrentLocale } from '@/router';
import { useSearchData } from '@/shared/hooks';
import { useSearchFiltersStore } from '@/shared/hooks/useSearchFiltersStore';
import { createRouteUrl } from '@/shared/utils';
import { SearchForm } from './SearchForm';
import { ISearchPanelProps } from '@/features/explore/types/searchPanel';

export function SearchPanel({ onSearch, initialFilters, 'data-qa-id': dataQaId = 'search-panel' }: ISearchPanelProps) {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  // Use custom hooks for data and filters management
  const {
    isics,
    sectors,
    regions,
    cities,
    areaRange,
    loadCities,
    isLoading: dataLoading,
  } = useSearchData();

  const { filters, areaValue, updateFilters, updateAreaValue, clearFilters } =
    useSearchFiltersStore({
      initialFilters,
      areaRange,
      onFiltersChange: () => {
        // Optional callback when filters change
      },
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
      const searchUrl = createRouteUrl(
        '/explore/listing',
        currentLocale,
        filters,
      );

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
    navigate(createRouteUrl(
      '/explore/listing',
      currentLocale,
    ));
  }, [clearFilters, currentLocale, navigate]);

  const handleAreaChangeEnd = useCallback(
    (values: number[]) => {
      const [min, max] = values as [number, number];
      const sortedValues: [number, number] = [
        Math.min(min, max),
        Math.max(min, max),
      ];
      updateFilters({
        minArea: Math.round(sortedValues[0]),
        maxArea: Math.round(sortedValues[1]),
      });
    },
    [updateFilters],
  );

  const isLoading = dataLoading || isSearching;

  return (
    <section className='container relative z-10 -mt-25' data-qa-id={dataQaId}>
      <div
        className='relative flex flex-col items-start rounded-[24px] border border-[#EBEDEF] overflow-hidden w-full max-w-[1280px] p-4 md:p-8'
        style={{
          background:
            'radial-gradient(48.45% 55.71% at 50% 0%, rgba(216, 200, 255, 0.50) 0%, rgba(216, 200, 255, 0.00) 100%), rgba(255, 255, 255, 0.80)',
          boxShadow: '0 2px 75px 20px rgba(85, 71, 181, 0.20)',
          backdropFilter: 'blur(50px)',
        }}
        data-qa-id={`${dataQaId}-container`}
      >
        {/* Content */}
        <div className='w-full' data-qa-id={`${dataQaId}-content`}>
          <SearchForm
            isics={isics}
            sectors={sectors}
            regions={regions}
            filters={filters}
            areaValue={areaValue}
            areaRange={areaRange}
            cities={cities}
            onFiltersChange={updateFilters}
            onAreaValueChange={updateAreaValue}
            onAreaChangeEnd={handleAreaChangeEnd}
            isLoading={isLoading}
            t={t}
            onSearch={handleSearch}
            onClear={handleClearFilters}
            isSearching={isSearching}
            data-qa-id={`${dataQaId}-form`}
          />
        </div>
      </div>
    </section>
  );
}
