/**
 * PropertyGrid Component Styles
 */

export const propertyGridStyles = {
  // Main containers
  container: {
    list: 'w-full',
    split: 'flex-1 lg:max-w-2xl',
  },

  // Card grid layout
  cardGrid: 'grid gap-6 grid-cols-1 md:grid-cols-2',

  // Pagination container
  pagination: {
    wrapper: 'mt-8 flex items-center justify-center',
    container: 'flex items-center gap-1',

    // Navigation buttons
    navButton: {
      base: 'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
      enabled: 'text-gray-600 hover:text-gray-900',
      disabled: 'opacity-50 cursor-not-allowed',
    },

    // Page numbers container
    numbers: {
      container: 'flex items-center gap-1 mx-4',
      button: {
        base: 'w-8 h-8 text-sm font-medium transition-colors cursor-pointer',
        active: 'text-blue-600 font-semibold',
        inactive: 'text-gray-600 hover:text-gray-900',
      },
      ellipsis: 'text-gray-400 mx-1',
    },

    // SVG icons
    icons: {
      prev: 'w-4 h-4',
      next: 'w-4 h-4',
    },
  },
} as const;
