import * as analyticsIndex from '../index';
import { AnalyticsPage } from '../analytics';

describe('analytics index', () => {
  it('exports AnalyticsPage', () => {
    expect(analyticsIndex.AnalyticsPage).toBeDefined();
    expect(typeof analyticsIndex.AnalyticsPage).toBe('function');
  });

  it('exports match the analytics module exports', () => {
    expect(analyticsIndex.AnalyticsPage).toBe(AnalyticsPage);
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(analyticsIndex);
    expect(exports).toHaveLength(1);
  });
});