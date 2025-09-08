import { useEffect, useRef, useState } from 'react';
import { useInvestorJourney } from './useInvestorJourney';
import { InvestorJourneyProps } from './types';
import { MobileSlider } from './MobileSlider';
import { DesktopGrid } from './DesktopGrid';
import { NavigationDots } from './NavigationDots';

export function InvestorJourney({
  title,
  content,
  steps,
}: InvestorJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const { cards, isRTL, content: i18nContent } = useInvestorJourney(steps);

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

  const displayTitle = title || i18nContent.defaultTitle;
  const displayContent = content || i18nContent.defaultContent;

  return (
    <section 
      className="w-full relative overflow-visible flex flex-col items-start gap-20 self-stretch px-4 py-12 md:px-20 md:py-[100px] md:pb-[200px]"
      style={{
        background: 'radial-gradient(134.48% 100% at 50% 100%, rgba(216, 200, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%)',
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="text-center pb-16">
          <h2 className="font-semibold text-[36px] leading-[42px] tracking-[-0.02em] md:text-[48px] md:leading-[60px] text-[#5547B5] mb-4">
            {displayTitle}
          </h2>
          <p className="font-medium text-base leading-[22px] tracking-normal md:text-[23px] md:leading-[30px] text-gray-600">
            {displayContent}
          </p>
        </div>

        {/* Mobile Slider */}
        <MobileSlider
          cards={cards}
          activeIndex={activeIndex}
          isRTL={isRTL}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        {/* Navigation Dots */}
        <NavigationDots
          cards={cards}
          activeIndex={activeIndex}
          isRTL={isRTL}
          onDotClick={setActiveIndex}
        />

        {/* Desktop Grid */}
        <DesktopGrid cards={cards} />

      </div>
    </section>
  );
}