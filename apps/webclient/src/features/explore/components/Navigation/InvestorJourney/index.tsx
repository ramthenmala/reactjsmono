import { useEffect, useRef, useState } from 'react';
import { MobileSlider } from './MobileSlider';
import { DesktopGrid } from './DesktopGrid';
import { NavigationDots } from './NavigationDots';
import { investorJourneyStyles } from './styles';
import { ICompassInvestorJourney, isRTL } from '@/shared';

export function InvestorJourney({
  title,
  content,
  cards,
  'data-qa-id': dataQaId = 'investor-journey',
}: ICompassInvestorJourney) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Handle null or undefined cards
  const safeCards = cards || [];

  // Keep activeIndex within bounds if steps length changes
  useEffect(() => {
    setActiveIndex(i => Math.min(i, Math.max(0, safeCards.length - 1)));
  }, [safeCards.length]);

  // Touch handlers for sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    const NEXT = () => setActiveIndex(i => Math.min(i + 1, safeCards.length - 1));
    const PREV = () => setActiveIndex(i => Math.max(i - 1, 0));

    if (isRTL()) {
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

  const displayTitle = title;
  const displayContent = content;

  return (
    <section
      className={investorJourneyStyles.section.base}
      style={investorJourneyStyles.section.style}
      data-qa-id={dataQaId}
    >
      <div className={investorJourneyStyles.container} data-qa-id={`${dataQaId}-container`}>
        <div className={investorJourneyStyles.header.wrapper} data-qa-id={`${dataQaId}-header`}>
          <h2 className={investorJourneyStyles.header.title} data-qa-id={`${dataQaId}-title`}>{displayTitle}</h2>
          <p className={investorJourneyStyles.header.content} data-qa-id={`${dataQaId}-content`}>
            {displayContent}
          </p>
        </div>

        {/* Mobile Slider */}
        <MobileSlider
          cards={safeCards}
          activeIndex={activeIndex}
          isRTL={isRTL()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          data-qa-id={`${dataQaId}-mobile-slider`}
        />

        {/* Navigation Dots */}
        <NavigationDots
          cards={safeCards}
          activeIndex={activeIndex}
          isRTL={isRTL()}
          onDotClick={setActiveIndex}
          data-qa-id={`${dataQaId}-navigation-dots`}
        />

        {/* Desktop Grid */}
        <DesktopGrid cards={safeCards} data-qa-id={`${dataQaId}-desktop-grid`} />
      </div>
    </section>
  );
}
