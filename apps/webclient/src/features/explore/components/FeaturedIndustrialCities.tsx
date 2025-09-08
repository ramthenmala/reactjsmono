import React, { useMemo, useState, useRef } from "react";
import { PropertyCard } from "./PropertyCard";
import { useCurrentLocale } from "../../../shared/lib/router";
import { TFeaturedProperty } from "../types/explore";
import { featuredData } from "../data/exploreLandingData";

const SWIPE_THRESHOLD = 40;

// Utils
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export function FeaturedIndustrialCities({
  title = "Featured Industrial Cities",
  subtitle = "Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.",
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
      className="w-full flex flex-col justify-center items-center gap-[80px] relative px-4 py-12 md:px-20 md:py-40"
      style={{ 
        overflow: "visible",
        maxWidth: '1440px',
        margin: '0 auto',
        background: 'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
      }}
    >
      {/* Decorative background pattern */}
      <div
        className="hidden md:block absolute"
        style={{
          left: "50%",
          top: "-60px",
          transform: "translateX(-50%)",
          zIndex: 0,
          width: "1400px",
          height: "800px",
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden
      >
        <img
          src="/assets/images/backgrounds/background-pattern-decorative.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center gap-[80px]">
        <div className="text-center">
          <h2 className="font-semibold text-[36px] leading-[42px] tracking-[-0.02em] md:text-[48px] md:leading-[60px] text-[#5547B5] mb-4">
            {title}
          </h2>
          <p className="font-medium text-base leading-[22px] tracking-normal md:text-[23px] md:leading-[30px] text-gray-600">
            {subtitle}
          </p>
        </div>
        
        {/* Mobile Slider */}
        <div
          className="md:hidden flex items-center justify-center overflow-hidden pb-4"
          style={{ touchAction: "pan-x", width: "100%", maxWidth: "100%" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex transition-transform duration-300 ease-in-out ${isRTL ? "flex-row-reverse" : ""}`}
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              width: "100%",
            }}
          >
            {properties.map((property, idx) => (
              <div
                key={property.id}
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  margin: 0,
                  opacity: idx === activeIndex ? 1 : 0.7,
                  transition: "opacity 0.3s",
                }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots for mobile */}
        <div className="md:hidden flex justify-center mt-4 gap-2">
          {visibleOrder.map((actualIdx) => (
            <button
              key={actualIdx}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeIndex === actualIdx ? "bg-[#6C4EEA]" : "bg-[#E0D7FF]"
              }`}
              onClick={() => setActiveIndex(actualIdx)}
              aria-label={`Go to card ${actualIdx + 1}`}
              style={{ outline: "none", border: "none", padding: 0, cursor: "pointer" }}
            />
          ))}
        </div>

        {/* Desktop Grid - Responsive for medium and large screens */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 items-start">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}