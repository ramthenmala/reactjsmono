import React from 'react';
import { render, screen } from '@testing-library/react';
import { PropertyHeader } from '@/features/explore/components/PropertyDetail/PropertyHeader';
import '@testing-library/jest-dom';

// Mock the Banner component
jest.mock('../../Banner', () => ({
  Banner: ({ imageSrc, 'data-qa-id': dataQaId }: { imageSrc: string; 'data-qa-id'?: string }) => (
    <div data-qa-id={dataQaId} data-image-src={imageSrc}>
      Mocked Banner Component
    </div>
  ),
}));

describe('PropertyHeader', () => {
  const defaultProps = {
    banner: 'https://example.com/banner.jpg',
    name: 'Industrial City Name',
    description: 'This is a detailed description of the industrial city with all its features and amenities.',
  };

  const renderComponent = (props = {}) => {
    return render(<PropertyHeader {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('property-header')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-header' });

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.queryByTestId('property-header')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('property-header-banner')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-content')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-info')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-description')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderComponent();

      const title = screen.getByTestId('property-header-title');
      const description = screen.getByTestId('property-header-description');

      expect(title.tagName).toBe('H1');
      expect(description.tagName).toBe('P');
    });
  });

  describe('Content Display', () => {
    it('should display the provided name', () => {
      renderComponent();

      expect(screen.getByText('Industrial City Name')).toBeInTheDocument();
    });

    it('should display the provided description', () => {
      renderComponent();

      expect(screen.getByText('This is a detailed description of the industrial city with all its features and amenities.')).toBeInTheDocument();
    });

    it('should pass banner image to Banner component', () => {
      renderComponent();

      const banner = screen.getByTestId('property-header-banner');
      expect(banner).toHaveAttribute('data-image-src', 'https://example.com/banner.jpg');
    });

    it('should handle null banner', () => {
      renderComponent({ banner: null });

      const banner = screen.getByTestId('property-header-banner');
      expect(banner).toHaveAttribute('data-image-src', '');
    });

    it('should handle null description', () => {
      renderComponent({ description: null });

      const description = screen.getByTestId('property-header-description');
      expect(description).toBeEmptyDOMElement();
    });

    it('should handle empty strings', () => {
      renderComponent({ 
        name: '',
        description: '',
        banner: ''
      });

      expect(screen.getByTestId('property-header-title')).toHaveTextContent('');
      expect(screen.getByTestId('property-header-description')).toHaveTextContent('');
      
      const banner = screen.getByTestId('property-header-banner');
      expect(banner).toHaveAttribute('data-image-src', '');
    });

    it('should handle long text content', () => {
      const longName = 'A'.repeat(200);
      const longDescription = 'B'.repeat(1000);

      renderComponent({ 
        name: longName,
        description: longDescription
      });

      expect(screen.getByText(longName)).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      renderComponent({ 
        name: 'City with émojis 🏭 and spéciàl chärs',
        description: 'Description with HTML <tags> & entities &amp; symbols ©®™'
      });

      expect(screen.getByText('City with émojis 🏭 and spéciàl chärs')).toBeInTheDocument();
      expect(screen.getByText('Description with HTML <tags> & entities &amp; symbols ©®™')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('property-header')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-banner')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-content')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-info')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('property-header-description')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-header' });

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-banner')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-info')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header-description')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'header-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-banner`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-content`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-info`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-description`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-banner"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-info"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-description"]')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to elements', () => {
      renderComponent();

      const content = screen.getByTestId('property-header-content');
      const info = screen.getByTestId('property-header-info');
      const title = screen.getByTestId('property-header-title');
      const description = screen.getByTestId('property-header-description');

      expect(content).toHaveClass('flex', 'flex-col', 'md:flex-row', 'items-start', 'justify-between', 'gap-4');
      expect(info).toHaveClass('flex', 'flex-col', 'gap-5');
      expect(title).toHaveClass('text-4xl', 'font-semibold', 'md:font-medium', 'text-brand-900');
      expect(description).toHaveClass('text-lg', 'font-medium', 'text-gray-600', 'max-w-[629px]');
    });

    it('should maintain responsive design classes', () => {
      renderComponent();

      const content = screen.getByTestId('property-header-content');
      const title = screen.getByTestId('property-header-title');

      expect(content).toHaveClass('md:flex-row');
      expect(title).toHaveClass('md:font-medium');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('property-header');
      const banner = screen.getByTestId('property-header-banner');
      const content = screen.getByTestId('property-header-content');
      const info = screen.getByTestId('property-header-info');
      const title = screen.getByTestId('property-header-title');
      const description = screen.getByTestId('property-header-description');

      expect(container).toContainElement(banner);
      expect(container).toContainElement(content);
      expect(content).toContainElement(info);
      expect(info).toContainElement(title);
      expect(info).toContainElement(description);
    });

    it('should render banner before content', () => {
      renderComponent();

      const container = screen.getByTestId('property-header');
      const children = Array.from(container.children);

      const bannerIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'property-header-banner'
      );
      const contentIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'property-header-content'
      );

      expect(bannerIndex).toBeLessThan(contentIndex);
    });

    it('should render title before description within info section', () => {
      renderComponent();

      const info = screen.getByTestId('property-header-info');
      const children = Array.from(info.children);

      const titleIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'property-header-title'
      );
      const descriptionIndex = children.findIndex(child => 
        child.getAttribute('data-qa-id') === 'property-header-description'
      );

      expect(titleIndex).toBeLessThan(descriptionIndex);
    });
  });

  describe('Accessibility', () => {
    it('should provide proper semantic structure with heading', () => {
      renderComponent();

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Industrial City Name');
    });

    it('should be accessible for screen readers', () => {
      renderComponent();

      const title = screen.getByRole('heading');
      expect(title).toBeVisible();
      expect(title).toHaveAccessibleName('Industrial City Name');
    });

    it('should maintain proper heading hierarchy', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H1');
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IPropertyHeaderProps', () => {
      expect(() => {
        render(
          <PropertyHeader
            banner="https://example.com/test.jpg"
            name="Test Name"
            description="Test Description"
            data-qa-id="test-header"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <PropertyHeader
            banner={null}
            name="Test Name"
            description={null}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('property-header')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <PropertyHeader
            banner="https://example.com/test.jpg"
            name="Test Name"
            description="Test Description"
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('property-header')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid prop changes', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 5; i++) {
        rerender(
          <PropertyHeader
            banner={`https://example.com/banner${i}.jpg`}
            name={`Dynamic Name ${i}`}
            description={`Dynamic description ${i}`}
            data-qa-id={`dynamic-header-${i}`}
          />
        );

        expect(screen.getByText(`Dynamic Name ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Dynamic description ${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`dynamic-header-${i}`)).toBeInTheDocument();
      }
    });

    it('should handle various banner URL formats', () => {
      const bannerUrls = [
        'https://example.com/image.jpg',
        '/relative/path/image.png',
        'data:image/svg+xml;base64,PHN2Zw==',
        '',
        null
      ];

      bannerUrls.forEach((url, index) => {
        const { unmount } = render(
          <PropertyHeader
            banner={url}
            name={`Test ${index}`}
            description="Test description"
            data-qa-id={`test-${index}`}
          />
        );

        const banner = screen.getByTestId(`test-${index}-banner`);
        expect(banner).toHaveAttribute('data-image-src', url || '');

        unmount();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('property-header')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('property-header')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('Industrial City Name')).toBeInTheDocument();

      rerender(
        <PropertyHeader
          {...defaultProps}
          name="Updated Name"
          description="Updated Description"
        />
      );

      expect(screen.getByText('Updated Name')).toBeInTheDocument();
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
      expect(screen.queryByText('Industrial City Name')).not.toBeInTheDocument();
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialStructure = screen.getByTestId('property-header').innerHTML;

      rerender(
        <PropertyHeader
          {...defaultProps}
          name="Different Name"
        />
      );

      const updatedContainer = screen.getByTestId('property-header');
      expect(updatedContainer).toBeInTheDocument();
      // Structure should remain the same, only content changes
      expect(updatedContainer.children).toHaveLength(2); // Banner + Content
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('property-header')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <PropertyHeader
            {...defaultProps}
            name={`Name ${i}`}
            description={`Description ${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByText('Name 9')).toBeInTheDocument();
    });
  });
});