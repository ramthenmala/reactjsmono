export interface InvestorJourneyCard {
  icon: string;
  title: string;
  content: string;
}

export interface InvestorJourneyProps {
  title?: string;
  content?: string;
  steps?: InvestorJourneyCard[];
}
