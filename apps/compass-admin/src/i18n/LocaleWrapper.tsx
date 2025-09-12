import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TLocaleWrapperProps } from '../types/components';
import { supportedLocales } from '../shared/constants';

export const LocaleWrapper = ({ children }: TLocaleWrapperProps) => {
  const { locale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // If no locale in URL or unsupported locale, redirect to English
    if (!locale || !supportedLocales.includes(locale)) {
      const currentPath = location.pathname;
      const newPath =
        currentPath.startsWith('/en') || currentPath.startsWith('/ar')
          ? currentPath.replace(/^\/[a-z]{2}/, '/en')
          : `/en${currentPath}`;
      navigate(newPath, { replace: true });
      return;
    }

    // Set the language in i18next
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    // Set document direction, lang attribute, and locale class
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;

    // Remove any existing locale classes and add the current one
    document.documentElement.classList.remove('locale-en', 'locale-ar');
    document.documentElement.classList.add(`locale-${locale}`);
  }, [locale, i18n, navigate, location.pathname]);

  return <>{children}</>;
};
