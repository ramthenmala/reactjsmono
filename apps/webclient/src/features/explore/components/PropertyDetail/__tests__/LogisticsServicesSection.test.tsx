import React from 'react';
import { render, screen } from '@testing-library/react';
import { LogisticsServicesSection } from '@/features/explore/components/PropertyDetail/LogisticsServicesSection';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  StatCard: ({ label, value, icon, variant, className, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId} 
      data-variant={variant}
      className={className}
    >
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
    </div>
  ),
}));

jest.mock('@untitledui/icons', () => ({
  Anchor: ({ className }: any) => (
    <div data-qa-id="anchor-icon" className={className}>
      Anchor Icon
    </div>
  ),
  Plane: ({ className }: any) => (
    <div data-qa-id="plane-icon" className={className}>
      Plane Icon
    </div>
  ),
  Train: ({ className }: any) => (
    <div data-qa-id="train-icon" className={className}>
      Train Icon
    </div>
  ),
}));

jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'property_detail.dry_port': 'Dry Port',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../../utils/propertyDetailUtils', () => ({
  formatValueWithUnit: (value: any, unit: any) => {
    if (value && unit) return `${value} ${unit}`;
    if (value) return `${value}`;
    return '';
  },
  propertyDetailStyles: {
    sectionTitleSmall: 'text-2xl font-semibold text-gray-900',
    grid: {
      threeColumns: 'grid grid-cols-1 md:grid-cols-3 gap-4',
    },
    card: {
      withPadding: 'bg-white rounded-lg p-6 shadow-sm border',
    },
    text: {
      cardSubtitle: 'text-lg font-medium text-gray-800 mb-4',
    },
  },
}));

