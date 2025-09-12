'use client';

import type { CustomTooltipProps } from '../../types/barChart';
import { barChartStyles } from './styles';

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;
    const formattedValue = value != null ? Number(value).toLocaleString() : 'undefined';
    
    return (
      <div className={barChartStyles.tooltip.container} data-qa-id="bar-chart-tooltip">
        <p className={barChartStyles.tooltip.label} data-qa-id="bar-chart-tooltip-label">{`${label}`}</p>
        <p className={barChartStyles.tooltip.value} data-qa-id="bar-chart-tooltip-value">
          {`Quantity: ${formattedValue}`}
        </p>
      </div>
    );
  }
  return null;
}
