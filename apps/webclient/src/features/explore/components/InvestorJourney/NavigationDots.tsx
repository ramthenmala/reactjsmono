import { InvestorJourneyCard } from './types';

interface NavigationDotsProps {
  cards: InvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onDotClick: (index: number) => void;
}

export function NavigationDots({
  cards,
  activeIndex,
  isRTL,
  onDotClick,
}: NavigationDotsProps) {
  return (
    <div className="md:hidden flex justify-center mt-4 gap-2">
      {(isRTL ? [...cards].reverse() : cards).map((_, idx) => {
        // For RTL, reverse the dot order and map index accordingly
        const dotIndex = isRTL ? cards.length - 1 - idx : idx;
        return (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${
              dotIndex === activeIndex ? "bg-[#6C4EEA]" : "bg-[#E0D7FF]"
            }`}
            onClick={() => onDotClick(dotIndex)}
            aria-label={`Go to step ${dotIndex + 1}`}
            style={{
              outline: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
        );
      })}
    </div>
  );
}