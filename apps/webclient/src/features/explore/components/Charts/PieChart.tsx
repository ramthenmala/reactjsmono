'use client';

import {
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
} from 'recharts';

interface PieChartProps {
  value: number;
  mobileSize?: number; // width/height on mobile
  desktopSize?: number; // width/height on md+
  'data-qa-id'?: string;
}

export const PieChart = ({
  value,
  mobileSize = 60,
  desktopSize = 120,
  'data-qa-id': dataQaId = 'pie-chart',
}: PieChartProps) => {
  const renderChart = (size: number, suffix: string) => (
    <ResponsiveContainer height={size} width={size}>
      <RechartsPieChart
        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        data-qa-id={`${dataQaId}-${suffix}`}
      >
        <Pie
          isAnimationActive={false}
          startAngle={-270}
          endAngle={-630}
          stroke='none'
          data={[
            { value, className: 'text-utility-brand-600' },
            { value: 100 - value, className: 'text-utility-gray-200' },
          ]}
          dataKey='value'
          nameKey='name'
          fill='currentColor'
          innerRadius={Math.round(size * 0.33)}
          outerRadius={Math.round(size * 0.5)}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  return (
    <div data-qa-id={dataQaId}>
      <div className='block md:hidden' data-qa-id={`${dataQaId}-mobile`}>
        {renderChart(mobileSize, 'mobile-chart')}
      </div>
      <div className='hidden md:block' data-qa-id={`${dataQaId}-desktop`}>
        {renderChart(desktopSize, 'desktop-chart')}
      </div>
    </div>
  );
};
