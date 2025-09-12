import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '@/shared/ui/layout/Footer';
import type { IFooter } from '@/shared/types';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('@/shared/ui/layout/FooterLogo', () => ({
  FooterLogo: ({ footerContent }: { footerContent: string }) => (
    <div data-qa-id="footer-logo-mock">{footerContent}</div>
  ),
}));

jest.mock('@/shared/ui/layout/FooterNavLinks', () => ({
  FooterNavLinks: ({ quickLinks, legalPages }: any) => (
    <div data-qa-id="footer-nav-links-mock">
      Nav Links: {quickLinks?.length || 0} quick, {legalPages?.length || 0} legal
    </div>
  ),
}));

jest.mock('@/shared/ui/layout/FooterSocialLinks', () => ({
  FooterSocialLinks: ({ socialLinks }: any) => (
    <div data-qa-id="footer-social-links-mock">
      Social Links: {socialLinks?.length || 0}
    </div>
  ),
}));

jest.mock('@/shared/ui/layout/FooterBottom', () => ({
  FooterBottom: ({ copyrightText }: { copyrightText?: string }) => (
    <div data-qa-id="footer-bottom-mock">{copyrightText}</div>
  ),
}));

describe('Footer', () => {
  const mockFooterData: IFooter = {
    footerContent: 'Test footer content',
    copyrightText: '© 2024 Test Company',
    quickLinks: [
      { label: 'Home', link: '/home' },
      { label: 'About', link: '/about' },
    ],
    legalPages: [
      { label: 'Privacy', link: '/privacy' },
      { label: 'Terms', link: '/terms' },
    ],
    socialLinks: [
      { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
      { platform: 'twitter', link: 'https://twitter.com', label: 'Twitter' },
    ],
  };

  const renderComponent = (props: Partial<IFooter> = {}) => {
    return render(
      <MemoryRouter>
        <Footer {...mockFooterData} {...props} />
      </MemoryRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should render footer with all required elements', () => {
      renderComponent();

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText('Test footer content')).toBeInTheDocument();
      expect(screen.getByText('Nav Links: 2 quick, 2 legal')).toBeInTheDocument();
      expect(screen.getByText('Social Links: 2')).toBeInTheDocument();
      expect(screen.getByText('© 2024 Test Company')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-background"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-background-image"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-background-overlay"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-main-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-right-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-links-grid"]')).toBeInTheDocument();
    });

    it('should render background image with correct attributes', () => {
      renderComponent();

      const backgroundImage = screen.getByAltText('Footer background');
      expect(backgroundImage).toBeInTheDocument();
      expect(backgroundImage).toHaveAttribute('src', '/assets/images/backgrounds/bg.jpg');
    });
  });

  describe('Props Handling', () => {
    it('should handle empty quickLinks', () => {
      renderComponent({ quickLinks: [] });

      expect(screen.getByText('Nav Links: 0 quick, 2 legal')).toBeInTheDocument();
    });

    it('should handle undefined quickLinks', () => {
      renderComponent({ quickLinks: undefined });

      expect(screen.getByText('Nav Links: 0 quick, 2 legal')).toBeInTheDocument();
    });

    it('should handle empty legalPages', () => {
      renderComponent({ legalPages: [] });

      expect(screen.getByText('Nav Links: 2 quick, 0 legal')).toBeInTheDocument();
    });

    it('should handle empty socialLinks', () => {
      renderComponent({ socialLinks: [] });

      expect(screen.getByText('Social Links: 0')).toBeInTheDocument();
    });

    it('should handle undefined copyrightText', () => {
      renderComponent({ copyrightText: undefined });

      expect(screen.queryByText('© 2024 Test Company')).not.toBeInTheDocument();
    });

    it('should handle empty footerContent', () => {
      renderComponent({ footerContent: '' });

      expect(screen.queryByText('Test footer content')).not.toBeInTheDocument();
    });
  });

  describe('Structure and Styling', () => {
    it('should have correct semantic HTML structure', () => {
      renderComponent();

      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
      expect(footer).toHaveClass('relative', 'text-white', 'overflow-hidden');
    });

    it('should have proper container structure', () => {
      const { container } = renderComponent();

      const footerContainer = container.querySelector('[data-qa-id="footer-container"]');
      expect(footerContainer).toHaveClass('container', 'relative', 'z-10', 'mx-auto', 'py-12');

      const mainContent = container.querySelector('[data-qa-id="footer-main-content"]');
      expect(mainContent).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-8', 'mb-12');
    });

    it('should have correct background styling', () => {
      const { container } = renderComponent();

      const background = container.querySelector('[data-qa-id="footer-background"]');
      expect(background).toHaveClass('absolute', 'inset-0');

      const backgroundImage = container.querySelector('[data-qa-id="footer-background-image"]');
      expect(backgroundImage).toHaveClass('w-full', 'h-full', 'object-cover');

      const overlay = container.querySelector('[data-qa-id="footer-background-overlay"]');
      expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-[#101319]', 'opacity-80');
    });

    it('should have correct grid structure', () => {
      const { container } = renderComponent();

      const rightSection = container.querySelector('[data-qa-id="footer-right-section"]');
      expect(rightSection).toHaveClass('lg:col-span-1');

      const linksGrid = container.querySelector('[data-qa-id="footer-links-grid"]');
      expect(linksGrid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-8');
    });
  });

  describe('Component Integration', () => {
    it('should pass correct props to FooterLogo', () => {
      renderComponent();

      expect(screen.getByText('Test footer content')).toBeInTheDocument();
    });

    it('should pass correct props to FooterNavLinks', () => {
      renderComponent();

      expect(screen.getByText('Nav Links: 2 quick, 2 legal')).toBeInTheDocument();
    });

    it('should pass correct props to FooterSocialLinks', () => {
      renderComponent();

      expect(screen.getByText('Social Links: 2')).toBeInTheDocument();
    });

    it('should pass correct props to FooterBottom', () => {
      renderComponent();

      expect(screen.getByText('© 2024 Test Company')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic footer element', () => {
      renderComponent();

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have accessible background image alt text', () => {
      renderComponent();

      const backgroundImage = screen.getByAltText('Footer background');
      expect(backgroundImage).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle complex footer content with special characters', () => {
      renderComponent({
        footerContent: 'Footer content with special chars: @#$%^&*()',
        copyrightText: '© 2024 Company™ - All Rights Reserved®',
      });

      expect(screen.getByText('Footer content with special chars: @#$%^&*()')).toBeInTheDocument();
      expect(screen.getByText('© 2024 Company™ - All Rights Reserved®')).toBeInTheDocument();
    });

    it('should handle large amounts of data', () => {
      const largeQuickLinks = Array.from({ length: 10 }, (_, i) => ({
        label: `Quick Link ${i + 1}`,
        link: `/quick${i + 1}`,
      }));

      const largeLegalPages = Array.from({ length: 5 }, (_, i) => ({
        label: `Legal Page ${i + 1}`,
        link: `/legal${i + 1}`,
      }));

      const largeSocialLinks = Array.from({ length: 6 }, (_, i) => ({
        platform: `platform${i + 1}`,
        link: `https://platform${i + 1}.com`,
        label: `Platform ${i + 1}`,
      }));

      renderComponent({
        quickLinks: largeQuickLinks,
        legalPages: largeLegalPages,
        socialLinks: largeSocialLinks,
      });

      expect(screen.getByText('Nav Links: 10 quick, 5 legal')).toBeInTheDocument();
      expect(screen.getByText('Social Links: 6')).toBeInTheDocument();
    });

    it('should handle null/undefined props gracefully', () => {
      renderComponent({
        quickLinks: undefined,
        legalPages: [],
        socialLinks: [],
        copyrightText: undefined,
        footerContent: '',
      });

      expect(screen.getByText('Nav Links: 0 quick, 0 legal')).toBeInTheDocument();
      expect(screen.getByText('Social Links: 0')).toBeInTheDocument();
    });
  });
});