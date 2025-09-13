import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeagalAndRegulatory } from '@/features/explore/components/PropertyDetail/LeagalAndRegulatory';
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
  Badge: ({ type, color, size, className, children, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-type={type}
      data-color={color}
      data-size={size}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('LeagalAndRegulatory', () => {
  const defaultProps = {
    title: 'Legal and Regulatory Framework',
    subTitle: 'Regulatory Compliance Status',
    value: 'Fully Compliant',
    image: 'https://example.com/legal.jpg',
  };

  const renderComponent = (props = {}) => {
    return render(<LeagalAndRegulatory {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-legal' });

      expect(screen.getByTestId('custom-legal')).toBeInTheDocument();
      expect(screen.queryByTestId('legal-regulatory')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-content')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-badge')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-image')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display subtitle and value correctly', () => {
      renderComponent();

      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('Regulatory Compliance Status');
      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('Fully Compliant');
    });

    it('should display image with correct attributes', () => {
      renderComponent();

      const image = screen.getByTestId('legal-regulatory-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/legal.jpg');
      expect(image).toHaveAttribute('alt', 'Legal and Regulatory');
    });

    it('should render Badge with correct props', () => {
      renderComponent();

      const badge = screen.getByTestId('legal-regulatory-badge');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'brand');
      expect(badge).toHaveAttribute('data-size', 'lg');
      expect(badge).toHaveClass('px-6');
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render image when image is null', () => {
      renderComponent({ image: null });

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-content')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
      expect(screen.queryByTestId('legal-regulatory-image')).not.toBeInTheDocument();
    });

    it('should not render image when image is empty string', () => {
      renderComponent({ image: '' });

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
      expect(screen.queryByTestId('legal-regulatory-image')).not.toBeInTheDocument();
    });

    it('should render StatCard even when value is null', () => {
      renderComponent({ value: null });

      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-badge')).toBeInTheDocument();
    });

    it('should render StatCard even when subTitle is empty', () => {
      renderComponent({ subTitle: '' });

      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('');
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-content')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-badge')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-image')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-legal' });

      expect(screen.getByTestId('custom-legal')).toBeInTheDocument();
      expect(screen.getByTestId('custom-legal-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-legal-stat')).toBeInTheDocument();
      expect(screen.getByTestId('custom-legal-badge')).toBeInTheDocument();
      expect(screen.getByTestId('custom-legal-image')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'legal-with_special-chars.123';
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

      const container = screen.getByTestId('legal-regulatory');
      const content = screen.getByTestId('legal-regulatory-content');

      expect(container).toHaveClass('flex', 'flex-col-reverse', 'lg:flex-row', 'gap-4');
      expect(content).toHaveClass('lg:w-1/2');
    });

    it('should render image with correct responsive classes', () => {
      renderComponent();

      const image = screen.getByTestId('legal-regulatory-image');
      expect(image).toHaveClass('lg:w-1/2', 'h-auto', 'rounded-2xl');
    });

    it('should maintain correct element order', () => {
      renderComponent();

      const container = screen.getByTestId('legal-regulatory');
      const children = Array.from(container.children);

      const contentIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'legal-regulatory-content'
      );
      const imageIndex = children.findIndex(child =>
        child.getAttribute('data-qa-id') === 'legal-regulatory-image'
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

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-content')).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat')).toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      renderComponent({
        subTitle: '',
        value: '',
        image: '',
      });

      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('');
      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('');
      expect(screen.queryByTestId('legal-regulatory-image')).not.toBeInTheDocument();
    });

    it('should handle very long text content', () => {
      const longSubTitle = 'A'.repeat(200);
      const longValue = 'B'.repeat(100);

      renderComponent({
        subTitle: longSubTitle,
        value: longValue,
      });

      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent(longSubTitle);
      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent(longValue);
    });

    it('should handle special characters in content', () => {
      renderComponent({
        subTitle: 'Legal & Regulatory Framework (2024)',
        value: 'Compliant with ISO 9001:2015 & GMP',
      });

      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('Legal & Regulatory Framework (2024)');
      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('Compliant with ISO 9001:2015 & GMP');
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
          <LeagalAndRegulatory
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
      renderComponent({ value: 2024 });

      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('2024');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('legal-regulatory');
      const content = screen.getByTestId('legal-regulatory-content');
      const stat = screen.getByTestId('legal-regulatory-stat');
      const image = screen.getByTestId('legal-regulatory-image');

      expect(container).toContainElement(content);
      expect(container).toContainElement(image);
      expect(content).toContainElement(stat);
    });

    it('should render Badge inside StatCard value prop', () => {
      renderComponent();

      const stat = screen.getByTestId('legal-regulatory-stat');
      const badge = screen.getByTestId('legal-regulatory-badge');

      expect(stat).toContainElement(badge);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('legal-regulatory')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('Fully Compliant');

      rerender(
        <LeagalAndRegulatory
          {...defaultProps}
          value="Partially Compliant"
          subTitle="Updated Compliance Status"
        />
      );

      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('Partially Compliant');
      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('Updated Compliance Status');
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialContainer = screen.getByTestId('legal-regulatory');
      expect(initialContainer.children).toHaveLength(2); // Content + Image

      rerender(
        <LeagalAndRegulatory
          {...defaultProps}
          value="Different Value"
        />
      );

      const updatedContainer = screen.getByTestId('legal-regulatory');
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
      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <LeagalAndRegulatory
            {...defaultProps}
            value={`Status ${i}`}
            subTitle={`Compliance ${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('legal-regulatory-badge')).toHaveTextContent('Status 9');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderComponent();

      const image = screen.getByTestId('legal-regulatory-image');
      expect(image).toHaveAttribute('alt', 'Legal and Regulatory');
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('legal-regulatory');
      const content = screen.getByTestId('legal-regulatory-content');
      const image = screen.getByTestId('legal-regulatory-image');

      expect(container).toContainElement(content);
      expect(container).toContainElement(image);
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('legal-regulatory'),
        screen.getByTestId('legal-regulatory-content'),
        screen.getByTestId('legal-regulatory-stat'),
        screen.getByTestId('legal-regulatory-badge'),
        screen.getByTestId('legal-regulatory-image'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in ILeagalAndRegulatory', () => {
      expect(() => {
        render(
          <LeagalAndRegulatory
            title="Test Legal"
            subTitle="Test Subtitle"
            value="Test Value"
            image="https://test.com/image.jpg"
            data-qa-id="test-legal"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <LeagalAndRegulatory
            title="Minimal Legal"
            subTitle="Minimal Subtitle"
            value="Minimal Value"
            image={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <LeagalAndRegulatory
            title="Test Legal"
            subTitle="Test Subtitle"
            value="Test Value"
            image="https://test.com/image.jpg"
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('legal-regulatory')).toBeInTheDocument();
    });
  });

  describe('Integration with StatCard and Badge', () => {
    it('should pass correct props to StatCard', () => {
      renderComponent();

      const statCard = screen.getByTestId('legal-regulatory-stat');
      expect(statCard).toBeInTheDocument();
      expect(screen.getByTestId('legal-regulatory-stat-label')).toHaveTextContent('Regulatory Compliance Status');
    });

    it('should embed Badge correctly within StatCard value', () => {
      renderComponent();

      const badge = screen.getByTestId('legal-regulatory-badge');
      const statCard = screen.getByTestId('legal-regulatory-stat');

      expect(statCard).toContainElement(badge);
      expect(badge).toHaveTextContent('Fully Compliant');
    });
  });
});