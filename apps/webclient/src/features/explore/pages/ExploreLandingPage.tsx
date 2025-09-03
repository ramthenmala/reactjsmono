import { memo, Suspense } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { SearchPanel, FeaturedIndustrialCities, InvestorJourney } from '../components';
import { LoadingSpinner } from '../../../shared/ui/components/LoadingSpinner';
import { ErrorFallback } from '../../../shared/ui/components/ErrorFallback';
import { ErrorBoundary } from '../../../shared/ui/components/ErrorBoundary';

// Page configuration constants
const PAGE_CONFIG = {
  hero: {
    backgroundImage: '/images/ExploreBG.jpg',
    breadcrumbBase: '/explore/landing',
  },
  layout: {
    className: 'flex min-h-dvh flex-col',
    background: 'bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
  },
} as const;

// Error fallback component for sections
const SectionErrorFallback = memo(({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <section className="py-8 px-4">
    <ErrorFallback 
      error={error} 
      resetErrorBoundary={resetErrorBoundary}
      message="This section failed to load"
    />
  </section>
));
SectionErrorFallback.displayName = 'SectionErrorFallback';

// Loading component for sections
const SectionLoading = memo(() => (
  <section className="py-8 px-4 flex justify-center">
    <LoadingSpinner />
  </section>
));
SectionLoading.displayName = 'SectionLoading';

// Hero Section Component
const HeroSection = memo(() => {
  const { t } = useLocaleTranslation();
  
  return (
    <Hero
      backgroundImage={PAGE_CONFIG.hero.backgroundImage}
      title={t('hero.explore.title') || 'Explore Industrial Opportunities'}
      subtitle={t('hero.explore.subtitle') || 'Discover investment opportunities across Saudi Arabia\'s industrial landscape'}
      breadcrumbItems={[
        { 
          label: t('navigation.explore') || 'Explore', 
          href: PAGE_CONFIG.hero.breadcrumbBase,
          current: true
        }
      ]}
    />
  );
});
HeroSection.displayName = 'HeroSection';

// Search Section Component
const SearchSection = memo(() => (
  <ErrorBoundary FallbackComponent={SectionErrorFallback}>
    <Suspense fallback={<SectionLoading />}>
      <SearchPanel />
    </Suspense>
  </ErrorBoundary>
));
SearchSection.displayName = 'SearchSection';

// Featured Cities Section Component
const FeaturedCitiesSection = memo(() => {
  const { t } = useLocaleTranslation();
  
  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      <Suspense fallback={<SectionLoading />}>
        <FeaturedIndustrialCities
          title={t('explore.featured.title') || 'Featured Industrial Cities'}
          subtitle={t('explore.featured.subtitle') || 'Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.'}
        />
      </Suspense>
    </ErrorBoundary>
  );
});
FeaturedCitiesSection.displayName = 'FeaturedCitiesSection';

// Investor Journey Section Component
const InvestorJourneySection = memo(() => (
  <ErrorBoundary FallbackComponent={SectionErrorFallback}>
    <Suspense fallback={<SectionLoading />}>
      <InvestorJourney />
    </Suspense>
  </ErrorBoundary>
));
InvestorJourneySection.displayName = 'InvestorJourneySection';

// Main page component
export const ExploreLandingPage = memo(() => {
  return (
    <main className={`${PAGE_CONFIG.layout.className} ${PAGE_CONFIG.layout.background}`}>
      {/* Hero Section - Critical, no lazy loading */}
      <HeroSection />

      {/* Search Section - Above the fold, high priority */}
      <SearchSection />

      {/* Featured Cities Section - Below the fold, can be lazy loaded */}
      <FeaturedCitiesSection />

      {/* Investor Journey Section - Bottom section, lowest priority */}
      <InvestorJourneySection />
    </main>
  );
});

ExploreLandingPage.displayName = 'ExploreLandingPage';