import { render, screen } from '@testing-library/react';
import { PieChart } from '@/features/explore/components/Charts/PieChart';
import '@testing-library/jest-dom';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children, height, width, ...props }: any) => (
    <div
      data-qa-id="mocked-responsive-container"
      data-height={height}
      data-width={width}
      {...props}
    >
      {children}
    </div>
  ),
  PieChart: ({ children, margin, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id="mocked-recharts-pie-chart"
      data-chart-qa-id={dataQaId}
      data-margin={JSON.stringify(margin)}
      {...props}
    >
      {children}
    </div>
  ),
  Pie: ({ 
    data, 
    dataKey, 
    nameKey, 
    fill, 
    innerRadius, 
    outerRadius, 
    startAngle, 
    endAngle,
    isAnimationActive,
    stroke,
    ...props 
  }: any) => (
    <div
      data-qa-id="mocked-pie"
      data-data={JSON.stringify(data)}
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-fill={fill}
      data-inner-radius={innerRadius}
      data-outer-radius={outerRadius}
      data-start-angle={startAngle}
      data-end-angle={endAngle}
      data-is-animation-active={String(isAnimationActive)}
      data-stroke={stroke}
      {...props}
    >
      Pie Component
    </div>
  ),
}));

describe('PieChart', () => {
  const defaultProps = {
    value: 75,
  };

  const renderComponent = (props = {}) => {
    return render(<PieChart {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render pie chart with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart-desktop')).toBeInTheDocument();
      expect(screen.getAllByTestId('mocked-responsive-container')).toHaveLength(2);
      expect(screen.getAllByTestId('mocked-recharts-pie-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('mocked-pie')).toHaveLength(2);
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="pie-chart"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="pie-chart-mobile"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="pie-chart-desktop"]')).toBeInTheDocument();
    });

    it('should render main wrapper as div element', () => {
      renderComponent();

      const chart = screen.getByTestId('pie-chart');
      expect(chart.tagName).toBe('DIV');
    });
  });

  describe('Responsive Rendering', () => {
    it('should render mobile version with correct classes', () => {
      renderComponent();

      const mobileContainer = screen.getByTestId('pie-chart-mobile');
      expect(mobileContainer).toHaveClass('block', 'md:hidden');
    });

    it('should render desktop version with correct classes', () => {
      renderComponent();

      const desktopContainer = screen.getByTestId('pie-chart-desktop');
      expect(desktopContainer).toHaveClass('hidden', 'md:block');
    });

    it('should render both mobile and desktop versions', () => {
      renderComponent();

      expect(screen.getByTestId('pie-chart-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart-desktop')).toBeInTheDocument();
    });

    it('should use default mobile size when not provided', () => {
      renderComponent();

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const mobileContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '60'
      );

      expect(mobileContainer).toBeInTheDocument();
      expect(mobileContainer).toHaveAttribute('data-height', '60');
      expect(mobileContainer).toHaveAttribute('data-width', '60');
    });

    it('should use default desktop size when not provided', () => {
      renderComponent();

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const desktopContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '120'
      );

      expect(desktopContainer).toBeInTheDocument();
      expect(desktopContainer).toHaveAttribute('data-height', '120');
      expect(desktopContainer).toHaveAttribute('data-width', '120');
    });

    it('should use custom mobile size when provided', () => {
      renderComponent({ mobileSize: 80 });

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const mobileContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '80'
      );

      expect(mobileContainer).toBeInTheDocument();
      expect(mobileContainer).toHaveAttribute('data-height', '80');
      expect(mobileContainer).toHaveAttribute('data-width', '80');
    });

    it('should use custom desktop size when provided', () => {
      renderComponent({ desktopSize: 150 });

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const desktopContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '150'
      );

      expect(desktopContainer).toBeInTheDocument();
      expect(desktopContainer).toHaveAttribute('data-height', '150');
      expect(desktopContainer).toHaveAttribute('data-width', '150');
    });
  });

  describe('Chart Configuration', () => {
    it('should configure RechartsBarChart with correct margin', () => {
      renderComponent();

      const pieCharts = screen.getAllByTestId('mocked-recharts-pie-chart');
      pieCharts.forEach(chart => {
        expect(chart).toHaveAttribute('data-margin', JSON.stringify({ left: 0, right: 0, top: 0, bottom: 0 }));
      });
    });

    it('should pass correct data-qa-id to RechartsBarChart', () => {
      renderComponent({ 'data-qa-id': 'custom-pie' });

      const pieCharts = screen.getAllByTestId('mocked-recharts-pie-chart');
      expect(pieCharts[0]).toHaveAttribute('data-chart-qa-id', 'custom-pie-mobile-chart');
      expect(pieCharts[1]).toHaveAttribute('data-chart-qa-id', 'custom-pie-desktop-chart');
    });

    it('should configure Pie with correct animation settings', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-is-animation-active', 'false');
      });
    });

    it('should configure Pie with correct angle settings', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-start-angle', '-270');
        expect(pie).toHaveAttribute('data-end-angle', '-630');
      });
    });

    it('should configure Pie with correct stroke settings', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-stroke', 'none');
      });
    });

    it('should configure Pie with correct fill and keys', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-fill', 'currentColor');
        expect(pie).toHaveAttribute('data-data-key', 'value');
        expect(pie).toHaveAttribute('data-name-key', 'name');
      });
    });
  });

  describe('Data Generation', () => {
    it('should generate correct data for given value', () => {
      renderComponent({ value: 75 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: 75, className: 'text-utility-brand-600' },
        { value: 25, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should generate correct data for zero value', () => {
      renderComponent({ value: 0 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: 0, className: 'text-utility-brand-600' },
        { value: 100, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should generate correct data for 100 value', () => {
      renderComponent({ value: 100 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: 100, className: 'text-utility-brand-600' },
        { value: 0, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should generate correct data for decimal values', () => {
      renderComponent({ value: 33.33 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: 33.33, className: 'text-utility-brand-600' },
        { value: 66.67, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should use correct CSS classes for data segments', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      pieComponents.forEach(pie => {
        const data = JSON.parse(pie.getAttribute('data-data') || '[]');
        expect(data[0].className).toBe('text-utility-brand-600');
        expect(data[1].className).toBe('text-utility-gray-200');
      });
    });
  });

  describe('Radius Calculations', () => {
    it('should calculate correct radius for default mobile size', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const mobileComponent = pieComponents.find(pie => {
        const innerRadius = pie.getAttribute('data-inner-radius');
        return innerRadius === '20'; // Math.round(60 * 0.33)
      });

      expect(mobileComponent).toBeInTheDocument();
      expect(mobileComponent).toHaveAttribute('data-inner-radius', '20');
      expect(mobileComponent).toHaveAttribute('data-outer-radius', '30'); // Math.round(60 * 0.5)
    });

    it('should calculate correct radius for default desktop size', () => {
      renderComponent();

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const desktopComponent = pieComponents.find(pie => {
        const innerRadius = pie.getAttribute('data-inner-radius');
        return innerRadius === '40'; // Math.round(120 * 0.33)
      });

      expect(desktopComponent).toBeInTheDocument();
      expect(desktopComponent).toHaveAttribute('data-inner-radius', '40');
      expect(desktopComponent).toHaveAttribute('data-outer-radius', '60'); // Math.round(120 * 0.5)
    });

    it('should calculate correct radius for custom mobile size', () => {
      renderComponent({ mobileSize: 90 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const mobileComponent = pieComponents.find(pie => {
        const innerRadius = pie.getAttribute('data-inner-radius');
        return innerRadius === '30'; // Math.round(90 * 0.33)
      });

      expect(mobileComponent).toBeInTheDocument();
      expect(mobileComponent).toHaveAttribute('data-inner-radius', '30');
      expect(mobileComponent).toHaveAttribute('data-outer-radius', '45'); // Math.round(90 * 0.5)
    });

    it('should calculate correct radius for custom desktop size', () => {
      renderComponent({ desktopSize: 200 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const desktopComponent = pieComponents.find(pie => {
        const innerRadius = pie.getAttribute('data-inner-radius');
        return innerRadius === '66'; // Math.round(200 * 0.33)
      });

      expect(desktopComponent).toBeInTheDocument();
      expect(desktopComponent).toHaveAttribute('data-inner-radius', '66');
      expect(desktopComponent).toHaveAttribute('data-outer-radius', '100'); // Math.round(200 * 0.5)
    });
  });

  describe('Data QA ID Prop Handling', () => {
    it('should use default data-qa-id when not provided', () => {
      renderComponent();

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart-desktop')).toBeInTheDocument();
    });

    it('should use custom data-qa-id when provided', () => {
      renderComponent({ 'data-qa-id': 'custom-pie' });

      expect(screen.getByTestId('custom-pie')).toBeInTheDocument();
      expect(screen.getByTestId('custom-pie-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('custom-pie-desktop')).toBeInTheDocument();
    });

    it('should not render default data-qa-id when custom is provided', () => {
      renderComponent({ 'data-qa-id': 'revenue-pie' });

      expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pie-chart-mobile')).not.toBeInTheDocument();
      expect(screen.getByTestId('revenue-pie')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-pie-mobile')).toBeInTheDocument();
    });

    it('should create dynamic child data-qa-ids based on main id', () => {
      const testCases = [
        { main: 'completion-chart', mobileExpected: 'completion-chart-mobile', desktopExpected: 'completion-chart-desktop' },
        { main: 'progress-pie', mobileExpected: 'progress-pie-mobile', desktopExpected: 'progress-pie-desktop' },
        { main: 'stats-chart', mobileExpected: 'stats-chart-mobile', desktopExpected: 'stats-chart-desktop' },
      ];

      testCases.forEach(({ main, mobileExpected, desktopExpected }) => {
        const { unmount } = renderComponent({ 'data-qa-id': main });
        expect(screen.getByTestId(mobileExpected)).toBeInTheDocument();
        expect(screen.getByTestId(desktopExpected)).toBeInTheDocument();
        unmount();
      });
    });

    it('should pass correct chart qa-ids to Recharts components', () => {
      renderComponent({ 'data-qa-id': 'analytics-pie' });

      const pieCharts = screen.getAllByTestId('mocked-recharts-pie-chart');
      expect(pieCharts[0]).toHaveAttribute('data-chart-qa-id', 'analytics-pie-mobile-chart');
      expect(pieCharts[1]).toHaveAttribute('data-chart-qa-id', 'analytics-pie-desktop-chart');
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'pie-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-mobile`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-desktop`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      renderComponent({ 'data-qa-id': '' });

      const { container } = render(<PieChart value={50} data-qa-id="" />);
      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-mobile"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-desktop"]')).toBeInTheDocument();
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const chart = screen.getByTestId('pie-chart');
      const mobileContainer = screen.getByTestId('pie-chart-mobile');
      const desktopContainer = screen.getByTestId('pie-chart-desktop');

      expect(chart).toContainElement(mobileContainer);
      expect(chart).toContainElement(desktopContainer);

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      expect(mobileContainer).toContainElement(responsiveContainers[0]);
      expect(desktopContainer).toContainElement(responsiveContainers[1]);
    });

    it('should render elements in correct order', () => {
      renderComponent();

      const chart = screen.getByTestId('pie-chart');
      const children = Array.from(chart.children);

      expect(children).toHaveLength(2);
      expect(children[0]).toHaveAttribute('data-qa-id', 'pie-chart-mobile');
      expect(children[1]).toHaveAttribute('data-qa-id', 'pie-chart-desktop');
    });

    it('should maintain Recharts component nesting', () => {
      renderComponent();

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const pieCharts = screen.getAllByTestId('mocked-recharts-pie-chart');
      const pieComponents = screen.getAllByTestId('mocked-pie');

      expect(responsiveContainers[0]).toContainElement(pieCharts[0]);
      expect(responsiveContainers[1]).toContainElement(pieCharts[1]);
      expect(pieCharts[0]).toContainElement(pieComponents[0]);
      expect(pieCharts[1]).toContainElement(pieComponents[1]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative values', () => {
      renderComponent({ value: -10 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: -10, className: 'text-utility-brand-600' },
        { value: 110, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should handle values over 100', () => {
      renderComponent({ value: 150 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      const expectedData = [
        { value: 150, className: 'text-utility-brand-600' },
        { value: -50, className: 'text-utility-gray-200' },
      ];

      pieComponents.forEach(pie => {
        expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
      });
    });

    it('should handle very small sizes', () => {
      renderComponent({ mobileSize: 1, desktopSize: 1 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      
      // Check that calculations still work for small sizes
      const mobileComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '0' // Math.round(1 * 0.33)
      );
      const desktopComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '0' && pie !== mobileComponent
      );

      expect(mobileComponent).toBeInTheDocument();
      expect(desktopComponent).toBeInTheDocument();
      expect(mobileComponent).toHaveAttribute('data-outer-radius', '1'); // Math.round(1 * 0.5)
    });

    it('should handle very large sizes', () => {
      renderComponent({ mobileSize: 1000, desktopSize: 2000 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      
      const mobileComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '330' // Math.round(1000 * 0.33)
      );
      const desktopComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '660' // Math.round(2000 * 0.33)
      );

      expect(mobileComponent).toBeInTheDocument();
      expect(desktopComponent).toBeInTheDocument();
      expect(mobileComponent).toHaveAttribute('data-outer-radius', '500'); // Math.round(1000 * 0.5)
      expect(desktopComponent).toHaveAttribute('data-outer-radius', '1000'); // Math.round(2000 * 0.5)
    });

    it('should handle decimal sizes', () => {
      renderComponent({ mobileSize: 33.33, desktopSize: 66.66 });

      const pieComponents = screen.getAllByTestId('mocked-pie');
      
      const mobileComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '11' // Math.round(33.33 * 0.33)
      );
      const desktopComponent = pieComponents.find(pie => 
        pie.getAttribute('data-inner-radius') === '22' // Math.round(66.66 * 0.33)
      );

      expect(mobileComponent).toBeInTheDocument();
      expect(desktopComponent).toBeInTheDocument();
    });

    it('should handle zero sizes', () => {
      renderComponent({ mobileSize: 0, desktopSize: 0 });

      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      expect(responsiveContainers[0]).toHaveAttribute('data-height', '0');
      expect(responsiveContainers[0]).toHaveAttribute('data-width', '0');
      expect(responsiveContainers[1]).toHaveAttribute('data-height', '0');
      expect(responsiveContainers[1]).toHaveAttribute('data-width', '0');
    });

    it('should handle undefined sizes gracefully', () => {
      renderComponent({ mobileSize: undefined, desktopSize: undefined });

      // Should use defaults
      const responsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      const mobileContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '60'
      );
      const desktopContainer = responsiveContainers.find(container => 
        container.getAttribute('data-height') === '120'
      );

      expect(mobileContainer).toBeInTheDocument();
      expect(desktopContainer).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 20; i++) {
        rerender(
          <PieChart
            value={i * 5}
            mobileSize={60 + i}
            desktopSize={120 + i * 2}
            data-qa-id={`chart-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('chart-19')).toBeInTheDocument();
    });

    it('should handle frequent value changes efficiently', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i <= 100; i += 10) {
        rerender(<PieChart value={i} />);

        const pieComponents = screen.getAllByTestId('mocked-pie');
        const expectedData = [
          { value: i, className: 'text-utility-brand-600' },
          { value: 100 - i, className: 'text-utility-gray-200' },
        ];

        pieComponents.forEach(pie => {
          expect(pie).toHaveAttribute('data-data', JSON.stringify(expectedData));
        });
      }
    });
  });

  describe('Integration', () => {
    it('should work correctly when used multiple times', () => {
      render(
        <div>
          <PieChart value={25} data-qa-id="chart-1" />
          <PieChart value={50} data-qa-id="chart-2" />
          <PieChart value={75} data-qa-id="chart-3" />
        </div>
      );

      expect(screen.getByTestId('chart-1')).toBeInTheDocument();
      expect(screen.getByTestId('chart-2')).toBeInTheDocument();
      expect(screen.getByTestId('chart-3')).toBeInTheDocument();

      expect(screen.getByTestId('chart-1-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('chart-2-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('chart-3-mobile')).toBeInTheDocument();
    });

    it('should maintain independent state for multiple instances', () => {
      render(
        <div>
          <PieChart value={30} mobileSize={50} data-qa-id="small-chart" />
          <PieChart value={70} desktopSize={200} data-qa-id="large-chart" />
        </div>
      );

      const allResponsiveContainers = screen.getAllByTestId('mocked-responsive-container');
      
      // Check that different sizes are applied correctly
      const smallMobile = allResponsiveContainers.find(c => c.getAttribute('data-height') === '50');
      const largeMobile = allResponsiveContainers.find(c => c.getAttribute('data-height') === '60');
      const smallDesktop = allResponsiveContainers.find(c => c.getAttribute('data-height') === '120');
      const largeDesktop = allResponsiveContainers.find(c => c.getAttribute('data-height') === '200');

      expect(smallMobile).toBeInTheDocument();
      expect(largeMobile).toBeInTheDocument();
      expect(smallDesktop).toBeInTheDocument();
      expect(largeDesktop).toBeInTheDocument();
    });
  });
});