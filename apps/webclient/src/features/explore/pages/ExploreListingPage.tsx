import { useState, useEffect } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { useLocaleNavigate } from '../../../shared/lib/router/routerUtils';
import { Hero } from '../../../shared/ui/components/Hero';
import { PropertyGrid } from '../components/Property/PropertyGrid';
import { ViewControls } from '../components/UI/ViewControls';
import { SearchPanel } from '../components/Search/SearchPanel';
import { Map } from '../components/Map';
import { EViewMode, IProperty, ISearchCity } from '../types';
import { useComparison } from '../contexts/ComparisonContext';
import { EXPLORE_PAGE_CONFIGS } from '../constants';
import { searchService } from '../services/searchService';

export function ExploreListingPage() {
  const { t, currentLanguage } = useLocaleTranslation();
  const { navigate } = useLocaleNavigate();
  const { addToComparison } = useComparison();
  const [viewMode, setViewMode] = useState<EViewMode>(EViewMode.split);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewProperty = (property: IProperty) => {
    navigate(`/explore/property/${property.slug}`);
  };

  const handleCompareProperty = (property: IProperty) => {
    const result = addToComparison(property);
    if (result.success) {
      // You might want to show a toast notification here
      console.log(result.message);
    } else {
      // Handle error - property already in list or max limit reached
      console.warn(result.message);
    }
  };

  // Fetch properties from API on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchService.getSearchData(currentLanguage);
        setProperties(
          data.cities
            ? data.cities.map((city: ISearchCity, idx: number) => ({
                id: city.id,
                slug: city.id,
                name: city.name,
                title: city.name,
                status: 'available',
                city: city.cityName,
                area: city.totalArea ? parseFloat(city.totalArea) : 0,
                image: city.banner ?? '',
                electricity: city.totalElectricityCapacity || undefined,
                water: city.totalWaterCapacity || undefined,
                gas: city.totalGasCapacity || undefined,
                featured: idx < 2,
                coordinates: {
                  lat: 24.7136 + (Math.random() - 0.5) * 0.2,
                  lng: 46.6753 + (Math.random() - 0.5) * 0.2,
                },
              }))
            : [],
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch properties',
        );
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentLanguage]);

  return (
    <div
      data-qa-id="explore-listing-page"
      className={`${EXPLORE_PAGE_CONFIGS.listing.layout.className} ${EXPLORE_PAGE_CONFIGS.listing.layout.background}`}
    >
      <div data-qa-id="explore-listing-hero-section">
        <Hero
          backgroundImage={EXPLORE_PAGE_CONFIGS.listing.hero.backgroundImage}
          breadcrumbItems={[
            {
              label: t('navigation.explore') || 'Explore',
              href: '/explore/landing',
            },
            {
              label: t('explore.listing') || 'Search Results',
              href: '/explore/listing',
            },
          ]}
        />
      </div>

      {/* Search/Filter Panel */}
      <div data-qa-id="explore-listing-search-section">
        <SearchPanel />
      </div>

      {/* Results Section */}
      <section data-qa-id="explore-listing-results-section" className='container mx-auto px-4 py-8'>
        {/* Results Header */}
        <div data-qa-id="explore-listing-results-header" className='mb-6'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
            {t('explore.results.title') || 'Available Industrial Cities'}
          </h2>
          {(() => {
            if (loading) {
              return <p data-qa-id="explore-listing-loading-text" className='text-gray-600'>Loading properties...</p>;
            }
            if (error) {
              return <p data-qa-id="explore-listing-error-text" className='text-red-600'>Error: {error}</p>;
            }
            return (
              <p data-qa-id="explore-listing-results-count" className='text-gray-600'>
                {t('explore.results.count', { count: properties.length }) ||
                  `${properties.length} industrial cities found`}
              </p>
            );
          })()}
        </div>

        {/* View Controls */}
        <div data-qa-id="explore-listing-view-controls">
          <ViewControls viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Content Area */}
        <div data-qa-id="explore-listing-content-area">
          {(() => {
            if (loading) {
              return (
                <div data-qa-id="explore-listing-loading-spinner" className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-gray-600'>
                    Loading industrial cities...
                  </span>
                </div>
              );
            }
            if (error) {
              return (
                <div data-qa-id="explore-listing-error-state" className='text-center py-12'>
                  <div className='text-red-500 mb-4'>
                    <svg
                      className='mx-auto h-16 w-16'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Failed to Load Data
                  </h3>
                  <p className='text-gray-600 mb-4'>{error}</p>
                  <button
                    data-qa-id="explore-listing-retry-button"
                    onClick={() => window.location.reload()}
                    className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                  >
                    Try Again
                  </button>
                </div>
              );
            }
            if (viewMode === EViewMode.map) {
              // Full Map View
              return (
                <div data-qa-id="explore-listing-full-map-view" className='w-full h-[600px]'>
                  <Map
                    points={properties}
                    className='h-full rounded-lg shadow-sm'
                    onMarkerClick={point => {
                      if (point.id) {
                        window.location.href = `/explore/property/${point.id}`;
                      }
                    }}
                  />
                </div>
              );
            }
            // Split and List Views
            return (
              <div
                data-qa-id="explore-listing-split-list-view"
                className={
                  viewMode === EViewMode.split
                    ? 'flex flex-col lg:flex-row gap-8'
                    : ''
                }
              >
                {/* Property Grid */}
                <div data-qa-id="explore-listing-property-grid">
                  <PropertyGrid
                    properties={properties}
                    viewMode={viewMode}
                    onView={handleViewProperty}
                    onCompare={handleCompareProperty}
                  />
                </div>

                {/* Map Area (for split view only) */}
                {viewMode === EViewMode.split && (
                  <div data-qa-id="explore-listing-split-map" className='w-full lg:flex-1 min-h-[400px] lg:min-h-[600px]'>
                    <Map
                      points={properties}
                      className='h-full rounded-lg shadow-sm'
                      onMarkerClick={point => {
                        if (point.id) {
                          window.location.href = `/explore/property/${point.id}`;
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
