import { useParams } from 'react-router-dom';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { Button } from '@compass/shared-ui';
import { Zap, Drop, Plane, MarkerPin02, Phone, Mail01 } from '@untitledui/icons';
import { Map } from '../components/Map';
import { IPlotPoint } from '../types/map';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocaleTranslation();

  // TODO: Fetch property data based on slug
  const property = {
    id: '1',
    slug: slug || '',
    city: 'Riyadh',
    title: 'Riyadh Industrial City - Plot A1',
    area: 5000,
    image: '/images/land-a.png',
    electricity: '15',
    water: '2500',
    gas: '10',
    status: 'available' as const,
    featured: true,
    description: 'Premium industrial plot located in the heart of Riyadh Industrial City. Perfect for manufacturing, logistics, and heavy industry operations.',
    amenities: ['24/7 Security', 'Fire Station', 'Medical Center', 'Transportation Hub'],
    price: 2500000,
    coordinates: { lat: 24.7136, lng: 46.6753 },
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      <Hero
        backgroundImage="/images/ExploreBG.jpg"
        title={property.title}
        subtitle={`${property.area.toLocaleString()} m² • ${property.city}`}
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore/landing' },
          { label: t('explore.listing') || 'Properties', href: '/explore/listing' },
          { label: property.title, href: `/explore/city-land/${slug}` }
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
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Electricity</p>
                    <p className="text-gray-600">{property.electricity} MW</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Drop className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Water</p>
                    <p className="text-gray-600">{property.water} m³/day</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gas</p>
                    <p className="text-gray-600">{property.gas} MMSCFD</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
                <p className="text-2xl font-semibold text-purple-600">
                  {property.area.toLocaleString()} m²
                </p>
              </div>
            </div>

            {/* Amenities */}
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
                points={[{
                  id: property.id,
                  coordinates: property.coordinates,
                  property: {
                    title: property.title,
                    city: property.city,
                    area: property.area,
                    status: property.status
                  }
                } as IPlotPoint]}
                center={[property.coordinates.lng, property.coordinates.lat]}
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