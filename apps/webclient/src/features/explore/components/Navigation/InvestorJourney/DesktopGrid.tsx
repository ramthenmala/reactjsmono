import { cardStyles } from './cardStyles';
import { investorJourneyStyles } from './styles';
import type { DesktopGridProps } from '../../types/desktopGrid';

export function DesktopGrid({ 
  cards, 
  'data-qa-id': dataQaId = 'desktop-grid' 
}: DesktopGridProps) {
  // Handle null or undefined cards
  const safeCards = cards || [];

  return (
    <div 
      className={investorJourneyStyles.desktopGrid.container}
      data-qa-id={dataQaId}
    >
      {safeCards.map((step, idx) => (
        <div
          key={step.title}
          className={`${cardStyles.base} ${cardStyles.hover} ${investorJourneyStyles.desktopGrid.card.wrapper}`}
          data-qa-id={`${dataQaId}-card-${idx}`}
        >
          {/* Icon Container */}
          <div 
            className={cardStyles.icon}
            data-qa-id={`${dataQaId}-card-${idx}-icon`}
          >
            <img
              src={step.icon || undefined}
              alt={step.title}
              className={investorJourneyStyles.cardContent.icon.image}
              data-qa-id={`${dataQaId}-card-${idx}-icon-image`}
            />
          </div>

          {/* Content Container */}
          <div 
            className={investorJourneyStyles.cardContent.text.wrapper}
            data-qa-id={`${dataQaId}-card-${idx}-content`}
          >
            <h3 
              className={investorJourneyStyles.cardContent.text.title}
              data-qa-id={`${dataQaId}-card-${idx}-title`}
            >
              {step.title}
            </h3>
            <p 
              className={investorJourneyStyles.cardContent.text.content}
              data-qa-id={`${dataQaId}-card-${idx}-text`}
            >
              {step.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
