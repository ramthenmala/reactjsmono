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
  return (
    <div className={barChartStyles.container} data-qa-id={dataQaId}>
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsBarChart 
          data={data} 
          margin={barChartStyles.margin}
          data-qa-id={`${dataQaId}-container`}
        >
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
            tick={<WrappedXAxisTick x={0} y={0} payload={{ value: '' }} />}
            className={barChartStyles.xAxis}
            data-qa-id={`${dataQaId}-x-axis`}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            interval='preserveStartEnd'
            tickFormatter={value => Number(value).toLocaleString()}
            className={barChartStyles.yAxis}
            label={{ value: 'Quantity', angle: -90, position: 'insideLeft', offset: 0 }}
            data-qa-id={`${dataQaId}-y-axis`}
          />

          <Tooltip 
            content={<CustomTooltip />} 
            cursor={barChartStyles.cursor}
            data-qa-id={`${dataQaId}-tooltip`}
          />

          <Bar
            dataKey='quantity'
            fill={barChartStyles.bar.fill}
            maxBarSize={barChartStyles.bar.maxBarSize}
            radius={barChartStyles.bar.radius}
            data-qa-id={`${dataQaId}-bars`}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
