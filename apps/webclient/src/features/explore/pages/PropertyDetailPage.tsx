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
      <main data-qa-id="property-detail-loading" className='flex min-h-dvh items-center justify-center'>
        <div data-qa-id="property-detail-loading-content" className='text-center'>
          <div data-qa-id="property-detail-loading-spinner" className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p data-qa-id="property-detail-loading-text" className='text-gray-600'>Loading property details...</p>
        </div>
      </main>
    );
  }

  if (!industrialCity) {
    return <ApiDownNotice data-qa-id="property-detail-api-down" />;
  }

  return (
    <main data-qa-id="property-detail-page" className='flex min-h-dvh flex-col bg-[radial-gradient(50%_50%_at_100%_50%,rgba(85,71,181,0.2)_0%,rgba(216,200,255,0)_100%)]'>
      {/* Hero Section */}
      <Hero
        data-qa-id="property-detail-hero"
        backgroundImage='/assets/images/backgrounds/ExploreBG.jpg'
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore' },
          { label: industrialCity.name , href: '/explore/listing' },
        ]}
        className='pb-28 md:pb-40'
      />

      <section data-qa-id="property-detail-mobile-actions" className='md:hidden mx-auto -mt-20 mb-11'>
        <div data-qa-id="property-detail-mobile-actions-container" className='end-4 top-4 z-10 flex items-center gap-3'>
          <ExploreActions data-qa-id="property-detail-explore-actions" size='sm' variant='light' />
        </div>
      </section>

      <PropertyDetailsSection data-qa-id="property-detail-details-section" {...industrialCity} />
      <PrioritizationResultsSection data-qa-id="property-detail-prioritization-section" {...industrialCity.prioritizationResultInfo} />
    </main>
  );
}
