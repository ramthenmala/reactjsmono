import { useState } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { PropertyGrid, ViewControls, SearchPanel } from '../components';
import { Map } from '../components/Map';
import { EViewMode, IProperty } from '../types';
import { IPlotPoint } from '../types/map';

// Sample data for testing
const sampleProperties: IProperty[] = [
  {
    id: '1',
    slug: 'riyadh-industrial-city-plot-1',
    city: 'Riyadh',
    title: 'Riyadh Industrial City - Plot A1',
    area: 5000,
    image: '/images/land-a.png',
    electricity: '15',
    water: '2500',
    gas: '10',
    status: 'available',
    featured: true,
    coordinates: { lat: 24.7136, lng: 46.6753 },
  },
  {
    id: '2',
    slug: 'jubail-industrial-city-plot-2',
    city: 'Jubail',
    title: 'Jubail Industrial City - Plot B2',
    area: 7500,
    image: '/images/land-b.png',
    electricity: '25',
    water: '4000',
    gas: '15',
    status: 'available',
    featured: false,
    coordinates: { lat: 27.0174, lng: 49.6252 },
  },
  {
    id: '3',
    slug: 'yanbu-industrial-city-plot-3',
    city: 'Yanbu',
    title: 'Yanbu Industrial City - Plot C3',
    area: 10000,
    image: '/images/land-c.png',
    electricity: '40',
    water: '6000',
    gas: '20',
    status: 'reserved',
    featured: false,
    coordinates: { lat: 24.0892, lng: 38.0618 },
  },
  {
    id: '4',
    slug: 'dammam-industrial-city-plot-4',
    city: 'Dammam',
    title: 'Dammam Industrial City - Plot D4',
    area: 3000,
    image: '/images/land-d.png',
    electricity: '12',
    water: '1800',
    gas: '8',
    status: 'available',
    featured: true,
    coordinates: { lat: 26.4207, lng: 50.0888 },
  },
];

export function ExploreListingPage() {
  const { t } = useLocaleTranslation();
  const [viewMode, setViewMode] = useState<EViewMode>(EViewMode.list);
  const [properties] = useState<IProperty[]>(sampleProperties);

  const handleViewProperty = (property: IProperty) => {
    console.log('View property:', property);
    // TODO: Navigate to property detail page
  };

  const handleCompareProperty = (property: IProperty) => {
    console.log('Compare property:', property);
    // TODO: Add to comparison list
  };

  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
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
            <div className={`${
              viewMode === EViewMode.map ? 'w-full' : 'flex-1'
            }`}>
              <Map 
                points={properties.map(property => ({
                  id: property.id,
                  coordinates: property.coordinates || { lat: 24.7136, lng: 46.6753 },
                  property: {
                    title: property.title,
                    city: property.city,
                    area: property.area,
                    status: property.status
                  }
                } as IPlotPoint))}
                className="min-h-[600px] rounded-lg shadow-sm"
                onMarkerClick={(point) => {
                  if (point.id) {
                    window.location.href = `/explore/city-land/${point.id}`;
                  }
                }}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}