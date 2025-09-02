// Supported locales
export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Default locale
export const DEFAULT_LOCALE: Locale = 'en';

// Helper function to validate locale
export const isValidLocale = (locale: string): locale is Locale => {
  return SUPPORTED_LOCALES.includes(locale as Locale);
};