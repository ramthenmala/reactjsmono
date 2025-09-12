import { render, screen } from '@testing-library/react';
import { CTASection } from '@/shared/ui/components/CTASection';
import '@testing-library/jest-dom';

// Mock the translation hook
const mockUseLocaleTranslation = jest.fn();

jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => mockUseLocaleTranslation(),
}));

// Mock the Button component
jest.mock('@compass/shared-ui', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('CTASection', () => {
  const mockTranslations = {
    'cta.title': 'Get Started Today',
    'cta.description': 'Join thousands of users who trust our platform for their business needs.',
    'cta.button': 'Start Now',
  };

  const renderComponent = () => {
    return render(<CTASection />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocaleTranslation.mockReturnValue({
      t: (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key,
    });
  });

  describe('Component Rendering', () => {
    it('should render CTA section with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
      expect(screen.getByTestId('cta-container')).toBeInTheDocument();
      expect(screen.getByTestId('cta-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cta-content')).toBeInTheDocument();
      expect(screen.getByTestId('cta-button-container')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="cta-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-grid"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-description"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-button-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="cta-button"]')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      renderComponent();

      const section = screen.getByTestId('cta-section');
      expect(section.tagName).toBe('SECTION');
    });
  });

  describe('Content Display', () => {
    it('should display translated title', () => {
      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent('Get Started Today');
    });

    it('should display translated description', () => {
      renderComponent();

      expect(screen.getByTestId('cta-description')).toHaveTextContent(
        'Join thousands of users who trust our platform for their business needs.'
      );
    });

    it('should display translated button text', () => {
      renderComponent();

      expect(screen.getByTestId('cta-button')).toHaveTextContent('Start Now');
    });

    it('should call translation function with correct keys', () => {
      const mockT = jest.fn((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key);
      
      mockUseLocaleTranslation.mockReturnValue({
        t: mockT,
      });

      renderComponent();

      expect(mockT).toHaveBeenCalledWith('cta.title');
      expect(mockT).toHaveBeenCalledWith('cta.description');
      expect(mockT).toHaveBeenCalledWith('cta.button');
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct section styling', () => {
      renderComponent();

      const section = screen.getByTestId('cta-section');
      expect(section).toHaveClass('w-full', 'bg-white');
    });

    it('should have correct container styling', () => {
      renderComponent();

      const container = screen.getByTestId('cta-container');
      expect(container).toHaveClass(
        'container',
        'py-16',
        'mx-auto',
        'max-w-7xl',
        'px-4'
      );
    });

    it('should have correct grid styling', () => {
      renderComponent();

      const grid = screen.getByTestId('cta-grid');
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-1',
        'md:grid-cols-2',
        'gap-6',
        'items-center'
      );
    });

    it('should have correct title styling', () => {
      renderComponent();

      const title = screen.getByTestId('cta-title');
      expect(title).toHaveClass(
        'font-semibold',
        'text-[30px]',
        'leading-[38px]',
        'tracking-normal',
        'md:text-left',
        'text-center',
        'mb-6',
        'text-[#171B23]'
      );
    });

    it('should have correct description styling', () => {
      renderComponent();

      const description = screen.getByTestId('cta-description');
      expect(description).toHaveClass(
        'text-justify',
        'text-[18px]',
        'leading-[24px]',
        'font-normal',
        'md:text-[16px]',
        'md:leading-[24px]',
        'md:font-medium',
        'tracking-normal',
        'text-[#3D424C]',
        'md:text-[#50555E]'
      );
    });

    it('should have correct button container styling', () => {
      renderComponent();

      const buttonContainer = screen.getByTestId('cta-button-container');
      expect(buttonContainer).toHaveClass(
        'flex',
        'justify-center',
        'md:justify-end'
      );
    });
  });

  describe('Button Component', () => {
    it('should render button with correct props', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      expect(button).toHaveAttribute('data-qa-id', 'cta-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have correct button styling', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      expect(button.className).toContain('flex');
      expect(button.className).toContain('items-center');
      expect(button.className).toContain('justify-center');
      expect(button.className).toContain('rounded-xl');
      expect(button.className).toContain('font-sans');
      expect(button.className).toContain('font-semibold');
      expect(button.className).toContain('text-white');
    });

    it('should have gradient background styling', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      expect(button.className).toContain('bg-[linear-gradient(62.92deg,#5547B5_-0.07%,#695DC2_100%)]');
    });

    it('should have responsive sizing classes', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      expect(button.className).toContain('w-[170px]');
      expect(button.className).toContain('h-12');
      expect(button.className).toContain('md:w-[190px]');
      expect(button.className).toContain('md:h-14');
    });

    it('should be clickable', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      expect(button).toBeEnabled();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Semantic Structure', () => {
    it('should use correct heading level', () => {
      renderComponent();

      const title = screen.getByTestId('cta-title');
      expect(title.tagName).toBe('H3');
    });

    it('should use paragraph for description', () => {
      renderComponent();

      const description = screen.getByTestId('cta-description');
      expect(description.tagName).toBe('P');
    });

    it('should maintain proper content hierarchy', () => {
      renderComponent();

      const section = screen.getByTestId('cta-section');
      const title = screen.getByTestId('cta-title');
      const description = screen.getByTestId('cta-description');
      const button = screen.getByTestId('cta-button');

      expect(section).toContainElement(title);
      expect(section).toContainElement(description);
      expect(section).toContainElement(button);
    });
  });

  describe('Translation Integration', () => {
    it('should use translation hook', () => {
      renderComponent();

      expect(mockUseLocaleTranslation).toHaveBeenCalled();
    });

    it('should handle missing translations gracefully', () => {
      mockUseLocaleTranslation.mockReturnValue({
        t: (key: string) => key, // Return key as fallback
      });

      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent('cta.title');
      expect(screen.getByTestId('cta-description')).toHaveTextContent('cta.description');
      expect(screen.getByTestId('cta-button')).toHaveTextContent('cta.button');
    });

    it('should handle different translations', () => {
      const customTranslations = {
        'cta.title': 'Custom Title',
        'cta.description': 'Custom description text',
        'cta.button': 'Custom Button',
      };

      mockUseLocaleTranslation.mockReturnValue({
        t: (key: string) => customTranslations[key as keyof typeof customTranslations] || key,
      });

      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent('Custom Title');
      expect(screen.getByTestId('cta-description')).toHaveTextContent('Custom description text');
      expect(screen.getByTestId('cta-button')).toHaveTextContent('Custom Button');
    });

    it('should handle empty translations', () => {
      mockUseLocaleTranslation.mockReturnValue({
        t: () => '', // Return empty string
      });

      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent('');
      expect(screen.getByTestId('cta-description')).toHaveTextContent('');
      expect(screen.getByTestId('cta-button')).toHaveTextContent('');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      renderComponent();

      const grid = screen.getByTestId('cta-grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should have responsive title alignment', () => {
      renderComponent();

      const title = screen.getByTestId('cta-title');
      expect(title).toHaveClass('text-center', 'md:text-left');
    });

    it('should have responsive button container alignment', () => {
      renderComponent();

      const buttonContainer = screen.getByTestId('cta-button-container');
      expect(buttonContainer).toHaveClass('justify-center', 'md:justify-end');
    });

    it('should have responsive description styling', () => {
      renderComponent();

      const description = screen.getByTestId('cta-description');
      expect(description).toHaveClass(
        'text-[18px]',
        'leading-[24px]',
        'font-normal',
        'md:text-[16px]',
        'md:leading-[24px]',
        'md:font-medium'
      );
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers', () => {
      renderComponent();

      const section = screen.getByTestId('cta-section');
      expect(section).toBeVisible();

      const title = screen.getByTestId('cta-title');
      expect(title).toBeVisible();

      const description = screen.getByTestId('cta-description');
      expect(description).toBeVisible();

      const button = screen.getByTestId('cta-button');
      expect(button).toBeVisible();
    });

    it('should have proper text contrast', () => {
      renderComponent();

      const title = screen.getByTestId('cta-title');
      expect(title).toHaveClass('text-[#171B23]');

      const description = screen.getByTestId('cta-description');
      expect(description).toHaveClass('text-[#3D424C]', 'md:text-[#50555E]');

      const button = screen.getByTestId('cta-button');
      expect(button).toHaveClass('text-white');
    });

    it('should maintain focus management', () => {
      renderComponent();

      const button = screen.getByTestId('cta-button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null translation function', () => {
      mockUseLocaleTranslation.mockReturnValue({
        t: null,
      });

      expect(() => renderComponent()).toThrow();
    });

    it('should handle undefined translation function', () => {
      mockUseLocaleTranslation.mockReturnValue({
        t: undefined,
      });

      expect(() => renderComponent()).toThrow();
    });

    it('should handle very long translated text', () => {
      const longTranslations = {
        'cta.title': 'A'.repeat(200),
        'cta.description': 'B'.repeat(500),
        'cta.button': 'C'.repeat(100),
      };

      mockUseLocaleTranslation.mockReturnValue({
        t: (key: string) => longTranslations[key as keyof typeof longTranslations] || key,
      });

      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent('A'.repeat(200));
      expect(screen.getByTestId('cta-description')).toHaveTextContent('B'.repeat(500));
      expect(screen.getByTestId('cta-button')).toHaveTextContent('C'.repeat(100));
    });

    it('should handle special characters in translations', () => {
      const specialTranslations = {
        'cta.title': 'Title with special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
        'cta.description': 'Description with Unicode: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好',
        'cta.button': 'Button & "quotes" <tags>',
      };

      mockUseLocaleTranslation.mockReturnValue({
        t: (key: string) => specialTranslations[key as keyof typeof specialTranslations] || key,
      });

      renderComponent();

      expect(screen.getByTestId('cta-title')).toHaveTextContent(specialTranslations['cta.title']);
      expect(screen.getByTestId('cta-description')).toHaveTextContent(specialTranslations['cta.description']);
      expect(screen.getByTestId('cta-button')).toHaveTextContent(specialTranslations['cta.button']);
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        rerender(<CTASection />);
        expect(screen.getByTestId('cta-section')).toBeInTheDocument();
      }
    });
  });
});