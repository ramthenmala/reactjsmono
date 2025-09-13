import React from 'react';
import type { MobileSliderProps } from '../../types/mobileSlider';
import { investorJourneyStyles } from './styles';

export function MobileSlider({
  cards,
  activeIndex,
  isRTL,
  onTouchStart,
  onTouchEnd,
  'data-qa-id': dataQaId = 'mobile-slider',
}: MobileSliderProps) {
  // Handle null or undefined cards
  const safeCards = cards || [];

  return (
    <div
      className={investorJourneyStyles.mobileSlider.container}
      style={investorJourneyStyles.mobileSlider.containerStyle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-qa-id={dataQaId}
    >
      <div
        className={investorJourneyStyles.mobileSlider.track}
        style={investorJourneyStyles.mobileSlider.trackStyle(
          isRTL,
          activeIndex,
        )}
        data-qa-id={`${dataQaId}-track`}
      >
        {safeCards.map((step, idx) => (
          <div
            key={step.title}
            className={investorJourneyStyles.mobileSlider.slide(
              idx === activeIndex,
            )}
            style={investorJourneyStyles.mobileSlider.slideStyle}
            data-qa-id={`${dataQaId}-slide-${idx}`}
          >
            {/* Icon Container */}
            <div 
              className={investorJourneyStyles.cardContent.icon.container}
              data-qa-id={`${dataQaId}-slide-${idx}-icon`}
            >
              <img
                src={step.icon || undefined}
                alt={step.title}
                className={investorJourneyStyles.cardContent.icon.image}
                data-qa-id={`${dataQaId}-slide-${idx}-icon-image`}
              />
            </div>

            {/* Content Container */}
            <div
              className={investorJourneyStyles.cardContent.text.wrapperMobile}
              data-qa-id={`${dataQaId}-slide-${idx}-content`}
            >
              <h3 
                className={investorJourneyStyles.cardContent.text.title}
                data-qa-id={`${dataQaId}-slide-${idx}-title`}
              >
                {step.title}
              </h3>
              <p 
                className={investorJourneyStyles.cardContent.text.content}
                data-qa-id={`${dataQaId}-slide-${idx}-text`}
              >
                {step.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
