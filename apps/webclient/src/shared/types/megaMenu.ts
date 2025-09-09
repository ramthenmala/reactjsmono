import React from "react";

export interface MegaMenuItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MegaMenuSection {
  title: string;
  columns: MegaMenuItem[][];
}

export interface MegaMenuConfig {
  title: string;
  subtitle: string;
  sections: MegaMenuSection[];
}

export interface MegaMenuProps {
  submenu: MegaMenuConfig | null;
  isVisible: boolean;
}