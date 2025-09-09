export const barChartStyles = {
  container: 'h-60 w-full',
  xAxisTick: 'text-xs text-gray-600',
  xAxis: 'text-gray-600',
  yAxis: 'text-gray-600 text-xs',
  tooltip: {
    container: 'bg-white p-2 border border-gray-200 rounded shadow-lg',
    label: 'text-sm font-medium text-gray-900',
    value: 'text-sm text-brand-600',
  },
  grid: {
    stroke: '#E5E7EB',
    className: 'opacity-50',
  },
  bar: {
    fill: 'rgb(105, 65, 198)', // brand-700 color
    maxBarSize: 32,
    radius: [6, 6, 0, 0] as [number, number, number, number],
  },
  cursor: {
    fill: 'rgba(209, 213, 219, 0.2)',
  },
  margin: {
    left: 4,
    right: 0,
    top: 12,
    bottom: 24,
  },
};
