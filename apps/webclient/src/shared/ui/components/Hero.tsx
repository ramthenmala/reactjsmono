import { Breadcrumb } from '@compass/shared-ui';
import { ImageSection } from './ImageSection';
import type { HeroProps } from '../../types/hero';

export function Hero({
  backgroundImage,
  title,
  subtitle,
  className = '',
  breadcrumbItems,
}: HeroProps) {
  return (
    <ImageSection
      backgroundImage={backgroundImage}
      alt='Hero background'
      className={`pt-40 pb-34 ${className}`}
      hasOverlay={true}
      data-qa-id="hero-section"
    >
      <div className='container mx-auto px-4' data-qa-id="hero-container">
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div data-qa-id="hero-breadcrumb">
            <Breadcrumb items={breadcrumbItems} showHome={true} />
          </div>
        )}
        {(title || subtitle) && (
          <div className='mx-auto text-center w-full md:w-1/2 my-10' data-qa-id="hero-content">
            {title && (
              <h1
                className='font-sans font-semibold text-center
                text-[40px] leading-[43px] tracking-[-0.02em]
                md:text-[48px] md:leading-[60px] text-[#F5F5F6]'
                data-qa-id="hero-title"
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className='mt-8 text-center font-sans
                text-[14px] leading-[20px] font-normal
                md:text-[18px] md:leading-[28px] md:font-medium
                tracking-normal text-[#F5F5F6]'
                data-qa-id="hero-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </ImageSection>
  );
}
