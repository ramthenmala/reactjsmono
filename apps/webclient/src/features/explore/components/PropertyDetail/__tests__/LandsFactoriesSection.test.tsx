import React from 'react';
import { render, screen } from '@testing-library/react';
import { LandsFactoriesSection } from '@/features/explore/components/PropertyDetail/LandsFactoriesSection';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('../../UI/StatCard', () => ({
  StatCard: ({ 
    label, 
    value, 
    variant,
    icon,
    'data-qa-id': dataQaId 
  }: { 
    label: string; 
    value: any; 
    variant?: string;
    icon?: React.ReactNode;
    'data-qa-id'?: string;
  }) => (
    <div 
      data-qa-id={dataQaId}
      data-label={label}
      data-value={value}
      data-variant={variant}
      data-has-icon={!!icon}
    >
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
      Mocked StatCard: {label} - {value}
    </div>
  ),
}));

jest.mock('../../../utils/propertyDetailUtils', () => ({
  formatValueWithUnit: jest.fn((value, unit) => {
    if (value === null || value === undefined) return '';
    if (!unit) return String(value);
    return `${value} ${unit}`;
  }),
  propertyDetailStyles: {
    sectionTitleSmall: 'section-title-small',
    grid: {
      threeColumns: 'grid-three-columns',
      twoColumns: 'grid-two-columns',
    },
  },
}));

jest.mock('@compass/shared-ui', () => ({
  Icon: ({ name }: { name: string }) => <div data-icon-name={name}>Mocked Icon: {name}</div>,
}));

