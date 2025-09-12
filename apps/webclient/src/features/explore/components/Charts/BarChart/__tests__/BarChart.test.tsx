import { render, screen } from '@testing-library/react';
import { BarChart } from '@/features/explore/components/Charts/BarChart';
import '@testing-library/jest-dom';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height, ...props }: any) => (
    <div
      data-qa-id="mocked-responsive-container"
      data-width={width}
      data-height={height}
      {...props}
    >
      {children}
    </div>
  ),
  BarChart: ({ children, data, margin, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id="mocked-recharts-bar-chart"
      data-chart-qa-id={dataQaId}
      data-chart-data={JSON.stringify(data)}
      data-margin={JSON.stringify(margin)}
      {...props}
    >
      {children}
    </div>
  ),
  CartesianGrid: ({ vertical, stroke, className, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id="mocked-cartesian-grid"
      data-grid-qa-id={dataQaId}
      data-vertical={String(vertical)}
      data-stroke={stroke}
      data-grid-class-name={className}
      {...props}
    >
      Cartesian Grid
    </div>
  ),
  XAxis: ({ 
    axisLine, 
    tickLine, 
    tickMargin, 
    interval, 
    dataKey, 
    tick, 
    className,
    'data-qa-id': dataQaId,
    ...props 
  }: any) => (
    <div
      data-qa-id="mocked-x-axis"
      data-axis-qa-id={dataQaId}
      data-axis-line={String(axisLine)}
      data-tick-line={String(tickLine)}
      data-tick-margin={String(tickMargin)}
      data-interval={String(interval)}
      data-data-key={dataKey}
      data-axis-class-name={className}
      {...props}
    >
      X Axis
      {tick}
    </div>
  ),
  YAxis: ({ 
    axisLine, 
    tickLine, 
    interval, 
    tickFormatter, 
    className, 
    label,
    'data-qa-id': dataQaId,
    ...props 
  }: any) => (
    <div
      data-qa-id="mocked-y-axis"
      data-axis-qa-id={dataQaId}
      data-axis-line={String(axisLine)}
      data-tick-line={String(tickLine)}
      data-interval={interval}
      data-axis-class-name={className}
      data-label={JSON.stringify(label)}
      {...props}
    >
      Y Axis
    </div>
  ),
  Tooltip: ({ content, cursor, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id="mocked-tooltip"
      data-tooltip-qa-id={dataQaId}
      data-cursor={JSON.stringify(cursor)}
      {...props}
    >
      Tooltip
      {content}
    </div>
  ),
  Bar: ({ 
    dataKey, 
    fill, 
    maxBarSize, 
    radius,
    'data-qa-id': dataQaId,
    ...props 
  }: any) => (
    <div
      data-qa-id="mocked-bar"
      data-bar-qa-id={dataQaId}
      data-data-key={dataKey}
      data-fill={fill}
      data-max-bar-size={String(maxBarSize)}
      data-radius={JSON.stringify(radius)}
      {...props}
    >
      Bar Component
    </div>
  ),
}));

// Mock CustomTooltip component
jest.mock('@/features/explore/components/Charts/BarChart/CustomTooltip', () => ({
  CustomTooltip: (props: any) => (
    <div data-qa-id="mocked-custom-tooltip" {...props}>
      Custom Tooltip
    </div>
  ),
}));

// Mock WrappedXAxisTick component
jest.mock('@/features/explore/components/Charts/BarChart/WrappedXAxisTick', () => ({
  WrappedXAxisTick: ({ x, y, payload }: any) => (
    <div 
      data-qa-id="mocked-wrapped-x-axis-tick" 
      data-x={x} 
      data-y={y} 
      data-payload={JSON.stringify(payload)}
    >
      Wrapped X Axis Tick
    </div>
  ),
}));

// Mock barChartStyles
jest.mock('@/features/explore/components/Charts/BarChart/styles', () => ({
  barChartStyles: {
    container: 'h-64 w-full',
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
    grid: {
      stroke: '#e0e0e0',
      className: 'opacity-50',
    },
    xAxis: 'text-gray-600 text-xs',
    yAxis: 'text-gray-600 text-xs',
    cursor: { fill: 'rgba(0, 0, 0, 0.1)' },
    bar: {
      fill: '#3b82f6',
      maxBarSize: 60,
      radius: [4, 4, 0, 0],
    },
  },
}));

