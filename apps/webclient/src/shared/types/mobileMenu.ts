import { NavigationItem } from './navigationMenu';

export interface MobileMenuProps {
  isOpen: boolean;
  items: NavigationItem[];
  onClose: () => void;
}