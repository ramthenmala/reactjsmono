import { useMemo } from 'react';
import { useLocaleTranslation, useCurrentLocale } from '../../../../shared/lib';
import { InvestorJourneyCard } from './types';

export function useInvestorJourney(steps?: InvestorJourneyCard[]) {
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const isRTL = currentLocale === 'ar';

  const defaultSteps: InvestorJourneyCard[] = useMemo(() => [
    {
      icon: '/images/icons/search-icon.svg',
      title: t('investor_journey.search.title') || 'Search & Filter',
      content: t('investor_journey.search.description') || 'Use our advanced search to find industrial opportunities that match your criteria',
    },
    {
      icon: '/images/icons/compare-icon.svg',
      title: t('investor_journey.compare.title') || 'Compare Options',
      content: t('investor_journey.compare.description') || 'Analyze different locations and properties with detailed insights and data',
    },
    {
      icon: '/images/icons/visit-icon.svg',
      title: t('investor_journey.visit.title') || 'Schedule Visits',
      content: t('investor_journey.visit.description') || 'Arrange site visits and meetings with relevant stakeholders',
    },
    {
      icon: '/images/icons/invest-icon.svg',
      title: t('investor_journey.invest.title') || 'Make Investment',
      content: t('investor_journey.invest.description') || 'Complete your investment with full support throughout the process',
    },
  ], [t]);

  // Data cleanup (normalization)
  const normalizeText = (v?: unknown): string =>
    typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";

  // Accepts various API keys and returns a clean, consistent shape
  const cards: InvestorJourneyCard[] = useMemo(() => {
    const sourceSteps = steps || defaultSteps;
    return sourceSteps.map((s: Record<string, unknown>) => ({
      icon: normalizeText(s?.icon ?? s?.iconUrl ?? s?.icon_url ?? s?.image ?? s?.img),
      title: normalizeText(s?.title ?? s?.name ?? s?.label),
      content: normalizeText(s?.content ?? s?.description ?? s?.desc),
    }));
  }, [steps, defaultSteps]);

  const content = {
    defaultTitle: t('investor_journey.title') || 'Your Investment Journey',
    defaultContent: t('investor_journey.subtitle') || 'Follow our streamlined process to secure your industrial investment',
    ctaTitle: t('investor_journey.cta.title') || 'Ready to Start Your Investment Journey?',
    ctaDescription: t('investor_journey.cta.description') || 'Join hundreds of successful investors who have found their perfect industrial investment opportunity through our platform.',
    ctaButton: t('investor_journey.cta.button') || 'Get Started Today',
  };

  return {
    cards,
    isRTL,
    content,
    t,
  };
}