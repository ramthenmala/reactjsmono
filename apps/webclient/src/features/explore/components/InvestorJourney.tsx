import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocaleTranslation } from '../../../shared/lib/i18n';
import { useCurrentLocale } from '../../../shared/lib/router';

export type InvestorJourneyCard = { 
  icon: string; 
  title: string; 
  content: string; 
};

export function InvestorJourney({
  title,
  content,
  steps,
}: {
  title?: string;
  content?: string;
  steps?: InvestorJourneyCard[];
}) {
  // Start with index 0 to match current behavior
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Detect RTL direction
  const { t } = useLocaleTranslation();
  const currentLocale = useCurrentLocale();
  const isRTL = currentLocale === 'ar';

  // Default journey steps if not provided via props
  const defaultSteps: InvestorJourneyCard[] = [
    {
      icon: '/images/icons/search-icon.svg',
      title: t('investor_journey.search.title') || 'Search & Filter',
      content: t('investor_journey.search.description') || 'Use our advanced search to find industrial opportunities that match your criteria',
    },
    {
      icon: '/images/icons/compare-icon.svg', 
      title: t('investor_journey.compare.title') || 'Compare Options',
      content: t('investor_journey.compare.description') || 'Analyze different locations and properties with detailed insights and data',
    },
    {
      icon: '/images/icons/visit-icon.svg',
      title: t('investor_journey.visit.title') || 'Schedule Visits',
      content: t('investor_journey.visit.description') || 'Arrange site visits and meetings with relevant stakeholders',
    },
    {
      icon: '/images/icons/invest-icon.svg',
      title: t('investor_journey.invest.title') || 'Make Investment', 
      content: t('investor_journey.invest.description') || 'Complete your investment with full support throughout the process',
    },
  ];

  // --- Data cleanup (normalization) ---
  const normalizeText = (v?: unknown): string =>
    typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";

  // Accepts various API keys and returns a clean, consistent shape
  const cards: InvestorJourneyCard[] = useMemo(() => {
    const sourceSteps = steps || defaultSteps;
    return sourceSteps.map((s: any) => ({
      icon: normalizeText(s?.icon ?? s?.iconUrl ?? s?.icon_url ?? s?.image ?? s?.img),
      title: normalizeText(s?.title ?? s?.name ?? s?.label),
      content: normalizeText(s?.content ?? s?.description ?? s?.desc),
    }));
  }, [steps, defaultSteps]);

  // Keep activeIndex within bounds if steps length changes
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, cards.length - 1)));
  }, [cards.length]);

  // Touch handlers for sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    const NEXT = () => setActiveIndex((i) => Math.min(i + 1, cards.length - 1));
    const PREV = () => setActiveIndex((i) => Math.max(i - 1, 0));

    if (isRTL) {
      // RTL: swipe right (diff > 40) -> NEXT; swipe left (diff < -40) -> PREV
      if (diff > 40) NEXT();
      else if (diff < -40) PREV();
    } else {
      // LTR: swipe right (diff > 40) -> PREV; swipe left (diff < -40) -> NEXT
      if (diff > 40) PREV();
      else if (diff < -40) NEXT();
    }
    touchStartX.current = null;
  };

  const defaultTitle = title || t('investor_journey.title') || 'Your Investment Journey';
  const defaultContent = content || t('investor_journey.subtitle') || 'Follow our streamlined process to secure your industrial investment';

  return (
    <section className="w-full bg-transparent pt-8 pb-12 relative overflow-visible">
      {/* Mobile background image */}
      <div className="absolute inset-0 flex justify-center items-start pointer-events-none select-none z-0 md:hidden">
        <img
          src="/images/Section.png"
          alt="Background"
          className="w-full max-w-xl h-auto object-cover opacity-90"
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="pt-6 sm:pb-16 md:pb-16 pb-6 px-4">
          <h2 className="font-semibold text-center text-[36px] leading-[42px] tracking-[-0.02em] md:text-[48px] md:leading-[60px] text-[#5547B5] mb-2">
            {defaultTitle}
          </h2>
          <p className="font-medium text-base leading-[22px] tracking-normal text-center md:text-[23px] md:leading-[30px] text-gray-600">
            {defaultContent}
          </p>
        </div>

        {/* Mobile Slider */}
        <div
          className="md:hidden flex items-center justify-center overflow-hidden pb-4 pt-24"
          style={{ touchAction: "pan-x", width: "100%", maxWidth: "100%" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: isRTL
                ? `translateX(${activeIndex * 100}%)` // RTL
                : `translateX(-${activeIndex * 100}%)`, // LTR
              width: "80%",
            }}
          >
            {cards.map((step, idx) => (
              <div
                key={step.title}
                className={`
                  bg-white rounded-2xl shadow-lg flex flex-col items-center text-center transition-all duration-300
                  ${idx === activeIndex 
                    ? "pt-6 pb-8 translate-y-0 opacity-95"   // active: less top padding, lifted up
                    : "pt-12 pb-6 translate-y-4 opacity-95"}  // inactive: more padding, shifted down
                `}
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  scale: idx === activeIndex ? 1 : 0.95,
                }}
              >
                <div
                  className="flex items-center justify-center mb-6 mt-6 radius-lg"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    border: "1px solid #5547B5",
                    background: "#FFF",
                    padding: 8,
                  }}
                >
                  <img src={step.icon} alt={step.title} style={{ width: 24, height: 24 }} />
                </div>
                <div className="px-10">
                  <h3 className="text-lg font-semibold mb-2 text-[#171B23]">{step.title}</h3>
                  <p className="text-gray-500">{step.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots for mobile */}
        <div className="md:hidden flex justify-center mt-4 gap-2">
          {(isRTL ? [...cards].reverse() : cards).map((_, idx) => {
            // For RTL, reverse the dot order and map index accordingly
            const dotIndex = isRTL ? cards.length - 1 - idx : idx;
            return (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${dotIndex === activeIndex ? "bg-[#6C4EEA]" : "bg-[#E0D7FF]"}`}
                onClick={() => setActiveIndex(dotIndex)}
                aria-label={`Go to step ${dotIndex + 1}`}
                style={{ outline: "none", border: "none", padding: 0, cursor: "pointer" }}
              />
            );
          })}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-8 mt-8">
          {cards.map((step) => (
            <div
              key={step.title}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-xl"
            >
              <div
                className="flex items-center justify-center mb-6"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  border: "1px solid #5547B5",
                  background: "#FFF",
                  padding: 8,
                }}
              >
                <img src={step.icon} alt={step.title} style={{ width: 24, height: 24 }} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#171B23]">{step.title}</h3>
              <p className="text-gray-500">{step.content}</p>
            </div>
          ))}
        </div>

        {/* Call to Action - Optional, can be controlled via props */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              {t('investor_journey.cta.title') || 'Ready to Start Your Investment Journey?'}
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              {t('investor_journey.cta.description') || 'Join hundreds of successful investors who have found their perfect industrial investment opportunity through our platform.'}
            </p>
            <button className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              {t('investor_journey.cta.button') || 'Get Started Today'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}