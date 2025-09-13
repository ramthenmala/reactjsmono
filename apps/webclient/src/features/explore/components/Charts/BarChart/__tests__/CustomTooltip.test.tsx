import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomTooltip } from '@/features/explore/components/Charts/BarChart/CustomTooltip';
import type { CustomTooltipProps, TooltipPayload } from '@/features/explore/types/barChart';

describe('CustomTooltip', () => {
  const mockPayload: TooltipPayload[] = [
    {
      value: 1234,
      name: 'quantity',
      color: '#695DC2',
    },
  ];

  const defaultProps: CustomTooltipProps = {
    active: true,
    payload: mockPayload,
    label: 'Test Category',
  };

  describe('Basic Rendering', () => {
    it('should render when active with payload', () => {
      render(<CustomTooltip {...defaultProps} />);

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('Quantity: 1,234')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<CustomTooltip {...defaultProps} data-qa-id="custom-tooltip-test" />);

      expect(screen.getByTestId('custom-tooltip-test')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip-test-label')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip-test-value')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(<CustomTooltip {...defaultProps} />);

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip-label')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tooltip-value')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes', () => {
      render(<CustomTooltip {...defaultProps} data-qa-id="test-tooltip" />);

      expect(screen.getByTestId('test-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('test-tooltip-label')).toBeInTheDocument();
      expect(screen.getByTestId('test-tooltip-value')).toBeInTheDocument();
    });

    it('should maintain hierarchy with different qa-id', () => {
      render(<CustomTooltip {...defaultProps} data-qa-id="chart-tooltip" />);

      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip-label')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip-value')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should return null when not active', () => {
      const { container } = render(
        <CustomTooltip
          active={false}
          payload={mockPayload}
          label="Test Category"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when payload is empty', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={[]}
          label="Test Category"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when payload is undefined', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={undefined}
          label="Test Category"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when all conditions are false', () => {
      const { container } = render(
        <CustomTooltip
          active={false}
          payload={[]}
          label="Test Category"
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Content Display', () => {
    it('should display label correctly', () => {
      render(<CustomTooltip {...defaultProps} label="Category Name" />);

      expect(screen.getByText('Category Name')).toBeInTheDocument();
    });

    it('should display formatted quantity value', () => {
      const largeNumberPayload: TooltipPayload[] = [
        {
          value: 1234567,
          name: 'quantity',
          color: '#695DC2',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={largeNumberPayload}
          label="Large Number"
        />
      );

      expect(screen.getByText('Quantity: 1,234,567')).toBeInTheDocument();
    });

    it('should handle zero value', () => {
      const zeroPayload: TooltipPayload[] = [
        {
          value: 0,
          name: 'quantity',
          color: '#695DC2',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={zeroPayload}
          label="Zero Value"
        />
      );

      expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
    });

    it('should handle negative value', () => {
      const negativePayload: TooltipPayload[] = [
        {
          value: -500,
          name: 'quantity',
          color: '#695DC2',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={negativePayload}
          label="Negative Value"
        />
      );

      expect(screen.getByText('Quantity: -500')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      render(<CustomTooltip {...defaultProps} />);

      const container = screen.getByTestId('custom-tooltip');
      const label = screen.getByTestId('custom-tooltip-label');
      const value = screen.getByTestId('custom-tooltip-value');

      expect(container).toHaveClass('bg-white', 'p-2', 'border', 'border-gray-200', 'rounded', 'shadow-lg');
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
      expect(value).toHaveClass('text-sm', 'text-brand-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string label', () => {
      render(<CustomTooltip {...defaultProps} label="" />);

      expect(screen.getByTestId('custom-tooltip-label')).toHaveTextContent('');
    });

    it('should handle undefined label', () => {
      render(<CustomTooltip {...defaultProps} label={undefined} />);

      expect(screen.getByTestId('custom-tooltip-label')).toHaveTextContent('undefined');
    });

    it('should handle payload with decimal value', () => {
      const decimalPayload: TooltipPayload[] = [
        {
          value: 123.456,
          name: 'quantity',
          color: '#695DC2',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={decimalPayload}
          label="Decimal Value"
        />
      );

      expect(screen.getByText('Quantity: 123.456')).toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      const largePayload: TooltipPayload[] = [
        {
          value: 999999999999,
          name: 'quantity',
          color: '#695DC2',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={largePayload}
          label="Very Large Number"
        />
      );

      expect(screen.getByText('Quantity: 999,999,999,999')).toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      render(<CustomTooltip {...defaultProps} label="Label with émojis 🚀" />);

      expect(screen.getByText('Label with émojis 🚀')).toBeInTheDocument();
    });

    it('should access first payload item when multiple items exist', () => {
      const multiplePayload: TooltipPayload[] = [
        {
          value: 100,
          name: 'quantity1',
          color: '#695DC2',
        },
        {
          value: 200,
          name: 'quantity2',
          color: '#FF5733',
        },
      ];

      render(
        <CustomTooltip
          active={true}
          payload={multiplePayload}
          label="Multiple Payload"
        />
      );

      // Should show the first payload item
      expect(screen.getByText('Quantity: 100')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide proper semantic structure', () => {
      render(<CustomTooltip {...defaultProps} />);

      const label = screen.getByTestId('custom-tooltip-label');
      const value = screen.getByTestId('custom-tooltip-value');

      expect(label.tagName).toBe('P');
      expect(value.tagName).toBe('P');
    });

    it('should maintain proper content hierarchy', () => {
      render(<CustomTooltip {...defaultProps} data-qa-id="accessible-tooltip" />);

      const container = screen.getByTestId('accessible-tooltip');
      const label = screen.getByTestId('accessible-tooltip-label');
      const value = screen.getByTestId('accessible-tooltip-value');

      expect(container).toContainElement(label);
      expect(container).toContainElement(value);
    });
  });
});