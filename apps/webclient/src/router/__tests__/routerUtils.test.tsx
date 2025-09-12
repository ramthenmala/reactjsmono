import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import {
  useCurrentLocale,
  useLocaleNavigate,
  getLocaleUrl,
  getLocaleFromPathname,
  generateLocaleUrls,
} from '@/router/routerUtils';
import { DEFAULT_LOCALE } from '@/shared/lib/constants';

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
  useParams: () => mockUseParams(),
}));

// Mock console to avoid cluttering test output
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

describe('routerUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
    mockNavigate.mockClear();
    mockUseLocation.mockClear();
    mockUseParams.mockClear();
  });

  describe('useCurrentLocale', () => {
    const renderHookWithRouter = (initialPath = '/en') => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[initialPath]}>
          {children}
        </MemoryRouter>
      );
      return renderHook(() => useCurrentLocale(), { wrapper });
    };

    it('should return locale from URL params', () => {
      mockUseParams.mockReturnValue({ locale: 'en' });
      const { result } = renderHookWithRouter('/en');
      expect(result.current).toBe('en');
    });

    it('should return arabic locale from URL params', () => {
      mockUseParams.mockReturnValue({ locale: 'ar' });
      const { result } = renderHookWithRouter('/ar');
      expect(result.current).toBe('ar');
    });

    it('should return default locale when no locale in params', () => {
      mockUseParams.mockReturnValue({});
      const { result } = renderHookWithRouter();
      expect(result.current).toBe(DEFAULT_LOCALE);
    });

    it('should return default locale for invalid locale', () => {
      mockUseParams.mockReturnValue({ locale: 'invalid' });
      const { result } = renderHookWithRouter();
      expect(result.current).toBe(DEFAULT_LOCALE);
    });

    it('should return default locale for undefined locale', () => {
      mockUseParams.mockReturnValue({ locale: undefined });
      const { result } = renderHookWithRouter();
      expect(result.current).toBe(DEFAULT_LOCALE);
    });

    it('should return default locale for null locale', () => {
      mockUseParams.mockReturnValue({ locale: null });
      const { result } = renderHookWithRouter();
      expect(result.current).toBe(DEFAULT_LOCALE);
    });
  });

  describe('useLocaleNavigate', () => {
    const renderHookWithMocks = (locale = 'en', pathname = '/en/home') => {
      mockUseParams.mockReturnValue({ locale });
      mockUseLocation.mockReturnValue({ pathname });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[pathname]}>
          {children}
        </MemoryRouter>
      );
      return renderHook(() => useLocaleNavigate(), { wrapper });
    };

    it('should navigate with current locale for absolute paths', () => {
      const { result } = renderHookWithMocks('en', '/en/home');
      
      result.current.navigate('/about');
      
      expect(mockNavigate).toHaveBeenCalledWith('/en/about', undefined);
    });

    it('should navigate with current locale for relative paths', () => {
      const { result } = renderHookWithMocks('en', '/en/home');
      
      result.current.navigate('contact');
      
      expect(mockNavigate).toHaveBeenCalledWith('/en/contact', undefined);
    });

    it('should navigate with options', () => {
      const { result } = renderHookWithMocks('ar', '/ar/home');
      
      result.current.navigate('/services', { replace: true });
      
      expect(mockNavigate).toHaveBeenCalledWith('/ar/services', { replace: true });
    });

    it('should change locale and maintain current path', () => {
      const { result } = renderHookWithMocks('en', '/en/products/item-1');
      
      result.current.changeLocale('ar');
      
      expect(mockNavigate).toHaveBeenCalledWith('/ar/products/item-1', { replace: true });
    });

    it('should change locale for root path', () => {
      const { result } = renderHookWithMocks('en', '/en');
      
      result.current.changeLocale('ar');
      
      expect(mockNavigate).toHaveBeenCalledWith('/ar', { replace: true });
    });

    it('should change locale with nested paths', () => {
      const { result } = renderHookWithMocks('ar', '/ar/explore/city/123');
      
      result.current.changeLocale('en');
      
      expect(mockNavigate).toHaveBeenCalledWith('/en/explore/city/123', { replace: true });
    });

    it('should return current locale', () => {
      const { result } = renderHookWithMocks('ar', '/ar/home');
      
      expect(result.current.currentLocale).toBe('ar');
    });

    it('should handle default locale fallback', () => {
      const { result } = renderHookWithMocks(undefined, '/invalid/home');
      
      expect(result.current.currentLocale).toBe(DEFAULT_LOCALE);
    });
  });

  describe('getLocaleUrl', () => {
    it('should create locale-aware URL with absolute path', () => {
      expect(getLocaleUrl('/about', 'en')).toBe('/en/about');
      expect(getLocaleUrl('/contact', 'ar')).toBe('/ar/contact');
    });

    it('should create locale-aware URL with relative path', () => {
      expect(getLocaleUrl('about', 'en')).toBe('/en/about');
      expect(getLocaleUrl('contact', 'ar')).toBe('/ar/contact');
    });

    it('should use default locale when locale not provided', () => {
      expect(getLocaleUrl('/services')).toBe(`/${DEFAULT_LOCALE}/services`);
      expect(getLocaleUrl('products')).toBe(`/${DEFAULT_LOCALE}/products`);
    });

    it('should handle nested paths', () => {
      expect(getLocaleUrl('/explore/city/123', 'en')).toBe('/en/explore/city/123');
      expect(getLocaleUrl('products/category/items', 'ar')).toBe('/ar/products/category/items');
    });

    it('should handle root path', () => {
      expect(getLocaleUrl('/', 'en')).toBe('/en/');
      expect(getLocaleUrl('', 'ar')).toBe('/ar/');
    });

    it('should handle paths with query parameters', () => {
      expect(getLocaleUrl('/search?q=test', 'en')).toBe('/en/search?q=test');
      expect(getLocaleUrl('results?page=2&limit=10', 'ar')).toBe('/ar/results?page=2&limit=10');
    });

    it('should handle paths with fragments', () => {
      expect(getLocaleUrl('/page#section', 'en')).toBe('/en/page#section');
      expect(getLocaleUrl('docs#api', 'ar')).toBe('/ar/docs#api');
    });
  });

  describe('getLocaleFromPathname', () => {
    it('should extract valid locale from pathname', () => {
      expect(getLocaleFromPathname('/en/about')).toBe('en');
      expect(getLocaleFromPathname('/ar/contact')).toBe('ar');
    });

    it('should return default locale for invalid locale in pathname', () => {
      expect(getLocaleFromPathname('/fr/about')).toBe(DEFAULT_LOCALE);
      expect(getLocaleFromPathname('/invalid/contact')).toBe(DEFAULT_LOCALE);
    });

    it('should return default locale for pathname without locale', () => {
      expect(getLocaleFromPathname('/about')).toBe(DEFAULT_LOCALE);
      expect(getLocaleFromPathname('/')).toBe(DEFAULT_LOCALE);
    });

    it('should handle complex pathnames', () => {
      expect(getLocaleFromPathname('/en/explore/city/123')).toBe('en');
      expect(getLocaleFromPathname('/ar/products/category/item')).toBe('ar');
    });

    it('should handle pathnames with query parameters', () => {
      expect(getLocaleFromPathname('/en/search?q=test')).toBe('en');
      expect(getLocaleFromPathname('/ar/results?page=2')).toBe('ar');
    });

    it('should handle empty or undefined pathname', () => {
      expect(getLocaleFromPathname('')).toBe(DEFAULT_LOCALE);
      expect(getLocaleFromPathname(undefined as any)).toBe(DEFAULT_LOCALE);
    });

    it('should handle pathnames with fragments', () => {
      expect(getLocaleFromPathname('/en/page#section')).toBe('en');
      expect(getLocaleFromPathname('/ar/docs#api')).toBe('ar');
    });

    it('should handle pathnames with trailing slashes', () => {
      expect(getLocaleFromPathname('/en/')).toBe('en');
      expect(getLocaleFromPathname('/ar/about/')).toBe('ar');
    });
  });

  describe('generateLocaleUrls', () => {
    it('should generate URLs for all supported locales', () => {
      const result = generateLocaleUrls('/about');
      
      expect(result).toEqual({
        en: '/en/about',
        ar: '/ar/about',
      });
    });

    it('should handle relative paths', () => {
      const result = generateLocaleUrls('contact');
      
      expect(result).toEqual({
        en: '/en/contact',
        ar: '/ar/contact',
      });
    });

    it('should handle nested paths', () => {
      const result = generateLocaleUrls('/explore/city/123');
      
      expect(result).toEqual({
        en: '/en/explore/city/123',
        ar: '/ar/explore/city/123',
      });
    });

    it('should handle root path', () => {
      const result = generateLocaleUrls('/');
      
      expect(result).toEqual({
        en: '/en/',
        ar: '/ar/',
      });
    });

    it('should handle empty path', () => {
      const result = generateLocaleUrls('');
      
      expect(result).toEqual({
        en: '/en/',
        ar: '/ar/',
      });
    });

    it('should handle paths with query parameters', () => {
      const result = generateLocaleUrls('/search?q=test&page=1');
      
      expect(result).toEqual({
        en: '/en/search?q=test&page=1',
        ar: '/ar/search?q=test&page=1',
      });
    });

    it('should handle paths with fragments', () => {
      const result = generateLocaleUrls('/docs#getting-started');
      
      expect(result).toEqual({
        en: '/en/docs#getting-started',
        ar: '/ar/docs#getting-started',
      });
    });
  });
});