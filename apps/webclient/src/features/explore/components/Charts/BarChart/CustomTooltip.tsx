'use client';

import type { CustomTooltipProps } from '../../types/barChart';
import { barChartStyles } from './styles';

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className={barChartStyles.tooltip.container}>
        <p className={barChartStyles.tooltip.label}>{`${label}`}</p>
        <p className={barChartStyles.tooltip.value}>
          {`Quantity: ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
}
