'use client';

import type { WrappedXAxisTickProps } from '../../types/barChart';
import { barChartStyles } from './styles';

interface Props extends WrappedXAxisTickProps {
  isRTL?: boolean;
}

export function WrappedXAxisTick({ x, y, payload, isRTL = false, 'data-qa-id': dataQaId = 'wrapped-x-axis-tick' }: Props) {
  const text = String(payload.value ?? '');

  // Simple text wrapping - split on spaces and limit line length
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= 12) {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit lines to 2 to prevent excessive height
  const limited = lines.slice(0, 2);
  const textAnchor = isRTL ? 'start' : 'end';

  return (
    <g transform={`translate(${x}, ${y}) rotate(-45)`} data-qa-id={dataQaId}>
      <text
        x={0}
        y={0}
        textAnchor={textAnchor}
        fill='currentColor'
        className={barChartStyles.xAxisTick}
        style={{ fontSize: isRTL ? '11px' : '12px' }}
        data-qa-id={`${dataQaId}-text`}
      >
        {limited.map((line, idx) => (
          <tspan key={idx} x={0} dy={idx === 0 ? 0 : 12} data-qa-id={`${dataQaId}-line-${idx}`}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
