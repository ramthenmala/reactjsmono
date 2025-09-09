import { InvestorJourneyCard } from '../../types/investorJourney';
import { cardStyles } from './cardStyles';
import type { DesktopGridProps } from '../../types/desktopGrid';
import { investorJourneyStyles } from './styles';

export function DesktopGrid({ cards }: DesktopGridProps) {
  return (
    <div className={investorJourneyStyles.desktopGrid.container}>
      {cards.map((step) => (
        <div
          key={step.title}
          className={`${cardStyles.base} ${cardStyles.hover} ${investorJourneyStyles.desktopGrid.card.wrapper}`}
        >
          {/* Icon Container */}
          <div className={cardStyles.icon}>
            <img src={step.icon} alt={step.title} className={investorJourneyStyles.cardContent.icon.image} />
          </div>
          
          {/* Content Container */}
          <div className={investorJourneyStyles.cardContent.text.wrapper}>
            <h3 className={investorJourneyStyles.cardContent.text.title}>
              {step.title}
            </h3>
            <p className={investorJourneyStyles.cardContent.text.content}>
              {step.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}