import React from 'react';
import { BreadcrumbItem } from './breadcrumb';

export interface HeroProps {
  backgroundImage?: string;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  breadcrumbItems?: BreadcrumbItem[];
}
