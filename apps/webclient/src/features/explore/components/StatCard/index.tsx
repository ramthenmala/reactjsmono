import React from 'react';
import type { StatCardProps, StatCardVariant } from '../../types/statCard';
import { statCardStyles } from './styles';

export function StatCard({
  label,
  value,
  className = '',
  variant = 'default',
  icon,
}: StatCardProps) {
  const variantClassName = statCardStyles.value.variants[variant];

  return (
    <div className={`${statCardStyles.container.base} ${className}`}>
      <div className={statCardStyles.label}>{label}</div>
      <div
        className={`${variantClassName} ${
          icon ? statCardStyles.container.withIcon : ''
        }`}
      >
        {icon}
        {value}
      </div>
    </div>
  );
}

export default StatCard;
