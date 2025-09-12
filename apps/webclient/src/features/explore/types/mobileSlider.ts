import React from 'react';
import { IInvestorJourneyCard } from './explore';

export interface MobileSliderProps {
  cards: IInvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}
