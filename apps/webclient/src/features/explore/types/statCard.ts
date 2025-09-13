import React from 'react';

export type StatCardVariant = 'default' | 'regular' | 'large' | 'logistics';

export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  variant?: StatCardVariant;
  icon?: React.ReactNode;
  labelStyle?: React.CSSProperties;
  'data-qa-id'?: string;
}
