import { useLocaleTranslation } from '../../i18n';
import { Button } from '@compass/shared-ui';

export function HomePage() {
  const { t, currentLanguage } = useLocaleTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* Hero Section */}
      <section
        className='relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(/assets/images/bg.jpg)',
        }}
      >
        <div className='container mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
            {t('hero.title') || 'Welcome to Compass'}
          </h1>
          <p className='text-xl text-gray-200 mb-8 max-w-3xl mx-auto'>
            {t('hero.subtitle') ||
              'Your gateway to industrial investment opportunities in Saudi Arabia'}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button size='lg' color='primary' className='px-8 py-3'>
              {t('cta.explore') || 'Explore Opportunities'}
            </Button>
            <Button
              size='lg'
              color='tertiary'
              className='px-8 py-3 border border-white/30 text-white hover:border-white/50 hover:bg-white/10 transition-all'
            >
              {t('cta.learn_more') || 'Learn More'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            {t('features.title') || 'Key Features'}
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {t('features.explore_title') || 'Explore Industrial Cities'}
              </h3>
              <p className='text-gray-600'>
                {t('features.explore_description') ||
                  "Discover industrial opportunities across Saudi Arabia's key regions and sectors."}
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {t('features.insights_title') || 'Market Insights'}
              </h3>
              <p className='text-gray-600'>
                {t('features.insights_description') ||
                  'Access comprehensive data and analytics to make informed investment decisions.'}
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {t('features.location_title') || 'Strategic Locations'}
              </h3>
              <p className='text-gray-600'>
                {t('features.location_description') ||
                  'Find prime industrial locations with excellent infrastructure and connectivity.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Info Section - For Testing */}
      <section className='py-12 px-4 bg-gray-50'>
        <div className='container mx-auto text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Current Language: {currentLanguage.toUpperCase()}
          </h3>
          <p className='text-gray-600'>
            {currentLanguage === 'ar'
              ? 'مرحباً بك في بوصلة الاستثمار الصناعي'
              : 'Welcome to Industrial Investment Compass'}
          </p>
        </div>
      </section>
    </div>
  );
}
