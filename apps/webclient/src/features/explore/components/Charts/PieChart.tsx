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
}

export const PieChart = ({
  value,
  mobileSize = 60,
  desktopSize = 120,
}: PieChartProps) => {
  const renderChart = (size: number) => (
    <ResponsiveContainer height={size} width={size}>
      <RechartsPieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
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
    <>
      <div className='block md:hidden'>{renderChart(mobileSize)}</div>
      <div className='hidden md:block'>{renderChart(desktopSize)}</div>
    </>
  );
};