describe('BarChart', () => {
  const defaultProps = {
    data: [
      { label: 'Category A', quantity: 100 },
      { label: 'Category B', quantity: 200 },
      { label: 'Category C', quantity: 150 },
    ],
  };

  const renderComponent = (props = {}) => {
    return render(<BarChart {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render bar chart with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-recharts-bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-bar')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="bar-chart"]')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-recharts-bar-chart')).toHaveAttribute('data-chart-qa-id', 'bar-chart-container');
      expect(screen.getByTestId('mocked-cartesian-grid')).toHaveAttribute('data-grid-qa-id', 'bar-chart-grid');
      expect(screen.getByTestId('mocked-x-axis')).toHaveAttribute('data-axis-qa-id', 'bar-chart-x-axis');
      expect(screen.getByTestId('mocked-y-axis')).toHaveAttribute('data-axis-qa-id', 'bar-chart-y-axis');
      expect(screen.getByTestId('mocked-tooltip')).toHaveAttribute('data-tooltip-qa-id', 'bar-chart-tooltip');
      expect(screen.getByTestId('mocked-bar')).toHaveAttribute('data-bar-qa-id', 'bar-chart-bars');
    });

    it('should render main container as div element', () => {
      renderComponent();

      const chart = screen.getByTestId('bar-chart');
      expect(chart.tagName).toBe('DIV');
    });
  });

  describe('Data Handling', () => {
    it('should pass correct data to RechartsBarChart', () => {
      renderComponent();

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      const expectedData = JSON.stringify(defaultProps.data);
      expect(barChart).toHaveAttribute('data-chart-data', expectedData);
    });

    it('should handle empty data array', () => {
      renderComponent({ data: [] });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', '[]');
    });

    it('should handle single data point', () => {
      const singleData = [{ label: 'Single', quantity: 50 }];
      renderComponent({ data: singleData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(singleData));
    });

    it('should handle large datasets', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        label: `Item ${i}`,
        quantity: Math.floor(Math.random() * 1000),
      }));

      renderComponent({ data: largeData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(largeData));
    });

    it('should handle data with different label types', () => {
      const mixedData = [
        { label: 'String Label', quantity: 100 },
        { label: 123, quantity: 200 },
        { label: 'Another String', quantity: 150 },
      ];

      renderComponent({ data: mixedData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(mixedData));
    });

    it('should handle data with zero quantities', () => {
      const zeroData = [
        { label: 'Zero A', quantity: 0 },
        { label: 'Zero B', quantity: 0 },
      ];

      renderComponent({ data: zeroData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(zeroData));
    });

    it('should handle data with negative quantities', () => {
      const negativeData = [
        { label: 'Negative A', quantity: -50 },
        { label: 'Positive B', quantity: 100 },
      ];

      renderComponent({ data: negativeData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(negativeData));
    });
  });

  describe('Chart Configuration', () => {
    it('should configure container with correct styling', () => {
      renderComponent();

      const container = screen.getByTestId('bar-chart');
      expect(container).toHaveClass('h-64', 'w-full');
    });

    it('should configure ResponsiveContainer correctly', () => {
      renderComponent();

      const responsiveContainer = screen.getByTestId('mocked-responsive-container');
      expect(responsiveContainer).toHaveAttribute('data-width', '100%');
      expect(responsiveContainer).toHaveAttribute('data-height', '100%');
    });

    it('should configure RechartsBarChart with correct margin', () => {
      renderComponent();

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      const expectedMargin = JSON.stringify({ top: 20, right: 30, left: 20, bottom: 60 });
      expect(barChart).toHaveAttribute('data-margin', expectedMargin);
    });

    it('should configure CartesianGrid correctly', () => {
      renderComponent();

      const grid = screen.getByTestId('mocked-cartesian-grid');
      expect(grid).toHaveAttribute('data-vertical', 'false');
      expect(grid).toHaveAttribute('data-stroke', '#e0e0e0');
      expect(grid).toHaveAttribute('data-grid-class-name', 'opacity-50');
    });

    it('should configure XAxis correctly', () => {
      renderComponent();

      const xAxis = screen.getByTestId('mocked-x-axis');
      expect(xAxis).toHaveAttribute('data-axis-line', 'false');
      expect(xAxis).toHaveAttribute('data-tick-line', 'false');
      expect(xAxis).toHaveAttribute('data-tick-margin', '11');
      expect(xAxis).toHaveAttribute('data-interval', '0');
      expect(xAxis).toHaveAttribute('data-data-key', 'label');
      expect(xAxis).toHaveAttribute('data-axis-class-name', 'text-gray-600 text-xs');
    });

    it('should configure YAxis correctly', () => {
      renderComponent();

      const yAxis = screen.getByTestId('mocked-y-axis');
      expect(yAxis).toHaveAttribute('data-axis-line', 'false');
      expect(yAxis).toHaveAttribute('data-tick-line', 'false');
      expect(yAxis).toHaveAttribute('data-interval', 'preserveStartEnd');
      expect(yAxis).toHaveAttribute('data-axis-class-name', 'text-gray-600 text-xs');
      
      const expectedLabel = JSON.stringify({ value: 'Quantity', angle: -90, position: 'insideLeft', offset: 0 });
      expect(yAxis).toHaveAttribute('data-label', expectedLabel);
    });

    it('should configure Tooltip correctly', () => {
      renderComponent();

      const tooltip = screen.getByTestId('mocked-tooltip');
      const expectedCursor = JSON.stringify({ fill: 'rgba(0, 0, 0, 0.1)' });
      expect(tooltip).toHaveAttribute('data-cursor', expectedCursor);
      expect(screen.getByTestId('mocked-custom-tooltip')).toBeInTheDocument();
    });

    it('should configure Bar correctly', () => {
      renderComponent();

      const bar = screen.getByTestId('mocked-bar');
      expect(bar).toHaveAttribute('data-data-key', 'quantity');
      expect(bar).toHaveAttribute('data-fill', '#3b82f6');
      expect(bar).toHaveAttribute('data-max-bar-size', '60');
      expect(bar).toHaveAttribute('data-radius', JSON.stringify([4, 4, 0, 0]));
    });
  });

  describe('Custom Components Integration', () => {
    it('should render CustomTooltip component', () => {
      renderComponent();

      expect(screen.getByTestId('mocked-custom-tooltip')).toBeInTheDocument();
      expect(screen.getByText('Custom Tooltip')).toBeInTheDocument();
    });

    it('should render WrappedXAxisTick component', () => {
      renderComponent();

      expect(screen.getByTestId('mocked-wrapped-x-axis-tick')).toBeInTheDocument();
      expect(screen.getByText('Wrapped X Axis Tick')).toBeInTheDocument();
    });

    it('should pass correct props to WrappedXAxisTick', () => {
      renderComponent();

      const wrappedTick = screen.getByTestId('mocked-wrapped-x-axis-tick');
      expect(wrappedTick).toHaveAttribute('data-x', '0');
      expect(wrappedTick).toHaveAttribute('data-y', '0');
      expect(wrappedTick).toHaveAttribute('data-payload', JSON.stringify({ value: '' }));
    });
  });

  describe('Data QA ID Prop Handling', () => {
    it('should use default data-qa-id when not provided', () => {
      renderComponent();

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-recharts-bar-chart')).toHaveAttribute('data-chart-qa-id', 'bar-chart-container');
      expect(screen.getByTestId('mocked-cartesian-grid')).toHaveAttribute('data-grid-qa-id', 'bar-chart-grid');
      expect(screen.getByTestId('mocked-x-axis')).toHaveAttribute('data-axis-qa-id', 'bar-chart-x-axis');
      expect(screen.getByTestId('mocked-y-axis')).toHaveAttribute('data-axis-qa-id', 'bar-chart-y-axis');
      expect(screen.getByTestId('mocked-tooltip')).toHaveAttribute('data-tooltip-qa-id', 'bar-chart-tooltip');
      expect(screen.getByTestId('mocked-bar')).toHaveAttribute('data-bar-qa-id', 'bar-chart-bars');
    });

    it('should use custom data-qa-id when provided', () => {
      renderComponent({ 'data-qa-id': 'revenue-chart' });

      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-recharts-bar-chart')).toHaveAttribute('data-chart-qa-id', 'revenue-chart-container');
      expect(screen.getByTestId('mocked-cartesian-grid')).toHaveAttribute('data-grid-qa-id', 'revenue-chart-grid');
      expect(screen.getByTestId('mocked-x-axis')).toHaveAttribute('data-axis-qa-id', 'revenue-chart-x-axis');
      expect(screen.getByTestId('mocked-y-axis')).toHaveAttribute('data-axis-qa-id', 'revenue-chart-y-axis');
      expect(screen.getByTestId('mocked-tooltip')).toHaveAttribute('data-tooltip-qa-id', 'revenue-chart-tooltip');
      expect(screen.getByTestId('mocked-bar')).toHaveAttribute('data-bar-qa-id', 'revenue-chart-bars');
    });

    it('should not render default data-qa-id when custom is provided', () => {
      renderComponent({ 'data-qa-id': 'sales-chart' });

      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
    });

    it('should create dynamic child data-qa-ids based on main id', () => {
      const testCases = [
        { main: 'analytics-chart', expected: 'analytics-chart-container' },
        { main: 'performance-bars', expected: 'performance-bars-container' },
        { main: 'metrics-visual', expected: 'metrics-visual-container' },
        { main: 'data-chart', expected: 'data-chart-container' },
      ];

      testCases.forEach(({ main, expected }) => {
        const { unmount } = renderComponent({ 'data-qa-id': main });
        expect(screen.getByTestId(main)).toBeInTheDocument();
        // Check one of the child elements
        const barChart = screen.getByTestId('mocked-recharts-bar-chart');
        expect(barChart).toHaveAttribute('data-chart-qa-id', expected);
        unmount();
      });
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'chart-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId('mocked-recharts-bar-chart')).toHaveAttribute('data-chart-qa-id', `${specialId}-container`);
      expect(screen.getByTestId('mocked-cartesian-grid')).toHaveAttribute('data-grid-qa-id', `${specialId}-grid`);
    });

    it('should handle empty string data-qa-id', () => {
      renderComponent({ 'data-qa-id': '' });

      const { container } = render(<BarChart data={defaultProps.data} data-qa-id="" />);
      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const chart = screen.getByTestId('bar-chart');
      const responsiveContainer = screen.getByTestId('mocked-responsive-container');
      const barChart = screen.getByTestId('mocked-recharts-bar-chart');

      expect(chart).toContainElement(responsiveContainer);
      expect(responsiveContainer).toContainElement(barChart);

      // Check that all chart elements are inside the bar chart
      expect(barChart).toContainElement(screen.getByTestId('mocked-cartesian-grid'));
      expect(barChart).toContainElement(screen.getByTestId('mocked-x-axis'));
      expect(barChart).toContainElement(screen.getByTestId('mocked-y-axis'));
      expect(barChart).toContainElement(screen.getByTestId('mocked-tooltip'));
      expect(barChart).toContainElement(screen.getByTestId('mocked-bar'));
    });

    it('should render chart components in correct order', () => {
      renderComponent();

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      const children = Array.from(barChart.children);

      expect(children).toHaveLength(5);
      expect(children[0]).toHaveAttribute('data-qa-id', 'mocked-cartesian-grid');
      expect(children[1]).toHaveAttribute('data-qa-id', 'mocked-x-axis');
      expect(children[2]).toHaveAttribute('data-qa-id', 'mocked-y-axis');
      expect(children[3]).toHaveAttribute('data-qa-id', 'mocked-tooltip');
      expect(children[4]).toHaveAttribute('data-qa-id', 'mocked-bar');
    });

    it('should maintain custom components within their parent elements', () => {
      renderComponent();

      const xAxis = screen.getByTestId('mocked-x-axis');
      const tooltip = screen.getByTestId('mocked-tooltip');

      expect(xAxis).toContainElement(screen.getByTestId('mocked-wrapped-x-axis-tick'));
      expect(tooltip).toContainElement(screen.getByTestId('mocked-custom-tooltip'));
    });
  });

  describe('Responsive Design', () => {
    it('should use responsive container dimensions', () => {
      renderComponent();

      const responsiveContainer = screen.getByTestId('mocked-responsive-container');
      expect(responsiveContainer).toHaveAttribute('data-width', '100%');
      expect(responsiveContainer).toHaveAttribute('data-height', '100%');
    });

    it('should apply responsive container styling', () => {
      renderComponent();

      const container = screen.getByTestId('bar-chart');
      expect(container).toHaveClass('h-64', 'w-full');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers', () => {
      renderComponent();

      const chart = screen.getByTestId('bar-chart');
      const responsiveContainer = screen.getByTestId('mocked-responsive-container');
      const barChart = screen.getByTestId('mocked-recharts-bar-chart');

      expect(chart).toBeVisible();
      expect(responsiveContainer).toBeVisible();
      expect(barChart).toBeVisible();
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const chart = screen.getByTestId('bar-chart');
      expect(chart.tagName).toBe('DIV');
    });

    it('should have descriptive Y-axis label', () => {
      renderComponent();

      const yAxis = screen.getByTestId('mocked-y-axis');
      const expectedLabel = JSON.stringify({ value: 'Quantity', angle: -90, position: 'insideLeft', offset: 0 });
      expect(yAxis).toHaveAttribute('data-label', expectedLabel);
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with very long labels', () => {
      const longLabelData = [
        { label: 'A'.repeat(100), quantity: 100 },
        { label: 'B'.repeat(50), quantity: 200 },
      ];

      renderComponent({ data: longLabelData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(longLabelData));
    });

    it('should handle data with special characters in labels', () => {
      const specialCharData = [
        { label: 'Label with @#$%^&*()', quantity: 100 },
        { label: 'Unicode: 测试 🚀', quantity: 200 },
      ];

      renderComponent({ data: specialCharData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(specialCharData));
    });

    it('should handle data with very large quantities', () => {
      const largeQuantityData = [
        { label: 'Large A', quantity: 999999999 },
        { label: 'Large B', quantity: 1000000000 },
      ];

      renderComponent({ data: largeQuantityData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(largeQuantityData));
    });

    it('should handle data with decimal quantities', () => {
      const decimalData = [
        { label: 'Decimal A', quantity: 123.45 },
        { label: 'Decimal B', quantity: 67.89 },
      ];

      renderComponent({ data: decimalData });

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(decimalData));
    });

    it('should handle data with missing properties gracefully', () => {
      const incompleteData: any = [
        { label: 'Complete', quantity: 100 },
        { label: 'Missing quantity' },
        { quantity: 150 },
      ];

      expect(() => {
        renderComponent({ data: incompleteData });
      }).not.toThrow();

      const barChart = screen.getByTestId('mocked-recharts-bar-chart');
      expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(incompleteData));
    });

    it('should handle null data gracefully', () => {
      expect(() => {
        renderComponent({ data: null });
      }).not.toThrow();
    });

    it('should handle undefined data gracefully', () => {
      expect(() => {
        renderComponent({ data: undefined });
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 20; i++) {
        const newData = [
          { label: `Item ${i}A`, quantity: i * 10 },
          { label: `Item ${i}B`, quantity: i * 15 },
        ];

        rerender(
          <BarChart
            data={newData}
            data-qa-id={`chart-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('chart-19')).toBeInTheDocument();
    });

    it('should handle data size changes efficiently', () => {
      const { rerender } = renderComponent();

      // Test with increasing data sizes
      for (let size = 1; size <= 10; size++) {
        const newData = Array.from({ length: size }, (_, i) => ({
          label: `Item ${i}`,
          quantity: i * 10,
        }));

        rerender(<BarChart data={newData} />);

        const barChart = screen.getByTestId('mocked-recharts-bar-chart');
        expect(barChart).toHaveAttribute('data-chart-data', JSON.stringify(newData));
      }
    });
  });

  describe('Integration', () => {
    it('should work correctly when used multiple times', () => {
      render(
        <div>
          <BarChart
            data={[{ label: 'A', quantity: 10 }]}
            data-qa-id="chart-1"
          />
          <BarChart
            data={[{ label: 'B', quantity: 20 }]}
            data-qa-id="chart-2"
          />
          <BarChart
            data={[{ label: 'C', quantity: 30 }]}
            data-qa-id="chart-3"
          />
        </div>
      );

      expect(screen.getByTestId('chart-1')).toBeInTheDocument();
      expect(screen.getByTestId('chart-2')).toBeInTheDocument();
      expect(screen.getByTestId('chart-3')).toBeInTheDocument();

      const allBarCharts = screen.getAllByTestId('mocked-recharts-bar-chart');
      expect(allBarCharts).toHaveLength(3);
    });

    it('should maintain independent configurations for multiple instances', () => {
      render(
        <div>
          <BarChart
            data={[{ label: 'First', quantity: 100 }]}
            data-qa-id="first-chart"
          />
          <BarChart
            data={[{ label: 'Second', quantity: 200 }]}
            data-qa-id="second-chart"
          />
        </div>
      );

      const allBarCharts = screen.getAllByTestId('mocked-recharts-bar-chart');
      expect(allBarCharts[0]).toHaveAttribute('data-chart-qa-id', 'first-chart-container');
      expect(allBarCharts[1]).toHaveAttribute('data-chart-qa-id', 'second-chart-container');
      
      expect(allBarCharts[0]).toHaveAttribute('data-chart-data', JSON.stringify([{ label: 'First', quantity: 100 }]));
      expect(allBarCharts[1]).toHaveAttribute('data-chart-data', JSON.stringify([{ label: 'Second', quantity: 200 }]));
    });
  });
});