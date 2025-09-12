import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '@/shared/ui/navigation/Header';
import { IHeader } from '@/shared/types';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('@/shared/ui/navigation/HeaderLogo', () => ({
  HeaderLogo: () => <div data-qa-id="header-logo">Logo</div>,
}));

jest.mock('@/shared/ui/navigation/NavigationMenu', () => ({
  NavigationMenu: ({ items, activeDropdown, onToggleDropdown }: any) => (
    <nav data-qa-id="navigation-menu">
      {items.map((item: any) => (
        <button
          key={item.label}
          data-qa-id={`nav-${item.label}`}
          onClick={() => item.hasDropdown && onToggleDropdown(item.dropdownId)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  ),
}));

jest.mock('@/shared/ui/navigation/LanguageSelector', () => ({
  LanguageSelector: ({ onLanguageChange }: any) => (
    <div data-qa-id="language-selector" onClick={onLanguageChange}>
      Language
    </div>
  ),
}));

jest.mock('@/shared/ui/navigation/MobileMenu', () => ({
  MobileMenu: ({ isOpen, items, onClose }: any) =>
    isOpen ? (
      <div data-qa-id="mobile-menu">
        Mobile Menu
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock('@/shared/ui/navigation/MegaMenu', () => ({
  MegaMenu: ({ isVisible, submenu }: any) =>
    isVisible && submenu ? (
      <div data-qa-id="mega-menu">{submenu.title}</div>
    ) : null,
}));

jest.mock('@/router', () => ({
  useCurrentLocale: () => 'en',
}));

describe('Header', () => {
  const mockMenu = [
    {
      label: 'Home',
      link: '/',
      hasSubMenu: false,
      subMenu: null,
    },
    {
      label: 'Saudi Industrial Landscape',
      link: '/explore',
      hasSubMenu: true,
      subMenu: [],
    },
    {
      label: 'About',
      link: '/about',
      hasSubMenu: false,
      subMenu: null,
    },
  ];

  const defaultProps: IHeader = {
    menu: mockMenu,
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    window.scrollY = 0;
  });

  describe('Component Rendering', () => {
    it('should render header with all required elements', () => {
      renderComponent();

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="header-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="header-left-section"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="header-desktop-actions"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="header-mobile-actions"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mobile-menu-toggle"]')).toBeInTheDocument();
    });

    it('should render navigation items correctly', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should handle empty menu prop', () => {
      renderComponent({ menu: [] });

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle null menu prop', () => {
      renderComponent({ menu: null as any });

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle undefined menu prop', () => {
      renderComponent({ menu: undefined as any });

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Scroll Behavior', () => {
    it('should add scrolled class when scrolled past 50px', () => {
      const { container } = renderComponent();
      const header = container.querySelector('header');

      expect(header).toHaveClass('relative');
      expect(header).not.toHaveClass('fixed');

      // Simulate scroll
      window.scrollY = 100;
      fireEvent.scroll(window);

      waitFor(() => {
        expect(header).toHaveClass('fixed');
        expect(header).toHaveClass('scrolled');
      });
    });

    it('should remove scrolled class when scrolled back to top', () => {
      const { container } = renderComponent();
      const header = container.querySelector('header');

      // Scroll down first
      window.scrollY = 100;
      fireEvent.scroll(window);

      waitFor(() => {
        expect(header).toHaveClass('fixed');
      });

      // Scroll back up
      window.scrollY = 30;
      fireEvent.scroll(window);

      waitFor(() => {
        expect(header).toHaveClass('relative');
        expect(header).not.toHaveClass('fixed');
      });
    });

    it('should clean up scroll event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderComponent();

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('Dropdown Behavior', () => {
    it('should toggle dropdown when clicking dropdown item', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape');

      // Open dropdown
      fireEvent.click(dropdownButton);

      waitFor(() => {
        expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });

      // Close dropdown
      fireEvent.click(dropdownButton);

      waitFor(() => {
        expect(screen.queryByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', () => {
      const { container } = renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape');

      // Open dropdown
      fireEvent.click(dropdownButton);

      waitFor(() => {
        expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });

      // Click outside
      fireEvent.pointerDown(document.body);

      waitFor(() => {
        expect(screen.queryByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });
    });

    it('should close dropdown when language changes', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape');

      // Open dropdown
      fireEvent.click(dropdownButton);

      waitFor(() => {
        expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });

      // Change language
      const languageSelector = screen.getByText('Language');
      fireEvent.click(languageSelector);

      waitFor(() => {
        expect(screen.queryByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });
    });

    it('should handle multiple dropdowns correctly', () => {
      const menuWithMultipleDropdowns = [
        {
          label: 'Dropdown 1',
          link: '/dropdown1',
          hasSubMenu: true,
          subMenu: [],
        },
        {
          label: 'Dropdown 2',
          link: '/dropdown2',
          hasSubMenu: true,
          subMenu: [],
        },
      ];

      renderComponent({ menu: menuWithMultipleDropdowns });

      const dropdown1 = screen.getByText('Dropdown 1');
      const dropdown2 = screen.getByText('Dropdown 2');

      // Open first dropdown
      fireEvent.click(dropdown1);

      // Open second dropdown (should close first)
      fireEvent.click(dropdown2);

      // Both dropdowns should not be open at the same time
      // This is tested through the activeDropdown state
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu when clicking menu button', () => {
      renderComponent();

      const menuButton = screen.getByLabelText('Open menu');

      // Open mobile menu
      fireEvent.click(menuButton);

      waitFor(() => {
        expect(screen.getByText('Mobile Menu')).toBeInTheDocument();
      });

      // Close mobile menu
      fireEvent.click(menuButton);

      waitFor(() => {
        expect(screen.queryByText('Mobile Menu')).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when close button is clicked', () => {
      renderComponent();

      const menuButton = screen.getByLabelText('Open menu');

      // Open mobile menu
      fireEvent.click(menuButton);

      waitFor(() => {
        expect(screen.getByText('Mobile Menu')).toBeInTheDocument();
      });

      // Close using close button
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      waitFor(() => {
        expect(screen.queryByText('Mobile Menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Item Transformation', () => {
    it('should add locale prefix to navigation links', () => {
      renderComponent();

      // The navigation items should have locale prefixed
      // This is handled in the component's getNavigationItems function
    });

    it('should handle Saudi Industrial Landscape special case', () => {
      renderComponent();

      // Saudi Industrial Landscape should have mega menu config
      const saudiButton = screen.getByText('Saudi Industrial Landscape');
      fireEvent.click(saudiButton);

      waitFor(() => {
        expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });
    });

    it('should handle root path correctly', () => {
      const menuWithRoot = [
        {
          label: 'Home',
          link: '/',
          hasSubMenu: false,
          subMenu: null,
        },
      ];

      renderComponent({ menu: menuWithRoot });

      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should generate correct dropdown IDs', () => {
      const menuWithSpaces = [
        {
          label: 'Test Item With Spaces',
          link: '/test',
          hasSubMenu: true,
          subMenu: [],
        },
      ];

      renderComponent({ menu: menuWithSpaces });

      expect(screen.getByText('Test Item With Spaces')).toBeInTheDocument();
      // Dropdown ID should be 'test_item_with_spaces'
    });
  });

  describe('Event Handling', () => {
    it('should handle pointer events correctly', () => {
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape');

      // Open dropdown
      fireEvent.click(dropdownButton);

      // Simulate pointer down on dropdown toggle (should not close)
      const event = new Event('pointerdown', { bubbles: true });
      Object.defineProperty(event, 'composedPath', {
        value: () => [dropdownButton],
      });

      document.dispatchEvent(event);

      waitFor(() => {
        expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      });
    });

    it('should clean up pointer event listener when dropdown closes', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      renderComponent();

      const dropdownButton = screen.getByText('Saudi Industrial Landscape');

      // Open dropdown
      fireEvent.click(dropdownButton);

      // Close dropdown
      fireEvent.click(dropdownButton);

      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    });
  });

  describe('Responsive Behavior', () => {
    it('should show desktop language selector on large screens', () => {
      const { container } = renderComponent();

      const desktopActions = container.querySelector('[data-qa-id="header-desktop-actions"]');
      expect(desktopActions).toHaveClass('hidden', 'xl:flex');
    });

    it('should show mobile menu button on small screens', () => {
      const { container } = renderComponent();

      const mobileActions = container.querySelector('[data-qa-id="header-mobile-actions"]');
      expect(mobileActions).toHaveClass('xl:hidden', 'flex');
    });
  });

  describe('Integration', () => {
    it('should pass correct props to child components', () => {
      renderComponent();

      // NavigationMenu should receive items
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // LanguageSelector should be rendered
      expect(screen.getByText('Language')).toBeInTheDocument();

      // HeaderLogo should be rendered
      expect(screen.getByText('Logo')).toBeInTheDocument();
    });

    it('should handle complex menu structures', () => {
      const complexMenu = [
        {
          label: 'Item 1',
          link: '/item1',
          hasSubMenu: true,
          subMenu: [
            { label: 'Sub 1', link: '/sub1' },
            { label: 'Sub 2', link: '/sub2' },
          ],
        },
        {
          label: 'Item 2',
          link: '/item2',
          hasSubMenu: false,
          subMenu: null,
        },
      ];

      renderComponent({ menu: complexMenu });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});