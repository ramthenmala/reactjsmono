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

export function BarChart({ data }: BarChartProps) {
  return (
    <div className={barChartStyles.container}>
      <ResponsiveContainer width="100%" height={240}>
        <RechartsBarChart data={data} margin={barChartStyles.margin}>
          <CartesianGrid
            vertical={false}
            stroke={barChartStyles.grid.stroke}
            className={barChartStyles.grid.className}
          />

          <XAxis
            axisLine={false}
            tickLine={false}
            tickMargin={11}
            interval={0}
            dataKey="label"
            tick={<WrappedXAxisTick x={0} y={0} payload={{ value: '' }} />}
            className={barChartStyles.xAxis}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value) => Number(value).toLocaleString()}
            className={barChartStyles.yAxis}
          />

          <Tooltip content={<CustomTooltip />} cursor={barChartStyles.cursor} />

          <Bar
            dataKey="quantity"
            fill={barChartStyles.bar.fill}
            maxBarSize={barChartStyles.bar.maxBarSize}
            radius={barChartStyles.bar.radius}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
