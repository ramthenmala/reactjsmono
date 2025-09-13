import React from 'react';
import { render, screen } from '@testing-library/react';
import { Environmental } from '@/features/explore/components/PropertyDetail/Environmental';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  __esModule: true,
  default: ({ label, value, icon, variant, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
      <div data-qa-id={`${dataQaId}-variant`}>{variant}</div>
    </div>
  ),
}));

jest.mock('@untitledui/icons', () => ({
  Wind01: ({ className, strokeWidth }: any) => (
    <div data-qa-id="wind01-icon" className={className} data-stroke-width={strokeWidth}>
      Wind01 Icon
    </div>
  ),
  ThermometerWarm: ({ className, strokeWidth }: any) => (
    <div data-qa-id="thermometer-warm-icon" className={className} data-stroke-width={strokeWidth}>
      ThermometerWarm Icon
    </div>
  ),
  Droplets01: ({ className, strokeWidth }: any) => (
    <div data-qa-id="droplets01-icon" className={className} data-stroke-width={strokeWidth}>
      Droplets01 Icon
    </div>
  ),
  Wind02: ({ className, strokeWidth }: any) => (
    <div data-qa-id="wind02-icon" className={className} data-stroke-width={strokeWidth}>
      Wind02 Icon
    </div>
  ),
}));

jest.mock('../../../utils/propertyDetailUtils', () => ({
  formatValueWithUnit: jest.fn((value, unit) => {
    if (value === null || value === undefined) return '';
    if (!unit) return String(value);
    return `${value} ${unit}`;
  }),
}));

