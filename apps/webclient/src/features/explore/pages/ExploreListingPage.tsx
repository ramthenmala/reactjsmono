import { useState, useEffect } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { PropertyGrid, ViewControls, SearchPanel } from '../components';
import { Map } from '../components/Map';
import { EViewMode, IProperty } from '../types';
import { IndustrialCitiesService } from '../services/industrialCitiesService';

export function ExploreListingPage() {
  const { t } = useLocaleTranslation();
  const [viewMode, setViewMode] = useState<EViewMode>(EViewMode.split);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewProperty = (property: IProperty) => {
    console.log('View property:', property);
    // TODO: Navigate to property detail page
  };

  const handleCompareProperty = (property: IProperty) => {
    console.log('Compare property:', property);
    // TODO: Add to comparison list
  };

  // Fetch properties from API on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProperties = await IndustrialCitiesService.getProperties();
        setProperties(apiProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      <Hero
        backgroundImage="/images/ExploreBG.jpg"
        title={t('hero.explore.title') || 'Find Your Perfect Industrial Plot'}
        subtitle={t('hero.explore.subtitle') || 'Browse available industrial properties and find the ideal location for your business'}
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore/landing' },
          { label: t('explore.listing') || 'Search Results', href: '/explore/listing' }
        ]}
      />

      {/* Search/Filter Panel */}
      <SearchPanel onSearch={(filters) => {
        console.log('Search filters:', filters);
        // TODO: Filter properties based on search criteria
      }} />

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t('explore.results.title') || 'Available Industrial Cities'}
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading properties...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <p className="text-gray-600">
              {t('explore.results.count', { count: properties.length }) || `${properties.length} industrial cities found`}
            </p>
          )}
        </div>

        {/* View Controls */}
        <ViewControls 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
        />

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading industrial cities...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          viewMode === EViewMode.map ? (
            /* Full Map View */
            <div className="w-full">
              <Map 
                points={properties}
                className="min-h-[600px] rounded-lg shadow-sm"
                onMarkerClick={(point) => {
                  if (point.id) {
                    window.location.href = `/explore/city-land/${point.id}`;
                  }
                }}
              />
            </div>
          ) : (
            /* Split and List Views */
            <div className="flex gap-8">
              {/* Property Grid */}
              <PropertyGrid
                properties={properties}
                totalResults={properties.length}
                viewMode={viewMode}
                onView={handleViewProperty}
                onCompare={handleCompareProperty}
              />

              {/* Map Area (for split view only) */}
              {viewMode === EViewMode.split && (
                <div className="flex-1">
                  <Map 
                    points={properties}
                    className="h-full rounded-lg shadow-sm"
                    onMarkerClick={(point) => {
                      if (point.id) {
                        window.location.href = `/explore/city-land/${point.id}`;
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )
        )}
      </section>
    </div>
  );
}