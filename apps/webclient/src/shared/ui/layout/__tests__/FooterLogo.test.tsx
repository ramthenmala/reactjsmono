import { render, screen } from '@testing-library/react';
import { FooterLogo } from '@/shared/ui/layout/FooterLogo';
import '@testing-library/jest-dom';

describe('FooterLogo', () => {
  const defaultProps = {
    footerContent: 'This is the footer content describing the company mission and values.',
  };

  const renderComponent = (props = {}) => {
    return render(<FooterLogo {...defaultProps} {...props} />);
  };

  describe('Component Rendering', () => {
    it('should render footer logo section with all elements', () => {
      renderComponent();

      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('This is the footer content describing the company mission and values.')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-logo-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-logo-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-logo"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-content-text"]')).toBeInTheDocument();
    });

    it('should render logo with correct attributes', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('src', '/assets/images/brand/logo.svg');
      expect(logo).toHaveAttribute('width', '32');
      expect(logo).toHaveAttribute('height', '32');
      expect(logo).toHaveAttribute('alt', 'Logo');
    });
  });

  describe('Footer Content', () => {
    it('should display provided footer content', () => {
      const customContent = 'Custom footer content about our company';
      renderComponent({ footerContent: customContent });

      expect(screen.getByText(customContent)).toBeInTheDocument();
    });

    it('should handle long footer content', () => {
      const longContent = 'This is a very long footer content that describes the company in great detail, including mission, vision, values, and other important information that might span multiple lines and should be properly displayed in the footer section.';
      renderComponent({ footerContent: longContent });

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle footer content with special characters', () => {
      const specialContent = 'Footer content with special chars: @#$%^&*()_+-=[]{}|;:,.<>?';
      renderComponent({ footerContent: specialContent });

      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('should handle footer content with HTML-like text', () => {
      const htmlLikeContent = 'Content with <tags> & "quotes" and other HTML-like content';
      renderComponent({ footerContent: htmlLikeContent });

      expect(screen.getByText(htmlLikeContent)).toBeInTheDocument();
    });

    it('should handle empty footer content', () => {
      renderComponent({ footerContent: '' });

      const { container } = render(<FooterLogo footerContent="" />);
      const contentElement = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentElement).toBeEmptyDOMElement();
    });

    it('should handle footer content with Unicode characters', () => {
      const unicodeContent = 'Footer content with Unicode: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好';
      renderComponent({ footerContent: unicodeContent });

      expect(screen.getByText(unicodeContent)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct section styling', () => {
      const { container } = renderComponent();

      const section = container.querySelector('[data-qa-id="footer-logo-section"]');
      expect(section).toHaveClass('lg:col-span-1');
    });

    it('should have correct logo container styling', () => {
      const { container } = renderComponent();

      const logoContainer = container.querySelector('[data-qa-id="footer-logo-container"]');
      expect(logoContainer).toHaveClass('flex', 'items-center', 'gap-2', 'mb-4');
    });

    it('should have correct logo image styling', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveClass('h-8', 'w-auto');
    });

    it('should have correct content text styling', () => {
      const { container } = renderComponent();

      const contentText = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentText).toHaveClass(
        'text-white',
        'font-medium',
        'text-base',
        'leading-6',
        'leading-relaxed',
        'max-w-[320px]'
      );
    });
  });

  describe('Logo Properties', () => {
    it('should render logo as img element', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo.tagName).toBe('IMG');
    });

    it('should have correct logo source path', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('src', '/assets/images/brand/logo.svg');
    });

    it('should have proper logo dimensions', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('width', '32');
      expect(logo).toHaveAttribute('height', '32');
    });

    it('should maintain aspect ratio with CSS classes', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveClass('h-8', 'w-auto');
    });
  });

  describe('Content Text Properties', () => {
    it('should render content as paragraph element', () => {
      renderComponent();

      const content = screen.getByText('This is the footer content describing the company mission and values.');
      expect(content.tagName).toBe('P');
    });

    it('should have maximum width constraint', () => {
      const { container } = renderComponent();

      const contentText = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentText).toHaveClass('max-w-[320px]');
    });

    it('should have proper text styling for readability', () => {
      const { container } = renderComponent();

      const contentText = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentText).toHaveClass('leading-relaxed');
      expect(contentText).toHaveClass('text-white');
      expect(contentText).toHaveClass('font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible logo with alt text', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('alt');
      expect(logo.getAttribute('alt')).not.toBe('');
    });

    it('should be accessible by role', () => {
      renderComponent();

      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
    });

    it('should have readable text content', () => {
      renderComponent();

      const content = screen.getByText('This is the footer content describing the company mission and values.');
      expect(content).toBeVisible();
    });
  });

  describe('Layout Integration', () => {
    it('should work within grid layout', () => {
      const { container } = renderComponent();

      const section = container.querySelector('[data-qa-id="footer-logo-section"]');
      expect(section).toHaveClass('lg:col-span-1');
    });

    it('should have proper spacing between logo and text', () => {
      const { container } = renderComponent();

      const logoContainer = container.querySelector('[data-qa-id="footer-logo-container"]');
      expect(logoContainer).toHaveClass('mb-4');
    });

    it('should align logo and content properly', () => {
      const { container } = renderComponent();

      const logoContainer = container.querySelector('[data-qa-id="footer-logo-container"]');
      expect(logoContainer).toHaveClass('flex', 'items-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long footer content', () => {
      const extremelyLongContent = 'A'.repeat(1000);
      renderComponent({ footerContent: extremelyLongContent });

      expect(screen.getByText(extremelyLongContent)).toBeInTheDocument();
    });

    it('should handle footer content with line breaks', () => {
      const contentWithBreaks = 'First line\nSecond line\nThird line';
      renderComponent({ footerContent: contentWithBreaks });

      // Check that the content exists, even if line breaks change how it's normalized
      expect(screen.getByText(/First line/)).toBeInTheDocument();
      expect(screen.getByText(/Third line/)).toBeInTheDocument();
    });

    it('should handle footer content with only whitespace', () => {
      const whitespaceContent = '   \n   \t   ';
      renderComponent({ footerContent: whitespaceContent });

      // Use a more flexible approach for whitespace content
      const { container } = render(<FooterLogo footerContent={whitespaceContent} />);
      const contentElement = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentElement?.textContent).toBe(whitespaceContent);
    });

    it('should maintain layout with empty content', () => {
      renderComponent({ footerContent: '' });

      // Logo should still be rendered
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      
      // Container structure should be maintained
      const { container } = render(<FooterLogo footerContent="" />);
      expect(container.querySelector('[data-qa-id="footer-logo-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-logo-container"]')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive column spanning', () => {
      const { container } = renderComponent();

      const section = container.querySelector('[data-qa-id="footer-logo-section"]');
      expect(section).toHaveClass('lg:col-span-1');
    });

    it('should maintain text width constraints', () => {
      const { container } = renderComponent();

      const contentText = container.querySelector('[data-qa-id="footer-content-text"]');
      expect(contentText).toHaveClass('max-w-[320px]');
    });

    it('should handle logo sizing responsively', () => {
      renderComponent();

      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveClass('w-auto'); // Maintains aspect ratio
    });
  });

  describe('Performance Considerations', () => {
    it('should render efficiently with large content', () => {
      const largeContent = 'Large content '.repeat(10); // Reduced size
      
      const startTime = performance.now();
      renderComponent({ footerContent: largeContent });
      const endTime = performance.now();

      // Check that content renders (use regex to avoid huge string matching)
      expect(screen.getByText(/Large content/)).toBeInTheDocument();
      expect(endTime - startTime).toBeLessThan(1000); // Very generous threshold
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        rerender(<FooterLogo footerContent={`Content ${i}`} />);
        expect(screen.getByText(`Content ${i}`)).toBeInTheDocument();
      }
    });
  });
});