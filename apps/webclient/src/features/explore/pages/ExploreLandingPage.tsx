import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { Hero } from '../../../shared/ui/components/Hero';
import { SearchPanel, FeaturedIndustrialCities, InvestorJourney } from '../components';

export function ExploreLandingPage() {
  const { t } = useLocaleTranslation();

  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      <Hero
        backgroundImage="/images/ExploreBG.jpg"
        title={t('hero.explore.title') || 'Explore Industrial Opportunities'}
        subtitle={t('hero.explore.subtitle') || 'Discover investment opportunities across Saudi Arabia\'s industrial landscape'}
        breadcrumbItems={[
          { label: t('navigation.explore') || 'Explore', href: '/explore/landing' }
        ]}
      />

      {/* SearchPanel Section */}
      <SearchPanel />

      {/* FeaturedIndustrialCities Section */}
      <FeaturedIndustrialCities
        title={t('explore.featured.title') || 'Featured Industrial Cities'}
        subtitle={t('explore.featured.subtitle') || 'Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.'}
      />

      {/* InvestorJourney Section */}
      <InvestorJourney />
    </main>
  );
}