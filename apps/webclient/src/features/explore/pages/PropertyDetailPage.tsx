import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocaleTranslation } from '../../../i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { PropertyDetailsSection } from '../components/PropertyDetail/PropertyDetailsSection';
import { PrioritizationResultsSection } from '../components/PropertyDetail/PrioritizationResultsSection';
import { ExploreActions } from '../components/Navigation/ExploreActions';
import { ApiDownNotice } from '../components/UI/ApiDownNotice';
import { useCurrentLocale } from '@/shared';
import { industrialCityService } from '../services/industrialCityService';
import { IIndustrialCityData } from '../types/industrialCity';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLocaleTranslation();
  const [industrialCity, setIndustrialCity] =
    useState<IIndustrialCityData | null>(null);
  const [loading, setLoading] = useState(true);
  const currentLocale = useCurrentLocale();

  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const data = await industrialCityService.getIndustrialCity(currentLocale, slug);
        setIndustrialCity(data);
      } catch (error) {
        console.error('Error loading property:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, currentLocale]);

  if (loading) {
    return (
      <main className='flex min-h-dvh items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading property details...</p>
        </div>
      </main>
    );
  }

  if (!industrialCity) {
    return <ApiDownNotice />;
  }

  return (
    <main className='flex min-h-dvh flex-col bg-[radial-gradient(50%_50%_at_100%_50%,rgba(85,71,181,0.2)_0%,rgba(216,200,255,0)_100%)]'>
      {/* Hero Section */}
      <Hero
        backgroundImage='/assets/images/backgrounds/ExploreBG.jpg'
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore' },
          { label: industrialCity.name , href: '/explore/listing' },
        ]}
        className='pb-28 md:pb-40'
      />

      <section className='md:hidden mx-auto -mt-20 mb-11'>
        <div className='end-4 top-4 z-10 flex items-center gap-3'>
          <ExploreActions size='sm' variant='light' />
        </div>
      </section>

      <PropertyDetailsSection {...industrialCity} />
      <PrioritizationResultsSection {...industrialCity.prioritizationResultInfo} />
    </main>
  );
}
