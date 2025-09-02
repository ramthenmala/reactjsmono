import type { AnalyticsSection, ScrollSpyConfig } from '../types/features';

export const ANALYTICS_SECTIONS: AnalyticsSection[] = [
  {
    id: 'investor-insights',
    title: 'analytics.investorInsights.title',
    description: 'analytics.investorInsights.description'
  },
  {
    id: 'industrial-city-insights',
    title: 'analytics.industrialCityInsights.title',
    description: 'analytics.industrialCityInsights.description'
  },
  {
    id: 'national',
    title: 'analytics.national.title',
    description: 'analytics.national.description'
  },
  {
    id: 'regional',
    title: 'analytics.regional.title',
    description: 'analytics.regional.description'
  },
  {
    id: 'city-metrics',
    title: 'analytics.cityMetrics.title',
    description: 'analytics.cityMetrics.description'
  },
  {
    id: 'sector-view',
    title: 'analytics.sectorView.title',
    description: 'analytics.sectorView.description'
  }
];

export const SCROLL_SPY_CONFIG: ScrollSpyConfig = {
  sections: ANALYTICS_SECTIONS.map(section => section.id),
  scrollOffset: 100,
  debounceDelay: 10,
  userScrollTimeout: 1000
};