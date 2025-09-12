import {
  buildSearchParams,
  parseSearchParams,
  createRouteUrl,
} from '@/utils/url';

describe('url utilities', () => {
  describe('buildSearchParams', () => {
    it('should build params from simple string values', () => {
      const filters = {
        name: 'test',
        category: 'electronics',
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('name')).toBe('test');
      expect(params.get('category')).toBe('electronics');
    });

    it('should build params from number values', () => {
      const filters = {
        minPrice: 100,
        maxPrice: 500,
        quantity: 3,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('minPrice')).toBe('100');
      expect(params.get('maxPrice')).toBe('500');
      expect(params.get('quantity')).toBe('3');
    });

    it('should build params from boolean values', () => {
      const filters = {
        active: true,
        featured: false,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('active')).toBe('true');
      expect(params.get('featured')).toBe('false');
    });

    it('should handle array values by joining with comma', () => {
      const filters = {
        categories: ['electronics', 'furniture', 'clothing'],
        ids: [1, 2, 3],
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('categories')).toBe('electronics,furniture,clothing');
      expect(params.get('ids')).toBe('1,2,3');
    });

    it('should skip undefined values', () => {
      const filters = {
        name: 'test',
        category: undefined,
        price: 100,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.has('name')).toBe(true);
      expect(params.has('category')).toBe(false);
      expect(params.has('price')).toBe(true);
    });

    it('should skip null values', () => {
      const filters = {
        name: 'test',
        category: null,
        price: 100,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.has('name')).toBe(true);
      expect(params.has('category')).toBe(false);
      expect(params.has('price')).toBe(true);
    });

    it('should skip empty string values', () => {
      const filters = {
        name: '',
        category: 'test',
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.has('name')).toBe(false);
      expect(params.has('category')).toBe(true);
    });

    it('should skip empty arrays', () => {
      const filters = {
        categories: [],
        tags: ['tag1'],
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.has('categories')).toBe(false);
      expect(params.has('tags')).toBe(true);
    });

    it('should handle mixed value types', () => {
      const filters = {
        name: 'product',
        price: 99.99,
        inStock: true,
        tags: ['new', 'sale'],
        description: null,
        category: undefined,
        rating: 0,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('name')).toBe('product');
      expect(params.get('price')).toBe('99.99');
      expect(params.get('inStock')).toBe('true');
      expect(params.get('tags')).toBe('new,sale');
      expect(params.has('description')).toBe(false);
      expect(params.has('category')).toBe(false);
      expect(params.get('rating')).toBe('0');
    });

    it('should handle zero as valid value', () => {
      const filters = {
        min: 0,
        max: 100,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('min')).toBe('0');
      expect(params.get('max')).toBe('100');
    });

    it('should handle false as valid value', () => {
      const filters = {
        active: false,
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('active')).toBe('false');
    });

    it('should handle special characters in strings', () => {
      const filters = {
        query: 'test & special=chars?',
        name: 'hello@world.com',
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('query')).toBe('test & special=chars?');
      expect(params.get('name')).toBe('hello@world.com');
    });

    it('should handle empty object', () => {
      const params = buildSearchParams({});
      
      expect(params.toString()).toBe('');
    });

    it('should handle arrays with empty strings', () => {
      const filters = {
        tags: ['', 'valid', ''],
      };
      
      const params = buildSearchParams(filters);
      
      expect(params.get('tags')).toBe(',valid,');
    });
  });

  describe('parseSearchParams', () => {
    it('should parse simple string values', () => {
      const searchParams = new URLSearchParams('name=test&category=electronics');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        name: 'test',
        category: 'electronics',
      });
    });

    it('should parse numeric values', () => {
      const searchParams = new URLSearchParams('price=99.99&quantity=5&id=123');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        price: 99.99,
        quantity: 5,
        id: 123,
      });
    });

    it('should parse comma-separated values as arrays', () => {
      const searchParams = new URLSearchParams('tags=new,sale,featured&ids=1,2,3');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        tags: ['new', 'sale', 'featured'],
        ids: ['1', '2', '3'],
      });
    });

    it('should handle mixed numeric and string arrays', () => {
      const searchParams = new URLSearchParams('mixed=1,two,3,four');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        mixed: ['1', 'two', '3', 'four'],
      });
    });

    it('should parse boolean-like strings as strings', () => {
      const searchParams = new URLSearchParams('active=true&featured=false');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        active: 'true',
        featured: 'false',
      });
    });

    it('should handle empty values', () => {
      const searchParams = new URLSearchParams('name=&category=test');
      
      const result = parseSearchParams(searchParams);
      
      // Number('') returns 0, not NaN
      expect(result).toEqual({
        name: 0,
        category: 'test',
      });
    });

    it('should handle single comma as non-array', () => {
      const searchParams = new URLSearchParams('value=,');
      
      const result = parseSearchParams(searchParams);
      
      // filter(Boolean) removes empty strings
      expect(result).toEqual({
        value: [],
      });
    });

    it('should handle encoded special characters', () => {
      const searchParams = new URLSearchParams('query=test%20%26%20special%3Dchars%3F');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        query: 'test & special=chars?',
      });
    });

    it('should parse zero correctly', () => {
      const searchParams = new URLSearchParams('min=0&max=100');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        min: 0,
        max: 100,
      });
    });

    it('should handle negative numbers', () => {
      const searchParams = new URLSearchParams('offset=-10&limit=20');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        offset: -10,
        limit: 20,
      });
    });

    it('should handle decimal numbers', () => {
      const searchParams = new URLSearchParams('lat=51.5074&lng=-0.1278');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        lat: 51.5074,
        lng: -0.1278,
      });
    });

    it('should handle empty URLSearchParams', () => {
      const searchParams = new URLSearchParams();
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({});
    });

    it('should handle arrays with empty values after split', () => {
      const searchParams = new URLSearchParams('tags=,middle,');
      
      const result = parseSearchParams(searchParams);
      
      // filter(Boolean) removes empty strings
      expect(result).toEqual({
        tags: ['middle'],
      });
    });

    it('should parse NaN strings as strings', () => {
      const searchParams = new URLSearchParams('value=NaN&text=abc');
      
      const result = parseSearchParams(searchParams);
      
      expect(result).toEqual({
        value: 'NaN',
        text: 'abc',
      });
    });

    it('should handle duplicate keys (takes last value)', () => {
      const searchParams = new URLSearchParams('name=first&name=second');
      
      const result = parseSearchParams(searchParams);
      
      // URLSearchParams actually takes the last value for duplicate keys
      expect(result).toEqual({
        name: 'second',
      });
    });
  });

  describe('createRouteUrl', () => {
    it('should create basic route with locale', () => {
      const url = createRouteUrl('/explore', 'en');
      
      expect(url).toBe('/en/explore');
    });

    it('should create route with different locale', () => {
      const url = createRouteUrl('/explore', 'ar');
      
      expect(url).toBe('/ar/explore');
    });

    it('should handle root path', () => {
      const url = createRouteUrl('/', 'en');
      
      expect(url).toBe('/en/');
    });

    it('should handle path without leading slash', () => {
      const url = createRouteUrl('explore', 'en');
      
      expect(url).toBe('/enexplore');
    });

    it('should create route with query parameters', () => {
      const url = createRouteUrl('/explore', 'en', {
        category: 'electronics',
        minPrice: 100,
      });
      
      expect(url).toBe('/en/explore?category=electronics&minPrice=100');
    });

    it('should handle array parameters', () => {
      const url = createRouteUrl('/search', 'en', {
        tags: ['new', 'sale'],
      });
      
      expect(url).toBe('/en/search?tags=new%2Csale');
    });

    it('should skip null and undefined params', () => {
      const url = createRouteUrl('/explore', 'en', {
        category: 'test',
        min: null,
        max: undefined,
        active: true,
      });
      
      expect(url).toBe('/en/explore?category=test&active=true');
    });

    it('should handle empty params object', () => {
      const url = createRouteUrl('/explore', 'en', {});
      
      expect(url).toBe('/en/explore');
    });

    it('should handle no params argument', () => {
      const url = createRouteUrl('/explore', 'en');
      
      expect(url).toBe('/en/explore');
    });

    it('should handle complex nested paths', () => {
      const url = createRouteUrl('/explore/property/details', 'en', {
        id: 123,
      });
      
      expect(url).toBe('/en/explore/property/details?id=123');
    });

    it('should handle boolean parameters', () => {
      const url = createRouteUrl('/search', 'en', {
        active: true,
        featured: false,
      });
      
      expect(url).toBe('/en/search?active=true&featured=false');
    });

    it('should handle zero values in params', () => {
      const url = createRouteUrl('/search', 'en', {
        min: 0,
        max: 100,
      });
      
      expect(url).toBe('/en/search?min=0&max=100');
    });

    it('should skip empty string values', () => {
      const url = createRouteUrl('/search', 'en', {
        query: '',
        category: 'test',
      });
      
      expect(url).toBe('/en/search?category=test');
    });

    it('should handle special characters in path', () => {
      const url = createRouteUrl('/search-results', 'en', {
        q: 'test query',
      });
      
      expect(url).toBe('/en/search-results?q=test+query');
    });

    it('should handle mixed parameter types', () => {
      const url = createRouteUrl('/api/data', 'en', {
        string: 'value',
        number: 42,
        boolean: true,
        array: ['a', 'b', 'c'],
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zero: 0,
      });
      
      expect(url).toBe('/en/api/data?string=value&number=42&boolean=true&array=a%2Cb%2Cc&zero=0');
    });

    it('should handle locale with region code', () => {
      const url = createRouteUrl('/home', 'en-US');
      
      expect(url).toBe('/en-US/home');
    });

    it('should handle empty arrays in params', () => {
      const url = createRouteUrl('/search', 'en', {
        tags: [],
        categories: ['valid'],
      });
      
      expect(url).toBe('/en/search?categories=valid');
    });

    it('should preserve trailing slashes in path', () => {
      const url = createRouteUrl('/explore/', 'en');
      
      expect(url).toBe('/en/explore/');
    });

    it('should handle path with multiple slashes', () => {
      const url = createRouteUrl('//explore//listing//', 'en');
      
      expect(url).toBe('/en//explore//listing//');
    });
  });

  describe('integration tests', () => {
    it('should round-trip simple params', () => {
      const original = {
        name: 'test',
        price: 99.99,
        active: true,
      };
      
      const params = buildSearchParams(original);
      const parsed = parseSearchParams(params);
      
      expect(parsed).toEqual({
        name: 'test',
        price: 99.99,
        active: 'true', // Note: boolean becomes string
      });
    });

    it('should round-trip array params', () => {
      const original = {
        tags: ['a', 'b', 'c'],
      };
      
      const params = buildSearchParams(original);
      const parsed = parseSearchParams(params);
      
      expect(parsed).toEqual({
        tags: ['a', 'b', 'c'],
      });
    });

    it('should create URL and parse back params', () => {
      const filters = {
        category: 'electronics',
        minPrice: 50,
        maxPrice: 500,
        tags: ['new', 'sale'],
      };
      
      const url = createRouteUrl('/search', 'en', filters);
      const urlObj = new URL(url, 'http://example.com');
      const parsed = parseSearchParams(urlObj.searchParams);
      
      expect(parsed).toEqual({
        category: 'electronics',
        minPrice: 50,
        maxPrice: 500,
        tags: ['new', 'sale'],
      });
    });

    it('should handle edge cases in round-trip', () => {
      const original = {
        zero: 0,
        emptyArray: [],
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
      };
      
      const params = buildSearchParams(original);
      const parsed = parseSearchParams(params);
      
      // Only zero should survive the round-trip
      expect(parsed).toEqual({
        zero: 0,
      });
    });
  });
});