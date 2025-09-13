import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, useLanguage, useLocaleTranslation } from '@/i18n/LanguageContext';
import { useCurrentLocale } from '@/router';
import { isRTL, getDirection } from '@/i18n/i18n';
import type { Locale } from '@/shared/lib/constants';

// Mock dependencies
jest.mock('react-i18next');
jest.mock('@/i18n/i18n');

// Mock router module more specifically to avoid import chain issues
jest.mock('@/router', () => ({
  useCurrentLocale: jest.fn(),
}));

const mockedUseTranslation = useTranslation as jest.MockedFunction<typeof useTranslation>;
const mockedUseCurrentLocale = useCurrentLocale as jest.MockedFunction<typeof useCurrentLocale>;
const mockedIsRTL = isRTL as jest.MockedFunction<typeof isRTL>;
const mockedGetDirection = getDirection as jest.MockedFunction<typeof getDirection>;

// Mock i18n object
const mockI18n = {
  language: 'en',
  changeLanguage: jest.fn(),
};

// Mock translation function
const mockT = jest.fn((key: string) => key);

// Test component to access context values
const TestComponent = () => {
  const context = useLanguage();
  return (
    <div>
      <span data-qa-id="current-language">{context.currentLanguage}</span>
      <span data-qa-id="is-rtl">{context.isRTL.toString()}</span>
      <span data-qa-id="direction">{context.direction}</span>
      <span data-qa-id="is-loading">{context.isLoading.toString()}</span>
      <button
        data-qa-id="change-language-btn"
        onClick={() => context.changeLanguage('ar' as Locale)}
      >
        Change Language
      </button>
    </div>
  );
};

