export { AppRouter } from './AppRouter';
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
  isValidLocale,
} from '../shared/lib/constants';
export {
  useCurrentLocale,
  useLocaleNavigate,
  getLocaleUrl,
  getLocaleFromPathname,
  generateLocaleUrls,
} from './routerUtils';
