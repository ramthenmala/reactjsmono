import { InvestorJourneyCard } from '../../types/investorJourney';
import type { NavigationDotsProps } from '../../types/navigationDots';
import { investorJourneyStyles } from './styles';

export function NavigationDots({
  cards,
  activeIndex,
  isRTL,
  onDotClick,
}: NavigationDotsProps) {
  return (
    <div className={investorJourneyStyles.dots.container}>
      {(isRTL ? [...cards].reverse() : cards).map((_, idx) => {
        // For RTL, reverse the dot order and map index accordingly
        const dotIndex = isRTL ? cards.length - 1 - idx : idx;
        return (
          <button
            key={idx}
            className={investorJourneyStyles.dots.button(dotIndex === activeIndex)}
            onClick={() => onDotClick(dotIndex)}
            aria-label={`Go to step ${dotIndex + 1}`}
            style={investorJourneyStyles.dots.buttonStyle}
          />
        );
      })}
    </div>
  );
}