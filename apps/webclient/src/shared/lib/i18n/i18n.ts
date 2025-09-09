import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../constants';

// Configure i18n
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    // Language configuration
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],

    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',

    // Language detection configuration
    detection: {
      // Order of detection methods
      order: ['path', 'localStorage', 'htmlTag', 'navigator'],

      // Look for language in URL path
      lookupFromPathIndex: 0,
      checkWhitelist: true,

      // Cache user language preference
      caches: ['localStorage'],

      // HTML tag configuration
      htmlTag: document.documentElement,
    },

    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already does escaping
      formatSeparator: ',',
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      },
    },

    // React specific options
    react: {
      useSuspense: false, // Disable Suspense since we're loading synchronously
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },

    // Default namespace
    defaultNS: 'translation',
    ns: ['translation'],

    // Key separation
    keySeparator: '.',
    nsSeparator: ':',

    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',

    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lngs, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Missing translation key: ${key} for languages: ${lngs.join(', ')}`
        );
      }
    },

    // Postprocessing
    postProcess: false,
  });

// Export i18n instance
export default i18n;

// Utility functions
export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const isRTL = (language?: string) => {
  const lng = language || i18n.language;
  return lng === 'ar';
};

export const getDirection = (language?: string) => {
  return isRTL(language) ? 'rtl' : 'ltr';
};
