import { InvestorJourneyCard } from './investorJourney';

export interface NavigationDotsProps {
  cards: InvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onDotClick: (index: number) => void;
}
