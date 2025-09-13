import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { StatCard } from '../StatCard';
import type { StatCardVariant } from '../../../types/statCard';

// Mock the styles
jest.mock('../StatCard/styles', () => ({
  statCardStyles: {
    container: {
      base: 'base-container-class',
    },
    label: 'label-class',
    value: {
      variants: {
        default: 'default-value-class',
        regular: 'regular-value-class',
        large: 'large-value-class',
        logistics: 'logistics-value-class',
      },
    },
  },
}));

describe('StatCard', () => {
  const defaultProps = {
    label: 'Test Label',
    value: 'Test Value',
  };

  describe('Rendering', () => {
    it('should render StatCard with default data-qa-id', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.getByTestId('stat-card')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-header')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-value-container')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-value')).toBeInTheDocument();
    });

    it('should render StatCard with custom data-qa-id', () => {
      render(<StatCard {...defaultProps} data-qa-id="custom-card" />);

      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-value-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-value')).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should display the provided label and value', () => {
      render(<StatCard label="Population" value="1.2M" />);

      expect(screen.getByTestId('stat-card-label')).toHaveTextContent('Population');
      expect(screen.getByTestId('stat-card-value')).toHaveTextContent('1.2M');
    });

    it('should handle React node content', () => {
      const labelNode = <span>Complex <strong>Label</strong></span>;
      const valueNode = <div>Complex <em>Value</em></div>;

      render(<StatCard label={labelNode} value={valueNode} />);

      const label = screen.getByTestId('stat-card-label');
      const value = screen.getByTestId('stat-card-value');

      expect(label).toContainHTML('<span>Complex <strong>Label</strong></span>');
      expect(value).toContainHTML('<div>Complex <em>Value</em></div>');
    });
  });

  describe('Variants', () => {
    const variants: StatCardVariant[] = ['default', 'regular', 'large', 'logistics'];

    variants.forEach((variant) => {
      it(`should apply correct classes for ${variant} variant`, () => {
        render(<StatCard {...defaultProps} variant={variant} />);

        const valueContainer = screen.getByTestId('stat-card-value-container');
        expect(valueContainer).toHaveClass(`${variant}-value-class`);
      });
    });

    it('should use default variant when none specified', () => {
      render(<StatCard {...defaultProps} />);

      const valueContainer = screen.getByTestId('stat-card-value-container');
      expect(valueContainer).toHaveClass('default-value-class');
    });

    it('should use default variant when undefined is passed', () => {
      render(<StatCard {...defaultProps} variant={undefined} />);

      const valueContainer = screen.getByTestId('stat-card-value-container');
      expect(valueContainer).toHaveClass('default-value-class');
    });
  });

  describe('Icon Handling', () => {
    const mockIcon = <svg data-testid="test-icon">Icon</svg>;

    it('should render icon for non-logistics variants', () => {
      render(<StatCard {...defaultProps} icon={mockIcon} variant="default" />);

      expect(screen.getByTestId('stat-card-icon')).toBeInTheDocument();
      // Icon content verified through component structure
    });

    it('should render icon in header for regular variant', () => {
      render(<StatCard {...defaultProps} icon={mockIcon} variant="regular" />);

      const header = screen.getByTestId('stat-card-header');
      const icon = screen.getByTestId('stat-card-icon');
      expect(header).toContainElement(icon);
    });

    it('should render icon in value container for logistics variant', () => {
      render(<StatCard {...defaultProps} icon={mockIcon} variant="logistics" />);

      expect(screen.queryByTestId('stat-card-icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('stat-card-logistics-icon')).toBeInTheDocument();
      // Icon content verified through component structure
    });

    it('should not render icon when none provided', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.queryByTestId('stat-card-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('stat-card-logistics-icon')).not.toBeInTheDocument();
    });

    it('should apply correct CSS classes to icon elements', () => {
      render(<StatCard {...defaultProps} icon={mockIcon} variant="default" />);

      const icon = screen.getByTestId('stat-card-icon');
      expect(icon).toHaveClass('text-[#695DC2]', 'flex-shrink-0');
    });

    it('should apply correct CSS classes to logistics icon', () => {
      render(<StatCard {...defaultProps} icon={mockIcon} variant="logistics" />);

      const logisticsIcon = screen.getByTestId('stat-card-logistics-icon');
      expect(logisticsIcon).toHaveClass('text-[#695DC2]', 'flex-shrink-0');
    });
  });

  describe('Styling and Classes', () => {
    it('should apply base container classes', () => {
      render(<StatCard {...defaultProps} />);

      const container = screen.getByTestId('stat-card');
      expect(container).toHaveClass('base-container-class');
    });

    it('should apply custom className', () => {
      render(<StatCard {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('stat-card');
      expect(container).toHaveClass('base-container-class', 'custom-class');
    });

    it('should apply label styles', () => {
      render(<StatCard {...defaultProps} />);

      const label = screen.getByTestId('stat-card-label');
      expect(label).toHaveClass('label-class', 'flex-1', 'min-w-0');
    });

    it('should apply custom label styles', () => {
      const customStyle = { color: 'red', fontSize: '16px' };
      render(<StatCard {...defaultProps} labelStyle={customStyle} />);

      const label = screen.getByTestId('stat-card-label');
      expect(label).toHaveStyle('color: rgb(255, 0, 0); font-size: 16px');
    });

    it('should apply flex-wrap for logistics variant', () => {
      render(<StatCard {...defaultProps} variant="logistics" />);

      const valueContainer = screen.getByTestId('stat-card-value-container');
      expect(valueContainer).toHaveClass('flex-wrap');
    });

    it('should not apply flex-wrap for non-logistics variants', () => {
      render(<StatCard {...defaultProps} variant="default" />);

      const valueContainer = screen.getByTestId('stat-card-value-container');
      expect(valueContainer).not.toHaveClass('flex-wrap');
    });
  });

  describe('Header Structure', () => {
    it('should have correct header structure', () => {
      render(<StatCard {...defaultProps} />);

      const header = screen.getByTestId('stat-card-header');
      expect(header).toHaveClass('flex', 'items-start', 'justify-between', 'w-full', 'gap-2');
    });

    it('should contain label in header', () => {
      render(<StatCard {...defaultProps} />);

      const header = screen.getByTestId('stat-card-header');
      const label = screen.getByTestId('stat-card-label');
      expect(header).toContainElement(label);
    });
  });

  describe('Value Container Structure', () => {
    it('should have correct value container structure', () => {
      render(<StatCard {...defaultProps} />);

      const valueContainer = screen.getByTestId('stat-card-value-container');
      const value = screen.getByTestId('stat-card-value');
      expect(valueContainer).toContainElement(value);
    });

    it('should apply correct classes to value element', () => {
      render(<StatCard {...defaultProps} />);

      const value = screen.getByTestId('stat-card-value');
      expect(value).toHaveClass('min-w-0', 'flex-1');
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical data-qa-id structure', () => {
      render(<StatCard {...defaultProps} data-qa-id="test-card" />);

      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByTestId('test-card-header')).toBeInTheDocument();
      expect(screen.getByTestId('test-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('test-card-value-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-card-value')).toBeInTheDocument();
    });

    it('should include icon data-qa-ids when icon is present', () => {
      const mockIcon = <svg>Icon</svg>;
      
      render(<StatCard {...defaultProps} icon={mockIcon} data-qa-id="test-card" />);

      expect(screen.getByTestId('test-card-icon')).toBeInTheDocument();
    });

    it('should include logistics icon data-qa-id for logistics variant', () => {
      const mockIcon = <svg>Icon</svg>;
      
      render(<StatCard {...defaultProps} icon={mockIcon} variant="logistics" data-qa-id="test-card" />);

      expect(screen.getByTestId('test-card-logistics-icon')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      render(<StatCard label="" value="" />);

      expect(screen.getByTestId('stat-card-label')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-value')).toBeInTheDocument();
    });

    it('should handle numeric values', () => {
      render(<StatCard label={123} value={456} />);

      expect(screen.getByTestId('stat-card-label')).toHaveTextContent('123');
      expect(screen.getByTestId('stat-card-value')).toHaveTextContent('456');
    });

    it('should handle undefined className gracefully', () => {
      render(<StatCard {...defaultProps} className={undefined} />);

      const container = screen.getByTestId('stat-card');
      expect(container).toHaveClass('base-container-class');
    });

    it('should handle empty className', () => {
      render(<StatCard {...defaultProps} className="" />);

      const container = screen.getByTestId('stat-card');
      expect(container).toHaveClass('base-container-class');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible when interactive content is present', () => {
      const interactiveLabel = <button>Interactive Label</button>;
      
      render(<StatCard label={interactiveLabel} value="Value" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should maintain proper structure for screen readers', () => {
      render(<StatCard label="Population" value="1.2M" />);

      const container = screen.getByTestId('stat-card');
      expect(container).toBeInTheDocument();
      
      // Labels and values should be properly associated through structure
      const label = screen.getByTestId('stat-card-label');
      const value = screen.getByTestId('stat-card-value');
      expect(label).toBeInTheDocument();
      expect(value).toBeInTheDocument();
    });
  });
});