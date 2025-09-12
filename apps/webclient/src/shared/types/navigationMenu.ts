export interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownId?: string;
  submenu?: any;
}

export interface NavigationMenuProps {
  items: NavigationItem[];
  activeDropdown: string | null;
  onToggleDropdown: (dropdownId: string) => void;
}
