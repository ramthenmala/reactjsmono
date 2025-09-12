import { render, screen } from '@testing-library/react';
import { StatChartCard } from '@/features/explore/components/Charts/StatChartCard';
import '@testing-library/jest-dom';

// Mock the PieChart component
jest.mock('@/features/explore/components/Charts/PieChart', () => ({
  PieChart: ({ value, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id="mocked-pie-chart"
      data-value={value}
      data-chart-qa-id={dataQaId}
      {...props}
    >
      Pie Chart ({value}%)
    </div>
  ),
}));

describe('StatChartCard', () => {
  const defaultProps = {
    label: 'Total Revenue',
    value: '$1.2M',
    percentage: 75,
  };

  const renderComponent = (props = {}) => {
    return render(<StatChartCard {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render stat chart card with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('stat-chart-card')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-pie-chart')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="stat-chart-card"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="stat-chart-card-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="stat-chart-card-label"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="stat-chart-card-value"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="stat-chart-card-chart"]')).toBeInTheDocument();
    });

    it('should render as div element', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Content Display', () => {
    it('should display label correctly', () => {
      renderComponent();

      expect(screen.getByTestId('stat-chart-card-label')).toHaveTextContent('Total Revenue');
    });

    it('should display value correctly', () => {
      renderComponent();

      expect(screen.getByTestId('stat-chart-card-value')).toHaveTextContent('$1.2M');
    });

    it('should pass percentage to PieChart', () => {
      renderComponent();

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '75');
    });

    it('should handle different content types', () => {
      renderComponent({
        label: 'New Orders',
        value: 1234,
        percentage: 50,
      });

      expect(screen.getByTestId('stat-chart-card-label')).toHaveTextContent('New Orders');
      expect(screen.getByTestId('stat-chart-card-value')).toHaveTextContent('1234');
      
      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '50');
    });

    it('should handle ReactNode content', () => {
      const labelNode = <span>Custom <strong>Label</strong></span>;
      const valueNode = <div>Custom Value</div>;

      renderComponent({
        label: labelNode,
        value: valueNode,
      });

      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Custom Value')).toBeInTheDocument();
    });
  });

  describe('Variant Handling', () => {
    it('should apply narrow variant by default', () => {
      renderComponent();

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-24');
    });

    it('should apply narrow variant when explicitly set', () => {
      renderComponent({ variant: 'narrow' });

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-24');
    });

    it('should apply wide variant', () => {
      renderComponent({ variant: 'wide' });

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-30');
    });

    it('should not have both width classes simultaneously', () => {
      renderComponent({ variant: 'wide' });

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-30');
      expect(label).not.toHaveClass('max-w-24');
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container styling', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass(
        'rounded-xl',
        'border',
        'border-solid',
        'bg-white',
        'p-4',
        'md:p-6',
        'w-full',
        'flex',
        'items-center',
        'justify-between'
      );
    });

    it('should have correct border styling', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('border-[var(--Colors-Border-border-secondary,_rgba(235,237,239,1))]');
    });

    it('should have correct content container styling', () => {
      renderComponent();

      const content = screen.getByTestId('stat-chart-card-content');
      expect(content).toHaveClass(
        'min-h-16',
        'md:min-h-26',
        'flex',
        'flex-col',
        'justify-between'
      );
    });

    it('should have correct label styling', () => {
      renderComponent();

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass(
        'text-[13px]',
        'md:text-sm',
        'font-medium',
        'text-gray-600'
      );
    });

    it('should have correct value styling', () => {
      renderComponent();

      const value = screen.getByTestId('stat-chart-card-value');
      expect(value).toHaveClass(
        'text-md',
        'md:text-2xl',
        'font-semibold'
      );
    });

    it('should apply custom className', () => {
      renderComponent({ className: 'custom-stat-card' });

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('custom-stat-card');
    });

    it('should combine custom className with base classes', () => {
      renderComponent({ className: 'shadow-lg hover:shadow-xl' });

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('shadow-lg', 'hover:shadow-xl', 'rounded-xl', 'border');
    });

    it('should handle empty className', () => {
      renderComponent({ className: '' });

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('rounded-xl', 'border');
    });

    it('should handle undefined className', () => {
      renderComponent({ className: undefined });

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('rounded-xl', 'border');
    });
  });

  describe('Data QA ID Prop Handling', () => {
    it('should use default data-qa-id when not provided', () => {
      renderComponent();

      expect(screen.getByTestId('stat-chart-card')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('stat-chart-card-chart')).toBeInTheDocument();
    });

    it('should use custom data-qa-id when provided', () => {
      renderComponent({ 'data-qa-id': 'revenue-card' });

      expect(screen.getByTestId('revenue-card')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-card-chart')).toBeInTheDocument();
    });

    it('should not render default data-qa-id when custom is provided', () => {
      renderComponent({ 'data-qa-id': 'orders-card' });

      expect(screen.queryByTestId('stat-chart-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('stat-chart-card-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('orders-card')).toBeInTheDocument();
      expect(screen.getByTestId('orders-card-content')).toBeInTheDocument();
    });

    it('should create dynamic child data-qa-ids based on main id', () => {
      const testCases = [
        { main: 'revenue-summary', expected: 'revenue-summary-content' },
        { main: 'user-stats', expected: 'user-stats-value' },
        { main: 'performance-metrics', expected: 'performance-metrics-chart' },
        { main: 'custom-card', expected: 'custom-card-label' },
      ];

      testCases.forEach(({ main, expected }) => {
        const { unmount } = renderComponent({ 'data-qa-id': main });
        expect(screen.getByTestId(expected)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'card-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-content`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-label`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-value`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-chart`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      renderComponent({ 'data-qa-id': '' });

      const { container } = render(<StatChartCard {...defaultProps} data-qa-id="" />);
      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-content"]')).toBeInTheDocument();
    });
  });

  describe('PieChart Integration', () => {
    it('should render PieChart component', () => {
      renderComponent();

      expect(screen.getByTestId('mocked-pie-chart')).toBeInTheDocument();
      expect(screen.getByText('Pie Chart (75%)')).toBeInTheDocument();
    });

    it('should pass correct percentage to PieChart', () => {
      renderComponent({ percentage: 85 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '85');
      expect(screen.getByText('Pie Chart (85%)')).toBeInTheDocument();
    });

    it('should handle zero percentage', () => {
      renderComponent({ percentage: 0 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '0');
      expect(screen.getByText('Pie Chart (0%)')).toBeInTheDocument();
    });

    it('should handle 100 percentage', () => {
      renderComponent({ percentage: 100 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '100');
      expect(screen.getByText('Pie Chart (100%)')).toBeInTheDocument();
    });

    it('should contain PieChart in chart wrapper', () => {
      renderComponent();

      const chartWrapper = screen.getByTestId('stat-chart-card-chart');
      const pieChart = screen.getByTestId('mocked-pie-chart');

      expect(chartWrapper).toContainElement(pieChart);
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      const content = screen.getByTestId('stat-chart-card-content');
      const label = screen.getByTestId('stat-chart-card-label');
      const value = screen.getByTestId('stat-chart-card-value');
      const chartWrapper = screen.getByTestId('stat-chart-card-chart');
      const pieChart = screen.getByTestId('mocked-pie-chart');

      expect(card).toContainElement(content);
      expect(card).toContainElement(chartWrapper);
      expect(content).toContainElement(label);
      expect(content).toContainElement(value);
      expect(chartWrapper).toContainElement(pieChart);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      const children = Array.from(card.children);

      expect(children).toHaveLength(2);
      expect(children[0]).toHaveAttribute('data-qa-id', 'stat-chart-card-content');
      expect(children[1]).toHaveAttribute('data-qa-id', 'stat-chart-card-chart');
    });

    it('should maintain content structure', () => {
      renderComponent();

      const content = screen.getByTestId('stat-chart-card-content');
      const contentChildren = Array.from(content.children);

      expect(contentChildren).toHaveLength(2);
      expect(contentChildren[0]).toHaveAttribute('data-qa-id', 'stat-chart-card-label');
      expect(contentChildren[1]).toHaveAttribute('data-qa-id', 'stat-chart-card-value');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding classes', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('p-4', 'md:p-6');
    });

    it('should have responsive minimum height classes', () => {
      renderComponent();

      const content = screen.getByTestId('stat-chart-card-content');
      expect(content).toHaveClass('min-h-16', 'md:min-h-26');
    });

    it('should have responsive text size classes for label', () => {
      renderComponent();

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('text-[13px]', 'md:text-sm');
    });

    it('should have responsive text size classes for value', () => {
      renderComponent();

      const value = screen.getByTestId('stat-chart-card-value');
      expect(value).toHaveClass('text-md', 'md:text-2xl');
    });

    it('should have responsive width constraints based on variant', () => {
      const { rerender } = renderComponent({ variant: 'narrow' });
      
      let label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-24');

      rerender(<StatChartCard {...defaultProps} variant="wide" />);
      
      label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('max-w-30');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      const content = screen.getByTestId('stat-chart-card-content');
      const label = screen.getByTestId('stat-chart-card-label');
      const value = screen.getByTestId('stat-chart-card-value');
      const chartWrapper = screen.getByTestId('stat-chart-card-chart');

      expect(card).toBeVisible();
      expect(content).toBeVisible();
      expect(label).toBeVisible();
      expect(value).toBeVisible();
      expect(chartWrapper).toBeVisible();
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const card = screen.getByTestId('stat-chart-card');
      const content = screen.getByTestId('stat-chart-card-content');

      expect(card.tagName).toBe('DIV');
      expect(content.tagName).toBe('DIV');
    });

    it('should have proper color contrast with text colors', () => {
      renderComponent();

      const label = screen.getByTestId('stat-chart-card-label');
      expect(label).toHaveClass('text-gray-600');

      const card = screen.getByTestId('stat-chart-card');
      expect(card).toHaveClass('bg-white');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props as minimal values', () => {
      expect(() => {
        render(
          <StatChartCard
            label=""
            value=""
            percentage={0}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('stat-chart-card')).toBeInTheDocument();
    });

    it('should handle negative percentages', () => {
      renderComponent({ percentage: -10 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '-10');
    });

    it('should handle percentages over 100', () => {
      renderComponent({ percentage: 150 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '150');
    });

    it('should handle decimal percentages', () => {
      renderComponent({ percentage: 33.33 });

      const pieChart = screen.getByTestId('mocked-pie-chart');
      expect(pieChart).toHaveAttribute('data-value', '33.33');
    });

    it('should handle very long label text', () => {
      const longLabel = 'A'.repeat(200);
      renderComponent({ label: longLabel });

      expect(screen.getByTestId('stat-chart-card-label')).toHaveTextContent(longLabel);
    });

    it('should handle very long value text', () => {
      const longValue = '9'.repeat(50);
      renderComponent({ value: longValue });

      expect(screen.getByTestId('stat-chart-card-value')).toHaveTextContent(longValue);
    });

    it('should handle special characters in content', () => {
      renderComponent({
        label: 'Revenue with special chars: @#$%^&*()',
        value: '$1,234.56 & more',
      });

      expect(screen.getByText('Revenue with special chars: @#$%^&*()')).toBeInTheDocument();
      expect(screen.getByText('$1,234.56 & more')).toBeInTheDocument();
    });

    it('should handle Unicode characters in content', () => {
      renderComponent({
        label: '收入统计 📊 Revenue Analytics',
        value: '¥1,234,567.89',
      });

      expect(screen.getByText('收入统计 📊 Revenue Analytics')).toBeInTheDocument();
      expect(screen.getByText('¥1,234,567.89')).toBeInTheDocument();
    });

    it('should handle null/undefined content gracefully', () => {
      renderComponent({
        label: null,
        value: undefined,
      });

      const label = screen.getByTestId('stat-chart-card-label');
      const value = screen.getByTestId('stat-chart-card-value');

      expect(label).toBeInTheDocument();
      expect(value).toBeInTheDocument();
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
        rerender(
          <StatChartCard
            label={`Label ${i}`}
            value={`Value ${i}`}
            percentage={i * 5}
            data-qa-id={`card-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('card-19')).toBeInTheDocument();
      expect(screen.getByText('Label 19')).toBeInTheDocument();
    });

    it('should handle frequent variant changes efficiently', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        const variant = i % 2 === 0 ? 'narrow' : 'wide';
        rerender(<StatChartCard {...defaultProps} variant={variant} />);

        const label = screen.getByTestId('stat-chart-card-label');
        const expectedClass = variant === 'wide' ? 'max-w-30' : 'max-w-24';
        expect(label).toHaveClass(expectedClass);
      }
    });
  });

  describe('Default Export', () => {
    it('should have default export available', () => {
      // This test ensures the default export works
      const StatChartCardDefault = require('@/features/explore/components/Charts/StatChartCard').default;
      expect(StatChartCardDefault).toBeDefined();
    });
  });

  describe('Integration', () => {
    it('should work correctly when used multiple times', () => {
      render(
        <div>
          <StatChartCard
            label="Revenue"
            value="$1.2M"
            percentage={75}
            data-qa-id="revenue-card"
          />
          <StatChartCard
            label="Orders"
            value="1,234"
            percentage={60}
            data-qa-id="orders-card"
          />
          <StatChartCard
            label="Users"
            value="5,678"
            percentage={90}
            data-qa-id="users-card"
          />
        </div>
      );

      expect(screen.getByTestId('revenue-card')).toBeInTheDocument();
      expect(screen.getByTestId('orders-card')).toBeInTheDocument();
      expect(screen.getByTestId('users-card')).toBeInTheDocument();

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('should work with complex ReactNode content', () => {
      const complexLabel = (
        <div>
          <span>Revenue</span>
          <small> (Last 30 days)</small>
        </div>
      );

      const complexValue = (
        <div>
          <span>$1.2M</span>
          <small> (+12%)</small>
        </div>
      );

      renderComponent({
        label: complexLabel,
        value: complexValue,
      });

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('(Last 30 days)')).toBeInTheDocument();
      expect(screen.getByText('$1.2M')).toBeInTheDocument();
      expect(screen.getByText('(+12%)')).toBeInTheDocument();
    });
  });
});