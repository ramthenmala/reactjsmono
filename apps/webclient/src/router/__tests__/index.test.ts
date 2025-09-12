import * as routerIndex from '../index';
import * as routerUtils from '../routerUtils';
import * as constants from '@/shared/lib/constants';

// Mock the AppRouter component to avoid React component testing complexities
jest.mock('../AppRouter', () => ({
  AppRouter: () => null,
}));

describe('router index', () => {
  it('should export AppRouter component', () => {
    expect(routerIndex.AppRouter).toBeDefined();
    expect(typeof routerIndex.AppRouter).toBe('function');
  });

  it('should re-export locale constants from shared lib', () => {
    expect(routerIndex.SUPPORTED_LOCALES).toBe(constants.SUPPORTED_LOCALES);
    expect(routerIndex.DEFAULT_LOCALE).toBe(constants.DEFAULT_LOCALE);
    expect(routerIndex.isValidLocale).toBe(constants.isValidLocale);
  });

  it('should re-export router utilities', () => {
    expect(routerIndex.useCurrentLocale).toBe(routerUtils.useCurrentLocale);
    expect(routerIndex.useLocaleNavigate).toBe(routerUtils.useLocaleNavigate);
    expect(routerIndex.getLocaleUrl).toBe(routerUtils.getLocaleUrl);
    expect(routerIndex.getLocaleFromPathname).toBe(routerUtils.getLocaleFromPathname);
    expect(routerIndex.generateLocaleUrls).toBe(routerUtils.generateLocaleUrls);
  });

  it('should maintain proper module structure', () => {
    const exportedKeys = Object.keys(routerIndex);
    const expectedExports = [
      'AppRouter',
      'SUPPORTED_LOCALES',
      'DEFAULT_LOCALE',
      'isValidLocale',
      'useCurrentLocale',
      'useLocaleNavigate',
      'getLocaleUrl',
      'getLocaleFromPathname',
      'generateLocaleUrls',
    ];
    
    expectedExports.forEach(exportName => {
      expect(exportedKeys).toContain(exportName);
    });
  });

  it('should re-export functions with same functionality', () => {
    // Test that re-exported functions work the same as original
    const testPath = '/about';
    const testLocale = 'en' as any;
    
    expect(routerIndex.getLocaleUrl(testPath, testLocale))
      .toBe(routerUtils.getLocaleUrl(testPath, testLocale));
    
    expect(routerIndex.getLocaleFromPathname('/en/home'))
      .toBe(routerUtils.getLocaleFromPathname('/en/home'));
      
    expect(routerIndex.generateLocaleUrls(testPath))
      .toEqual(routerUtils.generateLocaleUrls(testPath));
  });

  it('should re-export constants with same values', () => {
    expect(routerIndex.DEFAULT_LOCALE).toBe(constants.DEFAULT_LOCALE);
    expect(routerIndex.SUPPORTED_LOCALES).toEqual(constants.SUPPORTED_LOCALES);
    
    // Test isValidLocale function
    expect(routerIndex.isValidLocale('en')).toBe(constants.isValidLocale('en'));
    expect(routerIndex.isValidLocale('ar')).toBe(constants.isValidLocale('ar'));
    expect(routerIndex.isValidLocale('invalid')).toBe(constants.isValidLocale('invalid'));
  });

  it('should export all utility functions as functions', () => {
    expect(typeof routerIndex.useCurrentLocale).toBe('function');
    expect(typeof routerIndex.useLocaleNavigate).toBe('function');
    expect(typeof routerIndex.getLocaleUrl).toBe('function');
    expect(typeof routerIndex.getLocaleFromPathname).toBe('function');
    expect(typeof routerIndex.generateLocaleUrls).toBe('function');
    expect(typeof routerIndex.isValidLocale).toBe('function');
  });

  it('should export constants with correct types', () => {
    expect(Array.isArray(routerIndex.SUPPORTED_LOCALES)).toBe(true);
    expect(typeof routerIndex.DEFAULT_LOCALE).toBe('string');
    expect(routerIndex.SUPPORTED_LOCALES.length).toBeGreaterThan(0);
    expect(routerIndex.SUPPORTED_LOCALES).toContain(routerIndex.DEFAULT_LOCALE);
  });

  it('should maintain consistent API surface', () => {
    // Ensure that the index file provides a consistent API
    const indexExports = Object.keys(routerIndex);
    const utilExports = Object.keys(routerUtils);
    const constantExports = ['SUPPORTED_LOCALES', 'DEFAULT_LOCALE', 'isValidLocale'];
    
    // All util exports should be re-exported
    utilExports.forEach(exportName => {
      expect(indexExports).toContain(exportName);
    });
    
    // All constant exports should be re-exported
    constantExports.forEach(exportName => {
      expect(indexExports).toContain(exportName);
    });
    
    // AppRouter should be exported
    expect(indexExports).toContain('AppRouter');
  });
});