describe('LogisticsServicesSection', () => {
  const defaultProps = {
    logisticsServicesInfo: {
      title: 'Logistics Services',
      value: {
        dryPort: 'Port Authority Complex',
        airport: {
          name: 'International Airport',
          distance: 25,
          unit: 'km',
        },
        railwayStation: {
          name: 'Central Railway Station',
          distance: 5,
          unit: 'km',
        },
        neartestSeaport: {
          name: 'Major Seaport',
          distance: 15,
          unit: 'km',
        },
      },
    },
    nearByLogisticCentersInfo: {
      title: 'Nearby Logistics Centers',
      value: [
        'Distribution Center A',
        'Warehouse Complex B',
        'Logistics Hub C',
      ],
    },
  };

  const renderComponent = (props = {}) => {
    return render(<LogisticsServicesSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-logistics' });

      expect(screen.getByTestId('custom-logistics')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-title')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-services')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-card')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-title')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-list')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderComponent();

      const mainTitle = screen.getByTestId('logistics-services-section-title');
      const centersTitle = screen.getByTestId('logistics-services-section-centers-title');

      expect(mainTitle.tagName).toBe('H2');
      expect(centersTitle.tagName).toBe('H3');
    });
  });

  describe('Content Display', () => {
    it('should display the section title', () => {
      renderComponent();

      expect(screen.getByText('Logistics Services')).toBeInTheDocument();
    });

    it('should display the centers title', () => {
      renderComponent();

      expect(screen.getByText('Nearby Logistics Centers')).toBeInTheDocument();
    });

    it('should display nearby logistics centers', () => {
      renderComponent();

      expect(screen.getByText('Distribution Center A')).toBeInTheDocument();
      expect(screen.getByText('Warehouse Complex B')).toBeInTheDocument();
      expect(screen.getByText('Logistics Hub C')).toBeInTheDocument();
    });

    it('should display dry port when available', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-dry-port')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-dry-port-label')).toHaveTextContent('Dry Port');
      expect(screen.getByTestId('logistics-services-section-dry-port-value')).toHaveTextContent('Port Authority Complex');
    });

    it('should display airport when available', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-airport')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-airport-label')).toHaveTextContent('International Airport');
      expect(screen.getByTestId('logistics-services-section-airport-value')).toHaveTextContent('25 km');
    });

    it('should display railway station when available', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-railway')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-railway-label')).toHaveTextContent('Central Railway Station');
      expect(screen.getByTestId('logistics-services-section-railway-value')).toHaveTextContent('5 km');
    });

    it('should display seaport when available', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-seaport')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-seaport-label')).toHaveTextContent('Major Seaport');
      expect(screen.getByTestId('logistics-services-section-seaport-value')).toHaveTextContent('15 km');
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render dry port when not available', () => {
      const propsWithoutDryPort = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            dryPort: null,
          },
        },
      };

      renderComponent(propsWithoutDryPort);

      expect(screen.queryByTestId('logistics-services-section-dry-port')).not.toBeInTheDocument();
    });

    it('should not render airport when name is not available', () => {
      const propsWithoutAirport = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            airport: {
              name: null,
              distance: 25,
              unit: 'km',
            },
          },
        },
      };

      renderComponent(propsWithoutAirport);

      expect(screen.queryByTestId('logistics-services-section-airport')).not.toBeInTheDocument();
    });

    it('should not render railway when name is not available', () => {
      const propsWithoutRailway = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            railwayStation: {
              name: null,
              distance: 5,
              unit: 'km',
            },
          },
        },
      };

      renderComponent(propsWithoutRailway);

      expect(screen.queryByTestId('logistics-services-section-railway')).not.toBeInTheDocument();
    });

    it('should not render seaport when name is not available', () => {
      const propsWithoutSeaport = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            neartestSeaport: {
              name: null,
              distance: 15,
              unit: 'km',
            },
          },
        },
      };

      renderComponent(propsWithoutSeaport);

      expect(screen.queryByTestId('logistics-services-section-seaport')).not.toBeInTheDocument();
    });

    it('should render airport with distance undefined', () => {
      const propsWithoutDistance = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            airport: {
              name: 'International Airport',
              distance: null,
              unit: 'km',
            },
          },
        },
      };

      renderComponent(propsWithoutDistance);

      expect(screen.getByTestId('logistics-services-section-airport')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-airport-value')).toHaveTextContent('');
    });

    it('should handle empty logistics centers array', () => {
      const propsWithEmptyCenters = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Nearby Logistics Centers',
          value: [],
        },
      };

      renderComponent(propsWithEmptyCenters);

      expect(screen.getByTestId('logistics-services-section-centers-list')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-center-0')).not.toBeInTheDocument();
    });

    it('should handle null logistics centers', () => {
      const propsWithNullCenters = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Nearby Logistics Centers',
          value: null,
        },
      };

      renderComponent(propsWithNullCenters);

      expect(screen.getByTestId('logistics-services-section-centers-list')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-center-0')).not.toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-title')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-services')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-dry-port')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-airport')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-railway')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-seaport')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-card')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-title')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-centers-list')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-logistics' });

      expect(screen.getByTestId('custom-logistics')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-services')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-dry-port')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-airport')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-railway')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-seaport')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-centers-card')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-centers-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-logistics-centers-list')).toBeInTheDocument();
    });

    it('should create indexed data-qa-ids for logistics centers', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-center-0')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-center-1')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-center-2')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'logistics-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-services`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-centers-card`)).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render anchor icon for dry port', () => {
      renderComponent();

      const dryPortCard = screen.getByTestId('logistics-services-section-dry-port');
      expect(dryPortCard).toBeInTheDocument();
      const dryPortIcon = screen.getByTestId('logistics-services-section-dry-port-icon');
      expect(dryPortIcon.querySelector('[data-qa-id="anchor-icon"]')).toBeInTheDocument();
    });

    it('should render plane icon for airport', () => {
      renderComponent();

      const airportCard = screen.getByTestId('logistics-services-section-airport');
      expect(airportCard).toBeInTheDocument();
      expect(screen.getByTestId('plane-icon')).toBeInTheDocument();
    });

    it('should render train icon for railway', () => {
      renderComponent();

      const railwayCard = screen.getByTestId('logistics-services-section-railway');
      expect(railwayCard).toBeInTheDocument();
      expect(screen.getByTestId('train-icon')).toBeInTheDocument();
    });

    it('should render anchor icon for seaport', () => {
      renderComponent();

      const seaportCard = screen.getByTestId('logistics-services-section-seaport');
      expect(seaportCard).toBeInTheDocument();
      const anchorIcons = screen.getAllByTestId('anchor-icon');
      expect(anchorIcons).toHaveLength(2); // Dry port and seaport both use anchor
    });

    it('should apply correct icon styling', () => {
      renderComponent();

      const anchorIcons = screen.getAllByTestId('anchor-icon');
      const planeIcon = screen.getByTestId('plane-icon');
      const trainIcon = screen.getByTestId('train-icon');

      anchorIcons.forEach(icon => {
        expect(icon).toHaveClass('w-6', 'h-6', 'text-[#695DC2]');
      });
      expect(planeIcon).toHaveClass('w-6', 'h-6', 'text-[#695DC2]');
      expect(trainIcon).toHaveClass('w-6', 'h-6', 'text-[#695DC2]');
    });
  });

  describe('StatCard Integration', () => {
    it('should pass correct variant to all StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-dry-port')).toHaveAttribute('data-variant', 'logistics');
      expect(screen.getByTestId('logistics-services-section-airport')).toHaveAttribute('data-variant', 'logistics');
      expect(screen.getByTestId('logistics-services-section-railway')).toHaveAttribute('data-variant', 'logistics');
      expect(screen.getByTestId('logistics-services-section-seaport')).toHaveAttribute('data-variant', 'logistics');
    });

    it('should apply correct className to railway StatCard', () => {
      renderComponent();

      const railwayCard = screen.getByTestId('logistics-services-section-railway');
      expect(railwayCard).toHaveClass('col-span-2', 'md:col-span-1');
    });

    it('should not apply className to other StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-dry-port')).not.toHaveClass('col-span-2', 'md:col-span-1');
      expect(screen.getByTestId('logistics-services-section-airport')).not.toHaveClass('col-span-2', 'md:col-span-1');
      expect(screen.getByTestId('logistics-services-section-seaport')).not.toHaveClass('col-span-2', 'md:col-span-1');
    });
  });

  describe('Formatting and Utilities', () => {
    it('should format distance with unit correctly', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-airport-value')).toHaveTextContent('25 km');
      expect(screen.getByTestId('logistics-services-section-railway-value')).toHaveTextContent('5 km');
      expect(screen.getByTestId('logistics-services-section-seaport-value')).toHaveTextContent('15 km');
    });

    it('should handle missing distance gracefully', () => {
      const propsWithMissingDistance = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            airport: {
              name: 'International Airport',
              distance: null,
              unit: 'km',
            },
          },
        },
      };

      renderComponent(propsWithMissingDistance);

      expect(screen.getByTestId('logistics-services-section-airport-value')).toHaveTextContent('');
    });

    it('should handle missing unit gracefully', () => {
      const propsWithMissingUnit = {
        ...defaultProps,
        logisticsServicesInfo: {
          ...defaultProps.logisticsServicesInfo,
          value: {
            ...defaultProps.logisticsServicesInfo.value,
            airport: {
              name: 'International Airport',
              distance: 25,
              unit: null,
            },
          },
        },
      };

      renderComponent(propsWithMissingUnit);

      expect(screen.getByTestId('logistics-services-section-airport-value')).toHaveTextContent('25');
    });
  });

  describe('Logistics Centers List', () => {
    it('should render all logistics centers with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('logistics-services-section-center-0')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-center-1')).toBeInTheDocument();
      expect(screen.getByTestId('logistics-services-section-center-2')).toBeInTheDocument();

      expect(screen.getByText('Distribution Center A')).toBeInTheDocument();
      expect(screen.getByText('Warehouse Complex B')).toBeInTheDocument();
      expect(screen.getByText('Logistics Hub C')).toBeInTheDocument();
    });

    it('should handle single logistics center', () => {
      const propsWithSingleCenter = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Nearby Logistics Centers',
          value: ['Single Distribution Center'],
        },
      };

      renderComponent(propsWithSingleCenter);

      expect(screen.getByTestId('logistics-services-section-center-0')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-center-1')).not.toBeInTheDocument();
      expect(screen.getByText('Single Distribution Center')).toBeInTheDocument();
    });

    it('should handle many logistics centers', () => {
      const propsWithManyCenters = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Nearby Logistics Centers',
          value: Array.from({ length: 10 }, (_, i) => `Center ${i + 1}`),
        },
      };

      renderComponent(propsWithManyCenters);

      for (let i = 0; i < 10; i++) {
        expect(screen.getByTestId(`logistics-services-section-center-${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Center ${i + 1}`)).toBeInTheDocument();
      }
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('logistics-services-section');
      const title = screen.getByTestId('logistics-services-section-title');
      const services = screen.getByTestId('logistics-services-section-services');
      const centersCard = screen.getByTestId('logistics-services-section-centers-card');

      expect(container).toContainElement(title);
      expect(container).toContainElement(services);
      expect(container).toContainElement(centersCard);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const container = screen.getByTestId('logistics-services-section');
      const children = Array.from(container.children);

      const titleIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'logistics-services-section-title'
      );
      const servicesIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'logistics-services-section-services'
      );
      const centersCardIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'logistics-services-section-centers-card'
      );

      expect(titleIndex).toBeLessThan(servicesIndex);
      expect(servicesIndex).toBeLessThan(centersCardIndex);
    });
  });

  describe('Accessibility', () => {
    it('should provide proper semantic structure with headings', () => {
      renderComponent();

      const mainTitle = screen.getByRole('heading', { level: 2 });
      const centersTitle = screen.getByRole('heading', { level: 3 });

      expect(mainTitle).toBeInTheDocument();
      expect(mainTitle).toHaveTextContent('Logistics Services');
      expect(centersTitle).toBeInTheDocument();
      expect(centersTitle).toHaveTextContent('Nearby Logistics Centers');
    });

    it('should maintain proper heading hierarchy', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(2);
      expect(headings[0].tagName).toBe('H2');
      expect(headings[1].tagName).toBe('H3');
    });

    it('should be accessible for screen readers', () => {
      renderComponent();

      const mainTitle = screen.getByRole('heading', { level: 2 });
      const centersTitle = screen.getByRole('heading', { level: 3 });

      expect(mainTitle).toBeVisible();
      expect(mainTitle).toHaveAccessibleName('Logistics Services');
      expect(centersTitle).toBeVisible();
      expect(centersTitle).toHaveAccessibleName('Nearby Logistics Centers');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle all services being null', () => {
      const propsWithNullServices = {
        ...defaultProps,
        logisticsServicesInfo: {
          title: 'Logistics Services',
          value: {
            dryPort: null,
            airport: { name: null, distance: null, unit: null },
            railwayStation: { name: null, distance: null, unit: null },
            neartestSeaport: { name: null, distance: null, unit: null },
          },
        },
      };

      renderComponent(propsWithNullServices);

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
      expect(screen.getByText('Logistics Services')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-dry-port')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-airport')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-railway')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-seaport')).not.toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      const propsWithEmptyStrings = {
        logisticsServicesInfo: {
          title: '',
          value: {
            dryPort: '',
            airport: { name: '', distance: 0, unit: '' },
            railwayStation: { name: '', distance: 0, unit: '' },
            neartestSeaport: { name: '', distance: 0, unit: '' },
          },
        },
        nearByLogisticCentersInfo: {
          title: '',
          value: [''],
        },
      };

      renderComponent(propsWithEmptyStrings);

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-airport')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-railway')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logistics-services-section-seaport')).not.toBeInTheDocument();
    });

    it('should handle special characters in center names', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Centers with Special Chars',
          value: [
            'Distribution Center & Warehouse',
            'Logistics Hub (24/7)',
            'Port Terminal #5',
          ],
        },
      };

      renderComponent(propsWithSpecialChars);

      expect(screen.getByText('Distribution Center & Warehouse')).toBeInTheDocument();
      expect(screen.getByText('Logistics Hub (24/7)')).toBeInTheDocument();
      expect(screen.getByText('Port Terminal #5')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
    });

    it('should handle large logistics centers list efficiently', () => {
      const propsWithLargeList = {
        ...defaultProps,
        nearByLogisticCentersInfo: {
          title: 'Many Logistics Centers',
          value: Array.from({ length: 50 }, (_, i) => `Logistics Center ${i + 1}`),
        },
      };

      const startTime = performance.now();
      renderComponent(propsWithLargeList);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();
      expect(screen.getByText('Logistics Center 1')).toBeInTheDocument();
      expect(screen.getByText('Logistics Center 50')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('logistics-services-section')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('logistics-services-section')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('Logistics Services')).toBeInTheDocument();

      rerender(
        <LogisticsServicesSection
          {...defaultProps}
          logisticsServicesInfo={{
            title: 'Updated Logistics',
            value: defaultProps.logisticsServicesInfo.value,
          }}
        />
      );

      expect(screen.getByText('Updated Logistics')).toBeInTheDocument();
      expect(screen.queryByText('Logistics Services')).not.toBeInTheDocument();
    });
  });
});