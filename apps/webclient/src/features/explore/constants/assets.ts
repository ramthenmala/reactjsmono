/**
 * Asset path constants for the explore feature
 * Centralized asset paths to avoid duplication and enable easy updates
 */

export const ASSET_PATHS = {
  backgrounds: {
    explore: '/assets/images/backgrounds/ExploreBG.jpg',
    section: '/assets/images/backgrounds/Section.png',
    decorative: '/assets/images/backgrounds/background-pattern-decorative.png',
    footer: '/assets/images/backgrounds/bg.jpg',
    district: '/assets/images/backgrounds/district-map.png',
    workforce: '/assets/images/backgrounds/workforce-talent.jpg',
  },
  brand: {
    logo: '/assets/images/brand/logo.svg',
    ministry:
      '/assets/images/brand/ministry-of-industry-and-mineral-resources-seek-logo.svg',
    vision2030:
      '/assets/images/brand/vision-2030-kingdom-of-saudi-arabia-logo.svg',
    dga: '/assets/images/brand/registered-on-digital-government-authority-logo.svg',
  },
  flags: {
    SA: '/assets/images/flags/SA.svg',
    US: '/assets/images/flags/US.svg',
  },
  ui: {
    divider: '/assets/images/ui/divider.svg',
    clipboard: '/assets/images/ui/clipboard-check.svg',
    filter: '/assets/images/ui/filter-funnel-02.svg',
    link: '/assets/images/ui/link-03.svg',
  },
  properties: {
    landA: '/assets/images/properties/land-a.png',
    landB: '/assets/images/properties/land-b.png',
    landC: '/assets/images/properties/land-c.png',
    landD: '/assets/images/properties/land-d.png',
    placeholder: '/assets/images/properties/placeholder.png',
  },
} as const;

/**
 * Helper function to get property image by index
 * @param index - Index (0-3) to get corresponding land image
 * @returns Asset path for the property image
 */
export const getPropertyImageByIndex = (index: number): string => {
  const images = [
    ASSET_PATHS.properties.landA,
    ASSET_PATHS.properties.landB,
    ASSET_PATHS.properties.landC,
    ASSET_PATHS.properties.landD,
  ];
  return images[index % images.length];
};
