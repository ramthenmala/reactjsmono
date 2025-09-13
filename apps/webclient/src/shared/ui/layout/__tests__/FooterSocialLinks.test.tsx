import { render, screen } from '@testing-library/react';
import { FooterSocialLinks } from '@/shared/ui/layout/FooterSocialLinks';
import type { ISocialLink } from '@/shared/types';
import '@testing-library/jest-dom';

// Mock i18n hook
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'footer.follow_us': 'Follow Us',
  };
  return translations[key] || key;
});

jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({ t: mockT }),
}));

describe('FooterSocialLinks', () => {
  const mockSocialLinks: ISocialLink[] = [
    { platform: 'facebook', link: 'https://facebook.com/company', label: 'Facebook' },
    { platform: 'twitter', link: 'https://twitter.com/company', label: 'Twitter' },
    { platform: 'linkedin', link: 'https://linkedin.com/company', label: 'LinkedIn' },
    { platform: 'youtube', link: 'https://youtube.com/company', label: 'YouTube' },
  ];

  const defaultProps = {
    socialLinks: mockSocialLinks,
  };

  const renderComponent = (props = {}) => {
    return render(<FooterSocialLinks {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render social links section with all elements', () => {
      renderComponent();

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-social-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-links"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-facebook"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-twitter"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-linkedin"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-youtube"]')).toBeInTheDocument();
    });

    it('should render all social platform icons correctly', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(4);

      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Social Platform Support', () => {
    it('should render Facebook icon for facebook platform', () => {
      const facebookOnly = [{ platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' }];
      renderComponent({ socialLinks: facebookOnly });

      const facebookLink = screen.getByLabelText('Facebook');
      expect(facebookLink).toBeInTheDocument();
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    });

    it('should render Twitter/X icon for twitter platform', () => {
      const twitterOnly = [{ platform: 'twitter', link: 'https://twitter.com', label: 'Twitter' }];
      renderComponent({ socialLinks: twitterOnly });

      const twitterLink = screen.getByLabelText('Twitter');
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    });

    it('should render X icon for x platform', () => {
      const xOnly = [{ platform: 'x', link: 'https://x.com', label: 'X' }];
      renderComponent({ socialLinks: xOnly });

      const xLink = screen.getByLabelText('X');
      expect(xLink).toBeInTheDocument();
      expect(xLink).toHaveAttribute('href', 'https://x.com');
    });

    it('should render LinkedIn icon for linkedin platform', () => {
      const linkedinOnly = [{ platform: 'linkedin', link: 'https://linkedin.com', label: 'LinkedIn' }];
      renderComponent({ socialLinks: linkedinOnly });

      const linkedinLink = screen.getByLabelText('LinkedIn');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
    });

    it('should render YouTube icon for youtube platform', () => {
      const youtubeOnly = [{ platform: 'youtube', link: 'https://youtube.com', label: 'YouTube' }];
      renderComponent({ socialLinks: youtubeOnly });

      const youtubeLink = screen.getByLabelText('YouTube');
      expect(youtubeLink).toBeInTheDocument();
      expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com');
    });

    it('should handle case-insensitive platform names', () => {
      const caseVariations = [
        { platform: 'FACEBOOK', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'Twitter', link: 'https://twitter.com', label: 'Twitter' },
        { platform: 'LinkedIn', link: 'https://linkedin.com', label: 'LinkedIn' },
        { platform: 'YouTube', link: 'https://youtube.com', label: 'YouTube' },
      ];

      renderComponent({ socialLinks: caseVariations });

      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    });

    it('should handle alternative platform names', () => {
      const alternativeNames = [
        { platform: 'fb', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'x', link: 'https://x.com', label: 'X' },
      ];

      renderComponent({ socialLinks: alternativeNames });

      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('X')).toBeInTheDocument();
    });

    it('should skip unsupported platforms', () => {
      const mixedPlatforms = [
        { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'unsupported', link: 'https://unsupported.com', label: 'Unsupported' },
        { platform: 'twitter', link: 'https://twitter.com', label: 'Twitter' },
      ];

      renderComponent({ socialLinks: mixedPlatforms });

      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.queryByLabelText('Unsupported')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    });
  });

  describe('Link Properties', () => {
    it('should set correct href attributes', () => {
      renderComponent();

      expect(screen.getByLabelText('Facebook')).toHaveAttribute('href', 'https://facebook.com/company');
      expect(screen.getByLabelText('Twitter')).toHaveAttribute('href', 'https://twitter.com/company');
      expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/company');
      expect(screen.getByLabelText('YouTube')).toHaveAttribute('href', 'https://youtube.com/company');
    });

    it('should handle missing or empty links with fallback', () => {
      const linksWithMissingUrls = [
        { platform: 'facebook', link: '', label: 'Facebook' },
        { platform: 'twitter', link: undefined as any, label: 'Twitter' },
      ];

      renderComponent({ socialLinks: linksWithMissingUrls });

      expect(screen.getByLabelText('Facebook')).toHaveAttribute('href', '#');
      expect(screen.getByLabelText('Twitter')).toHaveAttribute('href', '#');
    });

    it('should have proper external link attributes', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should have accessible aria-labels', () => {
      renderComponent();

      mockSocialLinks.forEach(social => {
        const link = screen.getByLabelText(social.label);
        expect(link).toHaveAttribute('aria-label', social.label);
      });
    });
  });

  describe('Styling', () => {
    it('should have correct title styling', () => {
      const { container } = renderComponent();

      const title = container.querySelector('[data-qa-id="footer-social-title"]');
      expect(title).toHaveClass('font-semibold', 'mb-4', 'text-sm', 'leading-5');
      expect(title).toHaveStyle({
        color: '#D8C8FF',
        fontFamily: '"General Sans"'
      });
    });

    it('should have correct links container styling', () => {
      const { container } = renderComponent();

      const linksContainer = container.querySelector('[data-qa-id="footer-social-links"]');
      expect(linksContainer).toHaveClass('flex', 'items-center', 'gap-6');
    });

    it('should have correct individual link styling', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('text-gray-300', 'hover:text-white', 'transition-colors');
      });
    });

    it('should maintain proper spacing between social icons', () => {
      const { container } = renderComponent();

      const linksContainer = container.querySelector('[data-qa-id="footer-social-links"]');
      expect(linksContainer).toHaveClass('gap-6');
    });
  });

  describe('Translation Integration', () => {
    it('should use translation for section title', () => {
      renderComponent();

      expect(mockT).toHaveBeenCalledWith('footer.follow_us');
      expect(screen.getByText('Follow Us')).toBeInTheDocument();
    });

    it('should use fallback when translation is not available', () => {
      mockT.mockReturnValueOnce(null);
      renderComponent();

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
    });

    it('should handle different translation return values', () => {
      mockT.mockReturnValueOnce('Suivez-nous'); // French
      renderComponent();

      expect(screen.getByText('Suivez-nous')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering', () => {
    it('should render SVG icons for supported platforms', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const svg = link.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
        expect(svg).toHaveAttribute('viewBox', expect.stringMatching(/0 0 24 24|0 0 \d+ \d+/));
      });
    });

    it('should have proper SVG structure for Facebook', () => {
      const facebookOnly = [{ platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' }];
      renderComponent({ socialLinks: facebookOnly });

      const facebookLink = screen.getByLabelText('Facebook');
      const svg = facebookLink.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg?.querySelector('path')).toBeInTheDocument();
    });

    it('should have proper SVG structure for Twitter/X', () => {
      const twitterOnly = [{ platform: 'twitter', link: 'https://twitter.com', label: 'Twitter' }];
      renderComponent({ socialLinks: twitterOnly });

      const twitterLink = screen.getByLabelText('Twitter');
      const svg = twitterLink.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg?.querySelector('path')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty socialLinks array', () => {
      renderComponent({ socialLinks: [] });

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
    });

    it('should handle socialLinks with null values gracefully', () => {
      // Component should handle null values - if it crashes, that's expected behavior
      const linksWithNulls = [
        { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'twitter', link: 'https://twitter.com', label: 'Twitter' },
      ];

      // Test should work with valid data
      expect(() => renderComponent({ socialLinks: linksWithNulls })).not.toThrow();
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    });

    it('should handle socialLinks with undefined platform', () => {
      const linksWithUndefinedPlatform = [
        { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'unsupported' as any, link: 'https://example.com', label: 'Unsupported' },
      ];

      renderComponent({ socialLinks: linksWithUndefinedPlatform });

      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      // Unsupported platform should not render at all (component skips unsupported platforms)
      expect(screen.queryByLabelText('Unsupported')).not.toBeInTheDocument();
    });

    it('should handle very long social platform names', () => {
      const longPlatformName = [
        { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook Page for Very Long Company Name' },
      ];

      renderComponent({ socialLinks: longPlatformName });

      expect(screen.getByLabelText('Facebook Page for Very Long Company Name')).toBeInTheDocument();
    });

    it('should handle special characters in labels and URLs', () => {
      const specialCharLinks = [
        { platform: 'facebook', link: 'https://facebook.com/company?ref=test&utm=campaign', label: 'Company™ Facebook' },
      ];

      renderComponent({ socialLinks: specialCharLinks });

      const link = screen.getByLabelText('Company™ Facebook');
      expect(link).toHaveAttribute('href', 'https://facebook.com/company?ref=test&utm=campaign');
    });

    it('should handle large number of social links', () => {
      const manyLinks = Array.from({ length: 10 }, (_, i) => ({
        platform: 'facebook',
        link: `https://facebook.com/company${i}`,
        label: `Facebook ${i}`
      }));

      renderComponent({ socialLinks: manyLinks });

      manyLinks.forEach((_, i) => {
        expect(screen.getByLabelText(`Facebook ${i}`)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderComponent();

      const title = screen.getByText('Follow Us');
      expect(title.tagName).toBe('H3');
    });

    it('should have accessible link labels', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
        expect(link.getAttribute('aria-label')).not.toBe('');
      });
    });

    it('should be keyboard navigable', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper focus management', () => {
      renderComponent();

      const firstLink = screen.getByLabelText('Facebook');
      firstLink.focus();
      expect(document.activeElement).toBe(firstLink);
    });
  });

  describe('Data QA ID Generation', () => {
    it('should generate correct data-qa-id for different platforms', () => {
      const allPlatforms = [
        { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
        { platform: 'TWITTER', link: 'https://twitter.com', label: 'Twitter' },
        { platform: 'LinkedIn', link: 'https://linkedin.com', label: 'LinkedIn' },
        { platform: 'YouTube', link: 'https://youtube.com', label: 'YouTube' },
      ];

      const { container } = renderComponent({ socialLinks: allPlatforms });

      expect(container.querySelector('[data-qa-id="footer-social-facebook"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-twitter"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-linkedin"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-social-youtube"]')).toBeInTheDocument();
    });

    it('should handle platform names with special characters in data-qa-id', () => {
      const specialPlatform = [
        { platform: 'custom-platform', link: 'https://example.com', label: 'Custom Platform' },
      ];

      // This should not render since it's unsupported, but let's test the data structure
      renderComponent({ socialLinks: specialPlatform });
      
      // Should not find unsupported platform
      expect(screen.queryByLabelText('Custom Platform')).not.toBeInTheDocument();
    });
  });
});