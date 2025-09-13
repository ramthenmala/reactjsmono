'use client';

import type { CustomTooltipProps } from '../../types/barChart';
import { barChartStyles } from './styles';

export function CustomTooltip({ active, payload, label, 'data-qa-id': dataQaId = 'custom-tooltip' }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className={barChartStyles.tooltip.container} data-qa-id={dataQaId}>
        <p className={barChartStyles.tooltip.label} data-qa-id={`${dataQaId}-label`}>{`${label}`}</p>
        <p className={barChartStyles.tooltip.value} data-qa-id={`${dataQaId}-value`}>
          {`Quantity: ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
}
