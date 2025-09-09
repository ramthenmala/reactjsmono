import { Button } from '@compass/shared-ui';
import { useLocaleTranslation } from '../../lib/i18n';

export function CTASection() {
  const { t } = useLocaleTranslation();

  return (
    <section className='w-full bg-white'>
      <div className='container py-16 mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
          <div>
            <h3 className='font-semibold text-[30px] leading-[38px] tracking-normal md:text-left text-center mb-6 text-[#171B23]'>
              {t('cta.title') || 'Ready to Find Your Industrial Investment?'}
            </h3>
            <p className='text-justify text-[18px] leading-[24px] font-normal md:text-[16px] md:leading-[24px] md:font-medium tracking-normal text-[#3D424C] md:text-[#50555E]'>
              {t('cta.description') ||
                'Discover prime industrial locations across Saudi Arabia with our comprehensive platform. Get detailed insights, compare options, and connect with the right opportunities for your business growth.'}
            </p>
          </div>
          <div className='flex justify-center md:justify-end'>
            <Button
              size='lg'
              color='primary'
              className='flex items-center justify-center
                        rounded-xl
                        font-sans font-semibold text-white
                        transition
                        bg-[linear-gradient(62.92deg,#5547B5_-0.07%,#695DC2_100%)]
                        /* Mobile defaults */
                        w-[170px] h-12 px-[18px] py-[12px] gap-[6px]
                        /* Desktop overrides */
                        md:w-[190px] md:h-14 md:px-5 md:py-[14px] md:gap-[10px]'
            >
              {t('cta.button') || 'Start Exploring'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
