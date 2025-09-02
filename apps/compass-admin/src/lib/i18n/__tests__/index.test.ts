import * as i18nIndex from '../index';

describe('i18n index', () => {
  it('exports LocaleWrapper', () => {
    expect(i18nIndex.LocaleWrapper).toBeDefined();
    expect(typeof i18nIndex.LocaleWrapper).toBe('function');
  });

  it('exports i18n resources', () => {
    expect(i18nIndex.resources).toBeDefined();
    expect(typeof i18nIndex.resources).toBe('object');
  });

  it('has expected resources structure', () => {
    expect(i18nIndex.resources).toHaveProperty('en');
    expect(i18nIndex.resources).toHaveProperty('ar');
    
    expect(i18nIndex.resources.en).toHaveProperty('translation');
    expect(i18nIndex.resources.ar).toHaveProperty('translation');
  });

  it('has expected number of exports', () => {
    const exports = Object.keys(i18nIndex);
    expect(exports).toHaveLength(3); // LocaleWrapper, resources, and default
  });
});