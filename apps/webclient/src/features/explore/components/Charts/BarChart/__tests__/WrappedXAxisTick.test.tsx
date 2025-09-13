import React from 'react';
import { render, screen } from '@testing-library/react';
import { WrappedXAxisTick } from '@/features/explore/components/Charts/BarChart/WrappedXAxisTick';
import type { WrappedXAxisTickProps } from '@/features/explore/types/barChart';

interface Props extends WrappedXAxisTickProps {
  isRTL?: boolean;
}

describe('WrappedXAxisTick', () => {
  const defaultProps: Props = {
    x: 100,
    y: 200,
    payload: { value: 'Test Category' },
    isRTL: false,
  };

  describe('Basic Rendering', () => {
    it('should render with basic props', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      expect(screen.getByTestId('wrapped-x-axis-tick')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-text')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} data-qa-id="custom-tick" />
        </svg>
      );

      expect(screen.getByTestId('custom-tick')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tick-text')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      expect(screen.getByTestId('wrapped-x-axis-tick')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-text')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} data-qa-id="test-tick" />
        </svg>
      );

      expect(screen.getByTestId('test-tick')).toBeInTheDocument();
      expect(screen.getByTestId('test-tick-text')).toBeInTheDocument();
      expect(screen.getByTestId('test-tick-line-0')).toBeInTheDocument();
    });

    it('should create line-specific data-qa-id attributes', () => {
      render(
        <svg>
          <WrappedXAxisTick 
            {...defaultProps} 
            payload={{ value: 'Multi word category name that will wrap' }}
            data-qa-id="multi-line-tick" 
          />
        </svg>
      );

      expect(screen.getByTestId('multi-line-tick')).toBeInTheDocument();
      expect(screen.getByTestId('multi-line-tick-text')).toBeInTheDocument();
      expect(screen.getByTestId('multi-line-tick-line-0')).toBeInTheDocument();
      // Should have multiple lines for long text
      expect(screen.getByTestId('multi-line-tick-line-1')).toBeInTheDocument();
    });
  });

  describe('Text Wrapping', () => {
    it('should handle short text without wrapping', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 'Short' }} />
        </svg>
      );

      expect(screen.getByText('Short')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-line-0')).toBeInTheDocument();
      expect(screen.queryByTestId('wrapped-x-axis-tick-line-1')).not.toBeInTheDocument();
    });

    it('should wrap long text into multiple lines', () => {
      render(
        <svg>
          <WrappedXAxisTick 
            {...defaultProps} 
            payload={{ value: 'This is a very long category name that should wrap' }}
          />
        </svg>
      );

      expect(screen.getByTestId('wrapped-x-axis-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-line-1')).toBeInTheDocument();
    });

    it('should limit text to maximum 2 lines', () => {
      render(
        <svg>
          <WrappedXAxisTick 
            {...defaultProps} 
            payload={{ value: 'This is an extremely long category name that would normally wrap into many lines but should be limited to only two lines maximum' }}
          />
        </svg>
      );

      expect(screen.getByTestId('wrapped-x-axis-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-line-1')).toBeInTheDocument();
      expect(screen.queryByTestId('wrapped-x-axis-tick-line-2')).not.toBeInTheDocument();
    });

    it('should handle single word longer than character limit', () => {
      render(
        <svg>
          <WrappedXAxisTick 
            {...defaultProps} 
            payload={{ value: 'Supercalifragilisticexpialidocious' }}
          />
        </svg>
      );

      expect(screen.getByText('Supercalifragilisticexpialidocious')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-line-0')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should apply LTR text anchor for LTR layout', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} isRTL={false} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveAttribute('text-anchor', 'end');
      expect(textElement).toHaveStyle({ fontSize: '12px' });
    });

    it('should apply RTL text anchor for RTL layout', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} isRTL={true} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveAttribute('text-anchor', 'start');
      expect(textElement).toHaveStyle({ fontSize: '11px' });
    });

    it('should default to LTR when isRTL is not provided', () => {
      render(
        <svg>
          <WrappedXAxisTick x={100} y={200} payload={{ value: 'Test' }} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveAttribute('text-anchor', 'end');
      expect(textElement).toHaveStyle({ fontSize: '12px' });
    });
  });

  describe('Positioning and Transform', () => {
    it('should apply correct transform with position coordinates', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} x={150} y={250} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      expect(gElement).toHaveAttribute('transform', 'translate(150, 250) rotate(-45)');
    });

    it('should handle zero coordinates', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} x={0} y={0} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      expect(gElement).toHaveAttribute('transform', 'translate(0, 0) rotate(-45)');
    });

    it('should handle negative coordinates', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} x={-50} y={-100} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      expect(gElement).toHaveAttribute('transform', 'translate(-50, -100) rotate(-45)');
    });
  });

  describe('Text Content Handling', () => {
    it('should handle string values', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 'String Value' }} />
        </svg>
      );

      expect(screen.getByText('String Value')).toBeInTheDocument();
    });

    it('should handle number values', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 12345 }} />
        </svg>
      );

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should handle empty string', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: '' }} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toBeInTheDocument();
    });

    it('should handle undefined value', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: undefined as any }} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toBeInTheDocument();
    });

    it('should handle null value', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: null as any }} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('SVG Structure', () => {
    it('should render proper SVG structure', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');

      expect(gElement.tagName).toBe('g');
      expect(textElement.tagName).toBe('text');
    });

    it('should apply correct text attributes', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveAttribute('x', '0');
      expect(textElement).toHaveAttribute('y', '0');
      expect(textElement).toHaveAttribute('fill', 'currentColor');
    });

    it('should render tspan elements for each line', () => {
      render(
        <svg>
          <WrappedXAxisTick 
            {...defaultProps} 
            payload={{ value: 'Multi word text' }}
          />
        </svg>
      );

      expect(screen.getByTestId('wrapped-x-axis-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('wrapped-x-axis-tick-line-1')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveClass('text-xs', 'text-gray-600');
    });

    it('should apply different font sizes for RTL and LTR', () => {
      const { rerender } = render(
        <svg>
          <WrappedXAxisTick {...defaultProps} isRTL={false} />
        </svg>
      );
      
      let textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveStyle({ fontSize: '12px' });

      rerender(
        <svg>
          <WrappedXAxisTick {...defaultProps} isRTL={true} />
        </svg>
      );
      
      textElement = screen.getByTestId('wrapped-x-axis-tick-text');
      expect(textElement).toHaveStyle({ fontSize: '11px' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 'Special @#$%^&*()' }} />
        </svg>
      );

      expect(screen.getByText('Special')).toBeInTheDocument();
      expect(screen.getByText('@#$%^&*()')).toBeInTheDocument();
    });

    it('should handle unicode characters', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 'Unicode 中文 العربية' }} />
        </svg>
      );

      expect(screen.getByText('Unicode 中文')).toBeInTheDocument();
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    it('should handle emojis', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} payload={{ value: 'Emojis 🚀 🎉 📊' }} />
        </svg>
      );

      expect(screen.getByText('Emojis 🚀 🎉')).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
    });

    it('should handle very large coordinates', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} x={999999} y={888888} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      expect(gElement).toHaveAttribute('transform', 'translate(999999, 888888) rotate(-45)');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper data-qa-id hierarchy for testing', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} data-qa-id="accessible-tick" />
        </svg>
      );

      expect(screen.getByTestId('accessible-tick')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-tick-text')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-tick-line-0')).toBeInTheDocument();
    });

    it('should maintain semantic SVG structure', () => {
      render(
        <svg>
          <WrappedXAxisTick {...defaultProps} />
        </svg>
      );

      const gElement = screen.getByTestId('wrapped-x-axis-tick');
      const textElement = screen.getByTestId('wrapped-x-axis-tick-text');

      expect(gElement).toContainElement(textElement);
    });
  });
});