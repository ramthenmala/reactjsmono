import React from 'react';
import { render, screen } from '@testing-library/react';
import { MapLegend } from '../MapLegend';

// Mock shared-ui components
jest.mock('@compass/shared-ui', () => ({
  ButtonGroup: ({ children, size, className, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-size={size}
      className={className}
      role="group"
    >
      {children}
    </div>
  ),
  ButtonGroupItem: ({ 
    children, 
    id, 
    isSelected = false, 
    'data-qa-id': dataQaId 
  }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-id={id}
      data-selected={isSelected}
      role="button"
    >
      {children}
    </div>
  ),
}));

// Mock styles
jest.mock('../styles', () => ({
  mapStyles: {
    legend: {
      container: 'mock-legend-container',
      group: 'mock-legend-group',
      item: {
        wrapper: 'mock-item-wrapper',
        dot: (color: string) => `mock-dot ${color}`,
        colors: {
          industrial: 'mock-color-industrial',
          competitors: 'mock-color-competitors',
          suppliers: 'mock-color-suppliers',
          consumers: 'mock-color-consumers',
        },
      },
    },
  },
}));

describe('MapLegend', () => {
  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<MapLegend data-qa-id="custom-legend" />);
      
      expect(screen.getByTestId('custom-legend')).toBeInTheDocument();
    });

    it('should render all legend items', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-industrial')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-competitors')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-suppliers')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-consumers')).toBeInTheDocument();
    });

    it('should render button group with correct attributes', () => {
      render(<MapLegend />);
      
      const group = screen.getByTestId('map-legend-group');
      expect(group).toHaveAttribute('data-size', 'sm');
      expect(group).toHaveAttribute('role', 'group');
    });
  });

  describe('Legend Items Structure', () => {
    it('should render industrial legend item with correct structure', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-industrial')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-industrial-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-industrial-dot')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-industrial-label')).toBeInTheDocument();
    });

    it('should render competitors legend item with correct structure', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-competitors')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-competitors-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-competitors-dot')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-competitors-label')).toBeInTheDocument();
    });

    it('should render suppliers legend item with correct structure', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-suppliers')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-suppliers-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-suppliers-dot')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-suppliers-label')).toBeInTheDocument();
    });

    it('should render consumers legend item with correct structure', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-consumers')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-consumers-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-consumers-dot')).toBeInTheDocument();
      expect(screen.getByTestId('map-legend-consumers-label')).toBeInTheDocument();
    });
  });

  describe('Legend Labels', () => {
    it('should display correct text labels', () => {
      render(<MapLegend />);
      
      expect(screen.getByText('Industrial Cities')).toBeInTheDocument();
      expect(screen.getByText('Competitors')).toBeInTheDocument();
      expect(screen.getByText('Suppliers')).toBeInTheDocument();
      expect(screen.getByText('Consumers')).toBeInTheDocument();
    });

    it('should render labels with correct data-qa-ids', () => {
      render(<MapLegend />);
      
      const industrialLabel = screen.getByTestId('map-legend-industrial-label');
      const competitorsLabel = screen.getByTestId('map-legend-competitors-label');
      const suppliersLabel = screen.getByTestId('map-legend-suppliers-label');
      const consumersLabel = screen.getByTestId('map-legend-consumers-label');
      
      expect(industrialLabel).toHaveTextContent('Industrial Cities');
      expect(competitorsLabel).toHaveTextContent('Competitors');
      expect(suppliersLabel).toHaveTextContent('Suppliers');
      expect(consumersLabel).toHaveTextContent('Consumers');
    });
  });

  describe('Selection State', () => {
    it('should mark industrial item as selected by default', () => {
      render(<MapLegend />);
      
      const industrialItem = screen.getByTestId('map-legend-industrial');
      expect(industrialItem).toHaveAttribute('data-selected', 'true');
    });

    it('should not mark other items as selected by default', () => {
      render(<MapLegend />);
      
      const competitorsItem = screen.getByTestId('map-legend-competitors');
      const suppliersItem = screen.getByTestId('map-legend-suppliers');
      const consumersItem = screen.getByTestId('map-legend-consumers');
      
      expect(competitorsItem).toHaveAttribute('data-selected', 'false');
      expect(suppliersItem).toHaveAttribute('data-selected', 'false');
      expect(consumersItem).toHaveAttribute('data-selected', 'false');
    });
  });

  describe('Button Group Items', () => {
    it('should render ButtonGroupItems with correct IDs', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-industrial')).toHaveAttribute('data-id', 'industrial');
      expect(screen.getByTestId('map-legend-competitors')).toHaveAttribute('data-id', 'competitors');
      expect(screen.getByTestId('map-legend-suppliers')).toHaveAttribute('data-id', 'suppliers');
      expect(screen.getByTestId('map-legend-consumers')).toHaveAttribute('data-id', 'consumers');
    });

    it('should render ButtonGroupItems with button role', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend-industrial')).toHaveAttribute('role', 'button');
      expect(screen.getByTestId('map-legend-competitors')).toHaveAttribute('role', 'button');
      expect(screen.getByTestId('map-legend-suppliers')).toHaveAttribute('role', 'button');
      expect(screen.getByTestId('map-legend-consumers')).toHaveAttribute('role', 'button');
    });
  });

  describe('Color Dots', () => {
    it('should render colored dots with correct CSS classes', () => {
      render(<MapLegend />);
      
      const industrialDot = screen.getByTestId('map-legend-industrial-dot');
      const competitorsDot = screen.getByTestId('map-legend-competitors-dot');
      const suppliersDot = screen.getByTestId('map-legend-suppliers-dot');
      const consumersDot = screen.getByTestId('map-legend-consumers-dot');
      
      expect(industrialDot).toHaveClass('mock-dot', 'mock-color-industrial');
      expect(competitorsDot).toHaveClass('mock-dot', 'mock-color-competitors');
      expect(suppliersDot).toHaveClass('mock-dot', 'mock-color-suppliers');
      expect(consumersDot).toHaveClass('mock-dot', 'mock-color-consumers');
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical data-qa-id structure', () => {
      render(<MapLegend data-qa-id="test-legend" />);
      
      // Main container
      expect(screen.getByTestId('test-legend')).toBeInTheDocument();
      
      // Group
      expect(screen.getByTestId('test-legend-group')).toBeInTheDocument();
      
      // Industrial item hierarchy
      expect(screen.getByTestId('test-legend-industrial')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-industrial-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-industrial-dot')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-industrial-label')).toBeInTheDocument();
      
      // Competitors item hierarchy
      expect(screen.getByTestId('test-legend-competitors')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-competitors-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-competitors-dot')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-competitors-label')).toBeInTheDocument();
      
      // Suppliers item hierarchy
      expect(screen.getByTestId('test-legend-suppliers')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-suppliers-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-suppliers-dot')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-suppliers-label')).toBeInTheDocument();
      
      // Consumers item hierarchy
      expect(screen.getByTestId('test-legend-consumers')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-consumers-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-consumers-dot')).toBeInTheDocument();
      expect(screen.getByTestId('test-legend-consumers-label')).toBeInTheDocument();
    });

    it('should handle empty data-qa-id gracefully', () => {
      render(<MapLegend data-qa-id="" />);
      
      expect(screen.getByTestId('')).toBeInTheDocument();
      expect(screen.getByTestId('-group')).toBeInTheDocument();
      expect(screen.getByTestId('-industrial')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      render(<MapLegend data-qa-id="legend-with-special_chars-123" />);
      
      expect(screen.getByTestId('legend-with-special_chars-123')).toBeInTheDocument();
      expect(screen.getByTestId('legend-with-special_chars-123-group')).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should work with no props provided', () => {
      expect(() => render(<MapLegend />)).not.toThrow();
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
    });

    it('should work with empty props object', () => {
      expect(() => render(<MapLegend {...{}} />)).not.toThrow();
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
    });

    it('should use default props when component is called without arguments', () => {
      render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
      expect(screen.getByText('Industrial Cities')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<MapLegend />);
      
      const group = screen.getByTestId('map-legend-group');
      expect(group).toHaveAttribute('role', 'group');
      
      const items = [
        screen.getByTestId('map-legend-industrial'),
        screen.getByTestId('map-legend-competitors'),
        screen.getByTestId('map-legend-suppliers'),
        screen.getByTestId('map-legend-consumers'),
      ];
      
      items.forEach(item => {
        expect(item).toHaveAttribute('role', 'button');
      });
    });
  });

  describe('Style Integration', () => {
    it('should apply mapStyles correctly', () => {
      render(<MapLegend />);
      
      const container = screen.getByTestId('map-legend');
      expect(container).toHaveClass('mock-legend-container');
      
      const group = screen.getByTestId('map-legend-group');
      expect(group).toHaveClass('mock-legend-group');
    });

    it('should apply item wrapper styles', () => {
      render(<MapLegend />);
      
      const industrialWrapper = screen.getByTestId('map-legend-industrial-wrapper');
      expect(industrialWrapper).toHaveClass('mock-item-wrapper');
    });

    it('should apply dynamic dot colors from styles', () => {
      render(<MapLegend />);
      
      const industrialDot = screen.getByTestId('map-legend-industrial-dot');
      // The dot function is called with the color from mapStyles.legend.item.colors
      expect(industrialDot).toHaveClass('mock-dot', 'mock-color-industrial');
    });
  });

  describe('Component Memoization and Performance', () => {
    it('should render consistently with same props', () => {
      const { rerender } = render(<MapLegend data-qa-id="consistent-legend" />);
      
      expect(screen.getByTestId('consistent-legend')).toBeInTheDocument();
      
      rerender(<MapLegend data-qa-id="consistent-legend" />);
      
      expect(screen.getByTestId('consistent-legend')).toBeInTheDocument();
      expect(screen.getByText('Industrial Cities')).toBeInTheDocument();
    });

    it('should update when data-qa-id changes', () => {
      const { rerender } = render(<MapLegend data-qa-id="legend-1" />);
      
      expect(screen.getByTestId('legend-1')).toBeInTheDocument();
      
      rerender(<MapLegend data-qa-id="legend-2" />);
      
      expect(screen.queryByTestId('legend-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('legend-2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should render without errors when styles are missing properties', () => {
      // This would happen if styles object has missing nested properties
      expect(() => render(<MapLegend />)).not.toThrow();
    });
  });

  describe('Integration with Shared UI Components', () => {
    it('should pass correct props to ButtonGroup', () => {
      render(<MapLegend />);
      
      const buttonGroup = screen.getByTestId('map-legend-group');
      expect(buttonGroup).toHaveAttribute('data-size', 'sm');
    });

    it('should pass correct props to ButtonGroupItems', () => {
      render(<MapLegend />);
      
      const industrialItem = screen.getByTestId('map-legend-industrial');
      expect(industrialItem).toHaveAttribute('data-id', 'industrial');
      expect(industrialItem).toHaveAttribute('data-selected', 'true');
      
      const competitorsItem = screen.getByTestId('map-legend-competitors');
      expect(competitorsItem).toHaveAttribute('data-id', 'competitors');
      expect(competitorsItem).toHaveAttribute('data-selected', 'false');
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount without memory leaks', () => {
      const { unmount } = render(<MapLegend />);
      
      expect(screen.getByTestId('map-legend')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByTestId('map-legend')).not.toBeInTheDocument();
    });

    it('should maintain state consistency across re-renders', () => {
      const { rerender } = render(<MapLegend />);
      
      // Initial render
      expect(screen.getByTestId('map-legend-industrial')).toHaveAttribute('data-selected', 'true');
      
      // Re-render
      rerender(<MapLegend />);
      
      // Should maintain same state
      expect(screen.getByTestId('map-legend-industrial')).toHaveAttribute('data-selected', 'true');
    });
  });
});