describe('LandsFactoriesSection', () => {
  const defaultProps = {
    title: 'Land and Factories Information',
    totalLand: {
      title: 'Total Land',
      value: 500,
      unit: 'hectares',
    },
    developedLand: {
      title: 'Developed Land',
      value: 300,
      unit: 'hectares',
    },
    undevelopedLand: {
      title: 'Undeveloped Land',
      value: 200,
      unit: 'hectares',
    },
    occupancyRate: {
      title: 'Occupancy Rate',
      value: '85%',
      unit: null,
    },
    percentageOfLogisticLand: {
      title: 'Logistic Land',
      value: 15,
      unit: '%',
    },
    projectsUnderConstruction: {
      title: 'Projects Under Construction',
      value: 12,
    },
    noOfFactories: {
      title: 'Number of Factories',
      value: 45,
    },
    currentWorkforce: {
      title: 'Current Workforce',
      value: 2500,
    },
  };

  const renderComponent = (props = {}) => {
    return render(<LandsFactoriesSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('lands-factories-section')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-lands-section' });

      expect(screen.getByTestId('custom-lands-section')).toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section')).not.toBeInTheDocument();
    });

    it('should render section title', () => {
      renderComponent();

      const title = screen.getByTestId('lands-factories-section-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Land and Factories Information');
      expect(title).toHaveClass('section-title-small');
    });

    it('should render all required grid containers', () => {
      renderComponent();

      expect(screen.getByTestId('lands-factories-section-primary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-secondary-stats')).toBeInTheDocument();
    });

    it('should apply correct grid classes', () => {
      renderComponent();

      const primaryStats = screen.getByTestId('lands-factories-section-primary-stats');
      const secondaryStats = screen.getByTestId('lands-factories-section-secondary-stats');

      expect(primaryStats).toHaveClass('grid-three-columns');
      expect(secondaryStats).toHaveClass('grid-two-columns');
    });
  });

  describe('Primary Statistics Display', () => {
    it('should render all primary statistics when data is available', () => {
      renderComponent();

      expect(screen.getByTestId('lands-factories-section-total-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-developed-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-undeveloped-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-occupancy-rate')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-logistic-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-projects-construction')).toBeInTheDocument();
    });

    it('should call formatValueWithUnit for each statistic', () => {
      const { formatValueWithUnit } = require('../../../utils/propertyDetailUtils');
      renderComponent();

      expect(formatValueWithUnit).toHaveBeenCalledWith(500, 'hectares');
      expect(formatValueWithUnit).toHaveBeenCalledWith(300, 'hectares');
      expect(formatValueWithUnit).toHaveBeenCalledWith(200, 'hectares');
      expect(formatValueWithUnit).toHaveBeenCalledWith('85%', null);
      expect(formatValueWithUnit).toHaveBeenCalledWith(15, '%');
      expect(formatValueWithUnit).toHaveBeenCalledWith(12);
    });

    it('should display correct values for primary statistics', () => {
      renderComponent();

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      const developedLand = screen.getByTestId('lands-factories-section-developed-land');
      const undevelopedLand = screen.getByTestId('lands-factories-section-undeveloped-land');

      expect(totalLand).toHaveAttribute('data-label', 'Total Land');
      expect(totalLand).toHaveAttribute('data-value', '500 hectares');
      expect(developedLand).toHaveAttribute('data-value', '300 hectares');
      expect(undevelopedLand).toHaveAttribute('data-value', '200 hectares');
    });

    it('should render icons for all primary statistics', () => {
      renderComponent();

      const stats = [
        'lands-factories-section-total-land',
        'lands-factories-section-developed-land',
        'lands-factories-section-undeveloped-land',
        'lands-factories-section-occupancy-rate',
        'lands-factories-section-logistic-land',
        'lands-factories-section-projects-construction',
      ];

      stats.forEach(statId => {
        const stat = screen.getByTestId(statId);
        expect(stat).toHaveAttribute('data-has-icon', 'true');
      });
    });

    it('should not render statistics when data is null', () => {
      renderComponent({
        totalLand: null,
        developedLand: null,
        undevelopedLand: null,
      });

      expect(screen.queryByTestId('lands-factories-section-total-land')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section-developed-land')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section-undeveloped-land')).not.toBeInTheDocument();
    });

    it('should handle null values within statistics objects', () => {
      renderComponent({
        totalLand: {
          title: 'Total Land',
          value: null,
          unit: null,
        },
      });

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      expect(totalLand).toHaveAttribute('data-value', '');
    });
  });

  describe('Secondary Statistics Display', () => {
    it('should render secondary statistics with large variant', () => {
      renderComponent();

      const factoriesCount = screen.getByTestId('lands-factories-section-factories-count');
      const currentWorkforce = screen.getByTestId('lands-factories-section-current-workforce');

      expect(factoriesCount).toBeInTheDocument();
      expect(factoriesCount).toHaveAttribute('data-label', 'Number of Factories');
      expect(factoriesCount).toHaveAttribute('data-value', '45');
      expect(factoriesCount).toHaveAttribute('data-variant', 'large');

      expect(currentWorkforce).toBeInTheDocument();
      expect(currentWorkforce).toHaveAttribute('data-label', 'Current Workforce');
      expect(currentWorkforce).toHaveAttribute('data-value', '2500');
      expect(currentWorkforce).toHaveAttribute('data-variant', 'large');
    });

    it('should render icons for secondary statistics', () => {
      renderComponent();

      const factoriesCount = screen.getByTestId('lands-factories-section-factories-count');
      const currentWorkforce = screen.getByTestId('lands-factories-section-current-workforce');

      expect(factoriesCount).toHaveAttribute('data-has-icon', 'true');
      expect(currentWorkforce).toHaveAttribute('data-has-icon', 'true');
    });

    it('should not render secondary statistics when data is null', () => {
      renderComponent({
        noOfFactories: null,
        currentWorkforce: null,
      });

      expect(screen.queryByTestId('lands-factories-section-factories-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section-current-workforce')).not.toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('lands-factories-section')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-title')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-primary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-secondary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-total-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-developed-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-undeveloped-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-occupancy-rate')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-logistic-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-projects-construction')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-factories-count')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-current-workforce')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-lands' });

      expect(screen.getByTestId('custom-lands')).toBeInTheDocument();
      expect(screen.getByTestId('custom-lands-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-lands-primary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-lands-secondary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-lands-total-land')).toBeInTheDocument();
      expect(screen.getByTestId('custom-lands-factories-count')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'lands-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-primary-stats`)).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle minimal props with only title', () => {
      const minimalProps = {
        title: 'Minimal Section',
        totalLand: null,
        developedLand: null,
        undevelopedLand: null,
        occupancyRate: null,
        percentageOfLogisticLand: null,
        projectsUnderConstruction: null,
        noOfFactories: null,
        currentWorkforce: null,
      };

      expect(() => {
        renderComponent(minimalProps);
      }).not.toThrow();

      expect(screen.getByText('Minimal Section')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-primary-stats')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-secondary-stats')).toBeInTheDocument();
    });

    it('should handle missing nested properties', () => {
      const propsWithMissingValues = {
        ...defaultProps,
        totalLand: {
          title: 'Total Land',
          value: undefined,
          unit: undefined,
        } as any,
        developedLand: {
          title: 'Developed Land',
        } as any,
      };

      expect(() => {
        renderComponent(propsWithMissingValues);
      }).not.toThrow();
    });

    it('should handle zero values', () => {
      renderComponent({
        ...defaultProps,
        totalLand: {
          title: 'Total Land',
          value: 0,
          unit: 'hectares',
        },
        noOfFactories: {
          title: 'Number of Factories',
          value: 0,
        },
      });

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      const factoriesCount = screen.getByTestId('lands-factories-section-factories-count');

      expect(totalLand).toHaveAttribute('data-value', '0 hectares');
      expect(factoriesCount).toHaveAttribute('data-value', '0');
    });

    it('should handle negative values', () => {
      renderComponent({
        ...defaultProps,
        totalLand: {
          title: 'Total Land',
          value: -100,
          unit: 'hectares',
        },
      });

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      expect(totalLand).toHaveAttribute('data-value', '-100 hectares');
    });

    it('should handle very large numbers', () => {
      renderComponent({
        ...defaultProps,
        totalLand: {
          title: 'Total Land',
          value: 999999999,
          unit: 'hectares',
        },
        currentWorkforce: {
          title: 'Current Workforce',
          value: 1000000,
        },
      });

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      const workforce = screen.getByTestId('lands-factories-section-current-workforce');

      expect(totalLand).toHaveAttribute('data-value', '999999999 hectares');
      expect(workforce).toHaveAttribute('data-value', '1000000');
    });

    it('should handle special characters in text content', () => {
      renderComponent({
        ...defaultProps,
        title: 'Land & Factories with émojis 🏭 and spéciàl chärs',
        totalLand: {
          title: 'Total Land with HTML <tags> & entities &amp;',
          value: 500,
          unit: 'm²',
        },
      });

      expect(screen.getByText('Land & Factories with émojis 🏭 and spéciàl chärs')).toBeInTheDocument();
      
      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      expect(totalLand).toHaveAttribute('data-label', 'Total Land with HTML <tags> & entities &amp;');
    });

    it('should handle empty strings', () => {
      renderComponent({
        ...defaultProps,
        title: '',
        totalLand: {
          title: '',
          value: '',
          unit: '',
        },
      });

      const title = screen.getByTestId('lands-factories-section-title');
      expect(title).toHaveTextContent('');

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      expect(totalLand).toHaveAttribute('data-label', '');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('lands-factories-section');
      const title = screen.getByTestId('lands-factories-section-title');
      const primaryStats = screen.getByTestId('lands-factories-section-primary-stats');
      const secondaryStats = screen.getByTestId('lands-factories-section-secondary-stats');

      expect(container).toContainElement(title);
      expect(container).toContainElement(primaryStats);
      expect(container).toContainElement(secondaryStats);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const container = screen.getByTestId('lands-factories-section');
      const children = Array.from(container.children);

      expect(children).toHaveLength(3); // title, primary stats, secondary stats

      const titleIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'lands-factories-section-title'
      );
      const primaryIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'lands-factories-section-primary-stats'
      );
      const secondaryIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'lands-factories-section-secondary-stats'
      );

      expect(titleIndex).toBe(0);
      expect(primaryIndex).toBe(1);
      expect(secondaryIndex).toBe(2);
    });

    it('should conditionally render statistics based on data availability', () => {
      renderComponent({
        ...defaultProps,
        totalLand: null,
        developedLand: null,
        noOfFactories: null,
      });

      expect(screen.queryByTestId('lands-factories-section-total-land')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section-developed-land')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lands-factories-section-factories-count')).not.toBeInTheDocument();

      // But other stats should still be rendered
      expect(screen.getByTestId('lands-factories-section-undeveloped-land')).toBeInTheDocument();
      expect(screen.getByTestId('lands-factories-section-current-workforce')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('lands-factories-section')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <LandsFactoriesSection
            {...defaultProps}
            title={`Dynamic Title ${i}`}
            totalLand={{
              title: 'Total Land',
              value: i * 100,
              unit: 'hectares',
            }}
            data-qa-id={`dynamic-lands-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Dynamic Title 9')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('lands-factories-section')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('lands-factories-section')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('Land and Factories Information')).toBeInTheDocument();

      rerender(
        <LandsFactoriesSection
          {...defaultProps}
          title="Updated Lands Information"
          totalLand={{
            title: 'Updated Total Land',
            value: 1000,
            unit: 'acres',
          }}
        />
      );

      expect(screen.getByText('Updated Lands Information')).toBeInTheDocument();
      expect(screen.queryByText('Land and Factories Information')).not.toBeInTheDocument();

      const totalLand = screen.getByTestId('lands-factories-section-total-land');
      expect(totalLand).toHaveAttribute('data-label', 'Updated Total Land');
      expect(totalLand).toHaveAttribute('data-value', '1000 acres');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper semantic structure with heading', () => {
      renderComponent();

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Land and Factories Information');
    });

    it('should maintain proper heading hierarchy', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H2');
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in ILandsFactoriesSectionProps', () => {
      expect(() => {
        render(
          <LandsFactoriesSection
            title="Test Title"
            totalLand={{ title: 'Total', value: 100, unit: 'ha' }}
            developedLand={{ title: 'Developed', value: 50, unit: 'ha' }}
            undevelopedLand={{ title: 'Undeveloped', value: 50, unit: 'ha' }}
            occupancyRate={{ title: 'Occupancy', value: '80%', unit: null }}
            percentageOfLogisticLand={{ title: 'Logistic', value: 20, unit: '%' }}
            projectsUnderConstruction={{ title: 'Projects', value: 5 }}
            noOfFactories={{ title: 'Factories', value: 10 }}
            currentWorkforce={{ title: 'Workforce', value: 500 }}
            data-qa-id="test-lands"
          />
        );
      }).not.toThrow();
    });

    it('should work with null values for optional statistics', () => {
      expect(() => {
        render(
          <LandsFactoriesSection
            title="Test Title"
            totalLand={null}
            developedLand={null}
            undevelopedLand={null}
            occupancyRate={null}
            percentageOfLogisticLand={null}
            projectsUnderConstruction={null}
            noOfFactories={null}
            currentWorkforce={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('lands-factories-section')).toBeInTheDocument();
    });
  });
});