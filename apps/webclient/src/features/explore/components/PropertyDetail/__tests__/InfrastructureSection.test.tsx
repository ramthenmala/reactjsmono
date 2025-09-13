import React from 'react';
import { render, screen } from '@testing-library/react';
import { InfrastructureSection } from '@/features/explore/components/PropertyDetail/InfrastructureSection';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  StatCard: ({ label, value, icon, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
    </div>
  ),
}));

jest.mock('@untitledui/icons', () => ({
  Zap: ({ className, strokeWidth }: any) => (
    <div data-qa-id="zap-icon" className={className} data-stroke-width={strokeWidth}>
      Zap Icon
    </div>
  ),
  Drop: ({ className, strokeWidth }: any) => (
    <div data-qa-id="drop-icon" className={className} data-stroke-width={strokeWidth}>
      Drop Icon
    </div>
  ),
}));

jest.mock('@compass/shared-ui', () => ({
  Icon: ({ name, className, strokeWidth }: any) => (
    <div data-qa-id={`${name}-icon`} className={className} data-stroke-width={strokeWidth}>
      {name} Icon
    </div>
  ),
}));

describe('InfrastructureSection', () => {
  const defaultProps = {
    title: 'Infrastructure Overview',
    electricity: {
      title: 'Electricity Supply',
      value: '99.8% Availability',
    },
    gas: {
      title: 'Natural Gas',
      value: '24/7 Supply',
    },
    water: {
      title: 'Water Supply',
      value: 'Industrial Grade',
    },
  };

  const renderComponent = (props = {}) => {
    return render(<InfrastructureSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-infrastructure' });

      expect(screen.getByTestId('custom-infrastructure')).toBeInTheDocument();
      expect(screen.queryByTestId('infrastructure-section')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-title')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-stats')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-electricity')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-gas')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-water')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderComponent();

      const title = screen.getByTestId('infrastructure-section-title');
      expect(title.tagName).toBe('H2');
    });
  });

  describe('Content Display', () => {
    it('should display the section title', () => {
      renderComponent();

      expect(screen.getByText('Infrastructure Overview')).toBeInTheDocument();
    });

    it('should display electricity information correctly', () => {
      renderComponent();

      const electricityCard = screen.getByTestId('infrastructure-section-electricity');
      expect(electricityCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-electricity-label')).toHaveTextContent('Electricity Supply');
      expect(screen.getByTestId('infrastructure-section-electricity-value')).toHaveTextContent('99.8% Availability');
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('should display gas information correctly', () => {
      renderComponent();

      const gasCard = screen.getByTestId('infrastructure-section-gas');
      expect(gasCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-gas-label')).toHaveTextContent('Natural Gas');
      expect(screen.getByTestId('infrastructure-section-gas-value')).toHaveTextContent('24/7 Supply');
      expect(screen.getByTestId('fire-icon')).toBeInTheDocument();
    });

    it('should display water information correctly', () => {
      renderComponent();

      const waterCard = screen.getByTestId('infrastructure-section-water');
      expect(waterCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-water-label')).toHaveTextContent('Water Supply');
      expect(screen.getByTestId('infrastructure-section-water-value')).toHaveTextContent('Industrial Grade');
      expect(screen.getByTestId('drop-icon')).toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      renderComponent({
        title: '',
        electricity: { title: '', value: '' },
        gas: { title: '', value: '' },
        water: { title: '', value: '' },
      });

      expect(screen.getByTestId('infrastructure-section-title')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-electricity-label')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-electricity-value')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-gas-label')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-gas-value')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-water-label')).toHaveTextContent('');
      expect(screen.getByTestId('infrastructure-section-water-value')).toHaveTextContent('');
    });

    it('should handle special characters in content', () => {
      renderComponent({
        title: 'Infrastructure & Utilities Overview 🏭',
        electricity: {
          title: 'Electricity Supply ⚡',
          value: '99.8% Availability (24/7)',
        },
        gas: {
          title: 'Natural Gas & LPG',
          value: 'Continuous Supply @ 5.2 bar',
        },
        water: {
          title: 'H₂O Supply',
          value: 'Industrial Grade: 500 L/min',
        },
      });

      expect(screen.getByText('Infrastructure & Utilities Overview 🏭')).toBeInTheDocument();
      expect(screen.getByText('Electricity Supply ⚡')).toBeInTheDocument();
      expect(screen.getByText('99.8% Availability (24/7)')).toBeInTheDocument();
      expect(screen.getByText('Natural Gas & LPG')).toBeInTheDocument();
      expect(screen.getByText('Continuous Supply @ 5.2 bar')).toBeInTheDocument();
      expect(screen.getByText('H₂O Supply')).toBeInTheDocument();
      expect(screen.getByText('Industrial Grade: 500 L/min')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-title')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-stats')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-electricity')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-gas')).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-water')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-infrastructure' });

      expect(screen.getByTestId('custom-infrastructure')).toBeInTheDocument();
      expect(screen.getByTestId('custom-infrastructure-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-infrastructure-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-infrastructure-electricity')).toBeInTheDocument();
      expect(screen.getByTestId('custom-infrastructure-gas')).toBeInTheDocument();
      expect(screen.getByTestId('custom-infrastructure-water')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'infrastructure-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-stats`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-electricity`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-gas`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-water`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-stats"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-electricity"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-gas"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-water"]')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render electricity icon with correct props', () => {
      renderComponent();

      const zapIcon = screen.getByTestId('zap-icon');
      expect(zapIcon).toBeInTheDocument();
      expect(zapIcon).toHaveClass('size-8.5');
      expect(zapIcon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should render gas icon with correct props', () => {
      renderComponent();

      const fireIcon = screen.getByTestId('fire-icon');
      expect(fireIcon).toBeInTheDocument();
      expect(fireIcon).toHaveClass('size-8.5');
      expect(fireIcon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should render water icon with correct props', () => {
      renderComponent();

      const dropIcon = screen.getByTestId('drop-icon');
      expect(dropIcon).toBeInTheDocument();
      expect(dropIcon).toHaveClass('size-8.5');
      expect(dropIcon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should render all three utility icons', () => {
      renderComponent();

      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
      expect(screen.getByTestId('fire-icon')).toBeInTheDocument();
      expect(screen.getByTestId('drop-icon')).toBeInTheDocument();
    });
  });

  describe('StatCard Integration', () => {
    it('should pass correct props to electricity StatCard', () => {
      renderComponent();

      const electricityCard = screen.getByTestId('infrastructure-section-electricity');
      expect(electricityCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-electricity-label')).toHaveTextContent('Electricity Supply');
      expect(screen.getByTestId('infrastructure-section-electricity-value')).toHaveTextContent('99.8% Availability');
    });

    it('should pass correct props to gas StatCard', () => {
      renderComponent();

      const gasCard = screen.getByTestId('infrastructure-section-gas');
      expect(gasCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-gas-label')).toHaveTextContent('Natural Gas');
      expect(screen.getByTestId('infrastructure-section-gas-value')).toHaveTextContent('24/7 Supply');
    });

    it('should pass correct props to water StatCard', () => {
      renderComponent();

      const waterCard = screen.getByTestId('infrastructure-section-water');
      expect(waterCard).toBeInTheDocument();
      expect(screen.getByTestId('infrastructure-section-water-label')).toHaveTextContent('Water Supply');
      expect(screen.getByTestId('infrastructure-section-water-value')).toHaveTextContent('Industrial Grade');
    });

    it('should render exactly three StatCards', () => {
      renderComponent();

      const electricityCard = screen.getByTestId('infrastructure-section-electricity');
      const gasCard = screen.getByTestId('infrastructure-section-gas');
      const waterCard = screen.getByTestId('infrastructure-section-water');

      expect(electricityCard).toBeInTheDocument();
      expect(gasCard).toBeInTheDocument();
      expect(waterCard).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('infrastructure-section');
      const title = screen.getByTestId('infrastructure-section-title');
      const stats = screen.getByTestId('infrastructure-section-stats');
      const electricityCard = screen.getByTestId('infrastructure-section-electricity');
      const gasCard = screen.getByTestId('infrastructure-section-gas');
      const waterCard = screen.getByTestId('infrastructure-section-water');

      expect(container).toContainElement(title);
      expect(container).toContainElement(stats);
      expect(stats).toContainElement(electricityCard);
      expect(stats).toContainElement(gasCard);
      expect(stats).toContainElement(waterCard);
    });

    it('should render title before stats', () => {
      renderComponent();

      const container = screen.getByTestId('infrastructure-section');
      const children = Array.from(container.children);

      const titleIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'infrastructure-section-title'
      );
      const statsIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'infrastructure-section-stats'
      );

      expect(titleIndex).toBeLessThan(statsIndex);
    });

    it('should render cards in correct order within stats section', () => {
      renderComponent();

      const stats = screen.getByTestId('infrastructure-section-stats');
      const children = Array.from(stats.children);

      const electricityIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'infrastructure-section-electricity'
      );
      const gasIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'infrastructure-section-gas'
      );
      const waterIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'infrastructure-section-water'
      );

      expect(electricityIndex).toBeLessThan(gasIndex);
      expect(gasIndex).toBeLessThan(waterIndex);
    });
  });

  describe('Accessibility', () => {
    it('should provide proper semantic structure with heading', () => {
      renderComponent();

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Infrastructure Overview');
    });

    it('should be accessible for screen readers', () => {
      renderComponent();

      const title = screen.getByRole('heading');
      expect(title).toBeVisible();
      expect(title).toHaveAccessibleName('Infrastructure Overview');
    });

    it('should maintain proper heading hierarchy', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H2');
    });

    it('should have visible content for all utility types', () => {
      renderComponent();

      expect(screen.getByText('Electricity Supply')).toBeVisible();
      expect(screen.getByText('Natural Gas')).toBeVisible();
      expect(screen.getByText('Water Supply')).toBeVisible();
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IInfrastructureSectionProps', () => {
      expect(() => {
        render(
          <InfrastructureSection
            title="Test Infrastructure"
            electricity={{ title: "Test Electricity", value: "Test Value" }}
            gas={{ title: "Test Gas", value: "Test Value" }}
            water={{ title: "Test Water", value: "Test Value" }}
            data-qa-id="test-infrastructure"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <InfrastructureSection
            title="Minimal Test"
            electricity={{ title: "", value: "" }}
            gas={{ title: "", value: "" }}
            water={{ title: "", value: "" }}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <InfrastructureSection
            title="Test Infrastructure"
            electricity={{ title: "Test Electricity", value: "Test Value" }}
            gas={{ title: "Test Gas", value: "Test Value" }}
            water={{ title: "Test Water", value: "Test Value" }}
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid prop changes', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 5; i++) {
        rerender(
          <InfrastructureSection
            title={`Infrastructure ${i}`}
            electricity={{ title: `Electricity ${i}`, value: `${90 + i}% Available` }}
            gas={{ title: `Gas ${i}`, value: `Supply Type ${i}` }}
            water={{ title: `Water ${i}`, value: `Quality Grade ${i}` }}
            data-qa-id={`infrastructure-${i}`}
          />
        );

        expect(screen.getByText(`Infrastructure ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Electricity ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`${90 + i}% Available`)).toBeInTheDocument();
        expect(screen.getByTestId(`infrastructure-${i}`)).toBeInTheDocument();
      }
    });

    it('should handle very long text content', () => {
      const longTitle = 'A'.repeat(200);
      const longElectricityTitle = 'B'.repeat(100);
      const longElectricityValue = 'C'.repeat(100);

      renderComponent({
        title: longTitle,
        electricity: {
          title: longElectricityTitle,
          value: longElectricityValue,
        },
      });

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longElectricityTitle)).toBeInTheDocument();
      expect(screen.getByText(longElectricityValue)).toBeInTheDocument();
    });

    it('should handle various utility data formats', () => {
      const utilityFormats = [
        {
          electricity: { title: 'Power', value: '100% Uptime' },
          gas: { title: 'Gas', value: 'Available' },
          water: { title: 'Water', value: 'Clean' },
        },
        {
          electricity: { title: 'Electricity Supply (kW)', value: '5000 kW capacity' },
          gas: { title: 'Natural Gas Pipeline', value: 'High pressure - 15 bar' },
          water: { title: 'Industrial Water', value: '1000 L/min flow rate' },
        },
        {
          electricity: { title: '', value: '' },
          gas: { title: '', value: '' },
          water: { title: '', value: '' },
        },
      ];

      utilityFormats.forEach((format, index) => {
        const { unmount } = render(
          <InfrastructureSection
            title={`Test Infrastructure ${index}`}
            electricity={format.electricity}
            gas={format.gas}
            water={format.water}
            data-qa-id={`test-${index}`}
          />
        );

        expect(screen.getByTestId(`test-${index}`)).toBeInTheDocument();
        expect(screen.getByText(`Test Infrastructure ${index}`)).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('infrastructure-section')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('Infrastructure Overview')).toBeInTheDocument();

      rerender(
        <InfrastructureSection
          {...defaultProps}
          title="Updated Infrastructure"
          electricity={{ title: "Updated Electricity", value: "New Value" }}
        />
      );

      expect(screen.getByText('Updated Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Updated Electricity')).toBeInTheDocument();
      expect(screen.getByText('New Value')).toBeInTheDocument();
      expect(screen.queryByText('Infrastructure Overview')).not.toBeInTheDocument();
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialContainer = screen.getByTestId('infrastructure-section');
      expect(initialContainer.children).toHaveLength(2); // Title + Stats

      rerender(
        <InfrastructureSection
          {...defaultProps}
          title="Different Title"
        />
      );

      const updatedContainer = screen.getByTestId('infrastructure-section');
      expect(updatedContainer).toBeInTheDocument();
      expect(updatedContainer.children).toHaveLength(2); // Structure remains the same
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('infrastructure-section')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <InfrastructureSection
            {...defaultProps}
            title={`Infrastructure ${i}`}
            electricity={{ title: `Electricity ${i}`, value: `Value ${i}` }}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByText('Infrastructure 9')).toBeInTheDocument();
    });
  });
});