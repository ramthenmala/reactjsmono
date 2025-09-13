'use client';

import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BarChartProps } from '../../types/barChart';
import { WrappedXAxisTick } from './WrappedXAxisTick';
import { CustomTooltip } from './CustomTooltip';
import { barChartStyles } from './styles';

export function BarChart({ data, 'data-qa-id': dataQaId = 'bar-chart' }: BarChartProps) {
  // Detect RTL based on document direction
  const isRTL = document.documentElement.dir === 'rtl';

  // Reverse data for RTL layout
  const chartData = isRTL ? [...data].reverse() : data;

  // Dynamic margins for RTL
  const margin = isRTL
    ? { top: 20, right: 30, left: 20, bottom: 60 } // Increased right margin for Y-axis
    : barChartStyles.margin;

  return (
    <div className={barChartStyles.container} data-qa-id={dataQaId}>
      <ResponsiveContainer width='100%' height='100%' data-qa-id={`${dataQaId}-container`}>
        <RechartsBarChart data={chartData} margin={margin} data-qa-id={`${dataQaId}-chart`}>
          <CartesianGrid
            vertical={false}
            stroke={barChartStyles.grid.stroke}
            className={barChartStyles.grid.className}
            data-qa-id={`${dataQaId}-grid`}
          />

          <XAxis
            axisLine={false}
            tickLine={false}
            tickMargin={11}
            interval={0}
            dataKey='label'
            reversed={isRTL}
            tick={<WrappedXAxisTick x={0} y={0} payload={{ value: '' }} isRTL={isRTL} data-qa-id={`${dataQaId}-x-axis-tick`} />}
            className={barChartStyles.xAxis}
            data-qa-id={`${dataQaId}-x-axis`}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            interval='preserveStartEnd'
            tickFormatter={value => Number(value).toLocaleString()}
            className={barChartStyles.yAxis}
            orientation={isRTL ? 'right' : 'left'} // This moves the axis to the right
            tickMargin={isRTL ? 30 : 15}
            label={{
              value: 'Quantity',
              angle: -90,
              position: isRTL ? 'insideRight' : 'insideLeft',
              offset: isRTL ? -15 : 0, // Adjusted offset for the new margin
              style: { textAnchor: 'middle', fill: '#374151' },
            }}
            data-qa-id={`${dataQaId}-y-axis`}
          />

          <Tooltip 
            content={<CustomTooltip data-qa-id={`${dataQaId}-tooltip`} />} 
            cursor={barChartStyles.cursor} 
            data-qa-id={`${dataQaId}-tooltip-wrapper`}
          />

          <Bar
            dataKey='quantity'
            fill={barChartStyles.bar.fill}
            maxBarSize={barChartStyles.bar.maxBarSize}
            radius={barChartStyles.bar.radius}
            data-qa-id={`${dataQaId}-bar`}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
