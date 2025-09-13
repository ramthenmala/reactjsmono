import React from 'react';
import { render, screen } from '@testing-library/react';
import { DistrictMapSection } from '@/features/explore/components/PropertyDetail/DistrictMapSection';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('../../UI/StatCard', () => ({
  StatCard: ({ 
    label, 
    value, 
    icon,
    variant,
    'data-qa-id': dataQaId 
  }: { 
    label: string; 
    value: any; 
    icon?: React.ReactNode;
    variant?: string;
    'data-qa-id'?: string;
  }) => (
    <div 
      data-qa-id={dataQaId}
      data-label={label}
      data-value={value || ''}
      data-variant={variant}
    >
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
      Mocked StatCard: {label} - {value}
    </div>
  ),
}));

jest.mock('../../Charts/BarChart', () => ({
  BarChart: ({ 
    data,
    'data-qa-id': dataQaId 
  }: { 
    data: any[];
    'data-qa-id'?: string;
  }) => (
    <div 
      data-qa-id={dataQaId}
      data-chart-items={data.length}
    >
      Mocked BarChart with {data.length} items
    </div>
  ),
}));

jest.mock('../../../utils/propertyDetailUtils', () => ({
  propertyDetailStyles: {
    sectionTitleSmall: 'section-title-small',
    card: {
      container: 'card-container',
      withPadding: 'card-with-padding',
    },
    grid: {
      twoColumns: 'grid-two-columns',
    },
    text: {
      cardSubtitle: 'card-subtitle',
    },
  },
}));

