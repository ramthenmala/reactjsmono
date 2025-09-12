import * as utils from '../index';

describe('utils index exports', () => {
  describe('url exports', () => {
    it('should export buildSearchParams', () => {
      expect(utils.buildSearchParams).toBeDefined();
      expect(typeof utils.buildSearchParams).toBe('function');
    });

    it('should export parseSearchParams', () => {
      expect(utils.parseSearchParams).toBeDefined();
      expect(typeof utils.parseSearchParams).toBe('function');
    });

    it('should export createRouteUrl', () => {
      expect(utils.createRouteUrl).toBeDefined();
      expect(typeof utils.createRouteUrl).toBe('function');
    });
  });

  describe('format exports', () => {
    it('should export formatNumber', () => {
      expect(utils.formatNumber).toBeDefined();
      expect(typeof utils.formatNumber).toBe('function');
    });

    it('should export formatArea', () => {
      expect(utils.formatArea).toBeDefined();
      expect(typeof utils.formatArea).toBe('function');
    });

    it('should export formatAreaRange', () => {
      expect(utils.formatAreaRange).toBeDefined();
      expect(typeof utils.formatAreaRange).toBe('function');
    });

    it('should export truncateText', () => {
      expect(utils.truncateText).toBeDefined();
      expect(typeof utils.truncateText).toBe('function');
    });

    it('should export capitalizeFirst', () => {
      expect(utils.capitalizeFirst).toBeDefined();
      expect(typeof utils.capitalizeFirst).toBe('function');
    });
  });

  describe('exported functions work correctly', () => {
    it('buildSearchParams should create URLSearchParams', () => {
      const params = utils.buildSearchParams({ test: 'value' });
      expect(params).toBeInstanceOf(URLSearchParams);
      expect(params.get('test')).toBe('value');
    });

    it('parseSearchParams should parse URLSearchParams', () => {
      const searchParams = new URLSearchParams('key=value&num=123');
      const result = utils.parseSearchParams(searchParams);
      expect(result).toEqual({ key: 'value', num: 123 });
    });

    it('createRouteUrl should create localized URL', () => {
      const url = utils.createRouteUrl('/path', 'en', { param: 'value' });
      expect(url).toBe('/en/path?param=value');
    });

    it('formatNumber should format numbers', () => {
      const result = utils.formatNumber(1234);
      expect(typeof result).toBe('string');
      expect(result).toMatch(/1/);
    });

    it('formatArea should format area values', () => {
      const result = utils.formatArea(100);
      expect(result).toBe('100 m²');
    });

    it('formatAreaRange should format area ranges', () => {
      const result = utils.formatAreaRange(100, 200);
      expect(result).toBe('100 - 200 m²');
    });

    it('truncateText should truncate long text', () => {
      const result = utils.truncateText('Hello World', 5);
      expect(result).toBe('Hello...');
    });

    it('capitalizeFirst should capitalize first letter', () => {
      const result = utils.capitalizeFirst('hello');
      expect(result).toBe('Hello');
    });
  });

  describe('verify no unexpected exports', () => {
    it('should only export expected functions', () => {
      const expectedExports = [
        // From url.ts
        'buildSearchParams',
        'parseSearchParams',
        'createRouteUrl',
        // From format.ts
        'formatNumber',
        'formatArea',
        'formatAreaRange',
        'truncateText',
        'capitalizeFirst',
      ];

      const actualExports = Object.keys(utils);
      
      // Check that we have all expected exports
      expectedExports.forEach(exportName => {
        expect(actualExports).toContain(exportName);
      });

      // Check that we don't have unexpected exports
      expect(actualExports.sort()).toEqual(expectedExports.sort());
    });
  });

  describe('export signatures match original implementations', () => {
    it('buildSearchParams should handle various input types', () => {
      const result = utils.buildSearchParams({
        string: 'value',
        number: 123,
        array: ['a', 'b'],
        nullValue: null,
        undefinedValue: undefined,
      });

      expect(result.get('string')).toBe('value');
      expect(result.get('number')).toBe('123');
      expect(result.get('array')).toBe('a,b');
      expect(result.has('nullValue')).toBe(false);
      expect(result.has('undefinedValue')).toBe(false);
    });

    it('parseSearchParams should handle various formats', () => {
      const params = new URLSearchParams('text=hello&num=42&list=a,b,c');
      const result = utils.parseSearchParams(params);

      expect(result.text).toBe('hello');
      expect(result.num).toBe(42);
      expect(result.list).toEqual(['a', 'b', 'c']);
    });

    it('formatNumber should accept options', () => {
      const result = utils.formatNumber(1234.56, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      expect(result).toMatch(/1[,.]?234\.56/);
    });

    it('formatArea should accept custom unit', () => {
      const result = utils.formatArea(100, 'sq ft');
      expect(result).toBe('100 sq ft');
    });

    it('formatAreaRange should accept custom unit', () => {
      const result = utils.formatAreaRange(100, 200, 'acres');
      expect(result).toBe('100 - 200 acres');
    });
  });
});