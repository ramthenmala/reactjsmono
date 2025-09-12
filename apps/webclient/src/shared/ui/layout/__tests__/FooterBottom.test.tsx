import { render, screen } from '@testing-library/react';
import { FooterBottom } from '@/shared/ui/layout/FooterBottom';
import '@testing-library/jest-dom';

describe('FooterBottom', () => {
  const defaultProps = {
    copyrightText: '© 2024 Test Company. All rights reserved.',
  };

  const renderComponent = (props = {}) => {
    return render(<FooterBottom {...defaultProps} {...props} />);
  };

  describe('Component Rendering', () => {
    it('should render footer bottom with all elements', () => {
      renderComponent();

      expect(screen.getByText('© 2024 Test Company. All rights reserved.')).toBeInTheDocument();
      expect(screen.getByAltText('Ministry of Industry and Mineral Resources')).toBeInTheDocument();
      expect(screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia')).toBeInTheDocument();
      expect(screen.getByAltText('Digital Government Authority')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="footer-bottom"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-bottom-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-official-logos"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="ministry-logo-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="ministry-logo"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="vision-2030-logo-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="vision-2030-logo"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="digital-gov-logo-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="digital-gov-logo"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="footer-copyright"]')).toBeInTheDocument();
    });

    it('should render all official logos with correct attributes', () => {
      renderComponent();

      const ministryLogo = screen.getByAltText('Ministry of Industry and Mineral Resources');
      expect(ministryLogo).toHaveAttribute('src', '/assets/images/brand/ministry-of-industry-and-mineral-resources-seek-logo.svg');
      expect(ministryLogo).toHaveAttribute('width', '100');
      expect(ministryLogo).toHaveAttribute('height', '32');

      const visionLogo = screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia');
      expect(visionLogo).toHaveAttribute('src', '/assets/images/brand/vision-2030-kingdom-of-saudi-arabia-logo.svg');
      expect(visionLogo).toHaveAttribute('width', '100');
      expect(visionLogo).toHaveAttribute('height', '32');

      const digitalGovLogo = screen.getByAltText('Digital Government Authority');
      expect(digitalGovLogo).toHaveAttribute('src', '/assets/images/brand/registered-on-digital-government-authority-logo.svg');
      expect(digitalGovLogo).toHaveAttribute('width', '100');
      expect(digitalGovLogo).toHaveAttribute('height', '32');
    });
  });

  describe('Copyright Text', () => {
    it('should display provided copyright text', () => {
      renderComponent({ copyrightText: 'Custom copyright © 2024' });

      expect(screen.getByText('Custom copyright © 2024')).toBeInTheDocument();
    });

    it('should handle empty copyright text', () => {
      renderComponent({ copyrightText: '' });

      const { container } = render(<FooterBottom copyrightText="" />);
      const copyrightElement = container.querySelector('[data-qa-id="footer-copyright"]');
      expect(copyrightElement).toBeEmptyDOMElement();
    });

    it('should handle undefined copyright text', () => {
      renderComponent({ copyrightText: undefined });

      const { container } = render(<FooterBottom copyrightText={undefined} />);
      const copyrightElement = container.querySelector('[data-qa-id="footer-copyright"]');
      expect(copyrightElement).toBeEmptyDOMElement();
    });

    it('should handle copyright text with special characters', () => {
      const specialText = '© 2024 Company™ - All Rights Reserved® & More™';
      renderComponent({ copyrightText: specialText });

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('should handle long copyright text', () => {
      const longText = 'This is a very long copyright text that might wrap to multiple lines and should be handled gracefully by the component layout';
      renderComponent({ copyrightText: longText });

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container classes', () => {
      const { container } = renderComponent();

      const footerBottom = container.querySelector('[data-qa-id="footer-bottom"]');
      expect(footerBottom).toHaveClass('pt-8');

      const content = container.querySelector('[data-qa-id="footer-bottom-content"]');
      expect(content).toHaveClass(
        'flex',
        'flex-col',
        'lg:flex-row',
        'justify-between',
        'items-start',
        'lg:items-center',
        'gap-6'
      );
    });

    it('should have correct official logos styling', () => {
      const { container } = renderComponent();

      const officialLogos = container.querySelector('[data-qa-id="footer-official-logos"]');
      expect(officialLogos).toHaveClass('flex', 'flex-wrap', 'items-center', 'gap-6');

      const logoContainers = container.querySelectorAll('[data-qa-id*="logo-container"]');
      logoContainers.forEach(container => {
        expect(container).toHaveClass('flex', 'items-center', 'gap-3');
      });
    });

    it('should have correct logo image styling', () => {
      renderComponent();

      const logos = [
        screen.getByAltText('Ministry of Industry and Mineral Resources'),
        screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia'),
        screen.getByAltText('Digital Government Authority'),
      ];

      logos.forEach(logo => {
        expect(logo).toHaveClass('h-8', 'w-auto');
      });
    });

    it('should have correct copyright styling', () => {
      const { container } = renderComponent();

      const copyright = container.querySelector('[data-qa-id="footer-copyright"]');
      expect(copyright).toHaveClass(
        'text-sm',
        'text-white',
        'font-medium',
        'text-base',
        'leading-6',
        'text-center',
        'lg:text-right'
      );
    });
  });

  describe('Logo Integration', () => {
    it('should render ministry logo with correct properties', () => {
      renderComponent();

      const ministryLogo = screen.getByAltText('Ministry of Industry and Mineral Resources');
      const container = ministryLogo.closest('[data-qa-id="ministry-logo-container"]');
      
      expect(container).toBeInTheDocument();
      expect(ministryLogo).toHaveAttribute('data-qa-id', 'ministry-logo');
    });

    it('should render vision 2030 logo with correct properties', () => {
      renderComponent();

      const visionLogo = screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia');
      const container = visionLogo.closest('[data-qa-id="vision-2030-logo-container"]');
      
      expect(container).toBeInTheDocument();
      expect(visionLogo).toHaveAttribute('data-qa-id', 'vision-2030-logo');
    });

    it('should render digital government logo with correct properties', () => {
      renderComponent();

      const digitalGovLogo = screen.getByAltText('Digital Government Authority');
      const container = digitalGovLogo.closest('[data-qa-id="digital-gov-logo-container"]');
      
      expect(container).toBeInTheDocument();
      expect(digitalGovLogo).toHaveAttribute('data-qa-id', 'digital-gov-logo');
    });

    it('should have all logos in the correct order', () => {
      const { container } = renderComponent();

      const logoContainers = container.querySelectorAll('[data-qa-id*="logo-container"]');
      expect(logoContainers).toHaveLength(3);
      
      expect(logoContainers[0]).toHaveAttribute('data-qa-id', 'ministry-logo-container');
      expect(logoContainers[1]).toHaveAttribute('data-qa-id', 'vision-2030-logo-container');
      expect(logoContainers[2]).toHaveAttribute('data-qa-id', 'digital-gov-logo-container');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive layout classes', () => {
      const { container } = renderComponent();

      const content = container.querySelector('[data-qa-id="footer-bottom-content"]');
      
      // Should be flex column on mobile, flex row on large screens
      expect(content).toHaveClass('flex-col', 'lg:flex-row');
      
      // Should align items differently on different screen sizes
      expect(content).toHaveClass('items-start', 'lg:items-center');
      
      // Copyright should be center on mobile, right on large screens
      const copyright = container.querySelector('[data-qa-id="footer-copyright"]');
      expect(copyright).toHaveClass('text-center', 'lg:text-right');
    });

    it('should handle logo wrapping on smaller screens', () => {
      const { container } = renderComponent();

      const officialLogos = container.querySelector('[data-qa-id="footer-official-logos"]');
      expect(officialLogos).toHaveClass('flex-wrap');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for all logos', () => {
      renderComponent();

      expect(screen.getByAltText('Ministry of Industry and Mineral Resources')).toBeInTheDocument();
      expect(screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia')).toBeInTheDocument();
      expect(screen.getByAltText('Digital Government Authority')).toBeInTheDocument();
    });

    it('should have proper image attributes for screen readers', () => {
      renderComponent();

      const logos = [
        screen.getByAltText('Ministry of Industry and Mineral Resources'),
        screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia'),
        screen.getByAltText('Digital Government Authority'),
      ];

      logos.forEach(logo => {
        expect(logo.tagName).toBe('IMG');
        expect(logo).toHaveAttribute('alt');
        expect(logo.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null copyrightText', () => {
      const { container } = render(<FooterBottom copyrightText={null as any} />);
      
      const copyrightElement = container.querySelector('[data-qa-id="footer-copyright"]');
      expect(copyrightElement).toBeEmptyDOMElement();
    });

    it('should handle very long copyright text', () => {
      const veryLongText = 'A'.repeat(1000);
      renderComponent({ copyrightText: veryLongText });

      expect(screen.getByText(veryLongText)).toBeInTheDocument();
    });

    it('should handle copyright text with HTML-like content', () => {
      const htmlLikeText = '© 2024 <Company> & "Associates" - All Rights Reserved';
      renderComponent({ copyrightText: htmlLikeText });

      expect(screen.getByText(htmlLikeText)).toBeInTheDocument();
    });

    it('should maintain layout integrity with no copyright text', () => {
      renderComponent({ copyrightText: '' });

      // Logos should still be rendered
      expect(screen.getByAltText('Ministry of Industry and Mineral Resources')).toBeInTheDocument();
      expect(screen.getByAltText('Vision 2030 Kingdom of Saudi Arabia')).toBeInTheDocument();
      expect(screen.getByAltText('Digital Government Authority')).toBeInTheDocument();
    });
  });
});