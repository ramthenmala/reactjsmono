import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Locale, DEFAULT_LOCALE, isValidLocale } from '../constants';

/**
 * Hook to get current locale from URL params
 */
export const useCurrentLocale = (): Locale => {
  const { locale } = useParams<{ locale: string }>();
  
  if (!locale || !isValidLocale(locale)) {
    return DEFAULT_LOCALE;
  }
  
  return locale;
};

/**
 * Hook for locale-aware navigation
 */
export const useLocaleNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocale = useCurrentLocale();
  
  const navigateWithLocale = (path: string, options?: { replace?: boolean }) => {
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const localeAwarePath = `/${currentLocale}${fullPath}`;
    navigate(localeAwarePath, options);
  };
  
  const changeLocale = (newLocale: Locale) => {
    const currentPath = location.pathname;
    
    // Replace current locale with new locale in path
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    navigate(newPath, { replace: true });
  };
  
  return {
    navigate: navigateWithLocale,
    changeLocale,
    currentLocale,
  };
};

/**
 * Get locale-aware URL for a path
 */
export const getLocaleUrl = (path: string, locale?: Locale): string => {
  const targetLocale = locale || DEFAULT_LOCALE;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${targetLocale}${cleanPath}`;
};

/**
 * Extract locale from pathname
 */
export const getLocaleFromPathname = (pathname: string): Locale => {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (isValidLocale(potentialLocale)) {
    return potentialLocale;
  }
  
  return DEFAULT_LOCALE;
};

/**
 * Generate all locale variants of a URL for metadata
 */
export const generateLocaleUrls = (path: string) => {
  return {
    en: getLocaleUrl(path, 'en'),
    ar: getLocaleUrl(path, 'ar'),
  };
};