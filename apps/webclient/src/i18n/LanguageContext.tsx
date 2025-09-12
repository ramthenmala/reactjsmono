import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentLocale } from '../router';
import { isRTL, getDirection } from './i18n';
import type { Locale } from '../shared/lib/constants';

interface LanguageContextType {
  currentLanguage: Locale;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  changeLanguage: (locale: Locale) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const currentLocale = useCurrentLocale();
  const [isLoading, setIsLoading] = useState(false);

  const currentLanguage = currentLocale;
  const isRTLLang = isRTL(currentLanguage);
  const direction = getDirection(currentLanguage);

  // Update i18n language when locale changes
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      setIsLoading(true);
      i18n.changeLanguage(currentLanguage).finally(() => {
        setIsLoading(false);
      });
    }
  }, [currentLanguage, i18n]);

  // Update document attributes for RTL support
  useEffect(() => {
    const html = document.documentElement;

    // Set direction
    html.setAttribute('dir', direction);

    // Set lang attribute
    html.setAttribute('lang', currentLanguage);

    // Add/remove RTL class for styling
    if (isRTLLang) {
      html.classList.add('rtl');
      html.classList.remove('ltr');
    } else {
      html.classList.add('ltr');
      html.classList.remove('rtl');
    }

    // Add locale-specific class for font loading
    html.classList.remove('locale-en', 'locale-ar');
    html.classList.add(`locale-${currentLanguage}`);
  }, [currentLanguage, direction, isRTLLang]);

  const changeLanguage = async (locale: Locale): Promise<void> => {
    setIsLoading(true);
    try {
      await i18n.changeLanguage(locale);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    isRTL: isRTLLang,
    direction,
    changeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook for translation with language context
export const useLocaleTranslation = () => {
  const { t, ready } = useTranslation();
  const { currentLanguage, isRTL, direction, isLoading } = useLanguage();

  return {
    t,
    ready: ready && !isLoading,
    currentLanguage,
    isRTL,
    direction,
    isLoading,
  };
};
