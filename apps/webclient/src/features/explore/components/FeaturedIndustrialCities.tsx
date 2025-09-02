import React, { useMemo, useState, useRef } from "react";
import { PropertyCard } from "./PropertyCard";
import { useLocaleTranslation } from "../../../shared/lib/i18n";
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
  const { t } = useLocaleTranslation();
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
    <section className="w-full bg-transparent pt-8 pb-12 relative" style={{ overflow: "visible" }}>
      {/* Decorative background pattern */}
      <div
        className="hidden md:block"
        style={{
          position: "absolute",
          left: "50%",
          top: "-60px",
          transform: "translateX(-50%)",
          zIndex: 0,
          width: "700px",
          height: "400px",
          pointerEvents: "none",
          userSelect: "none",
        }}
        aria-hidden
      >
        <img
          src="/images/background-pattern-decorative.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className="relative z-10 mx-auto w-full pt-8 max-w-7xl px-4 md:px-0">
        <h2
          className="font-semibold text-center
          text-[36px] leading-[42px] tracking-[-0.02em]
          md:text-[48px] md:leading-[60px] text-[#5547B5] mb-2"
        >
          {title}
        </h2>
        <p className="font-medium text-base leading-[22px] tracking-normal text-center md:text-[23px] md:leading-[30px] mb-16 text-gray-600">
          {subtitle}
        </p>
        
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

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}