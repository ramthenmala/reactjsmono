import { render, screen } from '@testing-library/react';
import { Hero } from '@/shared/ui/components/Hero';
import '@testing-library/jest-dom';

// Mock the Breadcrumb component
jest.mock('@compass/shared-ui', () => ({
  Breadcrumb: ({ items, showHome, ...props }: any) => (
    <nav data-qa-id="breadcrumb-component" {...props}>
      {showHome && <span data-qa-id="breadcrumb-home">Home</span>}
      {items?.map((item: any, index: number) => (
        <span key={index} data-qa-id={`breadcrumb-item-${index}`}>
          {item.label}
        </span>
      ))}
    </nav>
  ),
}));

// Mock the ImageSection component
jest.mock('@/shared/ui/components/ImageSection', () => ({
  ImageSection: ({ 
    children, 
    backgroundImage, 
    alt, 
    className, 
    hasOverlay,
    'data-qa-id': dataQaId,
    ...props 
  }: any) => (
    <section 
      className={className} 
      data-qa-id={dataQaId}
      data-background-image={backgroundImage}
      data-alt={alt}
      data-has-overlay={hasOverlay}
      {...props}
    >
      {children}
    </section>
  ),
}));

describe('Hero', () => {
  const defaultProps = {
    backgroundImage: '/path/to/hero-image.jpg',
    title: 'Welcome to Our Platform',
    subtitle: 'Discover amazing features and capabilities',
    breadcrumbItems: [
      { label: 'Products', href: '/products' },
      { label: 'Category', href: '/products/category' },
      { label: 'Current Page', href: '/products/category/current' },
    ],
  };

  const renderComponent = (props = {}) => {
    return render(<Hero {...defaultProps} {...props} />);
  };

  describe('Component Rendering', () => {
    it('should render hero component with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('hero-container')).toBeInTheDocument();
      expect(screen.getByTestId('hero-breadcrumb')).toBeInTheDocument();
      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
      expect(screen.getByTestId('hero-title')).toBeInTheDocument();
      expect(screen.getByTestId('hero-subtitle')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="hero-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="hero-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="hero-breadcrumb"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="hero-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="hero-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="hero-subtitle"]')).toBeInTheDocument();
    });

    it('should pass props correctly to ImageSection', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-background-image', '/path/to/hero-image.jpg');
      expect(heroSection).toHaveAttribute('data-alt', 'Hero background');
      expect(heroSection).toHaveAttribute('data-has-overlay', 'true');
    });
  });

  describe('ImageSection Integration', () => {
    it('should use ImageSection as the wrapper component', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection.tagName).toBe('SECTION');
    });

    it('should pass background image to ImageSection', () => {
      const customImage = '/custom/hero-background.jpg';
      renderComponent({ backgroundImage: customImage });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-background-image', customImage);
    });

    it('should set correct alt text for hero background', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-alt', 'Hero background');
    });

    it('should enable overlay by default', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-has-overlay', 'true');
    });

    it('should apply correct default classes', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveClass('pt-40', 'pb-34');
    });

    it('should combine custom className with defaults', () => {
      renderComponent({ className: 'custom-hero-class' });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveClass('pt-40', 'pb-34', 'custom-hero-class');
    });
  });

  describe('Container and Layout', () => {
    it('should have correct container styling', () => {
      renderComponent();

      const container = screen.getByTestId('hero-container');
      expect(container).toHaveClass('container', 'mx-auto', 'px-4');
    });

    it('should render container as div element', () => {
      renderComponent();

      const container = screen.getByTestId('hero-container');
      expect(container.tagName).toBe('DIV');
    });
  });

  describe('Breadcrumb Integration', () => {
    it('should render breadcrumb when items are provided', () => {
      renderComponent();

      expect(screen.getByTestId('hero-breadcrumb')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-component')).toBeInTheDocument();
    });

    it('should pass breadcrumb items correctly', () => {
      renderComponent();

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Products');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Category');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Current Page');
    });

    it('should show home breadcrumb', () => {
      renderComponent();

      expect(screen.getByTestId('breadcrumb-home')).toHaveTextContent('Home');
    });

    it('should not render breadcrumb when items is null', () => {
      renderComponent({ breadcrumbItems: null });

      expect(screen.queryByTestId('hero-breadcrumb')).not.toBeInTheDocument();
    });

    it('should not render breadcrumb when items is undefined', () => {
      renderComponent({ breadcrumbItems: undefined });

      expect(screen.queryByTestId('hero-breadcrumb')).not.toBeInTheDocument();
    });

    it('should not render breadcrumb when items is empty array', () => {
      renderComponent({ breadcrumbItems: [] });

      expect(screen.queryByTestId('hero-breadcrumb')).not.toBeInTheDocument();
    });

    it('should wrap breadcrumb in div with data-qa-id', () => {
      renderComponent();

      const breadcrumbWrapper = screen.getByTestId('hero-breadcrumb');
      expect(breadcrumbWrapper.tagName).toBe('DIV');
      expect(breadcrumbWrapper).toContainElement(screen.getByTestId('breadcrumb-component'));
    });
  });

  describe('Title Display', () => {
    it('should display title when provided', () => {
      renderComponent();

      expect(screen.getByTestId('hero-title')).toHaveTextContent('Welcome to Our Platform');
    });

    it('should render title as h1 element', () => {
      renderComponent();

      const title = screen.getByTestId('hero-title');
      expect(title.tagName).toBe('H1');
    });

    it('should have correct title styling', () => {
      renderComponent();

      const title = screen.getByTestId('hero-title');
      expect(title).toHaveClass(
        'font-sans',
        'font-semibold',
        'text-center',
        'text-[40px]',
        'leading-[43px]',
        'tracking-[-0.02em]',
        'md:text-[48px]',
        'md:leading-[60px]',
        'text-[#F5F5F6]'
      );
    });

    it('should not render title when not provided', () => {
      renderComponent({ title: undefined });

      expect(screen.queryByTestId('hero-title')).not.toBeInTheDocument();
    });

    it('should not render title when empty string', () => {
      renderComponent({ title: '' });

      expect(screen.queryByTestId('hero-title')).not.toBeInTheDocument();
    });

    it('should handle long titles', () => {
      const longTitle = 'A'.repeat(200);
      renderComponent({ title: longTitle });

      expect(screen.getByTestId('hero-title')).toHaveTextContent(longTitle);
    });

    it('should handle titles with special characters', () => {
      const specialTitle = 'Welcome to Platform™ & Co. <Amazing> Features!';
      renderComponent({ title: specialTitle });

      expect(screen.getByTestId('hero-title')).toHaveTextContent(specialTitle);
    });
  });

  describe('Subtitle Display', () => {
    it('should display subtitle when provided', () => {
      renderComponent();

      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('Discover amazing features and capabilities');
    });

    it('should render subtitle as p element', () => {
      renderComponent();

      const subtitle = screen.getByTestId('hero-subtitle');
      expect(subtitle.tagName).toBe('P');
    });

    it('should have correct subtitle styling', () => {
      renderComponent();

      const subtitle = screen.getByTestId('hero-subtitle');
      expect(subtitle).toHaveClass(
        'mt-8',
        'text-center',
        'font-sans',
        'text-[14px]',
        'leading-[20px]',
        'font-normal',
        'md:text-[18px]',
        'md:leading-[28px]',
        'md:font-medium',
        'tracking-normal',
        'text-[#F5F5F6]'
      );
    });

    it('should not render subtitle when not provided', () => {
      renderComponent({ subtitle: undefined });

      expect(screen.queryByTestId('hero-subtitle')).not.toBeInTheDocument();
    });

    it('should not render subtitle when empty string', () => {
      renderComponent({ subtitle: '' });

      expect(screen.queryByTestId('hero-subtitle')).not.toBeInTheDocument();
    });

    it('should handle long subtitles', () => {
      const longSubtitle = 'B'.repeat(500);
      renderComponent({ subtitle: longSubtitle });

      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent(longSubtitle);
    });

    it('should handle subtitles with special characters', () => {
      const specialSubtitle = 'Discover features: @#$%^&*() with Unicode 👍 ✅ 🚀';
      renderComponent({ subtitle: specialSubtitle });

      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent(specialSubtitle);
    });
  });

  describe('Content Section Rendering', () => {
    it('should render content section when title or subtitle is provided', () => {
      renderComponent({ title: 'Test Title', subtitle: undefined });

      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
    });

    it('should render content section when subtitle is provided without title', () => {
      renderComponent({ title: undefined, subtitle: 'Test Subtitle' });

      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
    });

    it('should render content section when both title and subtitle are provided', () => {
      renderComponent();

      expect(screen.getByTestId('hero-content')).toBeInTheDocument();
    });

    it('should not render content section when neither title nor subtitle is provided', () => {
      renderComponent({ title: undefined, subtitle: undefined });

      expect(screen.queryByTestId('hero-content')).not.toBeInTheDocument();
    });

    it('should not render content section when both are empty strings', () => {
      renderComponent({ title: '', subtitle: '' });

      expect(screen.queryByTestId('hero-content')).not.toBeInTheDocument();
    });

    it('should have correct content section styling', () => {
      renderComponent();

      const content = screen.getByTestId('hero-content');
      expect(content).toHaveClass(
        'mx-auto',
        'text-center',
        'w-full',
        'md:w-1/2',
        'my-10'
      );
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive title classes', () => {
      renderComponent();

      const title = screen.getByTestId('hero-title');
      expect(title).toHaveClass(
        'text-[40px]',
        'leading-[43px]',
        'md:text-[48px]',
        'md:leading-[60px]'
      );
    });

    it('should have responsive subtitle classes', () => {
      renderComponent();

      const subtitle = screen.getByTestId('hero-subtitle');
      expect(subtitle).toHaveClass(
        'text-[14px]',
        'leading-[20px]',
        'font-normal',
        'md:text-[18px]',
        'md:leading-[28px]',
        'md:font-medium'
      );
    });

    it('should have responsive content width', () => {
      renderComponent();

      const content = screen.getByTestId('hero-content');
      expect(content).toHaveClass('w-full', 'md:w-1/2');
    });
  });

  describe('Component Props Handling', () => {
    it('should handle undefined backgroundImage', () => {
      renderComponent({ backgroundImage: undefined });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).not.toHaveAttribute('data-background-image');
    });

    it('should handle empty backgroundImage string', () => {
      renderComponent({ backgroundImage: '' });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-background-image', '');
    });

    it('should handle undefined className', () => {
      renderComponent({ className: undefined });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveClass('pt-40', 'pb-34');
    });

    it('should handle empty className string', () => {
      renderComponent({ className: '' });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveClass('pt-40', 'pb-34');
    });

    it('should handle all props as undefined', () => {
      const minimalProps = {
        backgroundImage: undefined,
        title: undefined,
        subtitle: undefined,
        className: undefined,
        breadcrumbItems: undefined,
      };

      expect(() => renderComponent(minimalProps)).not.toThrow();

      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('hero-container')).toBeInTheDocument();
    });
  });

  describe('Breadcrumb Edge Cases', () => {
    it('should handle breadcrumb items with missing labels', () => {
      const itemsWithMissingLabels = [
        { label: 'First', href: '/first' },
        { href: '/second' },
        { label: 'Third', href: '/third' },
      ];

      renderComponent({ breadcrumbItems: itemsWithMissingLabels });

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('First');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Third');
    });

    it('should handle single breadcrumb item', () => {
      renderComponent({ breadcrumbItems: [{ label: 'Single', href: '/single' }] });

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Single');
      expect(screen.queryByTestId('breadcrumb-item-1')).not.toBeInTheDocument();
    });

    it('should handle breadcrumb items with special characters', () => {
      const specialItems = [
        { label: 'Products & Services', href: '/products' },
        { label: '<Category>', href: '/category' },
        { label: 'Item™', href: '/item' },
      ];

      renderComponent({ breadcrumbItems: specialItems });

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Products & Services');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('<Category>');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Item™');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent();

      const title = screen.getByTestId('hero-title');
      expect(title.tagName).toBe('H1');
    });

    it('should be accessible by screen readers', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      const title = screen.getByTestId('hero-title');
      const subtitle = screen.getByTestId('hero-subtitle');

      expect(heroSection).toBeVisible();
      expect(title).toBeVisible();
      expect(subtitle).toBeVisible();
    });

    it('should have proper text contrast with light colored text', () => {
      renderComponent();

      const title = screen.getByTestId('hero-title');
      const subtitle = screen.getByTestId('hero-subtitle');

      expect(title).toHaveClass('text-[#F5F5F6]');
      expect(subtitle).toHaveClass('text-[#F5F5F6]');
    });

    it('should maintain semantic structure', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      const container = screen.getByTestId('hero-container');
      const content = screen.getByTestId('hero-content');
      const title = screen.getByTestId('hero-title');
      const subtitle = screen.getByTestId('hero-subtitle');

      expect(heroSection).toContainElement(container);
      expect(container).toContainElement(content);
      expect(content).toContainElement(title);
      expect(content).toContainElement(subtitle);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values gracefully', () => {
      const nullProps = {
        backgroundImage: null,
        title: null,
        subtitle: null,
        className: null,
        breadcrumbItems: null,
      };

      expect(() => renderComponent(nullProps)).not.toThrow();
    });

    it('should handle boolean values as strings', () => {
      renderComponent({
        title: 'true',
        subtitle: false as any,
      });

      expect(screen.getByTestId('hero-title')).toHaveTextContent('true');
      expect(screen.queryByTestId('hero-subtitle')).not.toBeInTheDocument();
    });

    it('should handle number values as strings', () => {
      renderComponent({
        title: 12345 as any,
        subtitle: 67890 as any,
      });

      expect(screen.getByTestId('hero-title')).toHaveTextContent('12345');
      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('67890');
    });

    it('should handle object values gracefully', () => {
      expect(() => {
        renderComponent({
          title: { test: 'object' } as any,
        });
      }).toThrow();
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
          <Hero
            {...defaultProps}
            title={`Title ${i}`}
            subtitle={`Subtitle ${i}`}
            className={`class-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByText('Title 19')).toBeInTheDocument();
      expect(screen.getByText('Subtitle 19')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with different ImageSection configurations', () => {
      renderComponent({
        backgroundImage: '/different/image.png',
        className: 'custom-hero-styling',
      });

      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toHaveAttribute('data-background-image', '/different/image.png');
      expect(heroSection).toHaveClass('custom-hero-styling');
    });

    it('should maintain all child elements in proper hierarchy', () => {
      renderComponent();

      const heroSection = screen.getByTestId('hero-section');
      const heroContainer = screen.getByTestId('hero-container');
      const heroBreadcrumb = screen.getByTestId('hero-breadcrumb');
      const heroContent = screen.getByTestId('hero-content');
      const heroTitle = screen.getByTestId('hero-title');
      const heroSubtitle = screen.getByTestId('hero-subtitle');

      // Check hierarchy
      expect(heroSection).toContainElement(heroContainer);
      expect(heroContainer).toContainElement(heroBreadcrumb);
      expect(heroContainer).toContainElement(heroContent);
      expect(heroContent).toContainElement(heroTitle);
      expect(heroContent).toContainElement(heroSubtitle);
    });
  });
});