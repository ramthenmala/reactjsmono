/**
 * Page configuration constants for explore feature pages
 * Defines hero settings and layout configurations for each page
 */

import { ASSET_PATHS } from './assets';

export const EXPLORE_PAGE_CONFIGS = {
  landing: {
    hero: {
      backgroundImage: ASSET_PATHS.backgrounds.explore,
      breadcrumbBase: '/explore/landing',
      title: {
        key: 'hero.explore.title',
        fallback: 'Explore Industrial Opportunities',
      },
      subtitle: {
        key: 'hero.explore.subtitle',
        fallback: 'Discover investment opportunities across Saudi Arabia\'s industrial landscape',
      },
    },
    layout: {
      className: 'flex min-h-dvh flex-col',
      background: 'bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
    },
  },
  
  listing: {
    hero: {
      backgroundImage: ASSET_PATHS.backgrounds.explore,
      breadcrumbBase: '/explore/listing',
      title: {
        key: 'hero.explore.title',
        fallback: 'Find Your Perfect Industrial Plot',
      },
      subtitle: {
        key: 'hero.explore.subtitle',
        fallback: 'Browse available industrial properties and find the ideal location for your business',
      },
    },
    layout: {
      className: 'flex min-h-dvh flex-col',
      background: 'bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
    },
  },
  
  detail: {
    hero: {
      backgroundImage: ASSET_PATHS.backgrounds.explore,
      breadcrumbBase: '/explore/property',
      title: {
        key: 'hero.property.title',
        fallback: 'Property Details',
      },
      subtitle: {
        key: 'hero.property.subtitle',
        fallback: 'Detailed information about this industrial property',
      },
    },
    layout: {
      className: 'flex min-h-dvh flex-col',
      background: 'bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
    },
  },
} as const;

/**
 * Type helper to get page config keys
 */
export type ExplorePageType = keyof typeof EXPLORE_PAGE_CONFIGS;