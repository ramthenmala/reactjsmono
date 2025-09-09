import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { Layout } from '../../ui/layout/Layout';
import { DEFAULT_LOCALE, isValidLocale } from '../constants';
import { HomePage } from '../../../features/home/HomePage';
import { ContactPage } from '../../../features/home/ContactPage';
import {
  ExploreLandingPage,
  ExploreListingPage,
  PropertyDetailPage,
} from '../../../features/explore/pages';
import { LanguageProvider } from '../i18n';

// Component to handle locale validation
const LocaleWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { locale } = useParams<{ locale: string }>();

  if (!locale || !isValidLocale(locale)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  return <LanguageProvider>{children}</LanguageProvider>;
};

// Main App Router component
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to default locale */}
        <Route
          path="/"
          element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />}
        />

        {/* Locale-based routes */}
        <Route
          path="/:locale"
          element={
            <LocaleWrapper>
              <Layout />
            </LocaleWrapper>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExploreLandingPage />} />
          <Route path="explore/landing" element={<ExploreLandingPage />} />
          <Route path="explore/listing" element={<ExploreListingPage />} />
          <Route
            path="explore/property/:slug"
            element={<PropertyDetailPage />}
          />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Catch all route - redirect to default locale */}
        <Route
          path="*"
          element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
