import { render, screen } from '@testing-library/react';
import { ImageSection } from '@/shared/ui/components/ImageSection';
import '@testing-library/jest-dom';

describe('ImageSection', () => {
  const defaultProps = {
    backgroundImage: '/path/to/test-image.jpg',
    alt: 'Test image alt text',
    children: <div data-qa-id="test-content">Test content</div>,
  };

  const renderComponent = (props = {}) => {
    return render(<ImageSection {...defaultProps} {...props} />);
  };

  describe('Component Rendering', () => {
    it('should render image section with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('image-section')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-background')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="image-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="image-section-background"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="image-section-content"]')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      renderComponent();

      const section = screen.getByTestId('image-section');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have correct base section styling', () => {
      renderComponent();

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass('relative', 'isolate', 'overflow-hidden');
    });
  });

  describe('Background Image Handling', () => {
    it('should render background image when provided', () => {
      renderComponent();

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage.tagName).toBe('IMG');
      expect(backgroundImage).toHaveAttribute('src', '/path/to/test-image.jpg');
      expect(backgroundImage).toHaveAttribute('alt', 'Test image alt text');
    });

    it('should have correct background image styling', () => {
      renderComponent();

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveClass(
        'absolute',
        'inset-0',
        'w-full',
        'h-full',
        'object-cover'
      );
    });

    it('should apply custom image className', () => {
      renderComponent({ imageClassName: 'custom-image-class' });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveClass('custom-image-class');
    });

    it('should use default alt text when not provided', () => {
      renderComponent({ alt: undefined });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', 'Background image');
    });

    it('should handle empty alt text', () => {
      renderComponent({ alt: '' });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', '');
    });

    it('should handle different image sources', () => {
      const customImagePath = '/assets/hero/banner.png';
      renderComponent({ backgroundImage: customImagePath });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', customImagePath);
    });
  });

  describe('Placeholder Rendering', () => {
    it('should render placeholder when no background image provided', () => {
      renderComponent({ backgroundImage: undefined });

      expect(screen.getByTestId('image-section-placeholder')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-placeholder-content')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-placeholder-inner')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-placeholder-icon')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-placeholder-text')).toBeInTheDocument();
    });

    it('should render placeholder when background image is empty string', () => {
      renderComponent({ backgroundImage: '' });

      expect(screen.getByTestId('image-section-placeholder')).toBeInTheDocument();
      expect(screen.queryByTestId('image-section-background')).not.toBeInTheDocument();
    });

    it('should render placeholder when background image is null', () => {
      renderComponent({ backgroundImage: null });

      expect(screen.getByTestId('image-section-placeholder')).toBeInTheDocument();
      expect(screen.queryByTestId('image-section-background')).not.toBeInTheDocument();
    });

    it('should have correct placeholder styling', () => {
      renderComponent({ backgroundImage: undefined });

      const placeholder = screen.getByTestId('image-section-placeholder');
      expect(placeholder).toHaveClass(
        'absolute',
        'inset-0',
        'w-full',
        'h-full',
        'bg-gradient-to-br',
        'from-gray-100',
        'to-gray-200'
      );
    });

    it('should have correct placeholder content styling', () => {
      renderComponent({ backgroundImage: undefined });

      const placeholderContent = screen.getByTestId('image-section-placeholder-content');
      expect(placeholderContent).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'h-full',
        'text-gray-400'
      );

      const placeholderInner = screen.getByTestId('image-section-placeholder-inner');
      expect(placeholderInner).toHaveClass('text-center');
    });

    it('should render placeholder icon with correct styling', () => {
      renderComponent({ backgroundImage: undefined });

      const icon = screen.getByTestId('image-section-placeholder-icon');
      expect(icon.tagName).toBe('svg');
      expect(icon).toHaveClass('mx-auto', 'h-16', 'w-16', 'mb-4');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('stroke', 'currentColor');
      expect(icon).toHaveAttribute('viewBox', '0 0 48 48');
    });

    it('should render placeholder text', () => {
      renderComponent({ backgroundImage: undefined });

      const text = screen.getByTestId('image-section-placeholder-text');
      expect(text).toHaveTextContent('Image not available');
      expect(text.tagName).toBe('P');
      expect(text).toHaveClass('text-sm', 'font-medium');
    });

    it('should apply custom imageClassName to placeholder', () => {
      renderComponent({ 
        backgroundImage: undefined, 
        imageClassName: 'custom-placeholder-class' 
      });

      const placeholder = screen.getByTestId('image-section-placeholder');
      expect(placeholder).toHaveClass('custom-placeholder-class');
    });
  });

  describe('Overlay Handling', () => {
    it('should not render overlay by default', () => {
      renderComponent();

      expect(screen.queryByTestId('image-section-overlay')).not.toBeInTheDocument();
    });

    it('should render overlay when hasOverlay is true', () => {
      renderComponent({ hasOverlay: true });

      expect(screen.getByTestId('image-section-overlay')).toBeInTheDocument();
    });

    it('should have correct overlay styling with default className', () => {
      renderComponent({ hasOverlay: true });

      const overlay = screen.getByTestId('image-section-overlay');
      expect(overlay).toHaveClass('absolute', 'inset-0');
      expect(overlay).toHaveClass('bg-[linear-gradient(180deg,rgba(10,9,18,0.55),rgba(16,12,26,0.85))]');
    });

    it('should apply custom overlay className', () => {
      renderComponent({ 
        hasOverlay: true, 
        overlayClassName: 'custom-overlay-gradient' 
      });

      const overlay = screen.getByTestId('image-section-overlay');
      expect(overlay).toHaveClass('absolute', 'inset-0', 'custom-overlay-gradient');
    });

    it('should render overlay as div element', () => {
      renderComponent({ hasOverlay: true });

      const overlay = screen.getByTestId('image-section-overlay');
      expect(overlay.tagName).toBe('DIV');
    });
  });

  describe('Children Content', () => {
    it('should render children when provided', () => {
      renderComponent();

      expect(screen.getByTestId('image-section-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should have correct content wrapper styling', () => {
      renderComponent();

      const content = screen.getByTestId('image-section-content');
      expect(content).toHaveClass('relative', 'z-10');
    });

    it('should not render content wrapper when no children provided', () => {
      renderComponent({ children: undefined });

      expect(screen.queryByTestId('image-section-content')).not.toBeInTheDocument();
    });

    it('should not render content wrapper when children is null', () => {
      renderComponent({ children: null });

      expect(screen.queryByTestId('image-section-content')).not.toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      const multipleChildren = (
        <>
          <div data-qa-id="child-1">Child 1</div>
          <div data-qa-id="child-2">Child 2</div>
        </>
      );

      renderComponent({ children: multipleChildren });

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      const complexChildren = (
        <div data-qa-id="parent">
          <h1 data-qa-id="title">Title</h1>
          <p data-qa-id="description">Description</p>
          <ul data-qa-id="list">
            <li data-qa-id="item-1">Item 1</li>
            <li data-qa-id="item-2">Item 2</li>
          </ul>
        </div>
      );

      renderComponent({ children: complexChildren });

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to section', () => {
      renderComponent({ className: 'custom-section-class' });

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass('custom-section-class');
    });

    it('should combine custom className with base classes', () => {
      renderComponent({ className: 'custom-class extra-styling' });

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass(
        'relative',
        'isolate',
        'overflow-hidden',
        'custom-class',
        'extra-styling'
      );
    });

    it('should handle empty className', () => {
      renderComponent({ className: '' });

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass('relative', 'isolate', 'overflow-hidden');
    });

    it('should handle undefined className', () => {
      renderComponent({ className: undefined });

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass('relative', 'isolate', 'overflow-hidden');
    });

    it('should apply custom imageClassName to background image', () => {
      renderComponent({ imageClassName: 'custom-image-styling' });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveClass('custom-image-styling');
    });

    it('should handle empty imageClassName', () => {
      renderComponent({ imageClassName: '' });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveClass(
        'absolute',
        'inset-0',
        'w-full',
        'h-full',
        'object-cover'
      );
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent({ hasOverlay: true });

      const section = screen.getByTestId('image-section');
      const backgroundImage = screen.getByTestId('image-section-background');
      const overlay = screen.getByTestId('image-section-overlay');
      const content = screen.getByTestId('image-section-content');

      expect(section).toContainElement(backgroundImage);
      expect(section).toContainElement(overlay);
      expect(section).toContainElement(content);
    });

    it('should render all components in correct order', () => {
      renderComponent({ hasOverlay: true });

      const section = screen.getByTestId('image-section');
      const children = Array.from(section.children);

      expect(children[0]).toHaveAttribute('data-qa-id', 'image-section-background');
      expect(children[1]).toHaveAttribute('data-qa-id', 'image-section-overlay');
      expect(children[2]).toHaveAttribute('data-qa-id', 'image-section-content');
    });

    it('should handle different combinations of props', () => {
      // Test with image, overlay, and content
      const { rerender } = renderComponent({ hasOverlay: true });
      expect(screen.getByTestId('image-section-background')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-content')).toBeInTheDocument();

      // Test with placeholder, overlay, and content
      rerender(
        <ImageSection
          backgroundImage=""
          hasOverlay={true}
          children={<div data-qa-id="test-content">Test content</div>}
        />
      );
      expect(screen.getByTestId('image-section-placeholder')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-content')).toBeInTheDocument();

      // Test with only image
      rerender(
        <ImageSection
          backgroundImage="/test.jpg"
          hasOverlay={false}
          children={undefined}
        />
      );
      expect(screen.getByTestId('image-section-background')).toBeInTheDocument();
      expect(screen.queryByTestId('image-section-overlay')).not.toBeInTheDocument();
      expect(screen.queryByTestId('image-section-content')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide alt text for background image', () => {
      renderComponent();

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', 'Test image alt text');
    });

    it('should be accessible by screen readers', () => {
      renderComponent();

      const section = screen.getByTestId('image-section');
      const backgroundImage = screen.getByTestId('image-section-background');
      const content = screen.getByTestId('image-section-content');

      expect(section).toBeVisible();
      expect(backgroundImage).toBeVisible();
      expect(content).toBeVisible();
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const section = screen.getByTestId('image-section');
      expect(section.tagName).toBe('SECTION');

      const content = screen.getByTestId('image-section-content');
      expect(section).toContainElement(content);
    });

    it('should handle long alt text', () => {
      const longAltText = 'A'.repeat(200);
      renderComponent({ alt: longAltText });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', longAltText);
    });

    it('should handle alt text with special characters', () => {
      const specialAltText = 'Image with special chars: @#$%^&*()_+-=[]{}|;:,.<>?';
      renderComponent({ alt: specialAltText });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', specialAltText);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props as undefined', () => {
      expect(() => {
        render(
          <ImageSection
            backgroundImage={undefined}
            alt={undefined}
            className={undefined}
            imageClassName={undefined}
            children={undefined}
            hasOverlay={undefined}
            overlayClassName={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('image-section')).toBeInTheDocument();
      expect(screen.getByTestId('image-section-placeholder')).toBeInTheDocument();
    });

    it('should handle boolean values for strings', () => {
      renderComponent({
        alt: 'true',
        className: 'false',
        imageClassName: 'true',
      });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', 'true');
    });

    it('should handle number values for strings', () => {
      renderComponent({
        alt: 12345 as any,
        className: 67890 as any,
      });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('alt', '12345');

      const section = screen.getByTestId('image-section');
      expect(section).toHaveClass('67890');
    });

    it('should handle very long image URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(1000) + '.jpg';
      renderComponent({ backgroundImage: longUrl });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', longUrl);
    });

    it('should handle image URLs with special characters', () => {
      const specialUrl = 'https://example.com/image-with-@#$%-chars.jpg?param=value&other=data';
      renderComponent({ backgroundImage: specialUrl });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', specialUrl);
    });

    it('should handle children with null values mixed in', () => {
      const mixedChildren = (
        <>
          <div data-qa-id="valid-child">Valid</div>
          {null}
          {undefined}
          <span data-qa-id="another-valid">Another</span>
        </>
      );

      renderComponent({ children: mixedChildren });

      expect(screen.getByTestId('valid-child')).toBeInTheDocument();
      expect(screen.getByTestId('another-valid')).toBeInTheDocument();
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
          <ImageSection
            backgroundImage={`/image-${i}.jpg`}
            alt={`Image ${i}`}
            className={`class-${i}`}
            hasOverlay={i % 2 === 0}
          >
            <div data-qa-id={`content-${i}`}>Content {i}</div>
          </ImageSection>
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByTestId('content-19')).toBeInTheDocument();
    });

    it('should handle frequent overlay toggles', () => {
      const { rerender } = renderComponent({ hasOverlay: false });

      for (let i = 0; i < 10; i++) {
        const hasOverlay = i % 2 === 0;
        rerender(<ImageSection {...defaultProps} hasOverlay={hasOverlay} />);

        if (hasOverlay) {
          expect(screen.getByTestId('image-section-overlay')).toBeInTheDocument();
        } else {
          expect(screen.queryByTestId('image-section-overlay')).not.toBeInTheDocument();
        }
      }
    });
  });

  describe('Image Loading States', () => {
    it('should handle image loading errors gracefully', () => {
      renderComponent({ backgroundImage: '/non-existent-image.jpg' });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', '/non-existent-image.jpg');
      // The component itself doesn't handle loading errors, but should still render
      expect(backgroundImage).toBeInTheDocument();
    });

    it('should handle data URLs', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      renderComponent({ backgroundImage: dataUrl });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', dataUrl);
    });

    it('should handle blob URLs', () => {
      const blobUrl = 'blob:https://example.com/123e4567-e89b-12d3-a456-426614174000';
      renderComponent({ backgroundImage: blobUrl });

      const backgroundImage = screen.getByTestId('image-section-background');
      expect(backgroundImage).toHaveAttribute('src', blobUrl);
    });
  });
});