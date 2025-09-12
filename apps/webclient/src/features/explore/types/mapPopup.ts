import { IProperty } from './explore';

export interface MapPopupProps {
  property: IProperty | null;
  container: HTMLDivElement | null;
  onClose: () => void;
  onView?: (property: IProperty) => void;
}
