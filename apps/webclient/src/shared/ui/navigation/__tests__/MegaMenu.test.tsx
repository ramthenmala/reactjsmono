import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MegaMenu } from '@/shared/ui/navigation/MegaMenu';
import type { MegaMenuConfig } from '@/shared/types/megaMenu';
import '@testing-library/jest-dom';

// Mock icon component
const MockIcon = ({ className }: { className?: string }) => (
  <span className={className} data-qa-id="mock-icon">Icon</span>
);

describe('MegaMenu', () => {
  const mockSubmenu: MegaMenuConfig = {
    title: 'Saudi Industrial Landscape',
    subtitle: 'Explore industrial opportunities',
    sections: [
      {
        title: 'Industries',
        columns: [
          [
            { name: 'Manufacturing', href: '/manufacturing', icon: MockIcon },
            { name: 'Technology', href: '/technology', icon: MockIcon },
          ],
          [
            { name: 'Energy', href: '/energy', icon: MockIcon },
            { name: 'Logistics', href: '/logistics', icon: MockIcon },
          ],
        ],
      },
      {
        title: 'Resources',
        columns: [
          [
            { name: 'Documents', href: '/documents' },
            { name: 'Reports', href: '/reports' },
          ],
        ],
      },
    ],
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      submenu: mockSubmenu,
      isVisible: true,
      ...props,
    };

    return render(
      <MemoryRouter>
        <MegaMenu ref={null} {...defaultProps} />
      </MemoryRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should render mega menu when visible with submenu', () => {
      renderComponent();

      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      expect(screen.getByText('Explore industrial opportunities')).toBeInTheDocument();
    });

    it('should not render when isVisible is false', () => {
      renderComponent({ isVisible: false });

      expect(screen.queryByText('Saudi Industrial Landscape')).not.toBeInTheDocument();
    });

    it('should not render when submenu is null', () => {
      renderComponent({ submenu: null });

      expect(screen.queryByText('Saudi Industrial Landscape')).not.toBeInTheDocument();
    });

    it('should not render when both isVisible is false and submenu is null', () => {
      renderComponent({ isVisible: false, submenu: null });

      expect(screen.queryByText('Saudi Industrial Landscape')).not.toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mega-menu"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-content"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-subtitle"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-sections"]')).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('should render title and subtitle', () => {
      renderComponent();

      const title = screen.getByText('Saudi Industrial Landscape');
      const subtitle = screen.getByText('Explore industrial opportunities');

      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'font-semibold');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('text-gray-300', 'text-sm');
    });

    it('should handle empty title', () => {
      const submenuWithoutTitle = {
        ...mockSubmenu,
        title: '',
      };

      renderComponent({ submenu: submenuWithoutTitle });

      expect(screen.getByText('Explore industrial opportunities')).toBeInTheDocument();
      expect(screen.queryByText('Saudi Industrial Landscape')).not.toBeInTheDocument();
    });

    it('should handle empty subtitle', () => {
      const submenuWithoutSubtitle = {
        ...mockSubmenu,
        subtitle: '',
      };

      renderComponent({ submenu: submenuWithoutSubtitle });

      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
    });
  });

  describe('Sections Rendering', () => {
    it('should render all sections', () => {
      renderComponent();

      expect(screen.getByText('Industries')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('should have correct data-qa-id for sections', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mega-menu-section-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-section-1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-section-title-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-section-title-1"]')).toBeInTheDocument();
    });

    it('should render section titles with correct styling', () => {
      renderComponent();

      const sectionTitles = [
        screen.getByText('Industries'),
        screen.getByText('Resources'),
      ];

      sectionTitles.forEach(title => {
        expect(title).toHaveClass('text-sm', 'font-semibold', 'text-gray-500');
      });
    });

    it('should handle empty sections array', () => {
      const submenuWithoutSections = {
        ...mockSubmenu,
        sections: [],
      };

      renderComponent({ submenu: submenuWithoutSections });

      expect(screen.getByText('Saudi Industrial Landscape')).toBeInTheDocument();
      expect(screen.queryByText('Industries')).not.toBeInTheDocument();
    });
  });

  describe('Menu Items', () => {
    it('should render all menu items', () => {
      renderComponent();

      expect(screen.getByText('Manufacturing')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Logistics')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('should render items as links', () => {
      renderComponent();

      const manufacturingLink = screen.getByText('Manufacturing').closest('a');
      const technologyLink = screen.getByText('Technology').closest('a');

      expect(manufacturingLink).toHaveAttribute('href', '/manufacturing');
      expect(technologyLink).toHaveAttribute('href', '/technology');
    });

    it('should have correct data-qa-id for items', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mega-menu-item-manufacturing"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-item-technology"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-item-energy"]')).toBeInTheDocument();
    });

    it('should render icons when provided', () => {
      renderComponent();

      const icons = screen.getAllByTestId('mock-icon');
      expect(icons).toHaveLength(4); // Manufacturing, Technology, Energy, Logistics
    });

    it('should apply correct icon styling', () => {
      renderComponent();

      const icons = screen.getAllByTestId('mock-icon');
      icons.forEach(icon => {
        expect(icon).toHaveClass('w-4', 'h-4', 'text-purple-400');
      });
    });

    it('should not render icon when not provided', () => {
      renderComponent();

      // Documents and Reports don't have icons
      const documentsLink = screen.getByText('Documents').closest('a');
      const icon = documentsLink?.querySelector('[data-qa-id="mock-icon"]');

      expect(icon).not.toBeInTheDocument();
    });

    it('should apply correct link styling', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass(
          'flex',
          'items-center',
          'gap-3',
          'w-fit',
          'text-left',
          'hover:text-purple-300',
          'transition-colors',
          'py-2'
        );
      });
    });
  });

  describe('Columns Layout', () => {
    it('should render columns correctly', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="mega-menu-column-0-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-column-0-1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="mega-menu-column-1-0"]')).toBeInTheDocument();
    });

    it('should handle single column sections', () => {
      const singleColumnSubmenu: MegaMenuConfig = {
        ...mockSubmenu,
        sections: [
          {
            title: 'Single Column',
            columns: [
              [
                { name: 'Item 1', href: '/item1' },
                { name: 'Item 2', href: '/item2' },
              ],
            ],
          },
        ],
      };

      renderComponent({ submenu: singleColumnSubmenu });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should handle empty columns', () => {
      const emptyColumnSubmenu: MegaMenuConfig = {
        ...mockSubmenu,
        sections: [
          {
            title: 'Empty Column Section',
            columns: [[]],
          },
        ],
      };

      renderComponent({ submenu: emptyColumnSubmenu });

      expect(screen.getByText('Empty Column Section')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct container styling', () => {
      const { container } = renderComponent();

      const megaMenu = container.querySelector('[data-qa-id="mega-menu"]');

      expect(megaMenu).toHaveClass(
        'absolute',
        'top-full',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        'mt-2',
        'w-auto',
        'max-w-[90vw]',
        'rounded-3xl',
        'border',
        'border-white/30',
        'backdrop-blur-[15px]',
        'z-50',
        'max-xl:hidden'
      );
    });

    it('should apply correct content padding', () => {
      const { container } = renderComponent();

      const content = container.querySelector('[data-qa-id="mega-menu-content"]');

      expect(content).toHaveClass('p-8', 'flex', 'flex-col', 'gap-8');
    });

    it('should apply correct sections layout', () => {
      const { container } = renderComponent();

      const sections = container.querySelector('[data-qa-id="mega-menu-sections"]');

      expect(sections).toHaveClass('flex', 'gap-12');
    });

    it('should be hidden on mobile screens', () => {
      const { container } = renderComponent();

      const megaMenu = container.querySelector('[data-qa-id="mega-menu"]');

      expect(megaMenu).toHaveClass('max-xl:hidden');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle deeply nested structure', () => {
      const complexSubmenu: MegaMenuConfig = {
        title: 'Complex Menu',
        subtitle: 'Multiple sections and columns',
        sections: [
          {
            title: 'Section 1',
            columns: [
              [{ name: 'Item 1-1', href: '/1-1' }],
              [{ name: 'Item 1-2', href: '/1-2' }],
              [{ name: 'Item 1-3', href: '/1-3' }],
            ],
          },
          {
            title: 'Section 2',
            columns: [
              [
                { name: 'Item 2-1', href: '/2-1' },
                { name: 'Item 2-2', href: '/2-2' },
              ],
            ],
          },
        ],
      };

      renderComponent({ submenu: complexSubmenu });

      expect(screen.getByText('Item 1-1')).toBeInTheDocument();
      expect(screen.getByText('Item 1-2')).toBeInTheDocument();
      expect(screen.getByText('Item 1-3')).toBeInTheDocument();
      expect(screen.getByText('Item 2-1')).toBeInTheDocument();
      expect(screen.getByText('Item 2-2')).toBeInTheDocument();
    });

    it('should handle special characters in item names', () => {
      const specialCharsSubmenu: MegaMenuConfig = {
        ...mockSubmenu,
        sections: [
          {
            title: 'Special',
            columns: [
              [
                { name: 'Q&A Section', href: '/qa' },
                { name: 'R&D Department', href: '/rd' },
              ],
            ],
          },
        ],
      };

      renderComponent({ submenu: specialCharsSubmenu });

      expect(screen.getByText('Q&A Section')).toBeInTheDocument();
      expect(screen.getByText('R&D Department')).toBeInTheDocument();
    });

    it('should handle long item names', () => {
      const longNameSubmenu: MegaMenuConfig = {
        ...mockSubmenu,
        sections: [
          {
            title: 'Long Names',
            columns: [
              [
                {
                  name: 'This is a very long menu item name that should still display correctly',
                  href: '/long'
                },
              ],
            ],
          },
        ],
      };

      renderComponent({ submenu: longNameSubmenu });

      expect(screen.getByText('This is a very long menu item name that should still display correctly')).toBeInTheDocument();
    });
  });

  describe('ForwardRef', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <MemoryRouter>
          <MegaMenu ref={ref} submenu={mockSubmenu} isVisible={true} />
        </MemoryRouter>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have displayName set', () => {
      expect(MegaMenu.displayName).toBe('MegaMenu');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have accessible links', () => {
      renderComponent();

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

});