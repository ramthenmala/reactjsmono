import React, { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RTLWrapper } from './RTLWrapper';
import { Header } from '../navigation/Header';
import { Footer } from './Footer';
import { CTASection } from '../components/CTASection';
import { ComparisonProvider } from '../../../features/explore/contexts/ComparisonContext';
import { ILayoutData, useCurrentLocale } from '@/shared/lib';
import { layoutService } from '@/shared/services/layoutService';

const Loading: React.FC = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
    <span className='ml-2 text-gray-600'>Loading...</span>
  </div>
);

/**
 * Main Layout component that wraps all pages
 * Includes header, footer, and RTL support
 */
export const Layout: React.FC = () => {
  const currentLocale = useCurrentLocale();
  const [layoutData, setLayoutData] = useState<ILayoutData | null>(null);

  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const data = await layoutService.getLayoutData(currentLocale);
        setLayoutData(data);
      } catch (error) {
        console.error('Failed to load navigation data:', error);
      }
    };

    loadNavigationData();
  }, [currentLocale]);

  return (
    <ComparisonProvider>
      <RTLWrapper className='min-h-screen flex flex-col'>
        {/* Header - Fixed/Floating */}
        {layoutData && <div className="absolute inset-x-0 top-0 z-50">
          <Header {...layoutData.header} />
        </div>}

        {/* Main Content Area */}
        <main className='flex-1'>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>

        {/* CTA Section - Appears on every page */}
        <CTASection />

        {/* Footer */}
        {layoutData && <Footer {...layoutData.footer}/>}
      </RTLWrapper>
    </ComparisonProvider>
  );
};
