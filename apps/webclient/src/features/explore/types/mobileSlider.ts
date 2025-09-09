import React from 'react';
import { InvestorJourneyCard } from './investorJourney';

export interface MobileSliderProps {
  cards: InvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}
