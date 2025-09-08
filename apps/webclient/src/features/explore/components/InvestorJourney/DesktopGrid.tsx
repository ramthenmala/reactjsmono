import { InvestorJourneyCard } from './types';
import { cardStyles } from './cardStyles';

interface DesktopGridProps {
  cards: InvestorJourneyCard[];
}

export function DesktopGrid({ cards }: DesktopGridProps) {
  return (
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((step) => (
        <div
          key={step.title}
          className={`${cardStyles.base} ${cardStyles.hover} transition-all duration-200`}
        >
          {/* Icon Container */}
          <div className={cardStyles.icon}>
            <img src={step.icon} alt={step.title} className="w-6 h-6" />
          </div>
          
          {/* Content Container */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-lg font-semibold text-[#171B23] leading-7">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 leading-5">
              {step.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}