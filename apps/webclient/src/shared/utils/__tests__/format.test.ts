import {
  formatNumber,
  formatArea,
  formatAreaRange,
  truncateText,
  capitalizeFirst,
} from '@/utils/format';

describe('format utilities', () => {
  describe('formatNumber', () => {
    it('should format number with default locale', () => {
      const result = formatNumber(1234567.89);
      // The exact format depends on the system locale
      expect(typeof result).toBe('string');
      expect(result).toContain('1');
    });

    it('should format number with specific options', () => {
      const result = formatNumber(1234.56, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(typeof result).toBe('string');
      expect(result).toMatch(/1[,.]?234\.56/);
    });

    it('should format zero correctly', () => {
      const result = formatNumber(0);
      expect(result).toBe('0');
    });

    it('should format negative numbers', () => {
      const result = formatNumber(-1234.56);
      expect(result).toMatch(/-1[,.]?234/);
    });

    it('should handle very large numbers', () => {
      const result = formatNumber(9999999999999);
      expect(typeof result).toBe('string');
      expect(result).toContain('9');
    });

    it('should handle very small decimal numbers', () => {
      const result = formatNumber(0.000001);
      expect(typeof result).toBe('string');
    });

    it('should format with currency options', () => {
      const result = formatNumber(1234.56, {
        style: 'currency',
        currency: 'USD',
      });
      expect(result).toMatch(/\$|USD/);
      expect(result).toMatch(/1[,.]?234/);
    });

    it('should format with percentage options', () => {
      const result = formatNumber(0.75, {
        style: 'percent',
      });
      expect(result).toContain('75');
      expect(result).toContain('%');
    });
  });

  describe('formatArea', () => {
    it('should format area with default unit', () => {
      const result = formatArea(1500);
      expect(result).toMatch(/1[,.]?500 m²/);
    });

    it('should format area with custom unit', () => {
      const result = formatArea(2500, 'sq ft');
      expect(result).toMatch(/2[,.]?500 sq ft/);
    });

    it('should format zero area', () => {
      const result = formatArea(0);
      expect(result).toBe('0 m²');
    });

    it('should format decimal areas', () => {
      const result = formatArea(1234.56);
      expect(result).toMatch(/1[,.]?234/);
      expect(result).toContain('m²');
    });

    it('should handle negative area (edge case)', () => {
      const result = formatArea(-100);
      expect(result).toMatch(/-100 m²/);
    });

    it('should handle empty unit string', () => {
      const result = formatArea(100, '');
      expect(result).toBe('100 ');
    });
  });

  describe('formatAreaRange', () => {
    it('should format area range with default unit', () => {
      const result = formatAreaRange(100, 500);
      expect(result).toMatch(/100 - 500 m²/);
    });

    it('should format area range with custom unit', () => {
      const result = formatAreaRange(200, 800, 'sq ft');
      expect(result).toMatch(/200 - 800 sq ft/);
    });

    it('should format range with same min and max', () => {
      const result = formatAreaRange(300, 300);
      expect(result).toBe('300 - 300 m²');
    });

    it('should format range with zero values', () => {
      const result = formatAreaRange(0, 1000);
      expect(result).toMatch(/0 - 1[,.]?000 m²/);
    });

    it('should format range with large numbers', () => {
      const result = formatAreaRange(10000, 50000);
      expect(result).toMatch(/10[,.]?000 - 50[,.]?000 m²/);
    });

    it('should handle inverted range (max < min)', () => {
      const result = formatAreaRange(500, 100);
      expect(result).toBe('500 - 100 m²');
    });

    it('should format with decimal values', () => {
      const result = formatAreaRange(100.5, 200.75, 'acres');
      expect(result).toMatch(/100/);
      expect(result).toMatch(/200/);
      expect(result).toContain('acres');
    });

    it('should handle negative ranges', () => {
      const result = formatAreaRange(-100, 100);
      expect(result).toMatch(/-100 - 100 m²/);
    });

    it('should handle empty unit', () => {
      const result = formatAreaRange(50, 150, '');
      expect(result).toBe('50 - 150 ');
    });
  });

  describe('truncateText', () => {
    it('should return original text if shorter than maxLength', () => {
      const result = truncateText('Hello', 10);
      expect(result).toBe('Hello');
    });

    it('should truncate text longer than maxLength', () => {
      const result = truncateText('Hello World, this is a long text', 11);
      expect(result).toBe('Hello World...');
    });

    it('should handle exact length match', () => {
      const result = truncateText('Hello', 5);
      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });

    it('should handle zero maxLength', () => {
      const result = truncateText('Hello', 0);
      expect(result).toBe('...');
    });

    it('should trim whitespace before ellipsis', () => {
      const result = truncateText('Hello World   ', 11);
      expect(result).toBe('Hello World...');
    });

    it('should handle text with only spaces', () => {
      const result = truncateText('     ', 3);
      expect(result).toBe('...');
    });

    it('should handle unicode characters correctly', () => {
      const result = truncateText('Hello 世界 World', 8);
      expect(result).toBe('Hello 世界...');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const result = truncateText(longText, 10);
      expect(result).toBe('aaaaaaaaaa...');
      expect(result.length).toBe(13); // 10 chars + '...'
    });

    it('should handle negative maxLength as zero', () => {
      const result = truncateText('Hello', -5);
      expect(result).toBe('...');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter of lowercase string', () => {
      const result = capitalizeFirst('hello');
      expect(result).toBe('Hello');
    });

    it('should handle already capitalized string', () => {
      const result = capitalizeFirst('Hello');
      expect(result).toBe('Hello');
    });

    it('should handle all uppercase string', () => {
      const result = capitalizeFirst('HELLO');
      expect(result).toBe('HELLO');
    });

    it('should handle empty string', () => {
      const result = capitalizeFirst('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = capitalizeFirst('a');
      expect(result).toBe('A');
    });

    it('should handle string starting with space', () => {
      const result = capitalizeFirst(' hello');
      expect(result).toBe(' hello');
    });

    it('should handle string starting with number', () => {
      const result = capitalizeFirst('123abc');
      expect(result).toBe('123abc');
    });

    it('should handle string starting with special character', () => {
      const result = capitalizeFirst('!hello');
      expect(result).toBe('!hello');
    });

    it('should only capitalize first letter, not others', () => {
      const result = capitalizeFirst('hello world');
      expect(result).toBe('Hello world');
    });

    it('should handle null/undefined gracefully', () => {
      // @ts-ignore - testing runtime behavior
      const resultNull = capitalizeFirst(null);
      expect(resultNull).toBe(null);

      // @ts-ignore - testing runtime behavior
      const resultUndefined = capitalizeFirst(undefined);
      expect(resultUndefined).toBe(undefined);
    });

    it('should handle unicode characters', () => {
      const result = capitalizeFirst('über');
      expect(result).toBe('Über');
    });
  });
});