/**
 * ViewControls Component Styles
 */

export const viewControlsStyles = {
  container:
    'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6',

  // Left side filters section
  filters: {
    container: 'flex flex-wrap items-center gap-2',
    dropdown: {
      container: 'relative',
      menu: 'absolute top-full left-0 mt-2 w-32 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50',
      padding: 'p-1',
      item: 'w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded',
    },
  },

  // Right side view buttons
  viewButtons: {
    container: 'flex rounded-lg border border-gray-300 overflow-hidden',
    button: {
      base: 'flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
      active: 'bg-purple-600 text-white',
      inactive: 'bg-white text-gray-700 hover:bg-gray-50',
      withBorder: 'border-l border-gray-300',
    },
    icon: 'size-4',
  },
} as const;
