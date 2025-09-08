/**
 * Barrel export for all explore feature constants
 * Provides clean imports across the application
 */

// Asset paths
export { ASSET_PATHS, getPropertyImageByIndex } from './assets';

// Page configurations  
export { EXPLORE_PAGE_CONFIGS, type ExplorePageType } from './pages';

// Style constants
export { 
  LAYOUT_CLASSES, 
  GRADIENT_STYLES, 
  ANIMATION_CLASSES, 
  COMPONENT_STYLES,
  RESPONSIVE 
} from './styles';

// Re-export commonly used combinations
export const COMMON_LAYOUTS = {
  pageWrapper: 'flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
  sectionContainer: 'container mx-auto px-4 py-8',
  cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
} as const;