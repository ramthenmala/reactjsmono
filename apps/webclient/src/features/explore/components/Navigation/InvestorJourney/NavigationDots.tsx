import type { NavigationDotsProps } from '../../types/navigationDots';
import { investorJourneyStyles } from './styles';

export function NavigationDots({
  cards,
  activeIndex,
  isRTL,
  onDotClick,
  'data-qa-id': dataQaId = 'navigation-dots',
}: NavigationDotsProps) {
  // Handle null or undefined cards
  if (!cards || !Array.isArray(cards)) {
    return (
      <div 
        className={investorJourneyStyles.dots.container}
        data-qa-id={dataQaId}
      />
    );
  }

  return (
    <div 
      className={investorJourneyStyles.dots.container}
      data-qa-id={dataQaId}
    >
      {(isRTL ? [...cards].reverse() : cards).map((_, idx) => {
        // For RTL, reverse the dot order and map index accordingly
        const dotIndex = isRTL ? cards.length - 1 - idx : idx;
        return (
          <button
            key={idx}
            className={investorJourneyStyles.dots.button(
              dotIndex === activeIndex,
            )}
            onClick={() => onDotClick(dotIndex)}
            aria-label={`Go to step ${dotIndex + 1}`}
            style={investorJourneyStyles.dots.buttonStyle}
            data-qa-id={`${dataQaId}-dot-${dotIndex}`}
          />
        );
      })}
    </div>
  );
}
