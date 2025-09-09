import React from 'react';
import type { MobileSliderProps } from '../../types/mobileSlider';
import { investorJourneyStyles } from './styles';

export function MobileSlider({
  cards,
  activeIndex,
  isRTL,
  onTouchStart,
  onTouchEnd,
}: MobileSliderProps) {
  return (
    <div
      className={investorJourneyStyles.mobileSlider.container}
      style={investorJourneyStyles.mobileSlider.containerStyle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={investorJourneyStyles.mobileSlider.track}
        style={investorJourneyStyles.mobileSlider.trackStyle(
          isRTL,
          activeIndex,
        )}
      >
        {cards.map((step, idx) => (
          <div
            key={step.title}
            className={investorJourneyStyles.mobileSlider.slide(
              idx === activeIndex,
            )}
            style={investorJourneyStyles.mobileSlider.slideStyle}
          >
            {/* Icon Container */}
            <div className={investorJourneyStyles.cardContent.icon.container}>
              <img
                src={step.icon}
                alt={step.title}
                className={investorJourneyStyles.cardContent.icon.image}
              />
            </div>

            {/* Content Container */}
            <div
              className={investorJourneyStyles.cardContent.text.wrapperMobile}
            >
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
    </div>
  );
}
