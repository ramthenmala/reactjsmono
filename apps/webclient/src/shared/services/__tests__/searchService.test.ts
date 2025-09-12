import { searchService } from '@/services/searchService';

describe('searchService', () => {
  describe('buildSearchUrl', () => {
    it('should build URL with no filters and default locale', () => {
      const result = searchService.buildSearchUrl({}, 'en');
      expect(result).toBe('/en/explore/listing');
    });

    it('should build URL with simple string filter', () => {
      const filters = { sector: 'technology' };
      const result = searchService.buildSearchUrl(filters, 'en');
      expect(result).toBe('/en/explore/listing?sector=technology');
    });

    it('should build URL with number filter', () => {
      const filters = { minArea: 1000 };
      const result = searchService.buildSearchUrl(filters, 'en');
      expect(result).toBe('/en/explore/listing?minArea=1000');
    });

    it('should build URL with array filter', () => {
      const filters = { isic: ['1010', '2020', '3030'] };
      const result = searchService.buildSearchUrl(filters, 'en');
      expect(result).toBe('/en/explore/listing?isic=1010%2C2020%2C3030');
    });

    it('should build URL with empty array filter (should be excluded)', () => {
      const filters = { isic: [] };
      const result = searchService.buildSearchUrl(filters, 'en');
      expect(result).toBe('/en/explore/listing');
    });

    it('should build URL with multiple filters', () => {
      const filters = {
        sector: 'technology',
        region: 'riyadh',
        minArea: 500,
        maxArea: 5000,
        isic: ['1010', '2020'],
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      // Parse the result to check all parameters are included
      const url = new URL('http://example.com' + result);
      expect(url.pathname).toBe('/en/explore/listing');
      expect(url.searchParams.get('sector')).toBe('technology');
      expect(url.searchParams.get('region')).toBe('riyadh');
      expect(url.searchParams.get('minArea')).toBe('500');
      expect(url.searchParams.get('maxArea')).toBe('5000');
      expect(url.searchParams.get('isic')).toBe('1010,2020');
    });

    it('should handle different locales', () => {
      const filters = { sector: 'technology' };
      
      expect(searchService.buildSearchUrl(filters, 'en')).toBe('/en/explore/listing?sector=technology');
      expect(searchService.buildSearchUrl(filters, 'ar')).toBe('/ar/explore/listing?sector=technology');
      expect(searchService.buildSearchUrl(filters, 'es')).toBe('/es/explore/listing?sector=technology');
    });

    it('should skip undefined values', () => {
      const filters = {
        sector: 'technology',
        region: undefined,
        location: 'city',
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('sector')).toBe('technology');
      expect(url.searchParams.get('location')).toBe('city');
      expect(url.searchParams.has('region')).toBe(false);
    });

    it('should skip null values', () => {
      const filters = {
        sector: 'technology',
        region: null,
        location: 'city',
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('sector')).toBe('technology');
      expect(url.searchParams.get('location')).toBe('city');
      expect(url.searchParams.has('region')).toBe(false);
    });

    it('should skip empty string values', () => {
      const filters = {
        sector: 'technology',
        region: '',
        location: 'city',
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('sector')).toBe('technology');
      expect(url.searchParams.get('location')).toBe('city');
      expect(url.searchParams.has('region')).toBe(false);
    });

    it('should handle zero values correctly', () => {
      const filters = {
        minArea: 0,
        maxArea: 1000,
        sector: 'technology',
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('minArea')).toBe('0');
      expect(url.searchParams.get('maxArea')).toBe('1000');
      expect(url.searchParams.get('sector')).toBe('technology');
    });

    it('should handle special characters in filter values', () => {
      const filters = {
        sector: 'oil & gas',
        location: 'al-khobar',
        isic: ['1010', '20/30'],
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('sector')).toBe('oil & gas');
      expect(url.searchParams.get('location')).toBe('al-khobar');
      expect(url.searchParams.get('isic')).toBe('1010,20/30');
    });

    it('should handle boolean values by converting to string', () => {
      const filters = {
        available: true,
        featured: false,
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('available')).toBe('true');
      expect(url.searchParams.get('featured')).toBe('false');
    });

    it('should handle single item arrays', () => {
      const filters = {
        isic: ['1010'],
        sectors: ['technology'],
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      const url = new URL('http://example.com' + result);
      expect(url.searchParams.get('isic')).toBe('1010');
      expect(url.searchParams.get('sectors')).toBe('technology');
    });

    it('should maintain consistent parameter order', () => {
      const filters = {
        z: 'last',
        a: 'first',
        m: 'middle',
      };
      const result = searchService.buildSearchUrl(filters, 'en');
      
      // URLSearchParams should maintain the order they were added
      const url = new URL('http://example.com' + result);
      const params = Array.from(url.searchParams.keys());
      expect(params).toEqual(['z', 'a', 'm']);
    });

    it('should handle complex filter combinations', () => {
      const filters = {
        isic: ['1010', '2020', '3030'],
        sector: 'manufacturing',
        region: 'eastern',
        location: 'dammam',
        minArea: 1000,
        maxArea: 50000,
        available: true,
        tags: ['industrial', 'waterfront'],
      };
      const result = searchService.buildSearchUrl(filters, 'ar');
      
      const url = new URL('http://example.com' + result);
      expect(url.pathname).toBe('/ar/explore/listing');
      expect(url.searchParams.get('isic')).toBe('1010,2020,3030');
      expect(url.searchParams.get('sector')).toBe('manufacturing');
      expect(url.searchParams.get('region')).toBe('eastern');
      expect(url.searchParams.get('location')).toBe('dammam');
      expect(url.searchParams.get('minArea')).toBe('1000');
      expect(url.searchParams.get('maxArea')).toBe('50000');
      expect(url.searchParams.get('available')).toBe('true');
      expect(url.searchParams.get('tags')).toBe('industrial,waterfront');
    });

    it('should create different URLs for same filters with different locales', () => {
      const filters = { sector: 'technology', region: 'riyadh' };
      
      const enUrl = searchService.buildSearchUrl(filters, 'en');
      const arUrl = searchService.buildSearchUrl(filters, 'ar');
      const esUrl = searchService.buildSearchUrl(filters, 'es');
      
      expect(enUrl).toContain('/en/explore/listing');
      expect(arUrl).toContain('/ar/explore/listing');
      expect(esUrl).toContain('/es/explore/listing');
      
      // Query parameters should be the same
      const enParams = enUrl.split('?')[1];
      const arParams = arUrl.split('?')[1];
      const esParams = esUrl.split('?')[1];
      
      expect(enParams).toBe(arParams);
      expect(arParams).toBe(esParams);
    });
  });
});