// Navigation type definitions

export interface NavigationLink {
  label: string;
  link: string;
  hasSubMenu?: boolean | null;
  subMenu?: NavigationLink[];
}

export interface FooterNavigation {
  footerContent?: string;
  copyrightText?: string;
  quickLinks: Array<{
    label: string;
    link: string;
  }>;
  legalPages: Array<{
    label: string;
    link: string;
  }>;
  socialLinks: Array<{
    platform: string;
    label: string;
    link: string | null;
  }>;
}

export interface NavigationData {
  header: NavigationLink[];
  footer: FooterNavigation;
}
