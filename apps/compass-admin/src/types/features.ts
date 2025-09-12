// Feature-specific types
import type { IWithId, IWithTitle, IWithOptionalDescription } from './common';

// Analytics feature types
export type AnalyticsSectionId =
  | 'investor-insights'
  | 'industrial-city-insights'
  | 'national'
  | 'regional'
  | 'city-metrics'
  | 'sector-view';

export interface AnalyticsSection
  extends IWithId,
    IWithTitle,
    IWithOptionalDescription {
  id: AnalyticsSectionId;
}

export interface AnalyticsSectionProps {
  section: AnalyticsSection;
  isActive?: boolean;
}

export interface ScrollSpyConfig {
  sections: AnalyticsSectionId[];
  scrollOffset: number;
  debounceDelay: number;
  userScrollTimeout: number;
}

// Configuration feature types
export interface ConfigurationPageProps {
  titleKey: string;
  subtitleKey?: string;
}

// Dashboard feature types
export interface DashboardProps {
  className?: string;
}

// Users feature types
export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UsersPageProps {
  className?: string;
}