// Test component for useLocaleTranslation hook
const LocaleTranslationTestComponent = () => {
  const { t, ready, currentLanguage, isRTL, direction, isLoading } = useLocaleTranslation();
  
  return (
    <div>
      <span data-qa-id="t-function">{t('test.key')}</span>
      <span data-qa-id="ready">{ready.toString()}</span>
      <span data-qa-id="locale-current-language">{currentLanguage}</span>
      <span data-qa-id="locale-is-rtl">{isRTL.toString()}</span>
      <span data-qa-id="locale-direction">{direction}</span>
      <span data-qa-id="locale-is-loading">{isLoading.toString()}</span>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockedUseTranslation.mockReturnValue({
      t: mockT,
      i18n: mockI18n,
      ready: true,
    } as any);
    
    mockedUseCurrentLocale.mockReturnValue('en' as Locale);
    mockedIsRTL.mockReturnValue(false);
    mockedGetDirection.mockReturnValue('ltr');
    
    // Reset i18n mock
    mockI18n.language = 'en';
    mockI18n.changeLanguage.mockResolvedValue(undefined);
    
    // Mock document methods
    const mockHtml = {
      setAttribute: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    };
    Object.defineProperty(document, 'documentElement', {
      value: mockHtml,
      writable: true,
    });
  });

  describe('LanguageProvider', () => {
    it('should render children', () => {
      render(
        <LanguageProvider>
          <div data-qa-id="test-child">Test Child</div>
        </LanguageProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should provide context values for English locale', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('is-rtl')).toHaveTextContent('false');
      expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    it('should provide context values for Arabic locale', () => {
      mockedUseCurrentLocale.mockReturnValue('ar' as Locale);
      mockedIsRTL.mockReturnValue(true);
      mockedGetDirection.mockReturnValue('rtl');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-language')).toHaveTextContent('ar');
      expect(screen.getByTestId('is-rtl')).toHaveTextContent('true');
      expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    });
  });

  describe('useLanguage hook', () => {
    it('should throw error when used outside LanguageProvider', () => {
      const TestComponentWithoutProvider = () => {
        useLanguage();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponentWithoutProvider />)).toThrow(
        'useLanguage must be used within a LanguageProvider'
      );
    });

    it('should provide context value when used within LanguageProvider', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current).toHaveProperty('currentLanguage');
      expect(result.current).toHaveProperty('isRTL');
      expect(result.current).toHaveProperty('direction');
      expect(result.current).toHaveProperty('changeLanguage');
      expect(result.current).toHaveProperty('isLoading');
    });
  });

  describe('Document manipulation effects', () => {
    it('should set document attributes for LTR language', () => {
      const mockHtml = document.documentElement;
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockHtml.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('lang', 'en');
      expect(mockHtml.classList.add).toHaveBeenCalledWith('ltr');
      expect(mockHtml.classList.add).toHaveBeenCalledWith('locale-en');
      expect(mockHtml.classList.remove).toHaveBeenCalledWith('rtl');
      expect(mockHtml.classList.remove).toHaveBeenCalledWith('locale-en', 'locale-ar');
    });

    it('should set document attributes for RTL language', () => {
      const mockHtml = document.documentElement;
      mockedUseCurrentLocale.mockReturnValue('ar' as Locale);
      mockedIsRTL.mockReturnValue(true);
      mockedGetDirection.mockReturnValue('rtl');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockHtml.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('lang', 'ar');
      expect(mockHtml.classList.add).toHaveBeenCalledWith('rtl');
      expect(mockHtml.classList.add).toHaveBeenCalledWith('locale-ar');
      expect(mockHtml.classList.remove).toHaveBeenCalledWith('ltr');
      expect(mockHtml.classList.remove).toHaveBeenCalledWith('locale-en', 'locale-ar');
    });

    it('should update document when language changes', () => {
      const mockHtml = document.documentElement;
      const { rerender } = render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Initially English
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('lang', 'en');

      // Change to Arabic
      mockedUseCurrentLocale.mockReturnValue('ar' as Locale);
      mockedIsRTL.mockReturnValue(true);
      mockedGetDirection.mockReturnValue('rtl');

      rerender(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockHtml.setAttribute).toHaveBeenCalledWith('lang', 'ar');
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
    });
  });

  describe('i18n integration', () => {
    it('should change i18n language when current locale differs', async () => {
      mockI18n.language = 'ar'; // i18n thinks it's Arabic
      mockedUseCurrentLocale.mockReturnValue('en' as Locale); // but current locale is English

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockI18n.changeLanguage).toHaveBeenCalledWith('en');
    });

    it('should not change i18n language when they match', () => {
      mockI18n.language = 'en';
      mockedUseCurrentLocale.mockReturnValue('en' as Locale);

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockI18n.changeLanguage).not.toHaveBeenCalled();
    });

    it('should show loading state while changing language', async () => {
      mockI18n.language = 'ar';
      mockedUseCurrentLocale.mockReturnValue('en' as Locale);
      
      let resolveLanguageChange: () => void;
      mockI18n.changeLanguage.mockImplementation(() => {
        return new Promise<void>((resolve) => {
          resolveLanguageChange = resolve;
        });
      });

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Should be loading initially
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

      // Complete the language change
      await act(async () => {
        resolveLanguageChange!();
      });

      // Should not be loading anymore
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });
  });

  describe('changeLanguage method', () => {
    it('should change language successfully', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await act(async () => {
        screen.getByTestId('change-language-btn').click();
      });

      expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ar');
    });

    it('should show loading state during language change', async () => {
      let resolveLanguageChange: () => void;
      mockI18n.changeLanguage.mockImplementation(() => {
        return new Promise<void>((resolve) => {
          resolveLanguageChange = resolve;
        });
      });

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      // Start language change
      act(() => {
        screen.getByTestId('change-language-btn').click();
      });

      // Should be loading
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

      // Complete language change
      await act(async () => {
        resolveLanguageChange!();
      });

      // Should not be loading anymore
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    it('should handle language change errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockI18n.changeLanguage.mockRejectedValue(new Error('Language change failed'));

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await act(async () => {
        screen.getByTestId('change-language-btn').click();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to change language:', expect.any(Error));
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');

      consoleSpy.mockRestore();
    });
  });

  describe('useLocaleTranslation hook', () => {
    it('should provide translation and language context', () => {
      render(
        <LanguageProvider>
          <LocaleTranslationTestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('t-function')).toHaveTextContent('test.key');
      expect(screen.getByTestId('ready')).toHaveTextContent('true');
      expect(screen.getByTestId('locale-current-language')).toHaveTextContent('en');
      expect(screen.getByTestId('locale-is-rtl')).toHaveTextContent('false');
      expect(screen.getByTestId('locale-direction')).toHaveTextContent('ltr');
      expect(screen.getByTestId('locale-is-loading')).toHaveTextContent('false');
    });

    it('should combine ready state from translation and loading state', () => {
      mockedUseTranslation.mockReturnValue({
        t: mockT,
        i18n: mockI18n,
        ready: true,
      } as any);

      const { result } = renderHook(() => useLocaleTranslation(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.ready).toBe(true);
    });

    it('should show not ready when translation is not ready', () => {
      mockedUseTranslation.mockReturnValue({
        t: mockT,
        i18n: mockI18n,
        ready: false,
      } as any);

      const { result } = renderHook(() => useLocaleTranslation(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.ready).toBe(false);
    });

    it('should show not ready when language is loading', () => {
      mockedUseTranslation.mockReturnValue({
        t: mockT,
        i18n: mockI18n,
        ready: true,
      } as any);

      // Mock loading state
      mockI18n.language = 'ar';
      mockedUseCurrentLocale.mockReturnValue('en' as Locale);

      const { result } = renderHook(() => useLocaleTranslation(), {
        wrapper: LanguageProvider,
      });

      expect(result.current.ready).toBe(false);
    });

    it('should throw error when used outside LanguageProvider', () => {
      const TestHookComponent = () => {
        useLocaleTranslation();
        return <div>Test</div>;
      };

      expect(() => render(<TestHookComponent />)).toThrow(
        'useLanguage must be used within a LanguageProvider'
      );
    });
  });

  describe('Helper function integration', () => {
    it('should call isRTL with current language', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockedIsRTL).toHaveBeenCalledWith('en');
    });

    it('should call getDirection with current language', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(mockedGetDirection).toHaveBeenCalledWith('en');
    });
  });

  describe('Context value structure', () => {
    it('should provide all required context properties', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      expect(result.current).toEqual({
        currentLanguage: 'en',
        isRTL: false,
        direction: 'ltr',
        changeLanguage: expect.any(Function),
        isLoading: false,
      });
    });

    it('should update context values when props change', () => {
      const { result, rerender } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      // Initially English
      expect(result.current.currentLanguage).toBe('en');
      expect(result.current.isRTL).toBe(false);
      expect(result.current.direction).toBe('ltr');

      // Change to Arabic
      mockedUseCurrentLocale.mockReturnValue('ar' as Locale);
      mockedIsRTL.mockReturnValue(true);
      mockedGetDirection.mockReturnValue('rtl');

      rerender();

      expect(result.current.currentLanguage).toBe('ar');
      expect(result.current.isRTL).toBe(true);
      expect(result.current.direction).toBe('rtl');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing document.documentElement', () => {
      const originalDocumentElement = document.documentElement;
      Object.defineProperty(document, 'documentElement', {
        value: null,
        writable: true,
      });

      // The component will throw because it tries to call setAttribute on null
      // This is expected behavior - we should have a valid documentElement
      expect(() => {
        render(
          <LanguageProvider>
            <TestComponent />
          </LanguageProvider>
        );
      }).toThrow();

      // Restore
      Object.defineProperty(document, 'documentElement', {
        value: originalDocumentElement,
        writable: true,
      });
    });

    it('should handle multiple rapid language changes', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: LanguageProvider,
      });

      // Trigger multiple language changes
      await act(async () => {
        result.current.changeLanguage('ar' as Locale);
        result.current.changeLanguage('en' as Locale);
        result.current.changeLanguage('ar' as Locale);
      });

      expect(mockI18n.changeLanguage).toHaveBeenCalledTimes(3);
    });

    it('should handle undefined locale gracefully', () => {
      mockedUseCurrentLocale.mockReturnValue(undefined as any);

      expect(() => {
        render(
          <LanguageProvider>
            <TestComponent />
          </LanguageProvider>
        );
      }).not.toThrow();
    });
  });
});