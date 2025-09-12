import React, { useMemo, useState, useRef } from 'react';
import { PropertyCard } from '@/features/explore/components/Property/PropertyCard';
import { useCurrentLocale } from '@/router';
import { TFeaturedProperty } from '@/features/explore/types/explore';
import { FeaturedIndustrialCitiesProps } from '@/features/explore/types/featuredIndustrialCities';
import { featuredData } from '@/features/explore/data/exploreLandingData';
import { featuredCitiesStyles } from './styles';

const SWIPE_THRESHOLD = 40;

// Utils
const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

export function FeaturedIndustrialCities({
  title = 'Featured Industrial Cities',
  subtitle = 'Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.',
  'data-qa-id': dataQaId = 'featured-industrial-cities',
}: FeaturedIndustrialCitiesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Detect RTL direction
  const currentLocale = useCurrentLocale();
  const isRTL = currentLocale === 'ar';

  // Choose localized dataset based on direction/locale
  const properties: TFeaturedProperty[] = useMemo(() => {
    const list = isRTL ? featuredData.ar : featuredData.en;
    // cast to TFeaturedProperty[] to keep types consistent here
    return list as TFeaturedProperty[];
  }, [isRTL]);

  // Touch handlers for sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    if (startX === null) return;

    const diff = e.changedTouches[0].clientX - startX;

    let next = activeIndex;
    if (diff > SWIPE_THRESHOLD) next = activeIndex - 1; // swipe right
    if (diff < -SWIPE_THRESHOLD) next = activeIndex + 1; // swipe left

    setActiveIndex(clamp(next, 0, properties.length - 1));
    touchStartX.current = null;
  };

  // Dot order aligns with visual order for RTL/LTR
  const visibleOrder = useMemo(() => {
    const indices = properties.map((_, i) => i);
    return isRTL ? indices.reverse() : indices;
  }, [isRTL, properties]);

  return (
    <section
      className={featuredCitiesStyles.section.base}
      style={featuredCitiesStyles.section.style}
      data-qa-id={dataQaId}
    >
      {/* Decorative background pattern */}
      <div
        className={featuredCitiesStyles.backgroundPattern.container}
        style={featuredCitiesStyles.backgroundPattern.style}
        aria-hidden
        data-qa-id={`${dataQaId}-background-pattern`}
      >
        <img
          src='/assets/images/backgrounds/background-pattern-decorative.png'
          alt=''
          style={featuredCitiesStyles.backgroundPattern.image}
          data-qa-id={`${dataQaId}-background-image`}
        />
      </div>
      <div className={featuredCitiesStyles.content.wrapper} data-qa-id={`${dataQaId}-content`}>
        <div className={featuredCitiesStyles.content.header.container} data-qa-id={`${dataQaId}-header`}>
          <h2 className={featuredCitiesStyles.content.header.title} data-qa-id={`${dataQaId}-title`}>{title}</h2>
          <p className={featuredCitiesStyles.content.header.subtitle} data-qa-id={`${dataQaId}-subtitle`}>
            {subtitle}
          </p>
        </div>

        {/* Mobile Slider */}
        <div
          className={featuredCitiesStyles.mobileSlider.container}
          style={featuredCitiesStyles.mobileSlider.containerStyle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          data-qa-id={`${dataQaId}-mobile-slider`}
        >
          <div
            className={featuredCitiesStyles.mobileSlider.track(isRTL)}
            style={featuredCitiesStyles.mobileSlider.trackStyle(activeIndex)}
            data-qa-id={`${dataQaId}-mobile-track`}
          >
            {properties.map((property, idx) => (
              <div
                key={property.id}
                style={featuredCitiesStyles.mobileSlider.slide(
                  idx === activeIndex,
                )}
                data-qa-id={`${dataQaId}-mobile-slide-${idx}`}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots for mobile */}
        <div className={featuredCitiesStyles.dots.container} data-qa-id={`${dataQaId}-mobile-dots`}>
          {visibleOrder.map(actualIdx => (
            <button
              key={actualIdx}
              className={featuredCitiesStyles.dots.button(
                activeIndex === actualIdx,
              )}
              onClick={() => setActiveIndex(actualIdx)}
              aria-label={`Go to card ${actualIdx + 1}`}
              style={featuredCitiesStyles.dots.buttonStyle}
              data-qa-id={`${dataQaId}-mobile-dot-${actualIdx}`}
            />
          ))}
        </div>

        {/* Desktop Grid - Responsive for medium and large screens */}
        <div className={featuredCitiesStyles.desktopGrid} data-qa-id={`${dataQaId}-desktop-grid`}>
          {properties.map((property, idx) => (
            <div key={property.id} data-qa-id={`${dataQaId}-desktop-card-${idx}`}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
