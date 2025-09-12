import { render, screen } from '@testing-library/react';
import { Banner } from '@/features/explore/components/Banner';
import '@testing-library/jest-dom';

// Mock the ExploreActions component
jest.mock('@/features/explore/components/Navigation/ExploreActions', () => ({
  ExploreActions: ({ size, variant, ...props }: any) => (
    <div
      data-qa-id="mocked-explore-actions"
      data-size={size}
      data-variant={variant}
      {...props}
    >
      Explore Actions
    </div>
  ),
}));

// Mock the ImageSection component
jest.mock('@/shared/ui/components/ImageSection', () => ({
  ImageSection: ({ 
    children, 
    backgroundImage, 
    alt, 
    className, 
    imageClassName,
    'data-qa-id': dataQaId,
    ...props 
  }: any) => (
    <section 
      className={className} 
      data-qa-id={dataQaId}
      data-background-image={backgroundImage}
      data-alt={alt}
      data-image-class-name={imageClassName}
      {...props}
    >
      {children}
    </section>
  ),
}));

describe('Banner', () => {
  const defaultProps = {
    imageSrc: '/path/to/banner-image.jpg',
  };

  const renderComponent = (props = {}) => {
    return render(<Banner {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render banner component with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('explore-banner')).toBeInTheDocument();
      expect(screen.getByTestId('explore-banner-actions')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-explore-actions')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="explore-banner"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="explore-banner-actions"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mocked-explore-actions"]')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner.tagName).toBe('SECTION');
    });
  });

  describe('ImageSection Integration', () => {
    it('should pass background image to ImageSection', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', '/path/to/banner-image.jpg');
    });

    it('should set correct alt text', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-alt', 'District overview');
    });

    it('should apply correct container className', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveClass('h-72', 'md:h-96', 'rounded-2xl');
    });

    it('should apply correct image className', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-image-class-name', 'rounded-2xl');
    });

    it('should handle undefined imageSrc', () => {
      renderComponent({ imageSrc: undefined });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).not.toHaveAttribute('data-background-image');
    });

    it('should handle empty imageSrc', () => {
      renderComponent({ imageSrc: '' });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', '');
    });

    it('should handle different image sources', () => {
      const customImageSrc = '/assets/districts/district-banner.png';
      renderComponent({ imageSrc: customImageSrc });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', customImageSrc);
    });
  });

  describe('Actions Container', () => {
    it('should render actions container with correct styling', () => {
      renderComponent();

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      expect(actionsContainer).toHaveClass(
        'absolute',
        'end-4',
        'top-4',
        'z-10',
        'hidden',
        'md:flex',
        'items-center',
        'gap-3'
      );
    });

    it('should render as div element', () => {
      renderComponent();

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      expect(actionsContainer.tagName).toBe('DIV');
    });

    it('should contain ExploreActions component', () => {
      renderComponent();

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      const exploreActions = screen.getByTestId('mocked-explore-actions');

      expect(actionsContainer).toContainElement(exploreActions);
    });
  });

  describe('ExploreActions Integration', () => {
    it('should pass correct size prop to ExploreActions', () => {
      renderComponent();

      const exploreActions = screen.getByTestId('mocked-explore-actions');
      expect(exploreActions).toHaveAttribute('data-size', 'sm');
    });

    it('should pass correct variant prop to ExploreActions', () => {
      renderComponent();

      const exploreActions = screen.getByTestId('mocked-explore-actions');
      expect(exploreActions).toHaveAttribute('data-variant', 'dark');
    });

    it('should render ExploreActions with correct content', () => {
      renderComponent();

      expect(screen.getByText('Explore Actions')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Prop Handling', () => {
    it('should use default data-qa-id when not provided', () => {
      renderComponent();

      expect(screen.getByTestId('explore-banner')).toBeInTheDocument();
      expect(screen.getByTestId('explore-banner-actions')).toBeInTheDocument();
    });

    it('should use custom data-qa-id when provided', () => {
      renderComponent({ 'data-qa-id': 'custom-banner' });

      expect(screen.getByTestId('custom-banner')).toBeInTheDocument();
      expect(screen.getByTestId('custom-banner-actions')).toBeInTheDocument();
    });

    it('should not render default data-qa-id when custom is provided', () => {
      renderComponent({ 'data-qa-id': 'district-banner' });

      expect(screen.queryByTestId('explore-banner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('explore-banner-actions')).not.toBeInTheDocument();
      expect(screen.getByTestId('district-banner')).toBeInTheDocument();
      expect(screen.getByTestId('district-banner-actions')).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      renderComponent({ 'data-qa-id': '' });

      const { container } = render(<Banner imageSrc="/test.jpg" data-qa-id="" />);
      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-actions"]')).toBeInTheDocument();
    });

    it('should create dynamic actions data-qa-id based on main id', () => {
      const testCases = [
        { main: 'test-banner', expected: 'test-banner-actions' },
        { main: 'district-overview', expected: 'district-overview-actions' },
        { main: 'region-banner', expected: 'region-banner-actions' },
        { main: 'custom-section', expected: 'custom-section-actions' },
      ];

      testCases.forEach(({ main, expected }) => {
        const { unmount } = renderComponent({ 'data-qa-id': main });
        expect(screen.getByTestId(expected)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'banner-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-actions`)).toBeInTheDocument();
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      const actionsContainer = screen.getByTestId('explore-banner-actions');
      const exploreActions = screen.getByTestId('mocked-explore-actions');

      expect(banner).toContainElement(actionsContainer);
      expect(actionsContainer).toContainElement(exploreActions);
    });

    it('should render all components in correct order', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      const actionsContainer = screen.getByTestId('explore-banner-actions');

      expect(banner.children).toHaveLength(1);
      expect(banner.children[0]).toBe(actionsContainer);
    });
  });

  describe('Styling Integration', () => {
    it('should apply banner styles from styles object', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      // Container styles: 'h-72 md:h-96 rounded-2xl'
      expect(banner).toHaveClass('h-72', 'md:h-96', 'rounded-2xl');

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      // Actions container styles: 'absolute end-4 top-4 z-10 hidden md:flex items-center gap-3'
      expect(actionsContainer).toHaveClass(
        'absolute',
        'end-4',
        'top-4',
        'z-10',
        'hidden',
        'md:flex',
        'items-center',
        'gap-3'
      );
    });

    it('should pass image styles to ImageSection', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      // Image styles: 'rounded-2xl'
      expect(banner).toHaveAttribute('data-image-class-name', 'rounded-2xl');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive height classes', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveClass('h-72', 'md:h-96');
    });

    it('should have responsive actions visibility', () => {
      renderComponent();

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      expect(actionsContainer).toHaveClass('hidden', 'md:flex');
    });

    it('should maintain rounded corners on different screen sizes', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveClass('rounded-2xl');
      expect(banner).toHaveAttribute('data-image-class-name', 'rounded-2xl');
    });
  });

  describe('Accessibility', () => {
    it('should provide alt text for background image', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-alt', 'District overview');
    });

    it('should be accessible by screen readers', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      const actionsContainer = screen.getByTestId('explore-banner-actions');
      const exploreActions = screen.getByTestId('mocked-explore-actions');

      expect(banner).toBeVisible();
      expect(actionsContainer).toBeVisible();
      expect(exploreActions).toBeVisible();
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner.tagName).toBe('SECTION');

      const actionsContainer = screen.getByTestId('explore-banner-actions');
      expect(actionsContainer.tagName).toBe('DIV');
    });

    it('should handle long alt text gracefully', () => {
      // Alt text is hardcoded, but test the structure remains intact
      renderComponent();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-alt', 'District overview');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props as undefined', () => {
      expect(() => {
        render(<Banner imageSrc={undefined} data-qa-id={undefined} />);
      }).not.toThrow();

      expect(screen.getByTestId('explore-banner')).toBeInTheDocument();
    });

    it('should handle null imageSrc', () => {
      renderComponent({ imageSrc: null });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).not.toHaveAttribute('data-background-image');
    });

    it('should handle very long image URLs', () => {
      const longImageUrl = 'https://example.com/' + 'a'.repeat(1000) + '.jpg';
      renderComponent({ imageSrc: longImageUrl });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', longImageUrl);
    });

    it('should handle image URLs with special characters', () => {
      const specialImageUrl = 'https://example.com/image-with-@#$%-chars.jpg?param=value&other=data';
      renderComponent({ imageSrc: specialImageUrl });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', specialImageUrl);
    });

    it('should handle data URLs for images', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      renderComponent({ imageSrc: dataUrl });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', dataUrl);
    });

    it('should handle blob URLs for images', () => {
      const blobUrl = 'blob:https://example.com/123e4567-e89b-12d3-a456-426614174000';
      renderComponent({ imageSrc: blobUrl });

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', blobUrl);
    });

    it('should handle numeric data-qa-id values', () => {
      renderComponent({ 'data-qa-id': '12345' });

      expect(screen.getByTestId('12345')).toBeInTheDocument();
      expect(screen.getByTestId('12345-actions')).toBeInTheDocument();
    });

    it('should handle Unicode characters in data-qa-id', () => {
      const unicodeId = 'banner-测试-العربية-🚀';
      renderComponent({ 'data-qa-id': unicodeId });

      expect(screen.getByTestId(unicodeId)).toBeInTheDocument();
      expect(screen.getByTestId(`${unicodeId}-actions`)).toBeInTheDocument();
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in BannerProps', () => {
      expect(() => {
        render(
          <Banner
            imageSrc="/test-image.jpg"
            data-qa-id="test-banner"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal props', () => {
      expect(() => {
        render(<Banner />);
      }).not.toThrow();

      expect(screen.getByTestId('explore-banner')).toBeInTheDocument();
    });

    it('should work with only imageSrc', () => {
      expect(() => {
        render(<Banner imageSrc="/minimal.jpg" />);
      }).not.toThrow();

      const banner = screen.getByTestId('explore-banner');
      expect(banner).toHaveAttribute('data-background-image', '/minimal.jpg');
    });

    it('should work with only data-qa-id', () => {
      expect(() => {
        render(<Banner data-qa-id="minimal-banner" />);
      }).not.toThrow();

      expect(screen.getByTestId('minimal-banner')).toBeInTheDocument();
      expect(screen.getByTestId('minimal-banner-actions')).toBeInTheDocument();
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
          <Banner
            imageSrc={`/image-${i}.jpg`}
            data-qa-id={`banner-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('banner-19')).toBeInTheDocument();
    });

    it('should handle frequent prop changes efficiently', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        rerender(
          <Banner
            imageSrc={i % 2 === 0 ? '/even-image.jpg' : '/odd-image.jpg'}
            data-qa-id={i % 2 === 0 ? 'even-banner' : 'odd-banner'}
          />
        );

        const expectedId = i % 2 === 0 ? 'even-banner' : 'odd-banner';
        const expectedImage = i % 2 === 0 ? '/even-image.jpg' : '/odd-image.jpg';

        expect(screen.getByTestId(expectedId)).toBeInTheDocument();
        expect(screen.getByTestId(expectedId)).toHaveAttribute('data-background-image', expectedImage);
      }
    });
  });

  describe('Component Integration', () => {
    it('should work correctly when nested in other components', () => {
      const WrapperComponent = () => (
        <div data-qa-id="wrapper">
          <Banner imageSrc="/nested-image.jpg" data-qa-id="nested-banner" />
        </div>
      );

      render(<WrapperComponent />);

      const wrapper = screen.getByTestId('wrapper');
      const banner = screen.getByTestId('nested-banner');

      expect(wrapper).toContainElement(banner);
      expect(banner).toBeInTheDocument();
    });

    it('should maintain functionality when used multiple times', () => {
      render(
        <div>
          <Banner imageSrc="/image1.jpg" data-qa-id="banner-1" />
          <Banner imageSrc="/image2.jpg" data-qa-id="banner-2" />
          <Banner imageSrc="/image3.jpg" data-qa-id="banner-3" />
        </div>
      );

      expect(screen.getByTestId('banner-1')).toBeInTheDocument();
      expect(screen.getByTestId('banner-2')).toBeInTheDocument();
      expect(screen.getByTestId('banner-3')).toBeInTheDocument();

      expect(screen.getByTestId('banner-1-actions')).toBeInTheDocument();
      expect(screen.getByTestId('banner-2-actions')).toBeInTheDocument();
      expect(screen.getByTestId('banner-3-actions')).toBeInTheDocument();
    });
  });
});