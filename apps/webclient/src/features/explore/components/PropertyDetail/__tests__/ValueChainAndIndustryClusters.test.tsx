import React from 'react';
import { render, screen } from '@testing-library/react';
import ValueChainAndIndustryClusters from '@/features/explore/components/PropertyDetail/ValueChainAndIndustryClusters';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  __esModule: true,
  default: ({ label, value, icon, variant, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
      {variant && <div data-qa-id={`${dataQaId}-variant`}>{variant}</div>}
    </div>
  ),
}));

jest.mock('@compass/shared-ui', () => ({
  Badge: ({ color, size, className, children, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-color={color}
      data-size={size}
      className={className}
    >
      {children}
    </div>
  ),
  Icon: ({ name, className, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId || `icon-${name}`}
      data-icon-name={name}
      className={className}
    >
      {name}
    </div>
  ),
}));

describe('ValueChainAndIndustryClusters', () => {
  const defaultProps = {
    valueParks: {
      title: 'Value Parks',
      value: ['Industrial Park A', 'Technology Hub B', 'Manufacturing Zone C'],
    },
    organicClusters: {
      title: 'Organic Clusters',
      value: ['Automotive Cluster', 'Electronics Cluster'],
    },
    knowHowAndInnovation: {
      title: 'Innovation Index',
      value: 85,
    },
  };

  const renderComponent = (props = {}) => {
    return render(<ValueChainAndIndustryClusters {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-value-chain' });

      expect(screen.getByTestId('custom-value-chain')).toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-grid')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-value-parks')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-organic-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-innovation')).toBeInTheDocument();
    });
  });

  describe('Value Parks Section', () => {
    it('should display value parks with correct data', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-value-parks-label')).toHaveTextContent('Value Parks');
      expect(screen.getByTestId('value-chain-clusters-value-parks-badges')).toBeInTheDocument();
    });

    it('should render individual value park badges', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-value-park-0')).toHaveTextContent('Industrial Park A');
      expect(screen.getByTestId('value-chain-clusters-value-park-1')).toHaveTextContent('Technology Hub B');
      expect(screen.getByTestId('value-chain-clusters-value-park-2')).toHaveTextContent('Manufacturing Zone C');
    });

    it('should render value park badges with correct props', () => {
      renderComponent();

      const badges = [0, 1, 2].map(index => screen.getByTestId(`value-chain-clusters-value-park-${index}`));
      
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('data-color', 'brand');
        expect(badge).toHaveAttribute('data-size', 'lg');
        expect(badge).toHaveClass('px-6');
      });
    });

    it('should render tree icon for value parks', () => {
      renderComponent();

      expect(screen.getByTestId('icon-tree')).toBeInTheDocument();
      expect(screen.getByTestId('icon-tree')).toHaveAttribute('data-icon-name', 'tree');
      expect(screen.getByTestId('icon-tree')).toHaveClass('size-11');
    });

    it('should not render value parks section when null', () => {
      renderComponent({ valueParks: null });

      expect(screen.queryByTestId('value-chain-clusters-value-parks')).not.toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters-value-parks-badges')).not.toBeInTheDocument();
    });

    it('should handle empty value parks array', () => {
      renderComponent({ valueParks: { title: 'Empty Parks', value: [] } });

      expect(screen.getByTestId('value-chain-clusters-value-parks-label')).toHaveTextContent('Empty Parks');
      expect(screen.getByTestId('value-chain-clusters-value-parks-badges')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-value-parks-badges')).toBeEmptyDOMElement();
    });
  });

  describe('Organic Clusters Section', () => {
    it('should display organic clusters with correct data', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-organic-clusters-label')).toHaveTextContent('Organic Clusters');
      expect(screen.getByTestId('value-chain-clusters-organic-clusters-badges')).toBeInTheDocument();
    });

    it('should render individual organic cluster badges', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-organic-cluster-0')).toHaveTextContent('Automotive Cluster');
      expect(screen.getByTestId('value-chain-clusters-organic-cluster-1')).toHaveTextContent('Electronics Cluster');
    });

    it('should render organic cluster badges with correct props', () => {
      renderComponent();

      const badges = [0, 1].map(index => screen.getByTestId(`value-chain-clusters-organic-cluster-${index}`));
      
      badges.forEach(badge => {
        expect(badge).toHaveAttribute('data-color', 'brand');
        expect(badge).toHaveAttribute('data-size', 'lg');
        expect(badge).toHaveClass('px-6');
      });
    });

    it('should render cluster icon for organic clusters', () => {
      renderComponent();

      expect(screen.getByTestId('icon-cluster')).toBeInTheDocument();
      expect(screen.getByTestId('icon-cluster')).toHaveAttribute('data-icon-name', 'cluster');
      expect(screen.getByTestId('icon-cluster')).toHaveClass('size-11');
    });

    it('should not render organic clusters section when null', () => {
      renderComponent({ organicClusters: null });

      expect(screen.queryByTestId('value-chain-clusters-organic-clusters')).not.toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters-organic-clusters-badges')).not.toBeInTheDocument();
    });

    it('should handle single organic cluster', () => {
      renderComponent({ 
        organicClusters: { 
          title: 'Single Cluster', 
          value: ['Healthcare Cluster'] 
        } 
      });

      expect(screen.getByTestId('value-chain-clusters-organic-cluster-0')).toHaveTextContent('Healthcare Cluster');
      expect(screen.queryByTestId('value-chain-clusters-organic-cluster-1')).not.toBeInTheDocument();
    });
  });

  describe('Innovation Section', () => {
    it('should display innovation with correct data', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-innovation-label')).toHaveTextContent('Innovation Index');
      expect(screen.getByTestId('value-chain-clusters-innovation-value')).toHaveTextContent('85');
    });

    it('should render innovation with large variant', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-innovation-variant')).toHaveTextContent('large');
    });

    it('should render innovation icon', () => {
      renderComponent();

      expect(screen.getByTestId('icon-innovation')).toBeInTheDocument();
      expect(screen.getByTestId('icon-innovation')).toHaveAttribute('data-icon-name', 'innovation');
      expect(screen.getByTestId('icon-innovation')).toHaveClass('size-11');
    });

    it('should not render innovation section when null', () => {
      renderComponent({ knowHowAndInnovation: null });

      expect(screen.queryByTestId('value-chain-clusters-innovation')).not.toBeInTheDocument();
    });

    it('should handle zero innovation value', () => {
      renderComponent({ knowHowAndInnovation: { title: 'Innovation Score', value: 0 } });

      expect(screen.getByTestId('value-chain-clusters-innovation-value')).toHaveTextContent('0');
    });

    it('should handle null innovation value', () => {
      renderComponent({ knowHowAndInnovation: { title: 'Innovation Score', value: null } });

      expect(screen.getByTestId('value-chain-clusters-innovation-value')).toBeEmptyDOMElement();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-grid')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-value-parks')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-organic-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-innovation')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-chain' });

      expect(screen.getByTestId('custom-chain')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chain-grid')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chain-value-parks')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chain-organic-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('custom-chain-innovation')).toBeInTheDocument();
    });

    it('should handle badge indexing correctly', () => {
      renderComponent({ 'data-qa-id': 'test-chain' });

      expect(screen.getByTestId('test-chain-value-park-0')).toBeInTheDocument();
      expect(screen.getByTestId('test-chain-value-park-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-chain-value-park-2')).toBeInTheDocument();
      expect(screen.getByTestId('test-chain-organic-cluster-0')).toBeInTheDocument();
      expect(screen.getByTestId('test-chain-organic-cluster-1')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'value-chain_with-special.chars123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-grid`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-value-parks`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-grid"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-value-parks"]')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper grid layout classes', () => {
      renderComponent();

      const container = screen.getByTestId('value-chain-clusters');
      const grid = screen.getByTestId('value-chain-clusters-grid');

      expect(container).toHaveClass('flex', 'flex-col', 'gap-4');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
    });

    it('should render components in correct grid structure', () => {
      renderComponent();

      const grid = screen.getByTestId('value-chain-clusters-grid');
      const valueParks = screen.getByTestId('value-chain-clusters-value-parks');
      const organicClusters = screen.getByTestId('value-chain-clusters-organic-clusters');
      const innovation = screen.getByTestId('value-chain-clusters-innovation');

      expect(grid).toContainElement(valueParks);
      expect(grid).toContainElement(organicClusters);
      expect(grid).toContainElement(innovation);
    });

    it('should maintain responsive behavior with missing sections', () => {
      renderComponent({ valueParks: null });

      const grid = screen.getByTestId('value-chain-clusters-grid');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
      expect(screen.queryByTestId('value-chain-clusters-value-parks')).not.toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-organic-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-innovation')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle all null sections gracefully', () => {
      renderComponent({
        valueParks: null,
        organicClusters: null,
        knowHowAndInnovation: null,
      });

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters-value-parks')).not.toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters-organic-clusters')).not.toBeInTheDocument();
      expect(screen.queryByTestId('value-chain-clusters-innovation')).not.toBeInTheDocument();
    });

    it('should handle empty arrays in all sections', () => {
      renderComponent({
        valueParks: { title: 'Empty Parks', value: [] },
        organicClusters: { title: 'Empty Clusters', value: [] },
      });

      expect(screen.getByTestId('value-chain-clusters-value-parks-badges')).toBeEmptyDOMElement();
      expect(screen.getByTestId('value-chain-clusters-organic-clusters-badges')).toBeEmptyDOMElement();
    });

    it('should handle very long array values', () => {
      const longValueParks = Array.from({ length: 20 }, (_, i) => `Park ${i + 1}`);
      const longOrganicClusters = Array.from({ length: 15 }, (_, i) => `Cluster ${i + 1}`);

      renderComponent({
        valueParks: { title: 'Many Parks', value: longValueParks },
        organicClusters: { title: 'Many Clusters', value: longOrganicClusters },
      });

      expect(screen.getByTestId('value-chain-clusters-value-park-0')).toHaveTextContent('Park 1');
      expect(screen.getByTestId('value-chain-clusters-value-park-19')).toHaveTextContent('Park 20');
      expect(screen.getByTestId('value-chain-clusters-organic-cluster-14')).toHaveTextContent('Cluster 15');
    });

    it('should handle special characters in array values', () => {
      renderComponent({
        valueParks: {
          title: 'Special Parks',
          value: ['Park with & special chars', 'Park (2024)', 'Park @#$%']
        },
      });

      expect(screen.getByTestId('value-chain-clusters-value-park-0')).toHaveTextContent('Park with & special chars');
      expect(screen.getByTestId('value-chain-clusters-value-park-1')).toHaveTextContent('Park (2024)');
      expect(screen.getByTestId('value-chain-clusters-value-park-2')).toHaveTextContent('Park @#$%');
    });

    it('should handle numeric innovation values', () => {
      const numericValues = [0, 25, 50, 75, 100, 999];

      numericValues.forEach((value, index) => {
        const { unmount } = render(
          <ValueChainAndIndustryClusters
            {...defaultProps}
            knowHowAndInnovation={{ title: 'Innovation', value }}
            data-qa-id={`test-${index}`}
          />
        );

        expect(screen.getByTestId(`test-${index}-innovation-value`)).toHaveTextContent(value.toString());
        unmount();
      });
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(100);
      
      renderComponent({
        valueParks: { title: longTitle, value: ['Park A'] },
        organicClusters: { title: longTitle, value: ['Cluster A'] },
        knowHowAndInnovation: { title: longTitle, value: 50 },
      });

      expect(screen.getByTestId('value-chain-clusters-value-parks-label')).toHaveTextContent(longTitle);
      expect(screen.getByTestId('value-chain-clusters-organic-clusters-label')).toHaveTextContent(longTitle);
      expect(screen.getByTestId('value-chain-clusters-innovation-label')).toHaveTextContent(longTitle);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('value-chain-clusters')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('value-chain-clusters-value-park-0')).toHaveTextContent('Industrial Park A');

      rerender(
        <ValueChainAndIndustryClusters
          {...defaultProps}
          valueParks={{ title: 'Updated Parks', value: ['New Park X', 'New Park Y'] }}
        />
      );

      expect(screen.getByTestId('value-chain-clusters-value-park-0')).toHaveTextContent('New Park X');
      expect(screen.getByTestId('value-chain-clusters-value-park-1')).toHaveTextContent('New Park Y');
      expect(screen.queryByTestId('value-chain-clusters-value-park-2')).not.toBeInTheDocument();
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialGrid = screen.getByTestId('value-chain-clusters-grid');
      expect(initialGrid.children).toHaveLength(3); // All three sections

      rerender(
        <ValueChainAndIndustryClusters
          {...defaultProps}
          knowHowAndInnovation={{ title: 'Updated Innovation', value: 95 }}
        />
      );

      const updatedGrid = screen.getByTestId('value-chain-clusters-grid');
      expect(updatedGrid).toBeInTheDocument();
      expect(updatedGrid.children).toHaveLength(3); // Structure remains
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <ValueChainAndIndustryClusters
            {...defaultProps}
            knowHowAndInnovation={{ title: 'Innovation', value: i * 10 }}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('value-chain-clusters-innovation-value')).toHaveTextContent('90');
    });

    it('should handle large badge arrays efficiently', () => {
      const largeBadgeArray = Array.from({ length: 100 }, (_, i) => `Item ${i}`);

      const startTime = performance.now();
      renderComponent({
        valueParks: { title: 'Many Parks', value: largeBadgeArray },
        organicClusters: { title: 'Many Clusters', value: largeBadgeArray },
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('value-chain-clusters-value-park-99')).toHaveTextContent('Item 99');
    });
  });

  describe('Accessibility', () => {
    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('value-chain-clusters');
      const grid = screen.getByTestId('value-chain-clusters-grid');

      expect(container).toContainElement(grid);
      expect(grid).toContainElement(screen.getByTestId('value-chain-clusters-value-parks'));
      expect(grid).toContainElement(screen.getByTestId('value-chain-clusters-organic-clusters'));
      expect(grid).toContainElement(screen.getByTestId('value-chain-clusters-innovation'));
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('value-chain-clusters'),
        screen.getByTestId('value-chain-clusters-grid'),
        screen.getByTestId('value-chain-clusters-value-parks'),
        screen.getByTestId('value-chain-clusters-organic-clusters'),
        screen.getByTestId('value-chain-clusters-innovation'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('should handle keyboard navigation appropriately', () => {
      renderComponent();

      const badges = [
        screen.getByTestId('value-chain-clusters-value-park-0'),
        screen.getByTestId('value-chain-clusters-value-park-1'),
        screen.getByTestId('value-chain-clusters-organic-cluster-0'),
      ];

      badges.forEach(badge => {
        expect(badge).toBeVisible();
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IValueChainAndIndustryClusters', () => {
      expect(() => {
        render(
          <ValueChainAndIndustryClusters
            valueParks={{ title: 'Test Parks', value: ['Park 1'] }}
            organicClusters={{ title: 'Test Clusters', value: ['Cluster 1'] }}
            knowHowAndInnovation={{ title: 'Innovation', value: 75 }}
            data-qa-id="test-value-chain"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <ValueChainAndIndustryClusters
            valueParks={null}
            organicClusters={null}
            knowHowAndInnovation={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <ValueChainAndIndustryClusters
            {...defaultProps}
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('value-chain-clusters')).toBeInTheDocument();
    });
  });

  describe('Integration with StatCard, Badge, and Icon', () => {
    it('should pass correct props to StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-value-parks')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-organic-clusters')).toBeInTheDocument();
      expect(screen.getByTestId('value-chain-clusters-innovation')).toBeInTheDocument();
    });

    it('should embed Badges correctly within StatCard values', () => {
      renderComponent();

      const valueParksCard = screen.getByTestId('value-chain-clusters-value-parks');
      const organicClustersCard = screen.getByTestId('value-chain-clusters-organic-clusters');

      expect(valueParksCard).toContainElement(screen.getByTestId('value-chain-clusters-value-park-0'));
      expect(organicClustersCard).toContainElement(screen.getByTestId('value-chain-clusters-organic-cluster-0'));
    });

    it('should render Icons with correct names and classes', () => {
      renderComponent();

      const treeIcon = screen.getByTestId('icon-tree');
      const clusterIcon = screen.getByTestId('icon-cluster');
      const innovationIcon = screen.getByTestId('icon-innovation');

      expect(treeIcon).toHaveAttribute('data-icon-name', 'tree');
      expect(clusterIcon).toHaveAttribute('data-icon-name', 'cluster');
      expect(innovationIcon).toHaveAttribute('data-icon-name', 'innovation');

      [treeIcon, clusterIcon, innovationIcon].forEach(icon => {
        expect(icon).toHaveClass('size-11');
      });
    });

    it('should pass variant prop to innovation StatCard', () => {
      renderComponent();

      expect(screen.getByTestId('value-chain-clusters-innovation-variant')).toHaveTextContent('large');
    });
  });
});