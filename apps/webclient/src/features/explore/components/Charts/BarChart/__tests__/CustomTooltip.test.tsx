import { render, screen } from '@testing-library/react';
import { CustomTooltip } from '@/features/explore/components/Charts/BarChart/CustomTooltip';
import '@testing-library/jest-dom';

// Mock the barChartStyles
jest.mock('@/features/explore/components/Charts/BarChart/styles', () => ({
  barChartStyles: {
    tooltip: {
      container: 'bg-white border border-gray-300 rounded-lg shadow-lg p-3',
      label: 'font-semibold text-gray-800 text-sm',
      value: 'text-gray-600 text-xs mt-1',
    },
  },
}));

describe('CustomTooltip', () => {
  const defaultPayload = [
    {
      value: 1500,
      name: 'quantity',
      color: '#3b82f6',
    },
  ];

  const defaultProps = {
    active: true,
    payload: defaultPayload,
    label: 'Category A',
  };

  const renderComponent = (props = {}) => {
    return render(<CustomTooltip {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Active Tooltip Rendering', () => {
    it('should render tooltip when active with payload and label', () => {
      renderComponent();

      expect(screen.getByTestId('bar-chart-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-tooltip-label')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-tooltip-value')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="bar-chart-tooltip"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="bar-chart-tooltip-label"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="bar-chart-tooltip-value"]')).toBeInTheDocument();
    });

    it('should render tooltip container as div element', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      expect(tooltip.tagName).toBe('DIV');
    });

    it('should render label as p element', () => {
      renderComponent();

      const label = screen.getByTestId('bar-chart-tooltip-label');
      expect(label.tagName).toBe('P');
    });

    it('should render value as p element', () => {
      renderComponent();

      const value = screen.getByTestId('bar-chart-tooltip-value');
      expect(value.tagName).toBe('P');
    });
  });

  describe('Content Display', () => {
    it('should display correct label', () => {
      renderComponent();

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('Category A');
    });

    it('should display correct value with formatting', () => {
      renderComponent();

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 1,500');
    });

    it('should handle different labels', () => {
      renderComponent({ label: 'Custom Category' });

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('Custom Category');
    });

    it('should handle different values', () => {
      const customPayload = [{ value: 2500, name: 'quantity', color: '#red' }];
      renderComponent({ payload: customPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 2,500');
    });

    it('should format large numbers with commas', () => {
      const largePayload = [{ value: 1234567, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: largePayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 1,234,567');
    });

    it('should format small numbers correctly', () => {
      const smallPayload = [{ value: 42, name: 'quantity', color: '#green' }];
      renderComponent({ payload: smallPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 42');
    });

    it('should handle zero values', () => {
      const zeroPayload = [{ value: 0, name: 'quantity', color: '#gray' }];
      renderComponent({ payload: zeroPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 0');
    });

    it('should handle negative values', () => {
      const negativePayload = [{ value: -150, name: 'quantity', color: '#red' }];
      renderComponent({ payload: negativePayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: -150');
    });

    it('should handle decimal values', () => {
      const decimalPayload = [{ value: 123.45, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: decimalPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 123.45');
    });
  });

  describe('Styling', () => {
    it('should apply correct container styling', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      expect(tooltip).toHaveClass(
        'bg-white',
        'border',
        'border-gray-300',
        'rounded-lg',
        'shadow-lg',
        'p-3'
      );
    });

    it('should apply correct label styling', () => {
      renderComponent();

      const label = screen.getByTestId('bar-chart-tooltip-label');
      expect(label).toHaveClass(
        'font-semibold',
        'text-gray-800',
        'text-sm'
      );
    });

    it('should apply correct value styling', () => {
      renderComponent();

      const value = screen.getByTestId('bar-chart-tooltip-value');
      expect(value).toHaveClass(
        'text-gray-600',
        'text-xs',
        'mt-1'
      );
    });
  });

  describe('Inactive Tooltip Behavior', () => {
    it('should return null when not active', () => {
      const { container } = render(<CustomTooltip active={false} payload={defaultPayload} label="Test" />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null when active but no payload', () => {
      const { container } = render(<CustomTooltip active={true} payload={undefined} label="Test" />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null when active but empty payload', () => {
      const { container } = render(<CustomTooltip active={true} payload={[]} label="Test" />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when active and payload but no label', () => {
      const { container } = render(<CustomTooltip active={true} payload={defaultPayload} />);

      expect(container.firstChild).not.toBeNull();
      expect(screen.getByTestId('bar-chart-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('undefined');
    });

    it('should return null when all conditions fail', () => {
      const { container } = render(<CustomTooltip />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined label gracefully', () => {
      const { container } = render(<CustomTooltip active={true} payload={defaultPayload} label={undefined} />);
      expect(container.firstChild).not.toBeNull();
      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('undefined');
    });

    it('should handle null label gracefully', () => {
      const { container } = render(<CustomTooltip active={true} payload={defaultPayload} label={null} />);
      expect(container.firstChild).not.toBeNull();
      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('null');
    });

    it('should handle empty string label', () => {
      renderComponent({ label: '' });

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent('');
    });

    it('should handle very long labels', () => {
      const longLabel = 'A'.repeat(200);
      renderComponent({ label: longLabel });

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent(longLabel);
    });

    it('should handle labels with special characters', () => {
      const specialLabel = 'Label with @#$%^&*() special chars';
      renderComponent({ label: specialLabel });

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent(specialLabel);
    });

    it('should handle labels with Unicode characters', () => {
      const unicodeLabel = 'Unicode: 测试 🚀 العربية';
      renderComponent({ label: unicodeLabel });

      expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent(unicodeLabel);
    });

    it('should handle payload with missing value', () => {
      const malformedPayload: any = [{ name: 'quantity', color: '#blue' }];
      renderComponent({ payload: malformedPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: undefined');
    });

    it('should handle payload with null value', () => {
      const nullPayload = [{ value: null, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: nullPayload as any });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: undefined');
    });

    it('should handle payload with string value', () => {
      const stringPayload = [{ value: '100' as any, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: stringPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 100');
    });

    it('should use first payload item when multiple items exist', () => {
      const multiplePayload = [
        { value: 100, name: 'quantity', color: '#blue' },
        { value: 200, name: 'other', color: '#red' },
      ];
      renderComponent({ payload: multiplePayload });

      // Should use the first payload item
      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 100');
    });

    it('should handle very large numbers', () => {
      const largePayload = [{ value: 999999999999, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: largePayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 999,999,999,999');
    });

    it('should handle very small decimal numbers', () => {
      const smallDecimalPayload = [{ value: 0.000001, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: smallDecimalPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 0');
    });

    it('should handle scientific notation numbers', () => {
      const scientificPayload = [{ value: 1e6, name: 'quantity', color: '#blue' }];
      renderComponent({ payload: scientificPayload });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 1,000,000');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy when active', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      const label = screen.getByTestId('bar-chart-tooltip-label');
      const value = screen.getByTestId('bar-chart-tooltip-value');

      expect(tooltip).toContainElement(label);
      expect(tooltip).toContainElement(value);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      const children = Array.from(tooltip.children);

      expect(children).toHaveLength(2);
      expect(children[0]).toHaveAttribute('data-qa-id', 'bar-chart-tooltip-label');
      expect(children[1]).toHaveAttribute('data-qa-id', 'bar-chart-tooltip-value');
    });
  });

  describe('Conditional Rendering Logic', () => {
    it('should render when active=true, payload exists, and payload has length', () => {
      renderComponent({ active: true, payload: defaultPayload, label: 'Test' });

      expect(screen.getByTestId('bar-chart-tooltip')).toBeInTheDocument();
    });

    it('should not render when active=false', () => {
      const { container } = render(
        <CustomTooltip active={false} payload={defaultPayload} label="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is null', () => {
      const { container } = render(
        <CustomTooltip active={true} payload={null} label="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is undefined', () => {
      const { container } = render(
        <CustomTooltip active={true} payload={undefined} label="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when payload is empty array', () => {
      const { container } = render(
        <CustomTooltip active={true} payload={[]} label="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle combination of failing conditions', () => {
      const testCases = [
        { active: false, payload: null, label: undefined },
        { active: false, payload: [], label: '' },
        { active: true, payload: null, label: undefined },
        { active: undefined, payload: undefined, label: undefined },
      ];

      testCases.forEach((testCase, index) => {
        const { container } = render(<CustomTooltip {...testCase as any} />);
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently when active', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 20; i++) {
        const newPayload = [{ value: i * 100, name: 'quantity', color: '#blue' }];
        rerender(
          <CustomTooltip
            active={true}
            payload={newPayload}
            label={`Category ${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Category 19')).toBeInTheDocument();
      expect(screen.getByText('Quantity: 1,900')).toBeInTheDocument();
    });

    it('should efficiently toggle between active and inactive states', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        const isActive = i % 2 === 0;
        rerender(
          <CustomTooltip
            active={isActive}
            payload={defaultPayload}
            label="Toggle Test"
          />
        );

        if (isActive) {
          expect(screen.getByTestId('bar-chart-tooltip')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('bar-chart-tooltip')).not.toBeInTheDocument();
        }
      }
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers when active', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      const label = screen.getByTestId('bar-chart-tooltip-label');
      const value = screen.getByTestId('bar-chart-tooltip-value');

      expect(tooltip).toBeVisible();
      expect(label).toBeVisible();
      expect(value).toBeVisible();
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      expect(tooltip.tagName).toBe('DIV');

      const label = screen.getByTestId('bar-chart-tooltip-label');
      expect(label.tagName).toBe('P');

      const value = screen.getByTestId('bar-chart-tooltip-value');
      expect(value.tagName).toBe('P');
    });

    it('should have proper text contrast with styling', () => {
      renderComponent();

      const label = screen.getByTestId('bar-chart-tooltip-label');
      expect(label).toHaveClass('text-gray-800');

      const value = screen.getByTestId('bar-chart-tooltip-value');
      expect(value).toHaveClass('text-gray-600');

      const tooltip = screen.getByTestId('bar-chart-tooltip');
      expect(tooltip).toHaveClass('bg-white');
    });
  });

  describe('Integration', () => {
    it('should work with different payload structures from Recharts', () => {
      const rechartsLikePayload = [
        {
          value: 500,
          name: 'quantity',
          color: '#8884d8',
          payload: { label: 'Category A', quantity: 500 },
          dataKey: 'quantity',
        },
      ];

      renderComponent({ payload: rechartsLikePayload as any });

      expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent('Quantity: 500');
    });

    it('should maintain consistency when used in different chart contexts', () => {
      const contexts = [
        { label: 'Revenue Chart', value: 1000 },
        { label: 'Sales Chart', value: 2000 },
        { label: 'User Chart', value: 3000 },
      ];

      contexts.forEach(({ label, value }, index) => {
        const payload = [{ value, name: 'quantity', color: '#blue' }];
        const { unmount } = renderComponent({ label, payload });

        expect(screen.getByTestId('bar-chart-tooltip-label')).toHaveTextContent(label);
        expect(screen.getByTestId('bar-chart-tooltip-value')).toHaveTextContent(`Quantity: ${value.toLocaleString()}`);
        
        unmount();
      });
    });
  });
});