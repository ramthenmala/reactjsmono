import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { PropertyDetailsSection } from '../components/PropertyDetailsSection';
import { PrioritizationResultsSection } from '../components/PrioritizationResultsSection';
import { ExploreActions } from '../components/ExploreActions';
import { IndustrialCitiesService } from '../services/industrialCitiesService';
import { ApiDownNotice } from '../components/ApiDownNotice';

export interface IIndustrialCityModel {
  id: string;
  slug?: string;
  name: string;
  title?: string;
  description: string;
  banner: string | null;
  image?: string;
  estYear: number;
  district: string;
  city?: string;
  area?: number;
  coordinates?: { lat: number; lng: number };
  status?: string;
  featured?: boolean;
  electricity?: number;
  water?: number;
  gas?: number;
  landsAndFactories?: {
    totalLand?: string;
    developedLand?: string;
    undevelopedLand?: string;
    occupancyRate?: string;
    logisticLandPercentage?: string;
    projectsUnderConstruction?: string | null;
    numberOfFactories?: number;
    currentWorkforce?: string;
  };
  infrastructure?: {
    totalElectricityCapacity?: string;
    totalWaterCapacity?: string | null;
    totalGasCapacity?: string | null;
  };
  logisticsServices?: {
    dryPort?: { name: string; distance: string };
    airport?: { name: string; distance: string };
    railwayStation?: { name: string; distance: string } | null;
    neartestSeaport?: { name: string; distance: string } | null;
    neartestRailway?: { name: string; distance: string } | null;
    nearbyLogisticCenters?: string[];
  };
  districtMapAndDetails?: string | null;
  industries?: { label: string | number; quantity: number }[];
  workforceTalent?: {
    availabilityOfSkilleLabor?: string;
    availabilityOfNonSkilleLabor?: string;
    skilledLaborAvgSalary?: string;
    nonSkilledLaborAvgSalary?: string;
  };
}

async function fetchIndustrialCityById(
  slug: string
): Promise<IIndustrialCityModel | null> {
  try {
    // Fetch all properties and find the matching one
    const properties = await IndustrialCitiesService.getProperties();
    const foundProperty = properties.find((p) => p.slug === slug);

    if (!foundProperty) {
      return null;
    }

    // Transform the property data to match IIndustrialCityModel
    const industrialCity: IIndustrialCityModel = {
      id: foundProperty.id || slug,
      slug: foundProperty.slug,
      name: foundProperty.title,
      title: foundProperty.title,
      description: `Premium industrial plot located in ${foundProperty.city}. Perfect for manufacturing, logistics, and heavy industry operations with excellent infrastructure and connectivity.`,
      banner: foundProperty.image,
      image: foundProperty.image,
      estYear: 2020,
      district: foundProperty.city,
      city: foundProperty.city,
      area: foundProperty.area,
      coordinates: foundProperty.coordinates,
      status: foundProperty.status,
      featured: foundProperty.featured,
      electricity:
        typeof foundProperty.electricity === 'string'
          ? parseFloat(foundProperty.electricity)
          : foundProperty.electricity,
      water:
        typeof foundProperty.water === 'string'
          ? parseFloat(foundProperty.water)
          : foundProperty.water,
      gas:
        typeof foundProperty.gas === 'string'
          ? parseFloat(foundProperty.gas)
          : foundProperty.gas,
      landsAndFactories: {
        totalLand: `${foundProperty.area} m²`,
        developedLand: `${Math.floor(foundProperty.area * 0.6)} m²`,
        undevelopedLand: `${Math.floor(foundProperty.area * 0.4)} m²`,
        occupancyRate: '75%',
        logisticLandPercentage: '25%',
        projectsUnderConstruction: '3',
        numberOfFactories: 15,
        currentWorkforce: '2,500',
      },
      infrastructure: {
        totalElectricityCapacity: `${foundProperty.electricity || 50} MW`,
        totalWaterCapacity: `${foundProperty.water || 5000} m³/day`,
        totalGasCapacity: `${foundProperty.gas || 10} MMSCFD`,
      },
      logisticsServices: {
        dryPort: { name: 'Riyadh Dry Port', distance: '25 km' },
        airport: {
          name: 'King Khalid International Airport',
          distance: '45 km',
        },
        railwayStation: { name: 'Riyadh Railway Station', distance: '30 km' },
        neartestSeaport: { name: 'King Abdulaziz Port', distance: '450 km' },
        nearbyLogisticCenters: ['Logistics Park 1', 'Distribution Center A'],
      },
      industries: [
        { label: 'Manufacturing', quantity: 8 },
        { label: 'Logistics', quantity: 4 },
        { label: 'Food Processing', quantity: 3 },
      ],
      workforceTalent: {
        availabilityOfSkilleLabor: 'High',
        availabilityOfNonSkilleLabor: 'High',
        skilledLaborAvgSalary: 'SAR 4,500/month',
        nonSkilledLaborAvgSalary: 'SAR 2,000/month',
      },
    };

    return industrialCity;
  } catch (error) {
    console.error('Error fetching industrial city:', error);
    return null;
  }
}

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocaleTranslation();
  const [industrialCity, setIndustrialCity] =
    useState<IIndustrialCityModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchIndustrialCityById(slug);
        setIndustrialCity(data);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </main>
    );
  }

  if (!industrialCity) {
    return <ApiDownNotice />;
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[radial-gradient(50%_50%_at_100%_50%,rgba(85,71,181,0.2)_0%,rgba(216,200,255,0)_100%)]">
      {/* Hero Section */}
      <Hero
        backgroundImage="/assets/images/backgrounds/ExploreBG.jpg"
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore' },
          { label: industrialCity.district, href: `/explore/property/${slug}` },
        ]}
        className="pb-28 md:pb-40"
      />

      <section className="md:hidden mx-auto -mt-20 mb-11">
        <div className="end-4 top-4 z-10 flex items-center gap-3">
          <ExploreActions size="sm" variant="light" />
        </div>
      </section>

      <PropertyDetailsSection industrialCity={industrialCity} />
      <PrioritizationResultsSection industrialCity={industrialCity} />
    </main>
  );
}
