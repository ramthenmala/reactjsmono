/**
 * Extracts percentage value from string
 * Used in WorkforceTalentSection and potentially other components
 */
export function extractPercentage(value: string | undefined | null): number {
  if (!value) return 0;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Formats currency values with SAR prefix
 */
export function formatSalary(value: string): string {
  if (!value) return '';
  return value.includes('SAR') ? value : `SAR ${value}`;
}

/**
 * Checks if a value exists and is not empty
 */
export function hasValue(value: string | undefined | null): boolean {
  return Boolean(value && value.trim() !== '' && value !== 'N/A');
}

/**
 * Common CSS classes for PropertyDetail sections
 */
export const propertyDetailStyles = {
  section: 'w-full',
  sectionTitle: 'text-xl md:text-2xl font-semibold text-gray-900 mb-6',
  sectionTitleSmall: 'text-md md:text-2xl font-semibold',
  grid: {
    twoColumns: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    threeColumns: 'grid grid-cols-1 md:grid-cols-3 gap-4',
    fourColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  },
  flexLayout: {
    reverseOnLarge: 'flex flex-col-reverse lg:flex-row gap-4 md:gap-10',
    column: 'flex flex-col gap-4',
  },
  image: {
    rounded: 'lg:w-5/12 h-auto rounded-2xl',
  },
  card: {
    container:
      'rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden',
    withPadding:
      'rounded-2xl border border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white/60 py-6 overflow-hidden flex flex-col gap-4 md:gap-8 p-6',
  },
  text: {
    cardSubtitle: 'text-sm font-medium text-gray-600',
  },
} as const;
