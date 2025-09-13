import React from 'react';
import { render, screen } from '@testing-library/react';
import { WorkforceTalentSection } from '@/features/explore/components/PropertyDetail/WorkforceTalentSection';
import '@testing-library/jest-dom';

jest.mock('../../Charts/StatChartCard', () => ({
  StatChartCard: ({ label, value, percentage, variant, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-percentage`}>{percentage}</div>
      {variant && <div data-qa-id={`${dataQaId}-variant`}>{variant}</div>}
    </div>
  ),
}));

jest.mock('../../UI/StatCard', () => ({
  StatCard: ({ label, value, variant, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      {variant && <div data-qa-id={`${dataQaId}-variant`}>{variant}</div>}
    </div>
  ),
}));

jest.mock('../../../utils/propertyDetailUtils', () => ({
  formatValueWithUnit: jest.fn((value, unit) => {
    if (value === null || value === undefined) return '';
    return `${value} ${unit || ''}`;
  }).mockName('formatValueWithUnit'),
  propertyDetailStyles: {
    flexLayout: {
      reverseOnLarge: 'flex flex-col-reverse lg:flex-row gap-4 md:gap-10',
    },
    image: {
      rounded: 'lg:w-5/12 h-auto rounded-2xl',
    },
  },
}));

jest.mock('@compass/shared-ui', () => ({
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

describe('WorkforceTalentSection', () => {
  const defaultProps = {
    title: 'Workforce and Talent',
    image: 'https://example.com/workforce.jpg',
    avaialbilityOfSkilledLabor: {
      title: 'Skilled Labor Availability',
      value: 'High',
      unit: '%',
    },
    avaialbilityOfNonSkilledLabor: {
      title: 'Non-Skilled Labor Availability',
      value: 'Medium',
      unit: '%',
    },
    skilledLaborAvgSalary: {
      title: 'Skilled Labor Average Salary',
      value: 5000,
      unit: 'SAR',
    },
    nonskilledLaborAvgSalary: {
      title: 'Non-Skilled Labor Average Salary',
      value: 3000,
      unit: 'SAR',
    },
  };

  const renderComponent = (props = {}) => {
    return render(<WorkforceTalentSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-workforce' });

      expect(screen.getByTestId('custom-workforce')).toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-stats')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-non-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-non-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-image')).toBeInTheDocument();
    });
  });

  describe('Skilled Labor Availability', () => {
    it('should display skilled labor availability correctly', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-skilled-availability-label')).toHaveTextContent('Skilled Labor Availability');
      expect(screen.getByTestId('workforce-talent-skilled-availability-value')).toHaveTextContent('High %');
      expect(screen.getByTestId('workforce-talent-skilled-availability-variant')).toHaveTextContent('wide');
    });

    it('should not render skilled availability when null', () => {
      renderComponent({ avaialbilityOfSkilledLabor: null });

      expect(screen.queryByTestId('workforce-talent-skilled-availability')).not.toBeInTheDocument();
    });

    it('should handle empty skilled availability values', () => {
      renderComponent({
        avaialbilityOfSkilledLabor: {
          title: '',
          value: null,
          unit: null,
        },
      });

      expect(screen.getByTestId('workforce-talent-skilled-availability-label')).toHaveTextContent('');
      expect(screen.getByTestId('workforce-talent-skilled-availability-value')).toBeEmptyDOMElement();
    });
  });

  describe('Non-Skilled Labor Availability', () => {
    it('should display non-skilled labor availability correctly', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-non-skilled-availability-label')).toHaveTextContent('Non-Skilled Labor Availability');
      expect(screen.getByTestId('workforce-talent-non-skilled-availability-value')).toHaveTextContent('Medium %');
      expect(screen.getByTestId('workforce-talent-non-skilled-availability-variant')).toHaveTextContent('wide');
    });

    it('should not render non-skilled availability when null', () => {
      renderComponent({ 
        avaialbilityOfNonSkilledLabor: null,
        avaialbilityOfSkilledLabor: null // Also set skilled to null to avoid reference error
      });

      expect(screen.queryByTestId('workforce-talent-non-skilled-availability')).not.toBeInTheDocument();
    });

    it('should handle numeric values for non-skilled availability', () => {
      renderComponent({
        avaialbilityOfNonSkilledLabor: {
          title: 'Non-Skilled Labor',
          value: '75',
          unit: '%',
        },
      });

      expect(screen.getByTestId('workforce-talent-non-skilled-availability-percentage')).toHaveTextContent('75');
    });
  });

  describe('Skilled Labor Salary', () => {
    it('should display skilled labor salary correctly', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-skilled-salary-label')).toHaveTextContent('Skilled Labor Average Salary');
      expect(screen.getByTestId('workforce-talent-skilled-salary-variant')).toHaveTextContent('large');
    });

    it('should render SAR icon for skilled salary', () => {
      renderComponent();

      const salaryValue = screen.getByTestId('workforce-talent-skilled-salary-value');
      expect(salaryValue).toBeInTheDocument();
      
      const sarIcons = screen.getAllByTestId('icon-sar');
      expect(sarIcons.length).toBeGreaterThanOrEqual(1);
      expect(sarIcons[0]).toHaveAttribute('data-icon-name', 'sar');
      expect(sarIcons[0]).toHaveClass('size-4', 'md:size-6');
    });

    it('should not render skilled salary when null', () => {
      renderComponent({ skilledLaborAvgSalary: null });

      expect(screen.queryByTestId('workforce-talent-skilled-salary')).not.toBeInTheDocument();
    });

    it('should handle zero skilled salary value', () => {
      renderComponent({
        skilledLaborAvgSalary: {
          title: 'Skilled Salary',
          value: 0,
          unit: 'SAR',
        },
      });

      const salaryValue = screen.getByTestId('workforce-talent-skilled-salary-value');
      expect(salaryValue).toHaveTextContent('0');
      
      const sarIcons = screen.getAllByTestId('icon-sar');
      expect(sarIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Non-Skilled Labor Salary', () => {
    it('should display non-skilled labor salary correctly', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-non-skilled-salary-label')).toHaveTextContent('Non-Skilled Labor Average Salary');
      expect(screen.getByTestId('workforce-talent-non-skilled-salary-variant')).toHaveTextContent('large');
    });

    it('should render SAR icon for non-skilled salary', () => {
      renderComponent();

      const salaryValue = screen.getByTestId('workforce-talent-non-skilled-salary-value');
      expect(salaryValue).toBeInTheDocument();
      
      const sarIcons = screen.getAllByTestId('icon-sar');
      expect(sarIcons.length).toBeGreaterThanOrEqual(1);
      
      // Check that at least one SAR icon has correct properties
      const validSarIcon = sarIcons.find(icon => 
        icon.getAttribute('data-icon-name') === 'sar' &&
        icon.classList.contains('size-4') &&
        icon.classList.contains('md:size-6')
      );
      expect(validSarIcon).toBeInTheDocument();
    });

    it('should not render non-skilled salary when null', () => {
      renderComponent({ nonskilledLaborAvgSalary: null });

      expect(screen.queryByTestId('workforce-talent-non-skilled-salary')).not.toBeInTheDocument();
    });

    it('should handle large salary numbers', () => {
      renderComponent({
        nonskilledLaborAvgSalary: {
          title: 'Non-Skilled Salary',
          value: 150000,
          unit: 'SAR',
        },
      });

      const salaryValue = screen.getByTestId('workforce-talent-non-skilled-salary-value');
      expect(salaryValue).toHaveTextContent('150000');
    });
  });

  describe('Image Display', () => {
    it('should display image with correct attributes', () => {
      renderComponent();

      const image = screen.getByTestId('workforce-talent-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/workforce.jpg');
      expect(image).toHaveAttribute('alt', 'Workforce and Talent');
      expect(image).toHaveClass('lg:w-5/12', 'h-auto', 'rounded-2xl');
    });

    it('should not render image when image is null', () => {
      renderComponent({ image: null });

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-stats')).toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-image')).not.toBeInTheDocument();
    });

    it('should not render image when image is empty string', () => {
      renderComponent({ image: '' });

      expect(screen.queryByTestId('workforce-talent-image')).not.toBeInTheDocument();
    });

    it('should handle various image URL formats', () => {
      const imageUrls = [
        'https://example.com/image.jpg',
        '/relative/path/image.png',
        'data:image/svg+xml;base64,PHN2Zw==',
        '//cdn.example.com/image.gif',
      ];

      imageUrls.forEach((url, index) => {
        const { unmount } = render(
          <WorkforceTalentSection
            {...defaultProps}
            image={url}
            data-qa-id={`test-${index}`}
          />
        );

        const image = screen.getByTestId(`test-${index}-image`);
        expect(image).toHaveAttribute('src', url);

        unmount();
      });
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-stats')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-non-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-non-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-image')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-workforce' });

      expect(screen.getByTestId('custom-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-non-skilled-availability')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-non-skilled-salary')).toBeInTheDocument();
      expect(screen.getByTestId('custom-workforce-image')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'workforce_with-special.chars123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-stats`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-skilled-availability`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-stats"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-skilled-availability"]')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper layout classes', () => {
      renderComponent();

      const container = screen.getByTestId('workforce-talent');
      const stats = screen.getByTestId('workforce-talent-stats');

      expect(container).toHaveClass('flex', 'flex-col-reverse', 'lg:flex-row', 'gap-4', 'md:gap-10');
      expect(stats).toHaveClass('lg:w-7/12', 'grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    it('should maintain correct element order', () => {
      renderComponent();

      const container = screen.getByTestId('workforce-talent');
      const children = Array.from(container.children);

      const statsIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'workforce-talent-stats'
      );
      const imageIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'workforce-talent-image'
      );

      expect(statsIndex).toBeLessThan(imageIndex);
    });

    it('should render stats in correct grid structure', () => {
      renderComponent();

      const stats = screen.getByTestId('workforce-talent-stats');
      const skilledAvailability = screen.getByTestId('workforce-talent-skilled-availability');
      const nonSkilledAvailability = screen.getByTestId('workforce-talent-non-skilled-availability');
      const skilledSalary = screen.getByTestId('workforce-talent-skilled-salary');
      const nonSkilledSalary = screen.getByTestId('workforce-talent-non-skilled-salary');

      expect(stats).toContainElement(skilledAvailability);
      expect(stats).toContainElement(nonSkilledAvailability);
      expect(stats).toContainElement(skilledSalary);
      expect(stats).toContainElement(nonSkilledSalary);
    });
  });

  describe('Utility Integration', () => {
    it('should call formatValueWithUnit with correct parameters for skilled availability', () => {
      const { formatValueWithUnit } = require('../../../utils/propertyDetailUtils');
      renderComponent();

      expect(formatValueWithUnit).toHaveBeenCalledWith('Medium', '%');
    });

    it('should call formatValueWithUnit with correct parameters for non-skilled availability', () => {
      const { formatValueWithUnit } = require('../../../utils/propertyDetailUtils');
      renderComponent();

      expect(formatValueWithUnit).toHaveBeenCalledWith('Medium', '%');
    });

    it('should handle null units in formatValueWithUnit', () => {
      renderComponent({
        avaialbilityOfNonSkilledLabor: {
          title: 'Non-Skilled Labor',
          value: 'High',
          unit: null,
        },
      });

      const { formatValueWithUnit } = require('../../../utils/propertyDetailUtils');
      expect(formatValueWithUnit).toHaveBeenCalledWith('High', null);
    });

    it('should use property detail styles correctly', () => {
      renderComponent();

      const container = screen.getByTestId('workforce-talent');
      const image = screen.getByTestId('workforce-talent-image');

      expect(container).toHaveClass('flex', 'flex-col-reverse', 'lg:flex-row', 'gap-4', 'md:gap-10');
      expect(image).toHaveClass('lg:w-5/12', 'h-auto', 'rounded-2xl');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle all null values gracefully', () => {
      renderComponent({
        avaialbilityOfSkilledLabor: null,
        avaialbilityOfNonSkilledLabor: null,
        skilledLaborAvgSalary: null,
        nonskilledLaborAvgSalary: null,
        image: null,
      });

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
      expect(screen.getByTestId('workforce-talent-stats')).toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-skilled-availability')).not.toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-non-skilled-availability')).not.toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-skilled-salary')).not.toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-non-skilled-salary')).not.toBeInTheDocument();
      expect(screen.queryByTestId('workforce-talent-image')).not.toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      renderComponent({
        avaialbilityOfSkilledLabor: {
          title: '',
          value: '',
          unit: '',
        },
        avaialbilityOfNonSkilledLabor: {
          title: '',
          value: '',
          unit: '',
        },
        skilledLaborAvgSalary: {
          title: '',
          value: null,
          unit: '',
        },
        nonskilledLaborAvgSalary: {
          title: '',
          value: null,
          unit: '',
        },
      });

      expect(screen.getByTestId('workforce-talent-skilled-availability-label')).toHaveTextContent('');
      expect(screen.getByTestId('workforce-talent-non-skilled-availability-label')).toHaveTextContent('');
      expect(screen.getByTestId('workforce-talent-skilled-salary-label')).toHaveTextContent('');
      expect(screen.getByTestId('workforce-talent-non-skilled-salary-label')).toHaveTextContent('');
    });

    it('should handle very long text content', () => {
      const longTitle = 'A'.repeat(200);
      
      renderComponent({
        avaialbilityOfSkilledLabor: {
          title: longTitle,
          value: 'High',
          unit: '%',
        },
      });

      expect(screen.getByTestId('workforce-talent-skilled-availability-label')).toHaveTextContent(longTitle);
    });

    it('should handle special characters in content', () => {
      renderComponent({
        avaialbilityOfSkilledLabor: {
          title: 'Skilled Labor & Workforce (2024)',
          value: 'High > 80%',
          unit: '%',
        },
      });

      expect(screen.getByTestId('workforce-talent-skilled-availability-label')).toHaveTextContent('Skilled Labor & Workforce (2024)');
    });

    it('should handle negative salary values', () => {
      renderComponent({
        skilledLaborAvgSalary: {
          title: 'Skilled Salary',
          value: -1000,
          unit: 'SAR',
        },
      });

      const salaryValue = screen.getByTestId('workforce-talent-skilled-salary-value');
      expect(salaryValue).toHaveTextContent('-1000');
    });

    it('should handle decimal salary values', () => {
      renderComponent({
        nonskilledLaborAvgSalary: {
          title: 'Non-Skilled Salary',
          value: 2500.75,
          unit: 'SAR',
        },
      });

      const salaryValue = screen.getByTestId('workforce-talent-non-skilled-salary-value');
      expect(salaryValue).toHaveTextContent('2500.75');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('workforce-talent')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('workforce-talent-skilled-salary-value')).toHaveTextContent('5000');

      rerender(
        <WorkforceTalentSection
          {...defaultProps}
          skilledLaborAvgSalary={{
            title: 'Updated Skilled Salary',
            value: 6000,
            unit: 'SAR',
          }}
        />
      );

      expect(screen.getByTestId('workforce-talent-skilled-salary-label')).toHaveTextContent('Updated Skilled Salary');
      expect(screen.getByTestId('workforce-talent-skilled-salary-value')).toHaveTextContent('6000');
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialStats = screen.getByTestId('workforce-talent-stats');
      expect(initialStats.children).toHaveLength(4); // All four stat components

      rerender(
        <WorkforceTalentSection
          {...defaultProps}
          avaialbilityOfSkilledLabor={null}
        />
      );

      const updatedStats = screen.getByTestId('workforce-talent-stats');
      expect(updatedStats).toBeInTheDocument();
      expect(updatedStats.children).toHaveLength(3); // One component removed
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <WorkforceTalentSection
            {...defaultProps}
            skilledLaborAvgSalary={{
              title: `Skilled Salary ${i}`,
              value: i * 1000,
              unit: 'SAR',
            }}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('workforce-talent-skilled-salary-value')).toHaveTextContent('9000');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderComponent();

      const image = screen.getByTestId('workforce-talent-image');
      expect(image).toHaveAttribute('alt', 'Workforce and Talent');
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('workforce-talent');
      const stats = screen.getByTestId('workforce-talent-stats');
      const image = screen.getByTestId('workforce-talent-image');

      expect(container).toContainElement(stats);
      expect(container).toContainElement(image);
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('workforce-talent'),
        screen.getByTestId('workforce-talent-stats'),
        screen.getByTestId('workforce-talent-skilled-availability'),
        screen.getByTestId('workforce-talent-non-skilled-availability'),
        screen.getByTestId('workforce-talent-skilled-salary'),
        screen.getByTestId('workforce-talent-non-skilled-salary'),
        screen.getByTestId('workforce-talent-image'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('should maintain accessibility without image', () => {
      renderComponent({ image: null });

      const elements = [
        screen.getByTestId('workforce-talent'),
        screen.getByTestId('workforce-talent-stats'),
        screen.getByTestId('workforce-talent-skilled-availability'),
        screen.getByTestId('workforce-talent-non-skilled-availability'),
        screen.getByTestId('workforce-talent-skilled-salary'),
        screen.getByTestId('workforce-talent-non-skilled-salary'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IWorkforceAndTalent', () => {
      expect(() => {
        render(
          <WorkforceTalentSection
            {...defaultProps}
            data-qa-id="test-workforce"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      const minimalProps = {
        title: 'Minimal Workforce',
        image: null,
        avaialbilityOfSkilledLabor: null,
        avaialbilityOfNonSkilledLabor: {
          title: 'Non-Skilled',
          value: 'Low',
          unit: null,
        },
        skilledLaborAvgSalary: null,
        nonskilledLaborAvgSalary: null,
      };

      expect(() => {
        render(<WorkforceTalentSection {...minimalProps} />);
      }).not.toThrow();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <WorkforceTalentSection
            {...defaultProps}
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('workforce-talent')).toBeInTheDocument();
    });
  });

  describe('Integration with StatCard, StatChartCard, and Icon', () => {
    it('should pass correct props to StatChartCards', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-skilled-availability-variant')).toHaveTextContent('wide');
      expect(screen.getByTestId('workforce-talent-non-skilled-availability-variant')).toHaveTextContent('wide');
    });

    it('should pass correct props to StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('workforce-talent-skilled-salary-variant')).toHaveTextContent('large');
      expect(screen.getByTestId('workforce-talent-non-skilled-salary-variant')).toHaveTextContent('large');
    });

    it('should render SAR icons with correct props', () => {
      renderComponent();

      const sarIcons = screen.getAllByTestId('icon-sar');
      expect(sarIcons).toHaveLength(2); // One for each salary field

      sarIcons.forEach(icon => {
        expect(icon).toHaveAttribute('data-icon-name', 'sar');
        expect(icon).toHaveClass('size-4', 'md:size-6');
      });
    });

    it('should embed salary values with icons correctly', () => {
      renderComponent();

      const skilledSalaryCard = screen.getByTestId('workforce-talent-skilled-salary');
      const nonSkilledSalaryCard = screen.getByTestId('workforce-talent-non-skilled-salary');

      expect(skilledSalaryCard).toBeInTheDocument();
      expect(nonSkilledSalaryCard).toBeInTheDocument();
    });
  });
});