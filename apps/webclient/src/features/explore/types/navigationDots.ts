import { IInvestorJourneyCard } from './explore';

export interface NavigationDotsProps {
  cards: IInvestorJourneyCard[];
  activeIndex: number;
  isRTL: boolean;
  onDotClick: (index: number) => void;
}
