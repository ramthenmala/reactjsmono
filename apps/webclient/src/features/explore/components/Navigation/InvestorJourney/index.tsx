import { useEffect, useRef, useState } from 'react';
import { useInvestorJourney } from './useInvestorJourney';
import type { InvestorJourneyProps } from '../../types/investorJourney';
import { MobileSlider } from './MobileSlider';
import { DesktopGrid } from './DesktopGrid';
import { NavigationDots } from './NavigationDots';
import { investorJourneyStyles } from './styles';

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
      className={investorJourneyStyles.section.base}
      style={investorJourneyStyles.section.style}
    >
      <div className={investorJourneyStyles.container}>
        <div className={investorJourneyStyles.header.wrapper}>
          <h2 className={investorJourneyStyles.header.title}>{displayTitle}</h2>
          <p className={investorJourneyStyles.header.content}>
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
