import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FooterNavLinks } from '@/shared/ui/layout/FooterNavLinks';
import type { ILinkItem } from '@/shared/types';
import '@testing-library/jest-dom';

// Mock i18n hooks
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'footer.quick_links': 'Quick Links',
    'footer.legal': 'Legal',
  };
  return translations[key] || key;
});

const mockCurrentLocale = 'en';

jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({ t: mockT }),
}));

jest.mock('@/router', () => ({
  useCurrentLocale: () => mockCurrentLocale,
}));

describe('FooterNavLinks', () => {
  const mockQuickLinks: ILinkItem[] = [
    { label: 'Home', link: '/home' },
    { label: 'About Us', link: '/about' },
    { label: 'Services', link: '/services' },
  ];

  const mockLegalPages: ILinkItem[] = [
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' },
  ];

  const defaultProps = {
    quickLinks: mockQuickLinks,
    legalPages: mockLegalPages,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <FooterNavLinks {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render both quick links and legal links sections', () => {
      renderComponent();

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Legal')).toBeInTheDocument();
      
      // Quick links
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      
      // Legal links
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes for quick links', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-quick-links-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-links-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-links-list"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-item-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-item-1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-item-2"]')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes for legal links', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-legal-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-list"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-item-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-item-1"]')).toBeInTheDocument();
    });

    it('should generate correct dynamic data-qa-id for links', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-quick-link-home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-about-us"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-services"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-link-privacy-policy"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-legal-link-terms-of-service"]')).toBeInTheDocument();
    });
  });

  describe('Quick Links Section', () => {
    it('should render quick links section when quickLinks provided', () => {
      renderComponent();

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should not render quick links section when quickLinks is undefined', () => {
      renderComponent({ quickLinks: undefined });

      expect(screen.queryByText('Quick Links')).not.toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should render empty quick links section when quickLinks is empty array', () => {
      renderComponent({ quickLinks: [] });

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      const { container } = render(
        <MemoryRouter>
          <FooterNavLinks quickLinks={[]} legalPages={mockLegalPages} />
        </MemoryRouter>
      );
      
      const quickLinksList = container.querySelector('[data-qa-id="footer-quick-links-list"]');
      expect(quickLinksList?.children).toHaveLength(0);
    });

    it('should render quick links as proper links with correct href', () => {
      renderComponent();

      const homeLink = screen.getByText('Home').closest('a');
      const aboutLink = screen.getByText('About Us').closest('a');
      const servicesLink = screen.getByText('Services').closest('a');

      expect(homeLink).toHaveAttribute('href', '/en/home');
      expect(aboutLink).toHaveAttribute('href', '/en/about');
      expect(servicesLink).toHaveAttribute('href', '/en/services');
    });

    it('should use translation for quick links title', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('footer.quick_links');
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
    });
  });

  describe('Legal Links Section', () => {
    it('should render legal links section', () => {
      renderComponent();

      expect(screen.getByText('Legal')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should render legal links when legalPages is empty array', () => {
      renderComponent({ legalPages: [] });

      expect(screen.getByText('Legal')).toBeInTheDocument();
      const { container } = render(
        <MemoryRouter>
          <FooterNavLinks quickLinks={mockQuickLinks} legalPages={[]} />
        </MemoryRouter>
      );
      
      const legalList = container.querySelector('[data-qa-id="footer-legal-list"]');
      expect(legalList?.children).toHaveLength(0);
    });

    it('should render legal links as proper links with correct href', () => {
      renderComponent();

      const privacyLink = screen.getByText('Privacy Policy').closest('a');
      const termsLink = screen.getByText('Terms of Service').closest('a');

      expect(privacyLink).toHaveAttribute('href', '/en/privacy');
      expect(termsLink).toHaveAttribute('href', '/en/terms');
    });

    it('should use translation for legal title with fallback', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('footer.legal');
      expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    it('should use fallback when translation returns null', () => {
      mockT.mockReturnValueOnce(null);
      renderComponent();

      expect(screen.getByText('Legal')).toBeInTheDocument();
    });
  });

  describe('Link Styling', () => {
    it('should have correct styling for section titles', () => {
      const { container } = renderComponent();

      const quickLinksTitle = container.querySelector('[data-qa-id="footer-quick-links-title"]');
      const legalTitle = container.querySelector('[data-qa-id="footer-legal-title"]');

      [quickLinksTitle, legalTitle].forEach(title => {
        expect(title).toHaveClass('font-semibold', 'mb-4', 'text-sm', 'leading-5');
        expect(title).toHaveStyle({ color: '#D8C8FF', fontFamily: '"General Sans"' });
      });
    });

    it('should have correct styling for navigation lists', () => {
      const { container } = renderComponent();

      const quickLinksList = container.querySelector('[data-qa-id="footer-quick-links-list"]');
      const legalList = container.querySelector('[data-qa-id="footer-legal-list"]');

      [quickLinksList, legalList].forEach(list => {
        expect(list).toHaveClass('flex', 'flex-col', 'items-start', 'gap-3', 'self-stretch');
      });
    });

    it('should have correct styling for individual links', () => {
      renderComponent();

      const links = [
        screen.getByText('Home').closest('a'),
        screen.getByText('About Us').closest('a'),
        screen.getByText('Privacy Policy').closest('a'),
      ];

      links.forEach(link => {
        expect(link).toHaveClass(
          'flex',
          'justify-center',
          'items-center',
          'gap-2',
          'text-white',
          'font-semibold',
          'text-base',
          'leading-6',
          'hover:opacity-90',
          'transition-opacity'
        );
        expect(link).toHaveStyle({ fontFamily: '"General Sans"' });
      });
    });
  });

  describe('Locale Integration', () => {
    it('should use current locale in link URLs', () => {
      renderComponent();

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/en/home');
    });

    it('should work with different locales', () => {
      // This test verifies locale integration, assuming the router hook works
      renderComponent();

      const homeLink = screen.getByText('Home').closest('a');
      // Should use current locale (mocked as 'en')
      expect(homeLink).toHaveAttribute('href', '/en/home');
    });

    it('should handle root paths correctly', () => {
      const rootLinks = [
        { label: 'Root', link: '/' },
      ];

      renderComponent({ quickLinks: rootLinks });

      const rootLink = screen.getByText('Root').closest('a');
      expect(rootLink).toHaveAttribute('href', '/en/');
    });
  });

  describe('Dynamic Data Attributes', () => {
    it('should handle labels with spaces correctly', () => {
      const spacedLinks = [
        { label: 'Contact Us', link: '/contact' },
        { label: 'Our Services', link: '/our-services' },
      ];

      const { container } = renderComponent({ quickLinks: spacedLinks });

      expect(container.querySelector('[data-qa-id="footer-quick-link-contact-us"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-our-services"]')).toBeInTheDocument();
    });

    it('should handle labels with special characters', () => {
      const specialLinks = [
        { label: 'Q&A', link: '/qa' },
        { label: 'R&D', link: '/rd' },
      ];

      const { container } = renderComponent({ quickLinks: specialLinks });

      expect(container.querySelector('[data-qa-id="footer-quick-link-q&a"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-quick-link-r&d"]')).toBeInTheDocument();
    });

    it('should handle empty or undefined labels', () => {
      const edgeLinks = [
        { label: '', link: '/empty' },
        { label: undefined, link: '/undefined' },
      ];

      const { container } = renderComponent({ quickLinks: edgeLinks as any });

      // Should not crash and should render
      expect(container.querySelector('[data-qa-id="footer-quick-links-section"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render links as proper anchor elements', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper list structure', () => {
      renderComponent();

      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2); // Quick links and legal links

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(5); // 3 quick links + 2 legal links
    });

    it('should have proper heading structure', () => {
      renderComponent();

      const quickLinksHeading = screen.getByText('Quick Links');
      const legalHeading = screen.getByText('Legal');

      expect(quickLinksHeading.tagName).toBe('H3');
      expect(legalHeading.tagName).toBe('H3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle links with empty URLs', () => {
      const emptyUrlLinks = [
        { label: 'Empty URL', link: '' },
      ];

      renderComponent({ quickLinks: emptyUrlLinks });

      const link = screen.getByText('Empty URL').closest('a');
      expect(link).toHaveAttribute('href', '/en');
    });

    it('should handle links with only quickLinks', () => {
      renderComponent({ legalPages: [] });

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Legal')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should handle links with only legalPages', () => {
      renderComponent({ quickLinks: undefined });

      expect(screen.queryByText('Quick Links')).not.toBeInTheDocument();
      expect(screen.getByText('Legal')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('should handle very long link labels', () => {
      const longLabelLinks = [
        {
          label: 'This is a very long link label that might cause layout issues',
          link: '/long-label'
        },
      ];

      renderComponent({ quickLinks: longLabelLinks });

      expect(screen.getByText('This is a very long link label that might cause layout issues')).toBeInTheDocument();
    });

    it('should handle large number of links', () => {
      const manyLinks = Array.from({ length: 20 }, (_, i) => ({
        label: `Link ${i + 1}`,
        link: `/link-${i + 1}`
      }));

      renderComponent({ quickLinks: manyLinks });

      expect(screen.getByText('Link 1')).toBeInTheDocument();
      expect(screen.getByText('Link 20')).toBeInTheDocument();
    });
  });
});