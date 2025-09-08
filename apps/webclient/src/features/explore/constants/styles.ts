/**
 * Style and CSS class constants for the explore feature
 * Reusable CSS classes and style configurations
 */

// Layout classes
export const LAYOUT_CLASSES = {
  container: 'container mx-auto px-4',
  section: 'py-8 md:py-16',
  sectionLarge: 'py-12 md:py-24',
  hero: 'relative bg-cover bg-center bg-no-repeat',
  card: 'bg-white rounded-xl shadow-sm',
  cardLarge: 'bg-white rounded-2xl shadow-lg',
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    col: 'flex flex-col',
    wrap: 'flex flex-wrap',
  },
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    cards: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    form: 'grid grid-cols-1 gap-4 md:grid-cols-3',
  },
} as const;

// Color and gradient configurations
export const GRADIENT_STYLES = {
  purple: 'bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]',
  purpleRadial: 'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
  investorJourney: 'radial-gradient(134.48% 100% at 50% 100%, rgba(216, 200, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%)',
  searchPanel: 'radial-gradient(48.45% 55.71% at 50% 0%, rgba(216, 200, 255, 0.50) 0%, rgba(216, 200, 255, 0.00) 100%), rgba(255, 255, 255, 0.80)',
  overlay: {
    dark: 'absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,18,0.55),rgba(16,12,26,0.85))]',
    light: 'absolute inset-0 bg-black/30',
  },
} as const;

// Animation classes
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600',
  transition: 'transition-all duration-300 ease-in-out',
  hover: 'transition-transform duration-300 ease-in-out group-hover:scale-110',
} as const;

// Component-specific styles
export const COMPONENT_STYLES = {
  hero: {
    container: 'relative min-h-[600px] flex items-center',
    overlay: GRADIENT_STYLES.overlay.dark,
    content: 'relative z-10 text-white',
  },
  propertyCard: {
    container: 'overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 flex flex-col h-full group',
    image: 'object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110',
    badge: 'absolute top-3 left-3 z-10',
  },
  searchPanel: {
    container: 'relative z-10 -mt-[80px] mx-auto w-full max-w-[1280px] px-4',
    card: 'relative flex flex-col items-start rounded-[24px] border border-[#EBEDEF] overflow-hidden w-full max-w-[1280px] p-4 md:p-8',
    shadow: '0 2px 75px 20px rgba(85, 71, 181, 0.20)',
  },
} as const;

// Responsive breakpoint helpers
export const RESPONSIVE = {
  mobile: 'block md:hidden',
  desktop: 'hidden md:block',
  tablet: 'hidden md:block lg:hidden',
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-4',
  },
} as const;