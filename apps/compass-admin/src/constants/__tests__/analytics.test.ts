import { ANALYTICS_SECTIONS, SCROLL_SPY_CONFIG } from '../analytics';

describe('analytics constants', () => {
  describe('ANALYTICS_SECTIONS', () => {
    it('contains all expected sections', () => {
      const expectedSections = [
        'investor-insights',
        'industrial-city-insights',
        'national',
        'regional',
        'city-metrics',
        'sector-view',
      ];

      expect(ANALYTICS_SECTIONS).toHaveLength(expectedSections.length);

      const sectionIds = ANALYTICS_SECTIONS.map(section => section.id);
      expectedSections.forEach(expectedId => {
        expect(sectionIds).toContain(expectedId);
      });
    });

    it('has correct structure for each section', () => {
      ANALYTICS_SECTIONS.forEach(section => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('description');

        expect(typeof section.id).toBe('string');
        expect(typeof section.title).toBe('string');
        expect(typeof section.description).toBe('string');

        expect(section.id.length).toBeGreaterThan(0);
        expect(section.title.length).toBeGreaterThan(0);
        expect(section.description.length).toBeGreaterThan(0);
      });
    });

    it('has unique section IDs', () => {
      const ids = ANALYTICS_SECTIONS.map(section => section.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('uses i18n keys for titles and descriptions', () => {
      ANALYTICS_SECTIONS.forEach(section => {
        expect(section.title).toMatch(/^analytics\./);
        expect(section.description).toMatch(/^analytics\./);
      });
    });

    it('has investor-insights section with correct properties', () => {
      const investorInsights = ANALYTICS_SECTIONS.find(
        section => section.id === 'investor-insights',
      );

      expect(investorInsights).toBeDefined();
      expect(investorInsights?.title).toBe('analytics.investorInsights.title');
      expect(investorInsights?.description).toBe(
        'analytics.investorInsights.description',
      );
    });

    it('has industrial-city-insights section with correct properties', () => {
      const industrialCityInsights = ANALYTICS_SECTIONS.find(
        section => section.id === 'industrial-city-insights',
      );

      expect(industrialCityInsights).toBeDefined();
      expect(industrialCityInsights?.title).toBe(
        'analytics.industrialCityInsights.title',
      );
      expect(industrialCityInsights?.description).toBe(
        'analytics.industrialCityInsights.description',
      );
    });

    it('has national section with correct properties', () => {
      const national = ANALYTICS_SECTIONS.find(
        section => section.id === 'national',
      );

      expect(national).toBeDefined();
      expect(national?.title).toBe('analytics.national.title');
      expect(national?.description).toBe('analytics.national.description');
    });

    it('has regional section with correct properties', () => {
      const regional = ANALYTICS_SECTIONS.find(
        section => section.id === 'regional',
      );

      expect(regional).toBeDefined();
      expect(regional?.title).toBe('analytics.regional.title');
      expect(regional?.description).toBe('analytics.regional.description');
    });

    it('has city-metrics section with correct properties', () => {
      const cityMetrics = ANALYTICS_SECTIONS.find(
        section => section.id === 'city-metrics',
      );

      expect(cityMetrics).toBeDefined();
      expect(cityMetrics?.title).toBe('analytics.cityMetrics.title');
      expect(cityMetrics?.description).toBe(
        'analytics.cityMetrics.description',
      );
    });

    it('has sector-view section with correct properties', () => {
      const sectorView = ANALYTICS_SECTIONS.find(
        section => section.id === 'sector-view',
      );

      expect(sectorView).toBeDefined();
      expect(sectorView?.title).toBe('analytics.sectorView.title');
      expect(sectorView?.description).toBe('analytics.sectorView.description');
    });
  });

  describe('SCROLL_SPY_CONFIG', () => {
    it('has correct structure', () => {
      expect(SCROLL_SPY_CONFIG).toHaveProperty('sections');
      expect(SCROLL_SPY_CONFIG).toHaveProperty('scrollOffset');
      expect(SCROLL_SPY_CONFIG).toHaveProperty('debounceDelay');
      expect(SCROLL_SPY_CONFIG).toHaveProperty('userScrollTimeout');
    });

    it('has correct sections array', () => {
      const expectedSectionIds = ANALYTICS_SECTIONS.map(section => section.id);
      expect(SCROLL_SPY_CONFIG.sections).toEqual(expectedSectionIds);
    });

    it('has correct scroll offset value', () => {
      expect(SCROLL_SPY_CONFIG.scrollOffset).toBe(100);
      expect(typeof SCROLL_SPY_CONFIG.scrollOffset).toBe('number');
    });

    it('has correct debounce delay value', () => {
      expect(SCROLL_SPY_CONFIG.debounceDelay).toBe(10);
      expect(typeof SCROLL_SPY_CONFIG.debounceDelay).toBe('number');
    });

    it('has correct user scroll timeout value', () => {
      expect(SCROLL_SPY_CONFIG.userScrollTimeout).toBe(1000);
      expect(typeof SCROLL_SPY_CONFIG.userScrollTimeout).toBe('number');
    });

    it('has reasonable performance values', () => {
      // Scroll offset should be positive
      expect(SCROLL_SPY_CONFIG.scrollOffset).toBeGreaterThan(0);

      // Debounce delay should be small for responsiveness
      expect(SCROLL_SPY_CONFIG.debounceDelay).toBeLessThan(100);
      expect(SCROLL_SPY_CONFIG.debounceDelay).toBeGreaterThanOrEqual(0);

      // User scroll timeout should be reasonable
      expect(SCROLL_SPY_CONFIG.userScrollTimeout).toBeGreaterThan(0);
      expect(SCROLL_SPY_CONFIG.userScrollTimeout).toBeLessThan(5000);
    });

    it('sections array matches ANALYTICS_SECTIONS length', () => {
      expect(SCROLL_SPY_CONFIG.sections.length).toBe(ANALYTICS_SECTIONS.length);
    });

    it('all section IDs exist in ANALYTICS_SECTIONS', () => {
      const analyticsIds = ANALYTICS_SECTIONS.map(section => section.id);

      SCROLL_SPY_CONFIG.sections.forEach(configId => {
        expect(analyticsIds).toContain(configId);
      });
    });
  });
});
