import { memo, useEffect, useState } from 'react';
import { useLocaleTranslation } from '../../../i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { SearchPanel } from '../components/Search/SearchPanel';
import { FeaturedIndustrialCities } from '../components/FeaturedIndustrialCities';
import { InvestorJourney } from '../components/Navigation/InvestorJourney';
import { EXPLORE_PAGE_CONFIGS } from '../constants';
import { useCurrentLocale } from '@/shared';
import { exploreService } from '@/features/explore/services/exploreService';
import { IExploreDetails } from '../types';

// Main page component
export const ExploreLandingPage = memo(() => {
  const currentLocale = useCurrentLocale();
  const [exploreDetails, setExploreDetails] = useState<IExploreDetails | null>(null);
  const { t } = useLocaleTranslation();

  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const data = await exploreService.getExploreData(currentLocale);
        setExploreDetails(data);
      } catch (error) {
        console.error('Failed to load navigation data:', error);
      }
    };

    loadNavigationData();
  }, [currentLocale]);

  return (
    <div
      className={`${EXPLORE_PAGE_CONFIGS.landing.layout.className} ${EXPLORE_PAGE_CONFIGS.landing.layout.background}`}
    >
      {/* Hero Section - Critical, no lazy loading */}
      <Hero
        backgroundImage={exploreDetails?.bannerImage || ''}
        title={exploreDetails?.bannerTitle || ''}
        subtitle={exploreDetails?.bannerContent || ''}
        breadcrumbItems={[
          {
            label: t('navigation.explore'),
            href: EXPLORE_PAGE_CONFIGS.landing.hero.breadcrumbBase,
            current: true,
          },
        ]}
      />

      {/* Search Section - Above the fold, high priority */}
      <SearchPanel />

      {/* Featured Cities Section - Below the fold, can be lazy loaded */}
      <FeaturedIndustrialCities
        title={exploreDetails?.featuredIndustrialCitiesTitle || ''}
        subtitle={exploreDetails?.featuredIndustrialCitiesContent || ''}
      />

      {/* Investor Journey Section - Bottom section, lowest priority */}
      <InvestorJourney
        title={exploreDetails?.compassInvestorJourney.title || ''}
        content={exploreDetails?.compassInvestorJourney.content || ''}
        cards={exploreDetails?.compassInvestorJourney.cards || []}
      />
    </div>
  );
});

ExploreLandingPage.displayName = 'ExploreLandingPage';
