import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationMenu } from '@/shared/ui/navigation/NavigationMenu';
import type { NavigationItem } from '@/shared/types/navigationMenu';
import '@testing-library/jest-dom';

// Mock Untitled UI icons
jest.mock('@untitledui/icons', () => ({
  ChevronDown: ({ className, ...props }: any) => (
    <span className={className} data-qa-id="chevron-icon" {...props}>
      ▼
    </span>
  ),
}));

describe('NavigationMenu', () => {
  const mockOnToggleDropdown = jest.fn();

  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      href: '/home',
      hasDropdown: false,
    },
    {
      label: 'Products',
      href: '/products',
      hasDropdown: true,
      dropdownId: 'products',
    },
    {
      label: 'About Us',
      href: '/about',
      hasDropdown: false,
    },
    {
      label: 'Services',
      href: '/services',
      hasDropdown: true,
      dropdownId: 'services',
    },
  ];

  const defaultProps = {
    items: navigationItems,
    activeDropdown: null,
    onToggleDropdown: mockOnToggleDropdown,
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <NavigationMenu {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render navigation menu with all items', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="desktop-navigation"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="navigation-list"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-item-home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-item-products"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-item-about-us"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-item-services"]')).toBeInTheDocument();
    });

    it('should render as nav element', () => {
      const { container } = renderComponent();

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('header-nav', 'max-xl:hidden');
    });

    it('should render ul with correct classes', () => {
      const { container } = renderComponent();

      const ul = container.querySelector('ul');
      expect(ul).toBeInTheDocument();
      expect(ul).toHaveClass('flex', 'items-center', 'gap-4');
    });

    it('should handle empty items array', () => {
      renderComponent({ items: [] });

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const ul = nav.querySelector('ul');
      expect(ul?.children).toHaveLength(0);
    });
  });

  describe('Dropdown Items', () => {
    it('should render dropdown items as buttons', () => {
      const { container } = renderComponent();

      const productsButton = container.querySelector('[data-qa-id="nav-dropdown-toggle-products"]');
      const servicesButton = container.querySelector('[data-qa-id="nav-dropdown-toggle-services"]');

      expect(productsButton).toBeInTheDocument();
      expect(productsButton?.tagName).toBe('BUTTON');
      expect(servicesButton).toBeInTheDocument();
      expect(servicesButton?.tagName).toBe('BUTTON');
    });

    it('should render chevron icon for dropdown items', () => {
      renderComponent();

      const chevrons = screen.getAllByText('▼');
      expect(chevrons).toHaveLength(2); // Products and Services
    });

    it('should rotate chevron when dropdown is active', () => {
      renderComponent({ activeDropdown: 'products' });

      const chevrons = screen.getAllByText('▼');
      const productsChevron = chevrons[0];

      expect(productsChevron).toHaveClass('rotate-180');
    });

    it('should not rotate chevron when dropdown is not active', () => {
      renderComponent({ activeDropdown: 'services' });

      const chevrons = screen.getAllByText('▼');
      const productsChevron = chevrons[0];

      expect(productsChevron).not.toHaveClass('rotate-180');
    });

    it('should have data-dropdown-toggle attribute', () => {
      const { container } = renderComponent();

      const productsButton = container.querySelector('[data-dropdown-toggle="products"]');
      const servicesButton = container.querySelector('[data-dropdown-toggle="services"]');

      expect(productsButton).toBeInTheDocument();
      expect(servicesButton).toBeInTheDocument();
    });

    it('should call onToggleDropdown when dropdown button is clicked', () => {
      const { container } = renderComponent();

      const productsButton = container.querySelector('[data-qa-id="nav-dropdown-toggle-products"]');
      fireEvent.click(productsButton!);

      expect(mockOnToggleDropdown).toHaveBeenCalledWith('products');
    });

    it('should handle undefined dropdownId', () => {
      const itemsWithUndefinedId: NavigationItem[] = [{
        label: 'Test',
        href: '/test',
        hasDropdown: true,
        dropdownId: undefined,
      }];

      renderComponent({ items: itemsWithUndefinedId });

      const button = screen.getByText('Test').parentElement;
      fireEvent.click(button!);

      expect(mockOnToggleDropdown).toHaveBeenCalledWith('');
    });
  });

  describe('Non-Dropdown Items', () => {
    it('should render non-dropdown items as links', () => {
      renderComponent();

      const homeLink = screen.getByText('Home').parentElement;
      const aboutLink = screen.getByText('About Us').parentElement;

      expect(homeLink?.tagName).toBe('A');
      expect(aboutLink?.tagName).toBe('A');
    });

    it('should have correct href attributes', () => {
      renderComponent();

      const homeLink = screen.getByText('Home').closest('a');
      const aboutLink = screen.getByText('About Us').closest('a');

      expect(homeLink).toHaveAttribute('href', '/home');
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should have correct data-qa-id for links', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="nav-link-home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-link-about-us"]')).toBeInTheDocument();
    });

    it('should not call onToggleDropdown when non-dropdown item is clicked', () => {
      renderComponent();

      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      expect(mockOnToggleDropdown).not.toHaveBeenCalled();
    });
  });

  describe('Dynamic Data Attributes', () => {
    it('should generate correct data-qa-id for items with spaces', () => {
      const itemsWithSpaces: NavigationItem[] = [{
        label: 'Our Services',
        href: '/our-services',
        hasDropdown: false,
      }];

      const { container } = renderComponent({ items: itemsWithSpaces });

      expect(container.querySelector('[data-qa-id="nav-item-our-services"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-link-our-services"]')).toBeInTheDocument();
    });

    it('should generate correct data-qa-id for items with uppercase', () => {
      const itemsWithUppercase: NavigationItem[] = [{
        label: 'FAQ',
        href: '/faq',
        hasDropdown: false,
      }];

      const { container } = renderComponent({ items: itemsWithUppercase });

      expect(container.querySelector('[data-qa-id="nav-item-faq"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="nav-link-faq"]')).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const itemsWithSpecialChars: NavigationItem[] = [{
        label: 'Q&A Section',
        href: '/qa',
        hasDropdown: false,
      }];

      const { container } = renderComponent({ items: itemsWithSpecialChars });

      expect(container.querySelector('[data-qa-id="nav-item-q&a-section"]')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct classes to list items', () => {
      const { container } = renderComponent();

      const listItems = container.querySelectorAll('li');
      listItems.forEach(item => {
        expect(item).toHaveClass('relative');
      });
    });

    it('should apply transition classes to chevron', () => {
      renderComponent();

      const chevrons = screen.getAllByText('▼');
      chevrons.forEach(chevron => {
        expect(chevron).toHaveClass('size-4', 'transition-transform');
      });
    });

    it('should be hidden on mobile screens', () => {
      const { container } = renderComponent();

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('max-xl:hidden');
    });
  });

  describe('Multiple Dropdowns', () => {
    it('should handle multiple dropdowns independently', () => {
      const { rerender } = renderComponent({ activeDropdown: 'products' });

      const chevrons = screen.getAllByText('▼');
      expect(chevrons[0]).toHaveClass('rotate-180'); // Products
      expect(chevrons[1]).not.toHaveClass('rotate-180'); // Services

      rerender(
        <MemoryRouter>
          <NavigationMenu {...defaultProps} activeDropdown="services" />
        </MemoryRouter>
      );

      const updatedChevrons = screen.getAllByText('▼');
      expect(updatedChevrons[0]).not.toHaveClass('rotate-180'); // Products
      expect(updatedChevrons[1]).toHaveClass('rotate-180'); // Services
    });

    it('should toggle different dropdowns', () => {
      const { container } = renderComponent();

      const productsButton = container.querySelector('[data-qa-id="nav-dropdown-toggle-products"]');
      const servicesButton = container.querySelector('[data-qa-id="nav-dropdown-toggle-services"]');

      fireEvent.click(productsButton!);
      expect(mockOnToggleDropdown).toHaveBeenCalledWith('products');

      fireEvent.click(servicesButton!);
      expect(mockOnToggleDropdown).toHaveBeenCalledWith('services');

      expect(mockOnToggleDropdown).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle items without href', () => {
      const itemsWithoutHref: NavigationItem[] = [{
        label: 'No Link',
        href: '',
        hasDropdown: false,
      }];

      renderComponent({ items: itemsWithoutHref });

      expect(screen.getByText('No Link')).toBeInTheDocument();
    });

    it('should handle long labels', () => {
      const longLabelItems: NavigationItem[] = [{
        label: 'This is a very long navigation item label that might wrap',
        href: '/long',
        hasDropdown: false,
      }];

      renderComponent({ items: longLabelItems });

      expect(screen.getByText('This is a very long navigation item label that might wrap')).toBeInTheDocument();
    });

    it('should handle duplicate labels', () => {
      const duplicateItems: NavigationItem[] = [
        { label: 'Services A', href: '/services1', hasDropdown: false },
        { label: 'Services B', href: '/services2', hasDropdown: false },
      ];

      renderComponent({ items: duplicateItems });

      expect(screen.getByText('Services A')).toBeInTheDocument();
      expect(screen.getByText('Services B')).toBeInTheDocument();
    });

    it('should handle mixed dropdown and non-dropdown items', () => {
      renderComponent();

      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');

      expect(buttons).toHaveLength(2); // Products and Services
      expect(links).toHaveLength(2); // Home and About Us
    });
  });

  describe('Accessibility', () => {
    it('should have navigation role', () => {
      renderComponent();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have list role for ul', () => {
      renderComponent();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should have listitem role for li elements', () => {
      renderComponent();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);
    });

    it('should maintain keyboard accessibility', () => {
      renderComponent();

      const productsButton = screen.getByText('Products').parentElement;
      productsButton?.focus();

      expect(document.activeElement).toBe(productsButton);
    });
  });

});