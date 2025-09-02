// Component-specific types and interfaces
import type { BaseProps, Translatable } from './common';

// Layout component types
export interface AdminLayoutProps extends BaseProps {
  activeUrl?: string;
}

export interface AdminHeaderProps {
  trailingContent?: React.ReactNode;
  showAvatarDropdown?: boolean;
  hideBorder?: boolean;
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

// UI component types
export interface PageHeaderProps extends Partial<Translatable> {
  titleKey: string;
  showBorder?: boolean;
  className?: string;
}

// i18n component types
export type LocaleWrapperProps = BaseProps;

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface LanguageSwitcherProps {
  className?: string;
}