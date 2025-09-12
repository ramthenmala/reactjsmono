import i18n, { changeLanguage, getCurrentLanguage, isRTL, getDirection } from '../i18n';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/shared/lib/constants';

// Mock the translation files
jest.mock('../translations/en.json', () => ({
  welcome: 'Welcome',
  home: 'Home',
  about: 'About Us',
}));

jest.mock('../translations/ar.json', () => ({
  welcome: 'مرحباً',
  home: 'الرئيسية',
  about: 'من نحن',
}));

// Mock console methods
const consoleSpy = {
  warn: jest.fn(),
};

describe('i18n configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.warn.mockClear();
    console.warn = consoleSpy.warn;
  });

  describe('i18n instance configuration', () => {
    it('should be initialized with correct default settings', () => {
      expect(i18n.language).toBeDefined();
      // fallbackLng can be string or array, check if it includes the default locale
      const fallback = i18n.options.fallbackLng;
      if (Array.isArray(fallback)) {
        expect(fallback).toContain(DEFAULT_LOCALE);
      } else {
        expect(fallback).toBe(DEFAULT_LOCALE);
      }
      // supportedLngs may include additional locales like 'cimode' from i18next
      expect(i18n.options.supportedLngs).toContain('en');
      expect(i18n.options.supportedLngs).toContain('ar');
    });

    it('should have correct resource configuration', () => {
      expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
      expect(i18n.hasResourceBundle('ar', 'translation')).toBe(true);
    });

    it('should have debug mode configured based on environment', () => {
      const expectedDebugMode = process.env.NODE_ENV === 'development';
      expect(i18n.options.debug).toBe(expectedDebugMode);
    });

    it('should have interpolation configured correctly', () => {
      expect(i18n.options.interpolation?.escapeValue).toBe(false);
      expect(i18n.options.interpolation?.formatSeparator).toBe(',');
      expect(typeof i18n.options.interpolation?.format).toBe('function');
    });

    it('should have detection configuration', () => {
      expect(i18n.options.detection?.order).toEqual(['path', 'localStorage', 'htmlTag', 'navigator']);
      expect(i18n.options.detection?.lookupFromPathIndex).toBe(0);
      expect(i18n.options.detection?.checkWhitelist).toBe(true);
      expect(i18n.options.detection?.caches).toEqual(['localStorage']);
    });

    it('should have React specific configuration', () => {
      expect(i18n.options.react?.useSuspense).toBe(false);
      expect(i18n.options.react?.bindI18n).toBe('languageChanged');
      expect(i18n.options.react?.transSupportBasicHtmlNodes).toBe(true);
    });
  });

  describe('interpolation format function', () => {
    const formatFn = i18n.options.interpolation?.format;

    it('should format text to uppercase', () => {
      expect(formatFn?.('hello world', 'uppercase')).toBe('HELLO WORLD');
      expect(formatFn?.('test', 'uppercase')).toBe('TEST');
    });

    it('should format text to lowercase', () => {
      expect(formatFn?.('HELLO WORLD', 'lowercase')).toBe('hello world');
      expect(formatFn?.('TEST', 'lowercase')).toBe('test');
    });

    it('should return original value for unknown format', () => {
      expect(formatFn?.('test', 'unknown')).toBe('test');
      expect(formatFn?.('hello', '')).toBe('hello');
      expect(formatFn?.('world', undefined)).toBe('world');
    });

    it('should handle different text types', () => {
      expect(formatFn?.('123', 'uppercase')).toBe('123');
      expect(formatFn?.('MiXeD cAsE', 'lowercase')).toBe('mixed case');
      expect(formatFn?.('special-chars!@#', 'uppercase')).toBe('SPECIAL-CHARS!@#');
    });
  });

  describe('missing key handler', () => {
    beforeEach(() => {
      // Reset i18n to a clean state
      i18n.changeLanguage('en');
    });

    it('should handle missing keys in development mode', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // Trigger missing key handler
      if (i18n.options.missingKeyHandler) {
        i18n.options.missingKeyHandler(['en'], 'translation', 'missing.key');
      }

      if (process.env.NODE_ENV === 'development') {
        expect(consoleSpy.warn).toHaveBeenCalledWith(
          'Missing translation key: missing.key for languages: en'
        );
      }

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should handle missing keys with multiple languages', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      if (i18n.options.missingKeyHandler) {
        i18n.options.missingKeyHandler(['en', 'ar'], 'translation', 'another.missing.key');
      }

      if (process.env.NODE_ENV === 'development') {
        expect(consoleSpy.warn).toHaveBeenCalledWith(
          'Missing translation key: another.missing.key for languages: en, ar'
        );
      }

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('changeLanguage utility', () => {
    it('should change language to English', async () => {
      await changeLanguage('en');
      expect(i18n.language).toBe('en');
    });

    it('should change language to Arabic', async () => {
      await changeLanguage('ar');
      expect(i18n.language).toBe('ar');
    });

    it('should return a promise', () => {
      const result = changeLanguage('en');
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle invalid language codes gracefully', async () => {
      await changeLanguage('invalid');
      // i18n should fall back to fallback language or handle gracefully
      expect(typeof i18n.language).toBe('string');
    });
  });

  describe('getCurrentLanguage utility', () => {
    it('should return current language', async () => {
      await changeLanguage('en');
      expect(getCurrentLanguage()).toBe('en');
      
      await changeLanguage('ar');
      expect(getCurrentLanguage()).toBe('ar');
    });

    it('should return string value', () => {
      const language = getCurrentLanguage();
      expect(typeof language).toBe('string');
    });
  });

  describe('isRTL utility', () => {
    it('should return true for Arabic', () => {
      expect(isRTL('ar')).toBe(true);
    });

    it('should return false for English', () => {
      expect(isRTL('en')).toBe(false);
    });

    it('should return false for unknown languages', () => {
      expect(isRTL('fr')).toBe(false);
      expect(isRTL('de')).toBe(false);
      expect(isRTL('invalid')).toBe(false);
    });

    it('should use current language when no parameter provided', async () => {
      await changeLanguage('ar');
      expect(isRTL()).toBe(true);
      
      await changeLanguage('en');
      expect(isRTL()).toBe(false);
    });

    it('should handle undefined and null values', () => {
      expect(isRTL(undefined)).toBe(false);
      expect(isRTL(null as any)).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isRTL('')).toBe(false);
    });
  });

  describe('getDirection utility', () => {
    it('should return "rtl" for Arabic', () => {
      expect(getDirection('ar')).toBe('rtl');
    });

    it('should return "ltr" for English', () => {
      expect(getDirection('en')).toBe('ltr');
    });

    it('should return "ltr" for unknown languages', () => {
      expect(getDirection('fr')).toBe('ltr');
      expect(getDirection('de')).toBe('ltr');
      expect(getDirection('invalid')).toBe('ltr');
    });

    it('should use current language when no parameter provided', async () => {
      await changeLanguage('ar');
      expect(getDirection()).toBe('rtl');
      
      await changeLanguage('en');
      expect(getDirection()).toBe('ltr');
    });

    it('should handle undefined and null values', () => {
      expect(getDirection(undefined)).toBe('ltr');
      expect(getDirection(null as any)).toBe('ltr');
    });

    it('should handle empty string', () => {
      expect(getDirection('')).toBe('ltr');
    });
  });

  describe('translation functionality', () => {
    beforeEach(async () => {
      await changeLanguage('en');
    });

    it('should translate keys in English', () => {
      expect(i18n.t('welcome')).toBe('Welcome');
      expect(i18n.t('home')).toBe('Home');
      expect(i18n.t('about')).toBe('About Us');
    });

    it('should translate keys in Arabic', async () => {
      await changeLanguage('ar');
      expect(i18n.t('welcome')).toBe('مرحباً');
      expect(i18n.t('home')).toBe('الرئيسية');
      expect(i18n.t('about')).toBe('من نحن');
    });

    it('should handle missing keys with fallback', () => {
      const result = i18n.t('nonexistent.key');
      expect(typeof result).toBe('string');
    });

    it('should handle interpolation with format', () => {
      // Test the format functionality if there are keys that use it
      const testKey = 'formatted.key';
      const result = i18n.t(testKey, { value: 'test', formatParams: { value: ['uppercase'] } });
      expect(typeof result).toBe('string');
    });
  });

  describe('language detection order', () => {
    it('should have path as first detection method', () => {
      expect(i18n.options.detection?.order?.[0]).toBe('path');
    });

    it('should have localStorage as second detection method', () => {
      expect(i18n.options.detection?.order?.[1]).toBe('localStorage');
    });

    it('should have htmlTag as third detection method', () => {
      expect(i18n.options.detection?.order?.[2]).toBe('htmlTag');
    });

    it('should have navigator as fourth detection method', () => {
      expect(i18n.options.detection?.order?.[3]).toBe('navigator');
    });
  });

  describe('namespace and separator configuration', () => {
    it('should use correct key separator', () => {
      expect(i18n.options.keySeparator).toBe('.');
    });

    it('should use correct namespace separator', () => {
      expect(i18n.options.nsSeparator).toBe(':');
    });

    it('should use correct plural separator', () => {
      expect(i18n.options.pluralSeparator).toBe('_');
    });

    it('should use correct context separator', () => {
      expect(i18n.options.contextSeparator).toBe('_');
    });

    it('should use translation as default namespace', () => {
      expect(i18n.options.defaultNS).toBe('translation');
    });
  });
});