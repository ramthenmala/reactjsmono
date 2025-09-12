import { render, screen } from '@testing-library/react';
import { HeaderLogo } from '@/shared/ui/navigation/HeaderLogo';
import '@testing-library/jest-dom';

describe('HeaderLogo', () => {
  describe('Component Rendering', () => {
    it('should render logo image with correct attributes', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/assets/images/brand/logo.svg');
      expect(logo).toHaveAttribute('alt', 'Compass');
    });

    it('should have correct data-qa-id attribute', () => {
      const { container } = render(<HeaderLogo />);

      const logo = container.querySelector('[data-qa-id="header-logo"]');
      
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/assets/images/brand/logo.svg');
    });

    it('should apply default classes', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto');
    });
  });

  describe('Props Handling', () => {
    it('should apply custom className when provided', () => {
      render(<HeaderLogo className="custom-class" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto', 'custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<HeaderLogo className="h-10 custom-style" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto', 'h-10', 'custom-style');
    });

    it('should handle empty className prop', () => {
      render(<HeaderLogo className="" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto');
    });

    it('should handle undefined className prop', () => {
      render(<HeaderLogo className={undefined} />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto');
    });

    it('should handle className with multiple spaces', () => {
      render(<HeaderLogo className="  class1   class2  " />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto', 'class1', 'class2');
    });
  });

  describe('Image Properties', () => {
    it('should render as an img element', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo.tagName).toBe('IMG');
    });

    it('should have proper image path', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveAttribute('src', '/assets/images/brand/logo.svg');
    });

    it('should have accessible alt text', () => {
      render(<HeaderLogo />);

      const logo = screen.getByRole('img');
      
      expect(logo).toHaveAttribute('alt', 'Compass');
    });

    it('should maintain aspect ratio with w-auto class', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('w-auto');
    });

    it('should have fixed height with h-8 class', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8');
    });
  });

  describe('Styling', () => {
    it('should apply Tailwind classes correctly', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      const classes = logo.className.split(' ');
      
      expect(classes).toContain('h-8');
      expect(classes).toContain('w-auto');
    });

    it('should handle className override for height', () => {
      render(<HeaderLogo className="h-12" />);

      const logo = screen.getByAltText('Compass');
      
      // Both h-8 and h-12 will be present, CSS specificity will determine which applies
      expect(logo).toHaveClass('h-8', 'h-12');
    });

    it('should handle className override for width', () => {
      render(<HeaderLogo className="w-32" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('w-auto', 'w-32');
    });

    it('should handle responsive classes', () => {
      render(<HeaderLogo className="md:h-10 lg:h-12" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto', 'md:h-10', 'lg:h-12');
    });

    it('should handle utility classes', () => {
      render(<HeaderLogo className="opacity-90 hover:opacity-100" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-8', 'w-auto', 'opacity-90', 'hover:opacity-100');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by role', () => {
      render(<HeaderLogo />);

      const logo = screen.getByRole('img');
      
      expect(logo).toBeInTheDocument();
    });

    it('should have descriptive alt text', () => {
      render(<HeaderLogo />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveAttribute('alt');
      expect(logo.getAttribute('alt')).not.toBe('');
    });

    it('should be findable by alt text', () => {
      render(<HeaderLogo />);

      expect(screen.getByAltText('Compass')).toBeInTheDocument();
    });

    it('should be findable by data-qa-id', () => {
      const { container } = render(<HeaderLogo />);

      expect(container.querySelector('[data-qa-id="header-logo"]')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with different parent containers', () => {
      const { container } = render(
        <div className="flex items-center">
          <HeaderLogo />
        </div>
      );

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement).toHaveClass('flex', 'items-center');
    });

    it('should work with link wrapper', () => {
      render(
        <a href="/">
          <HeaderLogo />
        </a>
      );

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement?.tagName).toBe('A');
    });

    it('should work with button wrapper', () => {
      render(
        <button type="button">
          <HeaderLogo />
        </button>
      );

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toBeInTheDocument();
      expect(logo.parentElement?.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in className', () => {
      render(<HeaderLogo className="hover:scale-110 transition-transform" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('hover:scale-110', 'transition-transform');
    });

    it('should handle className with pseudo-classes', () => {
      render(<HeaderLogo className="focus:outline-none active:scale-95" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('focus:outline-none', 'active:scale-95');
    });

    it('should handle className with arbitrary values', () => {
      render(<HeaderLogo className="h-[2.5rem] w-[120px]" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('h-[2.5rem]', 'w-[120px]');
    });

    it('should handle className with negative values', () => {
      render(<HeaderLogo className="-mt-1 -ml-2" />);

      const logo = screen.getByAltText('Compass');
      
      expect(logo).toHaveClass('-mt-1', '-ml-2');
    });
  });

});