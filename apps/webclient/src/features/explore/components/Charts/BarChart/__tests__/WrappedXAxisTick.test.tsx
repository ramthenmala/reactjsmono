'use client';

import { render, screen } from '@testing-library/react';
import { WrappedXAxisTick } from '../WrappedXAxisTick';
import { barChartStyles } from '../styles';

jest.mock('../styles', () => ({
  barChartStyles: {
    xAxisTick: 'text-xs text-gray-600'
  }
}));

describe('WrappedXAxisTick', () => {
  const defaultProps = {
    x: 100,
    y: 200,
    payload: { value: 'Test Label' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithSvg = (component: React.ReactElement) => {
    return render(
      <svg>
        {component}
      </svg>
    );
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
    });

    it('applies correct transform with x and y coordinates', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      const tickGroup = screen.getByTestId('bar-chart-x-tick');
      expect(tickGroup).toHaveAttribute('transform', 'translate(100, 200) rotate(-45)');
    });

    it('applies correct text styling and attributes', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      const textElement = screen.getByTestId('bar-chart-x-tick-text');
      expect(textElement).toHaveAttribute('x', '0');
      expect(textElement).toHaveAttribute('y', '0');
      expect(textElement).toHaveAttribute('text-anchor', 'end');
      expect(textElement).toHaveAttribute('fill', 'currentColor');
      expect(textElement).toHaveClass('text-xs text-gray-600');
    });
  });

  describe('Text Content Handling', () => {
    it('renders single word correctly', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Single' }} />);
      
      const line = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line).toHaveTextContent('Single');
      expect(line).toHaveAttribute('x', '0');
      expect(line).toHaveAttribute('dy', '0');
    });

    it('renders short text without wrapping', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Short Text' }} />);
      
      const line = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line).toHaveTextContent('Short Text');
      expect(screen.queryByTestId('bar-chart-x-tick-line-1')).not.toBeInTheDocument();
    });

    it('wraps long text into multiple lines', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'This is a very long text that should wrap' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toBeInTheDocument();
      expect(line2).toBeInTheDocument();
      expect(line1).toHaveAttribute('dy', '0');
      expect(line2).toHaveAttribute('dy', '12');
    });

    it('limits to maximum 2 lines', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'This is an extremely long text that would normally wrap into more than two lines but should be limited' }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-line-1')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-2')).not.toBeInTheDocument();
    });

    it('handles exactly 12 character limit per line', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Twelve chars exactly more text' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toHaveTextContent('Twelve chars');
      expect(line2).toHaveTextContent('exactly more');
    });
  });

  describe('Edge Cases and Special Values', () => {
    it('handles undefined payload value', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: undefined }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-0')).not.toBeInTheDocument();
    });

    it('handles null payload value', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: null }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-0')).not.toBeInTheDocument();
    });

    it('handles empty string payload value', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: '' }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-0')).not.toBeInTheDocument();
    });

    it('handles numeric payload value', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 12345 }} />);
      
      const line = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line).toHaveTextContent('12345');
    });

    it('handles boolean payload value', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: true }} />);
      
      const line = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line).toHaveTextContent('true');
    });

    it('handles zero coordinates', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} x={0} y={0} />);
      
      const tickGroup = screen.getByTestId('bar-chart-x-tick');
      expect(tickGroup).toHaveAttribute('transform', 'translate(0, 0) rotate(-45)');
    });

    it('handles negative coordinates', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} x={-50} y={-100} />);
      
      const tickGroup = screen.getByTestId('bar-chart-x-tick');
      expect(tickGroup).toHaveAttribute('transform', 'translate(-50, -100) rotate(-45)');
    });
  });

  describe('Text Wrapping Logic', () => {
    it('wraps at word boundaries', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Word boundary test case' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1.textContent).toBe('Word');
      expect(line2.textContent).toBe('boundary');
    });

    it('handles single long word exceeding character limit', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Supercalifragilisticexpialidocious' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line1).toHaveTextContent('Supercalifragilisticexpialidocious');
      expect(screen.queryByTestId('bar-chart-x-tick-line-1')).not.toBeInTheDocument();
    });

    it('handles multiple spaces between words', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Multiple    spaces   between' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toHaveTextContent('Multiple');
      expect(line2).toHaveTextContent('spaces');
    });

    it('preserves single spaces in wrapped text', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Short text wrap' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line1).toHaveTextContent('Short text');
    });
  });

  describe('Special Characters and Unicode', () => {
    it('handles text with special characters', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Special @#$%^&*() chars' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toHaveTextContent('Special');
      expect(line2).toHaveTextContent('@#$%^&*()');
    });

    it('handles Unicode characters', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Héllo Wörld 你好' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toHaveTextContent('Héllo Wörld');
      expect(line2).toHaveTextContent('你好');
    });

    it('handles emojis in text', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Hello 👋 World 🌍' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      const line2 = screen.getByTestId('bar-chart-x-tick-line-1');
      
      expect(line1).toHaveTextContent('Hello 👋');
      expect(line2).toHaveTextContent('World 🌍');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles very long strings efficiently', () => {
      const longText = 'word '.repeat(100);
      const startTime = performance.now();
      
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: longText }} />);
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50);
      
      expect(screen.getByTestId('bar-chart-x-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-line-1')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-2')).not.toBeInTheDocument();
    });

    it('handles string with only spaces', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: '     ' }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart-x-tick-line-0')).not.toBeInTheDocument();
    });

    it('handles string starting with spaces', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: '   Leading spaces' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line1).toHaveTextContent('Leading');
    });

    it('handles string ending with spaces', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Trailing spaces   ' }} />);
      
      const line1 = screen.getByTestId('bar-chart-x-tick-line-0');
      expect(line1).toHaveTextContent('Trailing');
    });
  });

  describe('Component Integration', () => {
    it('works with different coordinate values', () => {
      const coords = [
        { x: 0, y: 0 },
        { x: 100, y: 200 },
        { x: -50, y: 300 },
        { x: 1000, y: -100 }
      ];

      coords.forEach(({ x, y }) => {
        const { unmount } = renderWithSvg(
          <WrappedXAxisTick {...defaultProps} x={x} y={y} />
        );
        
        const tickGroup = screen.getByTestId('bar-chart-x-tick');
        expect(tickGroup).toHaveAttribute('transform', `translate(${x}, ${y}) rotate(-45)`);
        
        unmount();
      });
    });

    it('maintains consistent structure across different texts', () => {
      const testTexts = [
        'Short',
        'Medium length text',
        'Very long text that will definitely wrap into multiple lines',
        'SingleVeryLongWordWithoutSpaces'
      ];

      testTexts.forEach((text) => {
        const { unmount } = renderWithSvg(
          <WrappedXAxisTick {...defaultProps} payload={{ value: text }} />
        );
        
        expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart-x-tick-line-0')).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Accessibility and Data Attributes', () => {
    it('provides correct data-qa-id attributes for testing', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Test wrap text' }} />);
      
      expect(screen.getByTestId('bar-chart-x-tick')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-text')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-line-0')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-x-tick-line-1')).toBeInTheDocument();
    });

    it('maintains proper SVG structure for screen readers', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      const group = screen.getByTestId('bar-chart-x-tick');
      const text = screen.getByTestId('bar-chart-x-tick-text');
      
      expect(group.tagName).toBe('g');
      expect(text.tagName).toBe('text');
      expect(text).toHaveAttribute('fill', 'currentColor');
    });

    it('uses semantic SVG text elements', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} payload={{ value: 'Multi word test' }} />);
      
      const tspans = screen.getAllByTestId(/bar-chart-x-tick-line-\d+/);
      tspans.forEach((tspan) => {
        expect(tspan.tagName).toBe('tspan');
        expect(tspan).toHaveAttribute('x', '0');
      });
    });
  });

  describe('Style Integration', () => {
    it('applies barChartStyles.xAxisTick class', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      const textElement = screen.getByTestId('bar-chart-x-tick-text');
      expect(textElement).toHaveClass('text-xs text-gray-600');
    });

    it('maintains currentColor for dynamic theming', () => {
      renderWithSvg(<WrappedXAxisTick {...defaultProps} />);
      
      const textElement = screen.getByTestId('bar-chart-x-tick-text');
      expect(textElement).toHaveAttribute('fill', 'currentColor');
    });
  });
});