export interface ILayoutResponse {
  data?: ILayoutData
}

export interface ILayoutData {
  header: IHeader;
  footer: IFooter;
}

export interface IHeader {
  logos: ILogo[];
  menu: IMenuItem[];
}

export interface IFooter {
  footerContent: string;
  copyrightText: string;
  logos: ILogo[];
  quickLinks: ILinkItem[];
  legalPages: ILinkItem[];
  socialLinks: ISocialLink[];
}

export interface ILogo {
  logoName: string;
  logo: string;
}

export interface IMenuItem {
  label: string;
  link: string;
  hasSubMenu: boolean | null;
  subMenu: IMenuItem[];
}

export interface ILinkItem {
  label: string;
  link: string;
}

export interface ISocialLink {
  platform: string;
  label: string;
  link: string | null;
}
