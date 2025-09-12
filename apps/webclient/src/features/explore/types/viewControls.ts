import { EViewMode } from './map';

export interface ViewControlsProps {
  viewMode: EViewMode;
  onViewModeChange: (mode: EViewMode) => void;
}
