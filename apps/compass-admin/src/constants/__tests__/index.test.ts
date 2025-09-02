import * as constantsIndex from '../index';
import { ANALYTICS_SECTIONS, SCROLL_SPY_CONFIG } from '../analytics';

describe('constants index', () => {
  it('exports analytics constants', () => {
    expect(constantsIndex.ANALYTICS_SECTIONS).toBeDefined();
    expect(constantsIndex.SCROLL_SPY_CONFIG).toBeDefined();
  });

  it('exports match the analytics module exports', () => {
    expect(constantsIndex.ANALYTICS_SECTIONS).toBe(ANALYTICS_SECTIONS);
    expect(constantsIndex.SCROLL_SPY_CONFIG).toBe(SCROLL_SPY_CONFIG);
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(constantsIndex);
    expect(exports).toHaveLength(2);
  });
});