describe('Environmental', () => {
  const defaultProps = {
    title: 'Environmental Conditions',
    image: 'https://example.com/environmental.jpg',
    humidity: {
      title: 'Humidity',
      value: 65,
      unit: '%',
    },
    temperature: {
      title: 'Average Temperature',
      value: 28,
      unit: '°C',
    },
    percipitation: {
      title: 'Annual Precipitation',
      value: 120,
      unit: 'mm',
    },
    polution: {
      title: 'Air Quality Index',
      value: 85,
      unit: 'AQI',
    },
  };

  const renderComponent = (props = {}) => {
    return render(<Environmental {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-environmental' });

      expect(screen.getByTestId('custom-environmental')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental')).not.toBeInTheDocument();
    });

    it('should render all required elements when all data is provided', () => {
      renderComponent();

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-stats')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-humidity')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-temperature')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-precipitation')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-pollution')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-image')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display humidity information correctly', () => {
      renderComponent();

      expect(screen.getByTestId('environmental-humidity-label')).toHaveTextContent('Humidity');
      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('65 %');
      expect(screen.getByTestId('wind01-icon')).toBeInTheDocument();
    });

    it('should display temperature information correctly', () => {
      renderComponent();

      expect(screen.getByTestId('environmental-temperature-label')).toHaveTextContent('Average Temperature');
      expect(screen.getByTestId('environmental-temperature-value')).toHaveTextContent('28 °C');
      expect(screen.getByTestId('thermometer-warm-icon')).toBeInTheDocument();
    });

    it('should display precipitation information correctly', () => {
      renderComponent();

      expect(screen.getByTestId('environmental-precipitation-label')).toHaveTextContent('Annual Precipitation');
      expect(screen.getByTestId('environmental-precipitation-value')).toHaveTextContent('120 mm');
      expect(screen.getByTestId('droplets01-icon')).toBeInTheDocument();
    });

    it('should display pollution information correctly', () => {
      renderComponent();

      expect(screen.getByTestId('environmental-pollution-label')).toHaveTextContent('Air Quality Index');
      expect(screen.getByTestId('environmental-pollution-value')).toHaveTextContent('85 AQI');
      expect(screen.getByTestId('wind02-icon')).toBeInTheDocument();
    });

    it('should display image with correct attributes', () => {
      renderComponent();

      const image = screen.getByTestId('environmental-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/environmental.jpg');
      expect(image).toHaveAttribute('alt', 'Environmental');
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render humidity card when humidity data is null', () => {
      renderComponent({ humidity: null });

      expect(screen.queryByTestId('environmental-humidity')).not.toBeInTheDocument();
      expect(screen.getByTestId('environmental-temperature')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-precipitation')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-pollution')).toBeInTheDocument();
    });

    it('should not render temperature card when temperature data is null', () => {
      renderComponent({ temperature: null });

      expect(screen.getByTestId('environmental-humidity')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental-temperature')).not.toBeInTheDocument();
      expect(screen.getByTestId('environmental-precipitation')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-pollution')).toBeInTheDocument();
    });

    it('should not render precipitation card when precipitation data is null', () => {
      renderComponent({ percipitation: null });

      expect(screen.getByTestId('environmental-humidity')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-temperature')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental-precipitation')).not.toBeInTheDocument();
      expect(screen.getByTestId('environmental-pollution')).toBeInTheDocument();
    });

    it('should not render pollution card when pollution data is null', () => {
      renderComponent({ polution: null });

      expect(screen.getByTestId('environmental-humidity')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-temperature')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-precipitation')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental-pollution')).not.toBeInTheDocument();
    });

    it('should not render image when image is null', () => {
      renderComponent({ image: null });

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental-image')).not.toBeInTheDocument();
    });

    it('should render only stats container when all environmental data is null and no image', () => {
      renderComponent({ 
        humidity: null, 
        temperature: null, 
        percipitation: null, 
        polution: null, 
        image: null 
      });

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-stats')).toBeInTheDocument();
      expect(screen.queryByTestId('environmental-humidity')).not.toBeInTheDocument();
      expect(screen.queryByTestId('environmental-temperature')).not.toBeInTheDocument();
      expect(screen.queryByTestId('environmental-precipitation')).not.toBeInTheDocument();
      expect(screen.queryByTestId('environmental-pollution')).not.toBeInTheDocument();
      expect(screen.queryByTestId('environmental-image')).not.toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-stats')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-humidity')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-temperature')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-precipitation')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-pollution')).toBeInTheDocument();
      expect(screen.getByTestId('environmental-image')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-env' });

      expect(screen.getByTestId('custom-env')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-stats')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-humidity')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-temperature')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-precipitation')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-pollution')).toBeInTheDocument();
      expect(screen.getByTestId('custom-env-image')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'environmental-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-stats`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-humidity`)).toBeInTheDocument();
    });
  });

  describe('StatCard Integration', () => {
    it('should pass correct props to all StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('environmental-humidity-variant')).toHaveTextContent('large');
      expect(screen.getByTestId('environmental-temperature-variant')).toHaveTextContent('large');
      expect(screen.getByTestId('environmental-precipitation-variant')).toHaveTextContent('large');
      expect(screen.getByTestId('environmental-pollution-variant')).toHaveTextContent('large');
    });

    it('should call formatValueWithUnit for each environmental metric', () => {
      const { formatValueWithUnit } = require('../../../utils/propertyDetailUtils');
      renderComponent();

      expect(formatValueWithUnit).toHaveBeenCalledWith(65, '%');
      expect(formatValueWithUnit).toHaveBeenCalledWith(28, '°C');
      expect(formatValueWithUnit).toHaveBeenCalledWith(120, 'mm');
      expect(formatValueWithUnit).toHaveBeenCalledWith(85, 'AQI');
    });
  });

  describe('Icon Rendering', () => {
    it('should render icons with correct props', () => {
      renderComponent();

      const wind01Icon = screen.getByTestId('wind01-icon');
      const thermometerIcon = screen.getByTestId('thermometer-warm-icon');
      const dropletsIcon = screen.getByTestId('droplets01-icon');
      const wind02Icon = screen.getByTestId('wind02-icon');

      expect(wind01Icon).toHaveClass('size-11');
      expect(wind01Icon).toHaveAttribute('data-stroke-width', '1');
      
      expect(thermometerIcon).toHaveClass('size-11');
      expect(thermometerIcon).toHaveAttribute('data-stroke-width', '1');
      
      expect(dropletsIcon).toHaveClass('size-11');
      expect(dropletsIcon).toHaveAttribute('data-stroke-width', '1');
      
      expect(wind02Icon).toHaveClass('size-11');
      expect(wind02Icon).toHaveAttribute('data-stroke-width', '1');
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper responsive layout classes', () => {
      renderComponent();

      const container = screen.getByTestId('environmental');
      const statsGrid = screen.getByTestId('environmental-stats');

      expect(container).toHaveClass('flex', 'flex-col-reverse', 'lg:flex-row', 'gap-4', 'md:gap-10');
      expect(statsGrid).toHaveClass('lg:w-7/12', 'grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    it('should render image with correct responsive classes', () => {
      renderComponent();

      const image = screen.getByTestId('environmental-image');
      expect(image).toHaveClass('lg:w-5/12', 'h-auto', 'rounded-2xl');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing units gracefully', () => {
      renderComponent({
        humidity: { title: 'Humidity', value: 65, unit: null },
        temperature: { title: 'Temperature', value: 28, unit: null },
      });

      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('65');
      expect(screen.getByTestId('environmental-temperature-value')).toHaveTextContent('28');
    });

    it('should handle zero values', () => {
      renderComponent({
        humidity: { title: 'Humidity', value: 0, unit: '%' },
        temperature: { title: 'Temperature', value: 0, unit: '°C' },
      });

      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('0 %');
      expect(screen.getByTestId('environmental-temperature-value')).toHaveTextContent('0 °C');
    });

    it('should handle negative values', () => {
      renderComponent({
        temperature: { title: 'Temperature', value: -5, unit: '°C' },
        polution: { title: 'Air Quality', value: -1, unit: 'AQI' },
      });

      expect(screen.getByTestId('environmental-temperature-value')).toHaveTextContent('-5 °C');
      expect(screen.getByTestId('environmental-pollution-value')).toHaveTextContent('-1 AQI');
    });

    it('should handle very large numbers', () => {
      renderComponent({
        percipitation: { title: 'Precipitation', value: 999999, unit: 'mm' },
      });

      expect(screen.getByTestId('environmental-precipitation-value')).toHaveTextContent('999999 mm');
    });

    it('should handle empty string values', () => {
      renderComponent({
        humidity: { title: '', value: null, unit: '' },
        image: '',
      });

      expect(screen.getByTestId('environmental-humidity-label')).toHaveTextContent('');
      expect(screen.queryByTestId('environmental-image')).not.toBeInTheDocument();
    });

    it('should handle special characters in titles and units', () => {
      renderComponent({
        humidity: { 
          title: 'Humidity & Moisture (24/7)', 
          value: 65, 
          unit: '% RH' 
        },
      });

      expect(screen.getByTestId('environmental-humidity-label')).toHaveTextContent('Humidity & Moisture (24/7)');
      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('65 % RH');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('environmental')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('environmental')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('65 %');

      rerender(
        <Environmental
          {...defaultProps}
          humidity={{ title: 'Updated Humidity', value: 75, unit: '%' }}
        />
      );

      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('75 %');
      expect(screen.getByTestId('environmental-humidity-label')).toHaveTextContent('Updated Humidity');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('environmental')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <Environmental
            {...defaultProps}
            humidity={{ title: `Humidity ${i}`, value: 50 + i, unit: '%' }}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('environmental-humidity-value')).toHaveTextContent('59 %');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderComponent();

      const image = screen.getByTestId('environmental-image');
      expect(image).toHaveAttribute('alt', 'Environmental');
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('environmental');
      const statsGrid = screen.getByTestId('environmental-stats');
      const image = screen.getByTestId('environmental-image');

      expect(container).toContainElement(statsGrid);
      expect(container).toContainElement(image);
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IEnvironmental', () => {
      expect(() => {
        render(
          <Environmental
            title="Test Environmental"
            image="https://test.com/image.jpg"
            humidity={{ title: "Test Humidity", value: 50, unit: "%" }}
            temperature={{ title: "Test Temperature", value: 20, unit: "°C" }}
            percipitation={{ title: "Test Precipitation", value: 100, unit: "mm" }}
            polution={{ title: "Test Pollution", value: 30, unit: "AQI" }}
            data-qa-id="test-environmental"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <Environmental
            title="Minimal Environmental"
            image={null}
            humidity={null}
            temperature={null}
            percipitation={null}
            polution={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('environmental')).toBeInTheDocument();
    });
  });
});