import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarketAccessAndDemand } from '@/features/explore/components/PropertyDetail/MarketAccessAndDemand';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  __esModule: true,
  default: ({ label, value, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
    </div>
  ),
}));

jest.mock('@compass/shared-ui', () => ({
  BadgeWithDot: ({ type, color, size, children, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-type={type}
      data-color={color}
      data-size={size}
    >
      {children}
    </div>
  ),
}));

describe('MarketAccessAndDemand', () => {
  const defaultProps = {
    title: 'Market Access and Demand',
    subTitle: 'Market Reach Score',
    value: 85,
    image: 'https://example.com/market.jpg',
  };

  const renderComponent = (props = {}) => {
    return render(<MarketAccessAndDemand {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-market' });

      expect(screen.getByTestId('custom-market')).toBeInTheDocument();
      expect(screen.queryByTestId('market-access-demand')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-content')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-badge')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-image')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display subtitle and value correctly', () => {
      renderComponent();

      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('Market Reach Score');
      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('85');
    });

    it('should display image with correct attributes', () => {
      renderComponent();

      const image = screen.getByTestId('market-access-demand-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/market.jpg');
      expect(image).toHaveAttribute('alt', 'Market Access and Demand');
    });

    it('should render BadgeWithDot with correct props', () => {
      renderComponent();

      const badge = screen.getByTestId('market-access-demand-badge');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'brand');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render image when image is null', () => {
      renderComponent({ image: null });

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-content')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
      expect(screen.queryByTestId('market-access-demand-image')).not.toBeInTheDocument();
    });

    it('should not render image when image is empty string', () => {
      renderComponent({ image: '' });

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
      expect(screen.queryByTestId('market-access-demand-image')).not.toBeInTheDocument();
    });

    it('should render StatCard even when value is null', () => {
      renderComponent({ value: null });

      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-badge')).toBeInTheDocument();
    });

    it('should render StatCard even when subTitle is empty', () => {
      renderComponent({ subTitle: '' });

      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('');
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-content')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-badge')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-image')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-market' });

      expect(screen.getByTestId('custom-market')).toBeInTheDocument();
      expect(screen.getByTestId('custom-market-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-market-stat')).toBeInTheDocument();
      expect(screen.getByTestId('custom-market-badge')).toBeInTheDocument();
      expect(screen.getByTestId('custom-market-image')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'market-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-content`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-stat`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-badge`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-stat"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-badge"]')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper responsive layout classes', () => {
      renderComponent();

      const container = screen.getByTestId('market-access-demand');
      const content = screen.getByTestId('market-access-demand-content');

      expect(container).toHaveClass('flex', 'flex-col-reverse', 'lg:flex-row', 'gap-4');
      expect(content).toHaveClass('lg:w-1/3');
    });

    it('should render image with correct responsive classes', () => {
      renderComponent();

      const image = screen.getByTestId('market-access-demand-image');
      expect(image).toHaveClass('lg:w-2/3', 'h-auto', 'rounded-2xl');
    });

    it('should maintain correct element order', () => {
      renderComponent();

      const container = screen.getByTestId('market-access-demand');
      const children = Array.from(container.children);

      const contentIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'market-access-demand-content'
      );
      const imageIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'market-access-demand-image'
      );

      expect(contentIndex).toBeLessThan(imageIndex);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null values gracefully', () => {
      renderComponent({
        subTitle: null,
        value: null,
        image: null,
      });

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-content')).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat')).toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      renderComponent({
        subTitle: '',
        value: '',
        image: '',
      });

      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('');
      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('');
      expect(screen.queryByTestId('market-access-demand-image')).not.toBeInTheDocument();
    });

    it('should handle very long text content', () => {
      const longSubTitle = 'A'.repeat(200);
      const longValue = 999999;

      renderComponent({
        subTitle: longSubTitle,
        value: longValue,
      });

      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent(longSubTitle);
      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent(longValue.toString());
    });

    it('should handle special characters in content', () => {
      renderComponent({
        subTitle: 'Market Access & Demand Analysis (2024)',
        value: 'Score: 85% - Excellent',
      });

      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('Market Access & Demand Analysis (2024)');
      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('Score: 85% - Excellent');
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
          <MarketAccessAndDemand
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

    it('should handle numeric values', () => {
      const numericValues = [0, 25, 50, 75, 100, 999];

      numericValues.forEach((value, index) => {
        const { unmount } = render(
          <MarketAccessAndDemand
            {...defaultProps}
            value={value}
            data-qa-id={`test-${index}`}
          />
        );

        expect(screen.getByTestId(`test-${index}-badge`)).toHaveTextContent(value.toString());
        unmount();
      });
    });

    it('should handle negative numbers', () => {
      renderComponent({ value: -50 });

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('-50');
    });

    it('should handle decimal numbers', () => {
      renderComponent({ value: 85.75 });

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('85.75');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('market-access-demand');
      const content = screen.getByTestId('market-access-demand-content');
      const stat = screen.getByTestId('market-access-demand-stat');
      const image = screen.getByTestId('market-access-demand-image');

      expect(container).toContainElement(content);
      expect(container).toContainElement(image);
      expect(content).toContainElement(stat);
    });

    it('should render BadgeWithDot inside StatCard value prop', () => {
      renderComponent();

      const stat = screen.getByTestId('market-access-demand-stat');
      const badge = screen.getByTestId('market-access-demand-badge');

      expect(stat).toContainElement(badge);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('market-access-demand')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('85');

      rerender(
        <MarketAccessAndDemand
          {...defaultProps}
          value={95}
          subTitle="Updated Market Score"
        />
      );

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('95');
      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('Updated Market Score');
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialContainer = screen.getByTestId('market-access-demand');
      expect(initialContainer.children).toHaveLength(2); // Content + Image

      rerender(
        <MarketAccessAndDemand
          {...defaultProps}
          value={75}
        />
      );

      const updatedContainer = screen.getByTestId('market-access-demand');
      expect(updatedContainer).toBeInTheDocument();
      expect(updatedContainer.children).toHaveLength(2); // Structure remains the same
    });

    it('should handle image removal during re-render', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('market-access-demand-image')).toBeInTheDocument();

      rerender(
        <MarketAccessAndDemand
          {...defaultProps}
          image={null}
        />
      );

      expect(screen.queryByTestId('market-access-demand-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });

    it('should handle image addition during re-render', () => {
      const { rerender } = renderComponent({ image: null });

      expect(screen.queryByTestId('market-access-demand-image')).not.toBeInTheDocument();

      rerender(
        <MarketAccessAndDemand
          {...defaultProps}
          image="https://example.com/new-image.jpg"
        />
      );

      const image = screen.getByTestId('market-access-demand-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/new-image.jpg');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <MarketAccessAndDemand
            {...defaultProps}
            value={i * 10}
            subTitle={`Market Score ${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('90');
    });

    it('should handle image changes efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        null,
        'https://example.com/image4.jpg',
      ];

      images.forEach(image => {
        rerender(
          <MarketAccessAndDemand
            {...defaultProps}
            image={image}
          />
        );
      });

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderComponent();

      const image = screen.getByTestId('market-access-demand-image');
      expect(image).toHaveAttribute('alt', 'Market Access and Demand');
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('market-access-demand');
      const content = screen.getByTestId('market-access-demand-content');
      const image = screen.getByTestId('market-access-demand-image');

      expect(container).toContainElement(content);
      expect(container).toContainElement(image);
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('market-access-demand'),
        screen.getByTestId('market-access-demand-content'),
        screen.getByTestId('market-access-demand-stat'),
        screen.getByTestId('market-access-demand-badge'),
        screen.getByTestId('market-access-demand-image'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('should remain accessible without image', () => {
      renderComponent({ image: null });

      const elements = [
        screen.getByTestId('market-access-demand'),
        screen.getByTestId('market-access-demand-content'),
        screen.getByTestId('market-access-demand-stat'),
        screen.getByTestId('market-access-demand-badge'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IMarketAccessAndDemand', () => {
      expect(() => {
        render(
          <MarketAccessAndDemand
            title="Test Market"
            subTitle="Test Subtitle"
            value={75}
            image="https://test.com/image.jpg"
            data-qa-id="test-market"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <MarketAccessAndDemand
            title="Minimal Market"
            subTitle="Minimal Subtitle"
            value={50}
            image={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <MarketAccessAndDemand
            title="Test Market"
            subTitle="Test Subtitle"
            value={60}
            image="https://test.com/image.jpg"
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });

    it('should handle missing optional props', () => {
      expect(() => {
        render(
          <MarketAccessAndDemand
            subTitle="Only Subtitle"
            value={80}
            image={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('market-access-demand')).toBeInTheDocument();
    });
  });

  describe('Integration with StatCard and BadgeWithDot', () => {
    it('should pass correct props to StatCard', () => {
      renderComponent();

      const statCard = screen.getByTestId('market-access-demand-stat');
      expect(statCard).toBeInTheDocument();
      expect(screen.getByTestId('market-access-demand-stat-label')).toHaveTextContent('Market Reach Score');
    });

    it('should embed BadgeWithDot correctly within StatCard value', () => {
      renderComponent();

      const badge = screen.getByTestId('market-access-demand-badge');
      const statCard = screen.getByTestId('market-access-demand-stat');

      expect(statCard).toContainElement(badge);
      expect(badge).toHaveTextContent('85');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'brand');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });

    it('should maintain BadgeWithDot styling across value changes', () => {
      const { rerender } = renderComponent();

      const badge = screen.getByTestId('market-access-demand-badge');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'brand');
      expect(badge).toHaveAttribute('data-size', 'lg');

      rerender(
        <MarketAccessAndDemand
          {...defaultProps}
          value="Updated Value"
        />
      );

      const updatedBadge = screen.getByTestId('market-access-demand-badge');
      expect(updatedBadge).toHaveAttribute('data-type', 'pill-color');
      expect(updatedBadge).toHaveAttribute('data-color', 'brand');
      expect(updatedBadge).toHaveAttribute('data-size', 'lg');
      expect(updatedBadge).toHaveTextContent('Updated Value');
    });
  });

  describe('Type Safety', () => {
    it('should handle boolean values', () => {
      renderComponent({ value: true });

      expect(screen.getByTestId('market-access-demand-badge')).toBeEmptyDOMElement();
    });

    it('should handle string values', () => {
      renderComponent({ value: 'High Market Access' });

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('High Market Access');
    });

    it('should handle zero value', () => {
      renderComponent({ value: 0 });

      expect(screen.getByTestId('market-access-demand-badge')).toHaveTextContent('0');
    });

    it('should handle undefined value', () => {
      renderComponent({ value: undefined });

      expect(screen.getByTestId('market-access-demand-badge')).toBeEmptyDOMElement();
    });
  });
});