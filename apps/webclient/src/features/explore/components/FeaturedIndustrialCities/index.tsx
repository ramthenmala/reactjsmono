import React, { useMemo, useState, useRef } from 'react';
import { PropertyCard } from '@/features/explore/components/Property/PropertyCard';
import { useCurrentLocale } from '@/router';
import { TFeaturedProperty } from '@/features/explore/types/explore';
import { featuredData } from '@/features/explore/data/exploreLandingData';
import { featuredCitiesStyles } from './styles';

const SWIPE_THRESHOLD = 40;

// Utils
const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

export function FeaturedIndustrialCities({
  title = 'Featured Industrial Cities',
  subtitle = 'Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.',
}: {
  title?: string;
  subtitle?: string;
}) {
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
    >
      {/* Decorative background pattern */}
      <div
        className={featuredCitiesStyles.backgroundPattern.container}
        style={featuredCitiesStyles.backgroundPattern.style}
        aria-hidden
      >
        <img
          src='/assets/images/backgrounds/background-pattern-decorative.png'
          alt=''
          style={featuredCitiesStyles.backgroundPattern.image}
        />
      </div>
      <div className={featuredCitiesStyles.content.wrapper}>
        <div className={featuredCitiesStyles.content.header.container}>
          <h2 className={featuredCitiesStyles.content.header.title}>{title}</h2>
          <p className={featuredCitiesStyles.content.header.subtitle}>
            {subtitle}
          </p>
        </div>

        {/* Mobile Slider */}
        <div
          className={featuredCitiesStyles.mobileSlider.container}
          style={featuredCitiesStyles.mobileSlider.containerStyle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={featuredCitiesStyles.mobileSlider.track(isRTL)}
            style={featuredCitiesStyles.mobileSlider.trackStyle(activeIndex)}
          >
            {properties.map((property, idx) => (
              <div
                key={property.id}
                style={featuredCitiesStyles.mobileSlider.slide(
                  idx === activeIndex,
                )}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots for mobile */}
        <div className={featuredCitiesStyles.dots.container}>
          {visibleOrder.map(actualIdx => (
            <button
              key={actualIdx}
              className={featuredCitiesStyles.dots.button(
                activeIndex === actualIdx,
              )}
              onClick={() => setActiveIndex(actualIdx)}
              aria-label={`Go to card ${actualIdx + 1}`}
              style={featuredCitiesStyles.dots.buttonStyle}
            />
          ))}
        </div>

        {/* Desktop Grid - Responsive for medium and large screens */}
        <div className={featuredCitiesStyles.desktopGrid}>
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
