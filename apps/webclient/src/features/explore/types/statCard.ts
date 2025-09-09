import React from "react";

export type StatCardVariant = 'default' | 'regular' | 'large';

export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  variant?: StatCardVariant;
  icon?: React.ReactNode;
}