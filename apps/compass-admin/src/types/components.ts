// Component-specific types and interfaces
import type { IBaseProps, ITranslatable } from './common';

// Layout component types
export interface IAdminLayoutProps extends IBaseProps {
  activeUrl?: string;
}

export interface IAdminHeaderProps {
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
export interface IPageHeaderProps extends Partial<ITranslatable> {
  titleKey: string;
  showBorder?: boolean;
  className?: string;
}

// i18n component types
export type TLocaleWrapperProps = IBaseProps;

export interface ILanguage {
  code: string;
  name: string;
  nativeName: string;
}

export interface ILanguageSwitcherProps {
  className?: string;
}
