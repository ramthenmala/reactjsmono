/**
 * StatCard Component Styles
 */

export const statCardStyles = {
  container: {
    base: 'rounded-xl border border-solid border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white p-4 md:p-6 min-h-22 md:min-h-37 flex flex-col justify-between',
    withIcon: 'flex items-center gap-2 md:gap-3',
  },

  label: 'text-[13px] md:text-sm font-medium text-gray-600',

  value: {
    variants: {
      default: 'text-sm md:text-2xl font-semibold',
      regular: 'text-md md:text-2xl font-semibold text-brand-600',
      large: 'text-md md:text-4xl font-semibold md:font-medium text-brand-600',
    },
  },
} as const;
