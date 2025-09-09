import {
  Home04,
  Users01,
  Link01,
  BarChart01,
  Settings01,
  SearchLg,
  Building01,
  Globe01,
  Map01,
  Grid01,
  FilterFunnel01,
  Archive,
  Star01,
  Clock,
} from '@untitledui/icons';
import type { NavItemType } from '@compass/shared-ui';

export const getNavigationItems = (
  locale = 'en',
  t: (key: string) => string
): NavItemType[] => [
  {
    label: t('navigation.overview'),
    href: `/${locale}/overview`,
    icon: Home04,
  },
  {
    label: t('navigation.investors'),
    href: `/${locale}/investors`,
    icon: Users01,
  },
  {
    label: t('navigation.connectRequests'),
    href: `/${locale}/connect-requests`,
    icon: Link01,
  },
  {
    label: t('navigation.analytics'),
    href: `/${locale}/analytics`,
    icon: BarChart01,
    items: [
      {
        label: t('navigation.investorInsights'),
        href: `/${locale}/analytics#investor-insights`,
        icon: SearchLg,
      },
      {
        label: t('navigation.industrialCityInsights'),
        href: `/${locale}/analytics#industrial-city-insights`,
        icon: Building01,
      },
      {
        label: t('navigation.nationalAnalytics'),
        href: `/${locale}/analytics#national`,
        icon: Globe01,
      },
      {
        label: t('navigation.regionalAnalytics'),
        href: `/${locale}/analytics#regional`,
        icon: Map01,
      },
      {
        label: t('navigation.cityLevelMetrics'),
        href: `/${locale}/analytics#city-metrics`,
        icon: Building01,
      },
      {
        label: t('navigation.sectorLevelView'),
        href: `/${locale}/analytics#sector-view`,
        icon: Grid01,
      },
    ],
  },
  {
    label: t('navigation.configuration'),
    href: `/${locale}/configuration`,
    icon: Settings01,
    items: [
      {
        label: t('navigation.filterCriteria'),
        href: `/${locale}/configuration/filter-criteria`,
        icon: FilterFunnel01,
      },
      {
        label: t('navigation.isicRelevance'),
        href: `/${locale}/configuration/isic-relevance`,
        icon: Archive,
      },
      {
        label: t('navigation.featuredLands'),
        href: `/${locale}/configuration/featured-lands`,
        icon: Star01,
      },
      {
        label: t('navigation.configurationHistory'),
        href: `/${locale}/configuration/history`,
        icon: Clock,
      },
    ],
  },
];

export const navigationItems = getNavigationItems('en', (key: string) => key);
