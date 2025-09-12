import React from 'react';
import { PieChart } from './PieChart';

type StatChartVariant = 'narrow' | 'wide';

interface StatChartCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  percentage: number;
  className?: string;
  variant?: StatChartVariant; // controls label width
  'data-qa-id'?: string;
}

export function StatChartCard({
  label,
  value,
  percentage,
  className = '',
  variant = 'narrow',
  'data-qa-id': dataQaId = 'stat-chart-card',
}: StatChartCardProps) {
  const labelWidthClass = variant === 'wide' ? 'max-w-30' : 'max-w-24';
  return (
    <div
      className={`rounded-xl border border-solid border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))] bg-white p-4 md:p-6 w-full flex items-center justify-between ${className}`}
      data-qa-id={dataQaId}
    >
      <div className='min-h-16 md:min-h-26 flex flex-col justify-between' data-qa-id={`${dataQaId}-content`}>
        <div
          className={`text-[13px] md:text-sm font-medium text-gray-600 ${labelWidthClass}`}
          data-qa-id={`${dataQaId}-label`}
        >
          {label}
        </div>
        <div className='text-md md:text-2xl font-semibold' data-qa-id={`${dataQaId}-value`}>{value}</div>
      </div>
      <div data-qa-id={`${dataQaId}-chart`}>
        <PieChart value={percentage} />
      </div>
    </div>
  );
}

export default StatChartCard;
