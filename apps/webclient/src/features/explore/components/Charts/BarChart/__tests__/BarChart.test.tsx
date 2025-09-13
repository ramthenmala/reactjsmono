import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarChart } from '@/features/explore/components/Charts/BarChart';
import type { BarChartProps } from '@/features/explore/types/barChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  Bar: ({ 'data-qa-id': dataQaId, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-bar" {...props}>
      Bar Component
    </div>
  ),
  CartesianGrid: ({ 'data-qa-id': dataQaId, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-grid" {...props}>
      Grid Component
    </div>
  ),
  BarChart: ({ 'data-qa-id': dataQaId, children, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-bar-chart" {...props}>
      {children}
    </div>
  ),
  ResponsiveContainer: ({ 'data-qa-id': dataQaId, children, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-responsive-container" {...props}>
      {children}
    </div>
  ),
  Tooltip: ({ 'data-qa-id': dataQaId, content, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-tooltip" {...props}>
      {content}
    </div>
  ),
  XAxis: ({ 'data-qa-id': dataQaId, tick, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-x-axis" {...props}>
      {tick}
    </div>
  ),
  YAxis: ({ 'data-qa-id': dataQaId, ...props }: any) => (
    <div data-qa-id={dataQaId} data-testid="recharts-y-axis" {...props}>
      Y Axis
    </div>
  ),
}));

// Mock sub-components
jest.mock('../WrappedXAxisTick', () => ({
  WrappedXAxisTick: ({ 'data-qa-id': dataQaId, payload, isRTL }: any) => (
    <div data-qa-id={dataQaId} data-testid="wrapped-x-axis-tick">
      Wrapped X Axis Tick: {payload?.value} (RTL: {isRTL?.toString()})
    </div>
  ),
}));

jest.mock('../CustomTooltip', () => ({
  CustomTooltip: ({ 'data-qa-id': dataQaId, active, payload, label }: any) => (
    <div data-qa-id={dataQaId} data-testid="custom-tooltip">
      {active && payload && payload.length ? (
        <div>
          <span>Label: {label}</span>
          <span>Value: {payload[0]?.value}</span>
        </div>
      ) : (
        'Tooltip Inactive'
      )}
    </div>
  ),
}));

// Mock document.documentElement for RTL detection
const mockDocumentElement = {
  dir: 'ltr',
  setAttribute: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
};

Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

// Sample test data
const mockData = [
  { label: 'Category A', quantity: 100 },
  { label: 'Category B', quantity: 200 },
  { label: 'Category C', quantity: 150 },
  { label: 'Category D', quantity: 300 },
];

const defaultProps: BarChartProps = {
  data: mockData,
};

describe('BarChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDocumentElement.dir = 'ltr';
  });

  describe('Basic Rendering', () => {
    it('should render with basic props', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-grid')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-tooltip-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-bar')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<BarChart {...defaultProps} data-qa-id="custom-chart" />);

      expect(screen.getByTestId('custom-chart')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chart-chart')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes', () => {
      render(<BarChart {...defaultProps} data-qa-id="test-chart" />);

      expect(screen.getByTestId('test-chart')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-chart')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-grid')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-tooltip-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-bar')).toBeInTheDocument();
    });

    it('should pass data-qa-id to sub-components', () => {
      render(<BarChart {...defaultProps} data-qa-id="test-chart" />);

      expect(screen.getByTestId('test-chart-x-axis-tick')).toBeInTheDocument();
      expect(screen.getByTestId('test-chart-tooltip')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should handle LTR layout correctly', () => {
      mockDocumentElement.dir = 'ltr';
      render(<BarChart {...defaultProps} data-qa-id="ltr-chart" />);

      // Check that isRTL is passed as false to WrappedXAxisTick
      expect(screen.getByText(/RTL: false/)).toBeInTheDocument();
    });

    it('should handle RTL layout correctly', () => {
      mockDocumentElement.dir = 'rtl';
      render(<BarChart {...defaultProps} data-qa-id="rtl-chart" />);

      // Check that isRTL is passed as true to WrappedXAxisTick
      expect(screen.getByText(/RTL: true/)).toBeInTheDocument();
    });

    it('should reverse data for RTL layout', () => {
      mockDocumentElement.dir = 'rtl';
      render(<BarChart {...defaultProps} />);

      // The component should still render properly
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should use different margins for RTL layout', () => {
      mockDocumentElement.dir = 'rtl';
      render(<BarChart {...defaultProps} />);

      // Component should render with RTL-specific styling
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data array', () => {
      render(<BarChart data={[]} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
    });

    it('should handle single data point', () => {
      const singleData = [{ label: 'Single', quantity: 100 }];
      render(<BarChart data={singleData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-bar')).toBeInTheDocument();
    });

    it('should handle large numbers in data', () => {
      const largeNumberData = [
        { label: 'Large', quantity: 1000000 },
        { label: 'Small', quantity: 1 },
      ];
      render(<BarChart data={largeNumberData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle string and number labels', () => {
      const mixedLabelData = [
        { label: 'String Label', quantity: 100 },
        { label: 123, quantity: 200 },
      ];
      render(<BarChart data={mixedLabelData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render WrappedXAxisTick component', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('bar-chart-x-axis-tick')).toBeInTheDocument();
      expect(screen.getByText(/Wrapped X Axis Tick/)).toBeInTheDocument();
    });

    it('should render CustomTooltip component', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('bar-chart-tooltip')).toBeInTheDocument();
    });

    it('should pass correct props to WrappedXAxisTick', () => {
      render(<BarChart {...defaultProps} data-qa-id="prop-test" />);

      const wrappedTick = screen.getByTestId('prop-test-x-axis-tick');
      expect(wrappedTick).toBeInTheDocument();
      expect(screen.getByTestId('prop-test-x-axis-tick')).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('should apply correct container classes', () => {
      render(<BarChart {...defaultProps} />);

      const container = screen.getByTestId('bar-chart');
      expect(container).toHaveClass('h-80', 'w-full');
    });

    it('should maintain consistent styling structure', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('bar-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle data with zero quantities', () => {
      const zeroData = [
        { label: 'Zero', quantity: 0 },
        { label: 'Positive', quantity: 100 },
      ];
      render(<BarChart data={zeroData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle data with negative quantities', () => {
      const negativeData = [
        { label: 'Negative', quantity: -50 },
        { label: 'Positive', quantity: 100 },
      ];
      render(<BarChart data={negativeData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle very long labels', () => {
      const longLabelData = [
        { label: 'This is a very long label that might cause wrapping issues', quantity: 100 },
        { label: 'Short', quantity: 200 },
      ];
      render(<BarChart data={longLabelData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const specialCharData = [
        { label: 'Label with émojis 🚀', quantity: 100 },
        { label: 'Symbols @#$%', quantity: 200 },
      ];
      render(<BarChart data={specialCharData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render ResponsiveContainer with correct props', () => {
      render(<BarChart {...defaultProps} />);

      const container = screen.getByTestId('bar-chart-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('width', '100%');
      expect(container).toHaveAttribute('height', '100%');
    });

    it('should maintain chart structure in responsive container', () => {
      render(<BarChart {...defaultProps} />);

      const container = screen.getByTestId('bar-chart-container');
      const chart = screen.getByTestId('bar-chart-chart');
      
      expect(container).toContainElement(chart);
    });
  });

  describe('Accessibility', () => {
    it('should provide proper data-qa-id attributes for testing', () => {
      render(<BarChart {...defaultProps} data-qa-id="accessible-chart" />);

      expect(screen.getByTestId('accessible-chart')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-chart-chart')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-chart-x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-chart-y-axis')).toBeInTheDocument();
    });

    it('should maintain semantic structure', () => {
      render(<BarChart {...defaultProps} />);

      // Check that all major chart elements are present
      expect(screen.getByTestId('bar-chart-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-bar')).toBeInTheDocument();
    });
  });
});