describe('DistrictMapSection', () => {
  const defaultProps = {
    mapInfo: {
      title: 'District Map',
      map: 'https://example.com/map.jpg',
    },
    yearInfo: {
      title: 'Established Year',
      value: 2020,
    },
    districtInfo: {
      title: 'District',
      value: 'Industrial District A',
    },
    industriesInsideGraphInfo: {
      title: 'Industries Inside',
      value: [
        { label: 'Manufacturing', quantity: 45 },
        { label: 'Technology', quantity: 30 },
        { label: 'Logistics', quantity: 25 },
      ],
    },
  };

  const renderComponent = (props = {}) => {
    return render(<DistrictMapSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('district-map-section')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-district-map' });

      expect(screen.getByTestId('custom-district-map')).toBeInTheDocument();
      expect(screen.queryByTestId('district-map-section')).not.toBeInTheDocument();
    });

    it('should render all elements when map is available', () => {
      renderComponent();

      expect(screen.getByTestId('district-map-section-map-container')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-title')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-card')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-image')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-stats')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-industries-chart')).toBeInTheDocument();
    });

    it('should not render map elements when map is null', () => {
      renderComponent({
        mapInfo: {
          title: 'District Map',
          map: null,
        },
      });

      expect(screen.queryByTestId('district-map-section-map-container')).not.toBeInTheDocument();
      expect(screen.queryByTestId('district-map-section-map-title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('district-map-section-map-card')).not.toBeInTheDocument();
      expect(screen.queryByTestId('district-map-section-map-image')).not.toBeInTheDocument();

      // But stats and chart should still be rendered
      expect(screen.getByTestId('district-map-section-stats')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-industries-chart')).toBeInTheDocument();
    });

    it('should render with correct container classes', () => {
      renderComponent();

      const container = screen.getByTestId('district-map-section');
      expect(container).toHaveClass('lg:w-5/12', 'flex', 'flex-col', 'gap-4');
    });
  });

  describe('Map Display', () => {
    it('should display map title', () => {
      renderComponent();

      expect(screen.getByText('District Map')).toBeInTheDocument();
    });

    it('should render map image with correct attributes', () => {
      renderComponent();

      const image = screen.getByTestId('district-map-section-map-image');
      expect(image).toHaveAttribute('src', 'https://example.com/map.jpg');
      expect(image).toHaveAttribute('alt', 'District map');
      expect(image).toHaveClass('w-full', 'h-auto');
    });

    it('should apply correct styling to map elements', () => {
      renderComponent();

      const title = screen.getByTestId('district-map-section-map-title');
      const card = screen.getByTestId('district-map-section-map-card');

      expect(title).toHaveClass('section-title-small');
      expect(card).toHaveClass('card-container');
    });

    it('should handle empty map URL', () => {
      renderComponent({
        mapInfo: {
          title: 'District Map',
          map: '',
        },
      });

      expect(screen.queryByTestId('district-map-section-map-container')).not.toBeInTheDocument();
    });

    it('should handle different map URL formats', () => {
      const mapUrls = [
        'https://example.com/image.jpg',
        '/relative/path/image.png',
        'data:image/svg+xml;base64,PHN2Zw==',
      ];

      mapUrls.forEach((url, index) => {
        const { unmount } = render(
          <DistrictMapSection
            {...defaultProps}
            mapInfo={{
              title: `Map ${index}`,
              map: url,
            }}
            data-qa-id={`test-${index}`}
          />
        );

        const image = screen.getByTestId(`test-${index}-map-image`);
        expect(image).toHaveAttribute('src', url);

        unmount();
      });
    });
  });

  describe('Statistics Display', () => {
    it('should render year and district statistics', () => {
      renderComponent();

      const yearStat = screen.getByTestId('district-map-section-year-stat');
      const districtStat = screen.getByTestId('district-map-section-district-stat');

      expect(yearStat).toBeInTheDocument();
      expect(yearStat).toHaveAttribute('data-label', 'Established Year');
      expect(yearStat).toHaveAttribute('data-value', '2020');
      expect(yearStat).toHaveAttribute('data-variant', 'large');

      expect(districtStat).toBeInTheDocument();
      expect(districtStat).toHaveAttribute('data-label', 'District');
      expect(districtStat).toHaveAttribute('data-value', 'Industrial District A');
      expect(districtStat).toHaveAttribute('data-variant', 'regular');
    });

    it('should handle null values in statistics', () => {
      renderComponent({
        yearInfo: {
          title: 'Established Year',
          value: null,
        },
        districtInfo: {
          title: 'District',
          value: null,
        },
      });

      const yearStat = screen.getByTestId('district-map-section-year-stat');
      const districtStat = screen.getByTestId('district-map-section-district-stat');

      expect(yearStat).toHaveAttribute('data-value', '');
      expect(districtStat).toHaveAttribute('data-value', '');
    });

    it('should apply correct grid styling to stats', () => {
      renderComponent();

      const statsContainer = screen.getByTestId('district-map-section-stats');
      expect(statsContainer).toHaveClass('grid-two-columns');
    });
  });

  describe('Industries Chart', () => {
    it('should render industries chart with title', () => {
      renderComponent();

      const chartContainer = screen.getByTestId('district-map-section-industries-chart');
      const chartTitle = screen.getByTestId('district-map-section-industries-title');
      const chart = screen.getByTestId('district-map-section-industries-chart-component');

      expect(chartContainer).toBeInTheDocument();
      expect(chartTitle).toHaveTextContent('Industries Inside');
      expect(chart).toBeInTheDocument();
      expect(chart).toHaveAttribute('data-chart-items', '3');
    });

    it('should handle empty chart data', () => {
      renderComponent({
        industriesInsideGraphInfo: {
          title: 'Industries Inside',
          value: [],
        },
      });

      const chart = screen.getByTestId('district-map-section-industries-chart-component');
      expect(chart).toHaveAttribute('data-chart-items', '0');
    });

    it('should handle null chart data', () => {
      renderComponent({
        industriesInsideGraphInfo: {
          title: 'Industries Inside',
          value: null as any,
        },
      });

      const chart = screen.getByTestId('district-map-section-industries-chart-component');
      expect(chart).toHaveAttribute('data-chart-items', '0');
    });

    it('should apply correct styling to chart elements', () => {
      renderComponent();

      const chartContainer = screen.getByTestId('district-map-section-industries-chart');
      const chartTitle = screen.getByTestId('district-map-section-industries-title');

      expect(chartContainer).toHaveClass('card-with-padding');
      expect(chartTitle).toHaveClass('card-subtitle');
    });

    it('should handle large datasets', () => {
      const largeDataset = Array.from({ length: 20 }, (_, i) => ({
        label: `Industry ${i + 1}`,
        quantity: Math.floor(Math.random() * 100) + 1,
      }));

      renderComponent({
        industriesInsideGraphInfo: {
          title: 'Industries Inside',
          value: largeDataset,
        },
      });

      const chart = screen.getByTestId('district-map-section-industries-chart-component');
      expect(chart).toHaveAttribute('data-chart-items', '20');
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('district-map-section')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-container')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-title')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-card')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-map-image')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-stats')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-year-stat')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-district-stat')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-industries-chart')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-industries-title')).toBeInTheDocument();
      expect(screen.getByTestId('district-map-section-industries-chart-component')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-district' });

      expect(screen.getByTestId('custom-district')).toBeInTheDocument();
      expect(screen.getByTestId('custom-district-map-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-district-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-district-year-stat')).toBeInTheDocument();
      expect(screen.getByTestId('custom-district-district-stat')).toBeInTheDocument();
      expect(screen.getByTestId('custom-district-industries-chart')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'district-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-stats`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-industries-chart`)).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing optional properties', () => {
      const minimalProps = {
        mapInfo: { title: 'Map', map: null },
        yearInfo: { title: 'Year', value: null },
        districtInfo: { title: 'District', value: null },
        industriesInsideGraphInfo: { title: 'Industries', value: [] },
      };

      expect(() => {
        renderComponent(minimalProps);
      }).not.toThrow();

      expect(screen.getByTestId('district-map-section')).toBeInTheDocument();
    });

    it('should handle undefined nested objects', () => {
      expect(() => {
        renderComponent({
          mapInfo: undefined,
          yearInfo: undefined,
          districtInfo: undefined,
          industriesInsideGraphInfo: undefined,
        } as any);
      }).not.toThrow();
    });

    it('should handle malformed chart data', () => {
      const malformedData = [
        { label: 'Valid', quantity: 10 },
        { label: null, quantity: null },
        { label: '', quantity: 0 },
        {} as any,
        null as any,
      ];

      renderComponent({
        industriesInsideGraphInfo: {
          title: 'Industries Inside',
          value: malformedData,
        },
      });

      const chart = screen.getByTestId('district-map-section-industries-chart-component');
      expect(chart).toHaveAttribute('data-chart-items', '5');
    });

    it('should handle very long text content', () => {
      const longTitle = 'A'.repeat(200);
      const longValue = 'B'.repeat(300);

      renderComponent({
        mapInfo: {
          title: longTitle,
          map: 'https://example.com/map.jpg',
        },
        districtInfo: {
          title: 'District',
          value: longValue,
        },
      });

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      const districtStat = screen.getByTestId('district-map-section-district-stat');
      expect(districtStat).toHaveAttribute('data-value', longValue);
    });

    it('should handle special characters in content', () => {
      renderComponent({
        mapInfo: {
          title: 'Map with émojis 🗺️ and spéciàl chärs',
          map: 'https://example.com/map.jpg',
        },
        districtInfo: {
          title: 'District',
          value: 'District with HTML <tags> & entities &amp; symbols ©®™',
        },
      });

      expect(screen.getByText('Map with émojis 🗺️ and spéciàl chärs')).toBeInTheDocument();
      
      const districtStat = screen.getByTestId('district-map-section-district-stat');
      expect(districtStat).toHaveAttribute('data-value', 'District with HTML <tags> & entities &amp; symbols ©®™');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('district-map-section');
      const mapContainer = screen.getByTestId('district-map-section-map-container');
      const stats = screen.getByTestId('district-map-section-stats');
      const chart = screen.getByTestId('district-map-section-industries-chart');

      expect(container).toContainElement(mapContainer);
      expect(container).toContainElement(stats);
      expect(container).toContainElement(chart);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const container = screen.getByTestId('district-map-section');
      const children = Array.from(container.children);

      expect(children).toHaveLength(3); // map, stats, chart

      const mapIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'district-map-section-map-container'
      );
      const statsIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'district-map-section-stats'
      );
      const chartIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'district-map-section-industries-chart'
      );

      expect(mapIndex).toBe(0);
      expect(statsIndex).toBe(1);
      expect(chartIndex).toBe(2);
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('district-map-section')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <DistrictMapSection
            {...defaultProps}
            mapInfo={{
              title: `Dynamic Map ${i}`,
              map: `https://example.com/map${i}.jpg`,
            }}
            data-qa-id={`dynamic-district-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Dynamic Map 9')).toBeInTheDocument();
    });

    it('should handle large chart datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        label: `Industry ${i + 1}`,
        quantity: Math.floor(Math.random() * 100) + 1,
      }));

      const startTime = performance.now();
      
      renderComponent({
        industriesInsideGraphInfo: {
          title: 'Industries Inside',
          value: largeDataset,
        },
      });

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      
      const chart = screen.getByTestId('district-map-section-industries-chart-component');
      expect(chart).toHaveAttribute('data-chart-items', '100');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('district-map-section')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('district-map-section')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('District Map')).toBeInTheDocument();

      rerender(
        <DistrictMapSection
          {...defaultProps}
          mapInfo={{
            title: 'Updated Map Title',
            map: 'https://example.com/updated-map.jpg',
          }}
        />
      );

      expect(screen.getByText('Updated Map Title')).toBeInTheDocument();
      expect(screen.queryByText('District Map')).not.toBeInTheDocument();
    });
  });
});