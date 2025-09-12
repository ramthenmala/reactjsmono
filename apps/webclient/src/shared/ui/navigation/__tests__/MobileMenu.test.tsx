import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobileMenu } from '@/shared/ui/navigation/MobileMenu';
import type { MobileMenuProps } from '@/shared/types/mobileMenu';
import '@testing-library/jest-dom';

// Mock router hooks
const mockChangeLocale = jest.fn();
const mockCurrentLocale = jest.fn(() => 'en');

jest.mock('@/router', () => ({
  useCurrentLocale: () => mockCurrentLocale(),
  useLocaleNavigate: () => ({
    changeLocale: mockChangeLocale,
  }),
}));

// Mock Untitled UI icons
jest.mock('@untitledui/icons', () => ({
  ChevronDown: ({ className, ...props }: any) => (
    <span className={className} data-testid="chevron-down" {...props}>
      ▼
    </span>
  ),
}));

describe('MobileMenu', () => {
  const mockOnClose = jest.fn();

  const mockItems = [
    {
      label: 'Home',
      href: '/home',
      hasDropdown: false,
    },
    {
      label: 'Saudi Industrial Landscape',
      href: '/explore',
      hasDropdown: true,
      dropdownId: 'saudi_industrial_landscape',
      submenu: {
        title: 'Saudi Industrial Landscape',
        subtitle: 'Explore opportunities',
        sections: [
          {
            title: 'Industries',
            columns: [
              [
                { name: 'Manufacturing', href: '/manufacturing', icon: () => <span>Icon</span> },
                { name: 'Technology', href: '/technology' },
              ],
            ],
          },
        ],
      },
    },
    {
      label: 'About',
      href: '/about',
      hasDropdown: false,
    },
  ];

  const defaultProps: MobileMenuProps = {
    isOpen: true,
    items: mockItems,
    onClose: mockOnClose,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <MobileMenu {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentLocale.mockReturnValue('en');
  });

  describe('Component Rendering', () => {
    it('should render mobile menu when isOpen is true', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderComponent({ isOpen: false });

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mobile-menu"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-menu-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-switcher"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-navigation-list"]')).toBeInTheDocument();
    });

    it('should render with correct mobile-specific classes', () => {
      const { container } = renderComponent();

      const mobileMenu = container.querySelector('[data-qa-id="mobile-menu"]');
      expect(mobileMenu).toHaveClass('xl:hidden', 'absolute', 'top-full', 'left-0', 'right-0', 'mt-2', 'z-50');
    });
  });

  describe('Language Switcher', () => {
    it('should display current language correctly', () => {
      mockCurrentLocale.mockReturnValue('en');
      renderComponent();

      expect(screen.getByText('English')).toBeInTheDocument();
      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/US.svg');
    });

    it('should display Arabic language correctly', () => {
      mockCurrentLocale.mockReturnValue('ar');
      renderComponent();

      expect(screen.getByText('العربية')).toBeInTheDocument();
      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/SA.svg');
    });

    it('should have correct data-qa-id for language elements', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mobile-current-language"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-flag"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-text"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-buttons"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-en-button"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-language-ar-button"]')).toBeInTheDocument();
    });

    it('should change language when EN button is clicked', () => {
      renderComponent();

      const enButton = screen.getByText('EN');
      fireEvent.click(enButton);

      expect(mockChangeLocale).toHaveBeenCalledWith('en');
    });

    it('should change language when AR button is clicked', () => {
      renderComponent();

      const arButton = screen.getByText('AR');
      fireEvent.click(arButton);

      expect(mockChangeLocale).toHaveBeenCalledWith('ar');
    });

    it('should render language buttons with correct styling', () => {
      renderComponent();

      const enButton = screen.getByText('EN');
      const arButton = screen.getByText('AR');

      [enButton, arButton].forEach(button => {
        expect(button).toHaveClass(
          'px-3',
          'py-1',
          'rounded-md',
          'bg-white/10',
          'hover:bg-white/20',
          'text-sm'
        );
      });
    });
  });

  describe('Navigation Items', () => {
    it('should render all navigation items', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should have correct data-qa-id for navigation items', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mobile-nav-item-home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-nav-item-saudi-industrial-landscape"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-nav-item-about"]')).toBeInTheDocument();
    });

    it('should render non-dropdown items as links', () => {
      renderComponent();

      const homeLink = screen.getByText('Home').closest('a');
      const aboutLink = screen.getByText('About').closest('a');

      expect(homeLink).toHaveAttribute('href', '/home');
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should call onClose when non-dropdown link is clicked', () => {
      renderComponent();

      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should have correct data-qa-id for links', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mobile-nav-link-home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-nav-link-about"]')).toBeInTheDocument();
    });
  });

  describe('Dropdown Behavior', () => {
    it('should render dropdown items as buttons', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      expect(dropdownButton).toBeInTheDocument();
    });

    it('should toggle dropdown when button is clicked', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      expect(screen.getByText('Industries')).toBeInTheDocument();
      expect(screen.getByText('Manufacturing')).toBeInTheDocument();
    });

    it('should close dropdown when button is clicked again', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      
      // Open dropdown
      fireEvent.click(dropdownButton!);
      expect(screen.getByText('Industries')).toBeInTheDocument();

      // Close dropdown
      fireEvent.click(dropdownButton!);
      expect(screen.queryByText('Industries')).not.toBeInTheDocument();
    });

    it('should rotate chevron when dropdown is open', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      const chevron = screen.getByText('▼');
      expect(chevron).toHaveClass('rotate-180');
    });

    it('should have correct data-qa-id for dropdown elements', () => {
      const { container } = renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      expect(container.querySelector('[data-qa-id="mobile-dropdown-saudi-industrial-landscape"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-dropdown-toggle-saudi-industrial-landscape"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-dropdown-content-saudi-industrial-landscape"]')).toBeInTheDocument();
    });
  });

  describe('Dropdown Content', () => {
    it('should render dropdown sections when open', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      expect(screen.getByText('Industries')).toBeInTheDocument();
    });

    it('should render dropdown links in grid layout', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      expect(screen.getByText('Manufacturing')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should close menu when dropdown link is clicked', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      const manufacturingLink = screen.getByText('Manufacturing');
      fireEvent.click(manufacturingLink);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render icons when provided', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      // Manufacturing has an icon
      const manufacturingLink = screen.getByText('Manufacturing').closest('a');
      expect(manufacturingLink).toContainHTML('<span>Icon</span>');
    });

    it('should have correct data-qa-id for dropdown content', () => {
      const { container } = renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      expect(container.querySelector('[data-qa-id="mobile-dropdown-section-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-dropdown-section-title-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-dropdown-link-manufacturing"]')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct container styling', () => {
      const { container } = renderComponent();

      const content = container.querySelector('[data-qa-id="mobile-menu-content"]');
      expect(content).toHaveClass(
        'mx-4',
        'rounded-2xl',
        'border',
        'border-white/30',
        'bg-[rgba(12,17,29,0.85)]',
        'backdrop-blur-[12px]',
        'p-4'
      );
    });

    it('should apply correct navigation list styling', () => {
      const { container } = renderComponent();

      const navList = container.querySelector('[data-qa-id="mobile-navigation-list"]');
      expect(navList).toHaveClass('flex', 'flex-col', 'divide-y', 'divide-white/10');
    });

    it('should apply correct grid layout for dropdown links', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      fireEvent.click(dropdownButton!);

      const linkGrid = screen.getByText('Manufacturing').closest('.grid');
      expect(linkGrid).toHaveClass('grid', 'grid-cols-2', 'gap-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      renderComponent({ items: [] });

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      
      // Language switcher should still be present
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should handle items without dropdownId', () => {
      const itemsWithoutId = [{
        label: 'Test',
        href: '/test',
        hasDropdown: true,
        dropdownId: undefined,
        submenu: mockItems[1].submenu,
      }];

      renderComponent({ items: itemsWithoutId });

      const dropdownButton = screen.getByText('Test').closest('button');
      fireEvent.click(dropdownButton!);

      // Should handle gracefully without crashing
      expect(dropdownButton).toBeInTheDocument();
    });

    it('should handle items without submenu', () => {
      const itemsWithoutSubmenu = [{
        label: 'Test Dropdown',
        href: '/test',
        hasDropdown: true,
        dropdownId: 'test',
        submenu: undefined,
      }];

      renderComponent({ items: itemsWithoutSubmenu });

      const dropdownButton = screen.getByText('Test Dropdown').closest('button');
      fireEvent.click(dropdownButton!);

      // Should not crash
      expect(screen.queryByText('Industries')).not.toBeInTheDocument();
    });

    it('should handle special characters in item labels', () => {
      const specialItems = [{
        label: 'Q&A Section',
        href: '/qa',
        hasDropdown: false,
      }];

      renderComponent({ items: specialItems });

      expect(screen.getByText('Q&A Section')).toBeInTheDocument();
    });

    it('should handle mixed dropdown and non-dropdown items', () => {
      renderComponent();

      // Non-dropdown items should be links
      expect(screen.getByText('Home').closest('a')).toBeInTheDocument();
      expect(screen.getByText('About').closest('a')).toBeInTheDocument();

      // Dropdown item should be button
      expect(screen.getByText('Saudi Industrial Landscape').closest('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button elements for dropdowns', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape').closest('button');
      expect(dropdownButton).toHaveAttribute('type', 'button');
    });

    it('should have proper link elements for navigation', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should maintain focus on language buttons', () => {
      renderComponent();

      const enButton = screen.getByText('EN');
      enButton.focus();

      expect(document.activeElement).toBe(enButton);
    });
  });

});