/**
 * StatCard Component Styles
 */

export const statCardStyles = {
  container: {
    base: 'rounded-xl border border-solid border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-[rgba(255,255,255,0.30)] shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] px-4 py-4 md:px-6 md:py-[22px] flex flex-col justify-between items-start gap-3 md:gap-[38px] flex-1 min-h-[100px] md:min-h-[120px] w-full',
    withIcon: 'flex items-center gap-2 md:gap-3',
  },

  label:
    'text-xs md:text-sm font-medium text-gray-600 leading-tight w-full',

  value: {
    variants: {
      default:
        'text-lg md:text-2xl font-semibold text-[#695DC2] leading-tight w-full',
      regular:
        'text-lg md:text-2xl font-semibold text-[#695DC2] leading-tight w-full',
      large:
        'text-2xl md:text-4xl font-medium text-[#695DC2] leading-tight w-full',
      logistics:
        'text-lg md:text-2xl font-semibold text-[#695DC2] leading-tight flex items-center gap-2 md:gap-3 w-full',
    },
  },
} as const;
