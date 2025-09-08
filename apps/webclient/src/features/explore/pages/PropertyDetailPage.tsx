import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { Button } from '@compass/shared-ui';
import { Zap, Drop, Plane, MarkerPin02, Phone, Mail01 } from '@untitledui/icons';
import { Map } from '../components';
import { IProperty } from '../types/explore';
import { IndustrialCitiesService } from '../services/industrialCitiesService';

interface IPropertyDetail extends IProperty {
  description?: string;
  amenities?: string[];
  price?: number;
}

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocaleTranslation();
  const [property, setProperty] = useState<IPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch property data based on slug
  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) {
        setError('No property slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all properties and find the matching one
        const properties = await IndustrialCitiesService.getProperties();
        const foundProperty = properties.find(p => p.slug === slug);
        
        if (!foundProperty) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        // Enhance property with additional details
        const enhancedProperty: IPropertyDetail = {
          ...foundProperty,
          description: `Premium industrial plot located in ${foundProperty.city}. Perfect for manufacturing, logistics, and heavy industry operations with excellent infrastructure and connectivity.`,
          amenities: ['24/7 Security', 'Fire Station', 'Medical Center', 'Transportation Hub', 'Utilities Ready', 'High-Speed Internet'],
          price: Math.floor(foundProperty.area * (150 + Math.random() * 100)), // Estimated price per m²
        };

        setProperty(enhancedProperty);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
        <Hero
          backgroundImage="/images/ExploreBG.jpg"
          title="Loading..."
          subtitle="Please wait while we fetch the property details"
          breadcrumbItems={[
            { label: t('navigation.explore') || 'Explore', href: '/explore/landing' },
            { label: t('explore.listing') || 'Properties', href: '/explore/listing' },
            { label: 'Loading...', href: '#' }
          ]}
        />
        <section className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading property details...</span>
        </section>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
        <Hero
          backgroundImage="/images/ExploreBG.jpg"
          title="Property Not Found"
          subtitle={error || 'The requested property could not be found'}
          breadcrumbItems={[
            { label: t('navigation.explore') || 'Explore', href: '/explore/landing' },
            { label: t('explore.listing') || 'Properties', href: '/explore/listing' },
            { label: 'Not Found', href: '#' }
          ]}
        />
        <section className="container mx-auto px-4 py-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <Button 
            onClick={() => window.location.href = '/explore/listing'}
            color="primary"
          >
            Back to Properties
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      <Hero
        backgroundImage="/images/ExploreBG.jpg"
        title={property.title}
        subtitle={`${property.area.toLocaleString()} m² • ${property.city}`}
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore/landing' },
          { label: t('explore.listing') || 'Properties', href: '/explore/listing' },
          { label: property.title, href: `/explore/property/${slug}` }
        ]}
      />

      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Images */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : property.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`property.status.${property.status}`) || property.status}
                  </span>
                  {property.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {t('common.featured') || 'Featured'}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <MarkerPin02 className="w-5 h-5 text-purple-600" />
                  <span className="text-lg text-gray-600">{property.city}</span>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Utilities & Specifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Utilities & Specifications
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {property.electricity && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Electricity</p>
                      <p className="text-gray-600">{property.electricity} MW</p>
                    </div>
                  </div>
                )}
                
                {property.water && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Drop className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Water</p>
                      <p className="text-gray-600">{property.water} m³/day</p>
                    </div>
                  </div>
                )}
                
                {property.gas && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gas</p>
                      <p className="text-gray-600">{property.gas} MMSCFD</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
                <p className="text-2xl font-semibold text-purple-600">
                  {property.area.toLocaleString()} m²
                </p>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Amenities & Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">+966 11 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail01 className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">info@compass.sa</span>
                </div>
              </div>

              <Button size="lg" color="primary" className="w-full mb-3">
                Request Information
              </Button>
              
              <Button size="lg" color="secondary" className="w-full">
                Schedule Visit
              </Button>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <Map 
                points={[property]}
                center={property.coordinates ? [property.coordinates.lng, property.coordinates.lat] : undefined}
                zoom={12}
                className="aspect-square rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}