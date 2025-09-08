import { useState } from 'react';
import { useLocaleTranslation } from '../../shared/lib/i18n';
import { useLocaleNavigate } from '../../shared/lib/router/routerUtils';
import { PropertyGrid, ViewControls } from './components';
import { EViewMode, IProperty } from './types';
import { Hero } from '../../shared/ui/components/Hero';
import { useComparison } from './contexts/ComparisonContext';

// Sample data for testing
const sampleProperties: IProperty[] = [
  {
    id: '1',
    slug: 'riyadh-industrial-city-plot-1',
    city: 'Riyadh',
    title: 'Riyadh Industrial City - Plot A1',
    area: 5000,
    image: '/assets/images/properties/land-a.png',
    electricity: '15',
    water: '2500',
    gas: '10',
    status: 'available',
    featured: true,
  },
  {
    id: '2',
    slug: 'jubail-industrial-city-plot-2',
    city: 'Jubail',
    title: 'Jubail Industrial City - Plot B2',
    area: 7500,
    image: '/assets/images/properties/land-b.png',
    electricity: '25',
    water: '4000',
    gas: '15',
    status: 'available',
    featured: false,
  },
  {
    id: '3',
    slug: 'yanbu-industrial-city-plot-3',
    city: 'Yanbu',
    title: 'Yanbu Industrial City - Plot C3',
    area: 10000,
    image: '/assets/images/properties/land-c.png',
    electricity: '40',
    water: '6000',
    gas: '20',
    status: 'reserved',
    featured: false,
  },
  {
    id: '4',
    slug: 'dammam-industrial-city-plot-4',
    city: 'Dammam',
    title: 'Dammam Industrial City - Plot D4',
    area: 3000,
    image: '/assets/images/properties/land-d.png',
    electricity: '12',
    water: '1800',
    gas: '8',
    status: 'available',
    featured: true,
  },
];

export function ExplorePage() {
  const { t, currentLanguage } = useLocaleTranslation();
  const { navigate } = useLocaleNavigate();
  const { addToComparison } = useComparison();
  const [viewMode, setViewMode] = useState<EViewMode>(EViewMode.split);
  const [properties] = useState<IProperty[]>(sampleProperties);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      {/* Hero Section */}
      <Hero
        backgroundImage="/assets/images/backgrounds/ExploreBG.jpg"
        title={t('hero.explore.title') || 'Explore Industrial Opportunities'}
        subtitle={t('hero.explore.subtitle') || 'Discover investment opportunities across Saudi Arabia\'s industrial landscape'}
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: `/explore` }
        ]}
      />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t('explore.results.title') || 'Available Properties'}
          </h2>
          <p className="text-gray-600">
            {t('explore.results.count', { count: properties.length }) || `${properties.length} properties found`}
          </p>
        </div>

        {/* View Controls */}
        <ViewControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Area */}
        <div className="flex gap-8">
          {/* Property Grid */}
          <PropertyGrid
            properties={properties}
            totalResults={properties.length}
            viewMode={viewMode}
            onView={handleViewProperty}
            onCompare={handleCompareProperty}
          />

          {/* Map Area (for split and map views) */}
          {(viewMode === EViewMode.split || viewMode === EViewMode.map) && (
            <div className={`${viewMode === EViewMode.map ? 'w-full' : 'flex-1'
              } bg-gray-200 rounded-lg min-h-[600px] flex items-center justify-center`}>
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">
                  <span role="img" aria-label="Map">🗺️</span>
                </div>
                <p className="text-lg font-medium">Interactive Map</p>
                <p className="text-sm">Mapbox integration coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <p className="text-gray-600 mb-2">
            <strong>Current Language:</strong> {currentLanguage.toUpperCase()}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>View Mode:</strong> {viewMode}
          </p>
          <p className="text-gray-600">
            <strong>Properties:</strong> {properties.length} loaded
          </p>
        </div>
      </section>
    </div>
  );
}