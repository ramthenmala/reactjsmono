import { getNavigationItems, navigationItems } from '../navigation';

// Mock @untitledui/icons
jest.mock('@untitledui/icons', () => ({
  Home04: 'Home04Icon',
  Users01: 'Users01Icon',
  Link01: 'Link01Icon',
  BarChart01: 'BarChart01Icon',
  Settings01: 'Settings01Icon',
  SearchLg: 'SearchLgIcon',
  Building01: 'Building01Icon',
  Globe01: 'Globe01Icon',
  Map01: 'Map01Icon',
  Grid01: 'Grid01Icon',
  FilterFunnel01: 'FilterFunnel01Icon',
  Archive: 'ArchiveIcon',
  Star01: 'Star01Icon',
  Clock: 'ClockIcon',
}));

describe('Navigation Utils', () => {
  const mockTranslation = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      'navigation.overview': 'Overview',
      'navigation.investors': 'Investors',
      'navigation.connectRequests': 'Connect Requests',
      'navigation.analytics': 'Analytics',
      'navigation.investorInsights': 'Investor Insights',
      'navigation.industrialCityInsights': 'Industrial City Insights',
      'navigation.nationalAnalytics': 'National Analytics',
      'navigation.regionalAnalytics': 'Regional Analytics',
      'navigation.cityLevelMetrics': 'City Level Metrics',
      'navigation.sectorLevelView': 'Sector Level View',
      'navigation.configuration': 'Configuration',
      'navigation.filterCriteria': 'Filter Criteria',
      'navigation.isicRelevance': 'ISIC Relevance',
      'navigation.featuredLands': 'Featured Lands',
      'navigation.configurationHistory': 'Configuration History',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    mockTranslation.mockClear();
  });

  describe('getNavigationItems', () => {
    it('returns correct navigation structure with English locale', () => {
      const items = getNavigationItems('en', mockTranslation);

      expect(items).toHaveLength(5);
      expect(items[0].label).toBe('Overview');
      expect(items[0].href).toBe('/en/overview');
      expect(items[0].icon).toBe('Home04Icon');
    });

    it('returns correct navigation structure with Arabic locale', () => {
      const items = getNavigationItems('ar', mockTranslation);

      expect(items).toHaveLength(5);
      expect(items[0].href).toBe('/ar/overview');
      expect(items[1].href).toBe('/ar/investors');
      expect(items[2].href).toBe('/ar/connect-requests');
      expect(items[3].href).toBe('/ar/analytics');
      expect(items[4].href).toBe('/ar/configuration');
    });

    it('uses default English locale when no locale provided', () => {
      const items = getNavigationItems(undefined, mockTranslation);

      expect(items[0].href).toBe('/en/overview');
      expect(items[1].href).toBe('/en/investors');
      expect(items[2].href).toBe('/en/connect-requests');
    });

    it('calls translation function for all navigation labels', () => {
      getNavigationItems('en', mockTranslation);

      expect(mockTranslation).toHaveBeenCalledWith('navigation.overview');
      expect(mockTranslation).toHaveBeenCalledWith('navigation.investors');
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.connectRequests',
      );
      expect(mockTranslation).toHaveBeenCalledWith('navigation.analytics');
      expect(mockTranslation).toHaveBeenCalledWith('navigation.configuration');
    });

    it('includes correct icons for main navigation items', () => {
      const items = getNavigationItems('en', mockTranslation);

      expect(items[0].icon).toBe('Home04Icon'); // Overview
      expect(items[1].icon).toBe('Users01Icon'); // Investors
      expect(items[2].icon).toBe('Link01Icon'); // Connect Requests
      expect(items[3].icon).toBe('BarChart01Icon'); // Analytics
      expect(items[4].icon).toBe('Settings01Icon'); // Configuration
    });

    it('includes analytics sub-items with correct structure', () => {
      const items = getNavigationItems('en', mockTranslation);
      const analyticsItem = items.find(item => item.label === 'Analytics');

      expect(analyticsItem).toBeDefined();
      expect(analyticsItem?.items).toHaveLength(6);

      const subItems = analyticsItem?.items || [];
      expect(subItems[0].label).toBe('Investor Insights');
      expect(subItems[0].href).toBe('/en/analytics#investor-insights');
      expect(subItems[0].icon).toBe('SearchLgIcon');

      expect(subItems[1].label).toBe('Industrial City Insights');
      expect(subItems[1].href).toBe('/en/analytics#industrial-city-insights');
      expect(subItems[1].icon).toBe('Building01Icon');

      expect(subItems[2].label).toBe('National Analytics');
      expect(subItems[2].href).toBe('/en/analytics#national');
      expect(subItems[2].icon).toBe('Globe01Icon');

      expect(subItems[3].label).toBe('Regional Analytics');
      expect(subItems[3].href).toBe('/en/analytics#regional');
      expect(subItems[3].icon).toBe('Map01Icon');

      expect(subItems[4].label).toBe('City Level Metrics');
      expect(subItems[4].href).toBe('/en/analytics#city-metrics');
      expect(subItems[4].icon).toBe('Building01Icon');

      expect(subItems[5].label).toBe('Sector Level View');
      expect(subItems[5].href).toBe('/en/analytics#sector-view');
      expect(subItems[5].icon).toBe('Grid01Icon');
    });

    it('includes configuration sub-items with correct structure', () => {
      const items = getNavigationItems('en', mockTranslation);
      const configItem = items.find(item => item.label === 'Configuration');

      expect(configItem).toBeDefined();
      expect(configItem?.items).toHaveLength(4);

      const subItems = configItem?.items || [];
      expect(subItems[0].label).toBe('Filter Criteria');
      expect(subItems[0].href).toBe('/en/configuration/filter-criteria');
      expect(subItems[0].icon).toBe('FilterFunnel01Icon');

      expect(subItems[1].label).toBe('ISIC Relevance');
      expect(subItems[1].href).toBe('/en/configuration/isic-relevance');
      expect(subItems[1].icon).toBe('ArchiveIcon');

      expect(subItems[2].label).toBe('Featured Lands');
      expect(subItems[2].href).toBe('/en/configuration/featured-lands');
      expect(subItems[2].icon).toBe('Star01Icon');

      expect(subItems[3].label).toBe('Configuration History');
      expect(subItems[3].href).toBe('/en/configuration/history');
      expect(subItems[3].icon).toBe('ClockIcon');
    });

    it('maintains analytics sub-items locale consistency', () => {
      const items = getNavigationItems('ar', mockTranslation);
      const analyticsItem = items.find(item => item.label === 'Analytics');
      const subItems = analyticsItem?.items || [];

      expect(subItems[0].href).toBe('/ar/analytics#investor-insights');
      expect(subItems[1].href).toBe('/ar/analytics#industrial-city-insights');
      expect(subItems[2].href).toBe('/ar/analytics#national');
      expect(subItems[3].href).toBe('/ar/analytics#regional');
      expect(subItems[4].href).toBe('/ar/analytics#city-metrics');
      expect(subItems[5].href).toBe('/ar/analytics#sector-view');
    });

    it('maintains configuration sub-items locale consistency', () => {
      const items = getNavigationItems('fr', mockTranslation);
      const configItem = items.find(item => item.label === 'Configuration');
      const subItems = configItem?.items || [];

      expect(subItems[0].href).toBe('/fr/configuration/filter-criteria');
      expect(subItems[1].href).toBe('/fr/configuration/isic-relevance');
      expect(subItems[2].href).toBe('/fr/configuration/featured-lands');
      expect(subItems[3].href).toBe('/fr/configuration/history');
    });

    it('calls translation function for all sub-item labels', () => {
      getNavigationItems('en', mockTranslation);

      // Analytics sub-items
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.investorInsights',
      );
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.industrialCityInsights',
      );
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.nationalAnalytics',
      );
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.regionalAnalytics',
      );
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.cityLevelMetrics',
      );
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.sectorLevelView',
      );

      // Configuration sub-items
      expect(mockTranslation).toHaveBeenCalledWith('navigation.filterCriteria');
      expect(mockTranslation).toHaveBeenCalledWith('navigation.isicRelevance');
      expect(mockTranslation).toHaveBeenCalledWith('navigation.featuredLands');
      expect(mockTranslation).toHaveBeenCalledWith(
        'navigation.configurationHistory',
      );
    });

    it('handles custom locales correctly', () => {
      const customLocale = 'custom-locale';
      const items = getNavigationItems(customLocale, mockTranslation);

      expect(items[0].href).toBe(`/${customLocale}/overview`);
      expect(items[1].href).toBe(`/${customLocale}/investors`);
      expect(items[2].href).toBe(`/${customLocale}/connect-requests`);
      expect(items[3].href).toBe(`/${customLocale}/analytics`);
      expect(items[4].href).toBe(`/${customLocale}/configuration`);
    });

    it('returns translation keys when translation function fails', () => {
      const failingTranslation = jest.fn((key: string) => key); // Returns key itself
      const items = getNavigationItems('en', failingTranslation);

      expect(items[0].label).toBe('navigation.overview');
      expect(items[1].label).toBe('navigation.investors');
      expect(items[2].label).toBe('navigation.connectRequests');
      expect(items[3].label).toBe('navigation.analytics');
      expect(items[4].label).toBe('navigation.configuration');
    });

    it('validates navigation item structure', () => {
      const items = getNavigationItems('en', mockTranslation);

      items.forEach(item => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('icon');
        expect(typeof item.label).toBe('string');
        expect(typeof item.href).toBe('string');
        expect(item.href).toMatch(/^\/[a-z-]+\//); // Validates href format
      });
    });

    it('validates sub-items structure', () => {
      const items = getNavigationItems('en', mockTranslation);
      const itemsWithSubItems = items.filter(
        item => item.items && item.items.length > 0,
      );

      expect(itemsWithSubItems).toHaveLength(2); // Analytics and Configuration

      itemsWithSubItems.forEach(item => {
        item.items?.forEach(subItem => {
          expect(subItem).toHaveProperty('label');
          expect(subItem).toHaveProperty('href');
          expect(subItem).toHaveProperty('icon');
          expect(typeof subItem.label).toBe('string');
          expect(typeof subItem.href).toBe('string');
        });
      });
    });
  });

  describe('navigationItems', () => {
    it('is pre-generated with English locale and identity translation', () => {
      expect(navigationItems).toHaveLength(5);
      expect(navigationItems[0].href).toBe('/en/overview');
      expect(navigationItems[0].label).toBe('navigation.overview');
      expect(navigationItems[1].label).toBe('navigation.investors');
      expect(navigationItems[2].label).toBe('navigation.connectRequests');
      expect(navigationItems[3].label).toBe('navigation.analytics');
      expect(navigationItems[4].label).toBe('navigation.configuration');
    });

    it('maintains same structure as getNavigationItems with English locale', () => {
      const identityTranslation = (key: string) => key;
      const generatedItems = getNavigationItems('en', identityTranslation);

      expect(navigationItems).toEqual(generatedItems);
    });

    it('includes all required navigation items', () => {
      const expectedHrefs = [
        '/en/overview',
        '/en/investors',
        '/en/connect-requests',
        '/en/analytics',
        '/en/configuration',
      ];

      navigationItems.forEach((item, index) => {
        expect(item.href).toBe(expectedHrefs[index]);
      });
    });

    it('includes sub-items in pre-generated navigation', () => {
      const analyticsItem = navigationItems.find(
        item => item.href === '/en/analytics',
      );
      const configItem = navigationItems.find(
        item => item.href === '/en/configuration',
      );

      expect(analyticsItem?.items).toHaveLength(6);
      expect(configItem?.items).toHaveLength(4);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty locale string', () => {
      const items = getNavigationItems('', mockTranslation);

      // Empty string locale results in double slash, which is expected behavior
      expect(items[0].href).toBe('//overview');
    });

    it('handles null translation function gracefully', () => {
      // TypeScript would prevent this, but testing runtime behavior
      expect(() => {
        getNavigationItems('en', null as any);
      }).toThrow();
    });

    it('handles undefined translation function gracefully', () => {
      // TypeScript would prevent this, but testing runtime behavior
      expect(() => {
        getNavigationItems('en', undefined as any);
      }).toThrow();
    });

    it('works with different locale formats', () => {
      const locales = ['en-US', 'ar-SA', 'fr-FR', 'de-DE'];

      locales.forEach(locale => {
        const items = getNavigationItems(locale, mockTranslation);
        expect(items).toHaveLength(5);
        expect(items[0].href).toBe(`/${locale}/overview`);
      });
    });

    it('maintains function purity - same inputs produce same outputs', () => {
      const items1 = getNavigationItems('en', mockTranslation);
      const items2 = getNavigationItems('en', mockTranslation);

      expect(items1).toEqual(items2);
      expect(items1).not.toBe(items2); // Different object references
    });
  });
});
