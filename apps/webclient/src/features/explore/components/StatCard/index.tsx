import React from "react";
import type { StatCardProps, StatCardVariant } from '../../types/statCard';

export function StatCard({ label, value, className = "", variant = 'default', icon }: StatCardProps) {
  const variantClassName = (() => {
    switch (variant) {
      case 'regular':
        return 'text-md md:text-2xl font-semibold text-brand-600';
      case 'large':
        return 'text-md md:text-4xl font-semibold md:font-medium text-brand-600';
      case 'default':
      default:
        return 'text-sm md:text-2xl font-semibold';
    }
  })();
  return (
    <div className={`rounded-xl border border-solid border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white p-4 md:p-6 min-h-22 md:min-h-37 flex flex-col justify-between ${className}`}>
      <div className="text-[13px] md:text-sm font-medium text-gray-600">
        {label}
      </div>
      <div className={`${variantClassName} ${icon ? 'flex items-center gap-2 md:gap-3' : ''}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}

export default StatCard;