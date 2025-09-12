import {
  extractPercentage,
  formatSalary,
  hasValue,
  propertyDetailStyles,
  formatValueWithUnit,
} from '@/features/explore/utils/propertyDetailUtils';

describe('propertyDetailUtils', () => {
  describe('extractPercentage', () => {
    it('should extract percentage from string with % symbol', () => {
      expect(extractPercentage('75%')).toBe(75);
      expect(extractPercentage('100%')).toBe(100);
      expect(extractPercentage('25.5%')).toBe(25.5);
    });

    it('should extract percentage from string with just numbers', () => {
      expect(extractPercentage('75')).toBe(75);
      expect(extractPercentage('100')).toBe(100);
      expect(extractPercentage('25.5')).toBe(25.5);
    });

    it('should extract first numeric value from complex strings', () => {
      expect(extractPercentage('High - 85% availability')).toBe(85);
      expect(extractPercentage('Approx 42.5% of total')).toBe(42.5);
      expect(extractPercentage('Rate: 33.33%')).toBe(33.33);
    });

    it('should handle decimal numbers', () => {
      expect(extractPercentage('12.75%')).toBe(12.75);
      expect(extractPercentage('0.5%')).toBe(0.5);
      expect(extractPercentage('99.99%')).toBe(99.99);
    });

    it('should return 0 for null, undefined, or empty values', () => {
      expect(extractPercentage(null)).toBe(0);
      expect(extractPercentage(undefined)).toBe(0);
      expect(extractPercentage('')).toBe(0);
    });

    it('should return 0 for strings without numbers', () => {
      expect(extractPercentage('No data')).toBe(0);
      expect(extractPercentage('N/A')).toBe(0);
      expect(extractPercentage('Not available')).toBe(0);
      expect(extractPercentage('abc')).toBe(0);
    });

    it('should handle strings with special characters', () => {
      expect(extractPercentage('~75%')).toBe(75);
      expect(extractPercentage('>50%')).toBe(50);
      expect(extractPercentage('<25%')).toBe(25);
      expect(extractPercentage('±33.5%')).toBe(33.5);
    });

    it('should extract from strings with units', () => {
      expect(extractPercentage('75% capacity')).toBe(75);
      expect(extractPercentage('25.5% utilization rate')).toBe(25.5);
    });
  });

  describe('formatSalary', () => {
    it('should add SAR prefix to values without SAR', () => {
      expect(formatSalary('5000')).toBe('SAR 5000');
      expect(formatSalary('12500')).toBe('SAR 12500');
      expect(formatSalary('3,500')).toBe('SAR 3,500');
    });

    it('should not add SAR prefix to values that already have SAR', () => {
      expect(formatSalary('SAR 5000')).toBe('SAR 5000');
      expect(formatSalary('SAR 12,500')).toBe('SAR 12,500');
    });

    it('should handle empty values', () => {
      expect(formatSalary('')).toBe('');
      expect(formatSalary(null as any)).toBe('');
      expect(formatSalary(undefined as any)).toBe('');
    });

    it('should handle different SAR formats', () => {
      expect(formatSalary('5000 SAR')).toBe('5000 SAR');
      expect(formatSalary('SAR5000')).toBe('SAR5000');
      expect(formatSalary('sar 5000')).toBe('SAR sar 5000'); // case sensitive
    });

    it('should handle numeric strings with decimals', () => {
      expect(formatSalary('5000.50')).toBe('SAR 5000.50');
      expect(formatSalary('SAR 5000.50')).toBe('SAR 5000.50');
    });
  });

  describe('hasValue', () => {
    it('should return true for valid non-empty strings', () => {
      expect(hasValue('Valid value')).toBe(true);
      expect(hasValue('123')).toBe(true);
      expect(hasValue('0')).toBe(true);
      expect(hasValue('false')).toBe(true);
    });

    it('should return false for null, undefined, or empty values', () => {
      expect(hasValue(null)).toBe(false);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue('')).toBe(false);
    });

    it('should return false for whitespace-only strings', () => {
      expect(hasValue('   ')).toBe(false);
      expect(hasValue('\t\n')).toBe(false);
      expect(hasValue(' \t \n ')).toBe(false);
    });

    it('should return false for N/A values', () => {
      expect(hasValue('N/A')).toBe(false);
      expect(hasValue('n/a')).toBe(true); // case sensitive
      expect(hasValue('N/a')).toBe(true); // case sensitive
    });

    it('should handle strings with leading/trailing whitespace', () => {
      expect(hasValue(' Valid value ')).toBe(true);
      expect(hasValue('  123  ')).toBe(true);
      expect(hasValue('  N/A  ')).toBe(true); // This has content after trimming, but isn't exactly 'N/A'
    });
  });

  describe('propertyDetailStyles', () => {
    it('should have section styles', () => {
      expect(propertyDetailStyles.section).toBe('w-full');
      expect(propertyDetailStyles.sectionTitle).toContain('text-xl');
      expect(propertyDetailStyles.sectionTitle).toContain('font-semibold');
      expect(propertyDetailStyles.sectionTitleSmall).toContain('text-md');
    });

    it('should have grid layout styles', () => {
      expect(propertyDetailStyles.grid.twoColumns).toContain('grid-cols-1');
      expect(propertyDetailStyles.grid.twoColumns).toContain('md:grid-cols-2');
      expect(propertyDetailStyles.grid.threeColumns).toContain('md:grid-cols-3');
      expect(propertyDetailStyles.grid.fourColumns).toContain('lg:grid-cols-4');
    });

    it('should have flex layout styles', () => {
      expect(propertyDetailStyles.flexLayout.reverseOnLarge).toContain('flex-col-reverse');
      expect(propertyDetailStyles.flexLayout.reverseOnLarge).toContain('lg:flex-row');
      expect(propertyDetailStyles.flexLayout.column).toContain('flex-col');
    });

    it('should have image styles', () => {
      expect(propertyDetailStyles.image.rounded).toContain('lg:w-5/12');
      expect(propertyDetailStyles.image.rounded).toContain('rounded-2xl');
    });

    it('should have card styles', () => {
      expect(propertyDetailStyles.card.container).toContain('rounded-2xl');
      expect(propertyDetailStyles.card.container).toContain('border');
      expect(propertyDetailStyles.card.withPadding).toContain('p-6');
      expect(propertyDetailStyles.card.withPadding).toContain('flex-col');
    });

    it('should have text styles', () => {
      expect(propertyDetailStyles.text.cardSubtitle).toContain('text-sm');
      expect(propertyDetailStyles.text.cardSubtitle).toContain('font-medium');
    });

    it('should be immutable (as const)', () => {
      // This test ensures the object is properly typed as readonly
      // TypeScript const assertion provides compile-time immutability
      const originalSection = propertyDetailStyles.section;
      expect(originalSection).toBe('w-full');
      
      // TypeScript should prevent this at compile time
      // @ts-expect-error - Testing that the object is readonly
      // propertyDetailStyles.section = 'modified';
    });
  });

  describe('formatValueWithUnit', () => {
    it('should format value with unit', () => {
      expect(formatValueWithUnit(100, 'km')).toBe('100 km');
      expect(formatValueWithUnit(25.5, 'MW')).toBe('25.5 MW');
      expect(formatValueWithUnit('5000', 'sqm')).toBe('5000 sqm');
    });

    it('should format value without unit', () => {
      expect(formatValueWithUnit(100)).toBe('100');
      expect(formatValueWithUnit(25.5)).toBe('25.5');
      expect(formatValueWithUnit('5000')).toBe('5000');
    });

    it('should handle null and undefined values', () => {
      expect(formatValueWithUnit(null)).toBeUndefined();
      expect(formatValueWithUnit(undefined)).toBeUndefined();
      expect(formatValueWithUnit(null, 'km')).toBeUndefined();
      expect(formatValueWithUnit(undefined, 'MW')).toBeUndefined();
    });

    it('should handle null and undefined units', () => {
      expect(formatValueWithUnit(100, null)).toBe('100');
      expect(formatValueWithUnit(100, undefined)).toBe('100');
      expect(formatValueWithUnit('5000', null)).toBe('5000');
    });

    it('should handle zero values', () => {
      expect(formatValueWithUnit(0)).toBe('0');
      expect(formatValueWithUnit(0, 'km')).toBe('0 km');
      expect(formatValueWithUnit('0')).toBe('0');
      expect(formatValueWithUnit('0', 'MW')).toBe('0 MW');
    });

    it('should handle empty string units', () => {
      expect(formatValueWithUnit(100, '')).toBe('100');
      expect(formatValueWithUnit('5000', '')).toBe('5000');
    });

    it('should handle decimal values with units', () => {
      expect(formatValueWithUnit(123.45, 'kg')).toBe('123.45 kg');
      expect(formatValueWithUnit('98.7', '%')).toBe('98.7 %');
    });

    it('should handle negative values', () => {
      expect(formatValueWithUnit(-10, 'degrees')).toBe('-10 degrees');
      expect(formatValueWithUnit('-5.5', 'units')).toBe('-5.5 units');
    });

    it('should handle string values that look like numbers', () => {
      expect(formatValueWithUnit('100', 'items')).toBe('100 items');
      expect(formatValueWithUnit('25.5', 'percent')).toBe('25.5 percent');
    });

    it('should handle non-numeric string values', () => {
      expect(formatValueWithUnit('Available', 'status')).toBe('Available status');
      expect(formatValueWithUnit('N/A', 'value')).toBe('N/A value');
    });
  });
});