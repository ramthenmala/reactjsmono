import * as configurationIndex from '../index';
import { FilterCriteriaPage } from '../filter-criteria';
import { IsicRelevancePage } from '../isic-relevance';
import { FeaturedLandsPage } from '../featured-lands';
import { ConfigurationHistoryPage } from '../configuration-history';

describe('configuration index', () => {
  it('exports FilterCriteriaPage', () => {
    expect(configurationIndex.FilterCriteriaPage).toBeDefined();
    expect(typeof configurationIndex.FilterCriteriaPage).toBe('function');
  });

  it('exports IsicRelevancePage', () => {
    expect(configurationIndex.IsicRelevancePage).toBeDefined();
    expect(typeof configurationIndex.IsicRelevancePage).toBe('function');
  });

  it('exports FeaturedLandsPage', () => {
    expect(configurationIndex.FeaturedLandsPage).toBeDefined();
    expect(typeof configurationIndex.FeaturedLandsPage).toBe('function');
  });

  it('exports ConfigurationHistoryPage', () => {
    expect(configurationIndex.ConfigurationHistoryPage).toBeDefined();
    expect(typeof configurationIndex.ConfigurationHistoryPage).toBe('function');
  });

  it('exports match the configuration module exports', () => {
    expect(configurationIndex.FilterCriteriaPage).toBe(FilterCriteriaPage);
    expect(configurationIndex.IsicRelevancePage).toBe(IsicRelevancePage);
    expect(configurationIndex.FeaturedLandsPage).toBe(FeaturedLandsPage);
    expect(configurationIndex.ConfigurationHistoryPage).toBe(
      ConfigurationHistoryPage,
    );
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(configurationIndex);
    expect(exports).toHaveLength(4);
  });
});
