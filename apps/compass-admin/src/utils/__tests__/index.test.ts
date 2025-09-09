import * as utilsIndex from '../index';
import * as scrollSpyUtils from '../scroll-spy';

describe('utils index', () => {
  it('exports all scroll-spy utilities', () => {
    expect(utilsIndex.createScrollToSection).toBeDefined();
    expect(utilsIndex.createUrlForSection).toBeDefined();
    expect(utilsIndex.extractHashFromUrl).toBeDefined();
    expect(utilsIndex.findActiveSection).toBeDefined();
    expect(utilsIndex.isAnalyticsAnchor).toBeDefined();
  });

  it('exports match the scroll-spy module exports', () => {
    expect(utilsIndex.createScrollToSection).toBe(
      scrollSpyUtils.createScrollToSection
    );
    expect(utilsIndex.createUrlForSection).toBe(
      scrollSpyUtils.createUrlForSection
    );
    expect(utilsIndex.extractHashFromUrl).toBe(
      scrollSpyUtils.extractHashFromUrl
    );
    expect(utilsIndex.findActiveSection).toBe(scrollSpyUtils.findActiveSection);
    expect(utilsIndex.isAnalyticsAnchor).toBe(scrollSpyUtils.isAnalyticsAnchor);
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(utilsIndex);
    expect(exports).toHaveLength(5);
  });
});
