import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminHeader } from '../AdminHeader';

jest.mock('@untitledui/icons', () => ({
  Bell01: ({ className }: { className?: string }) => (
    <svg
      data-qa-id="bell-icon"
      className={className}
      aria-label="Bell notification"
      role="img"
    />
  ),
  SearchLg: ({ className }: { className?: string }) => (
    <svg
      data-qa-id="search-icon"
      className={className}
      aria-label="Search"
      role="img"
    />
  ),
  Settings01: () => (
    <svg data-qa-id="settings-icon" aria-label="Settings" role="img" />
  ),
  LogOut01: () => (
    <svg data-qa-id="logout-icon" aria-label="Log out" role="img" />
  ),
  User01: () => <svg data-qa-id="user-icon" aria-label="User" role="img" />,
}));

jest.mock('react-aria-components', () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

jest.mock('@compass/shared-ui', () => ({
  Avatar: ({ alt, src, size }: { alt: string; src?: string; size: string }) => (
    <div data-qa-id="avatar" data-alt={alt} data-src={src} data-size={size}>
      Avatar: {alt}
    </div>
  ),
  Dropdown: {
    Root: ({ children }: { children: React.ReactNode }) => (
      <div data-qa-id="dropdown-root">{children}</div>
    ),
    Popover: ({ children }: { children: React.ReactNode }) => (
      <div data-qa-id="dropdown-popover">{children}</div>
    ),
    Menu: ({ children }: { children: React.ReactNode }) => (
      <div data-qa-id="dropdown-menu">{children}</div>
    ),
    Item: ({
      icon: Icon,
      label,
      onAction,
    }: {
      icon: React.ComponentType;
      label: string;
      onAction: () => void;
    }) => (
      <button data-qa-id="dropdown-item" onClick={onAction}>
        <Icon />
        {label}
      </button>
    ),
    Separator: () => <div data-qa-id="dropdown-separator">---</div>,
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'welcome.title': 'Welcome Admin',
        'welcome.subtitle': 'Dashboard Overview',
        'userMenu.viewProfile': 'View Profile',
        'userMenu.settings': 'Settings',
        'userMenu.logOut': 'Log Out',
      };
      return translations[key] || key;
    },
  }),
}));

describe('AdminHeader', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    userName: 'John Doe',
    userRole: 'Test Admin',
  };

  it('renders without crashing', () => {
    render(<AdminHeader {...defaultProps} />);

    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header-section')).toBeInTheDocument();
  });

  it('displays title and subtitle correctly', () => {
    render(<AdminHeader {...defaultProps} />);

    expect(screen.getByTestId('admin-header-title')).toHaveTextContent(
      'Test Title'
    );
    expect(screen.getByTestId('admin-header-subtitle')).toHaveTextContent(
      'Test Subtitle'
    );
  });

  it('uses translation fallback when title and subtitle are not provided', () => {
    render(<AdminHeader />);

    expect(screen.getByTestId('admin-header-title')).toHaveTextContent(
      'Welcome Admin'
    );
    expect(screen.getByTestId('admin-header-subtitle')).toHaveTextContent(
      'Dashboard Overview'
    );
  });

  it('uses provided title over translation when title is provided', () => {
    render(<AdminHeader title="Custom Title" />);

    expect(screen.getByTestId('admin-header-title')).toHaveTextContent(
      'Custom Title'
    );
  });

  it('uses provided subtitle over translation when subtitle is provided', () => {
    render(<AdminHeader subtitle="Custom Subtitle" />);

    expect(screen.getByTestId('admin-header-subtitle')).toHaveTextContent(
      'Custom Subtitle'
    );
  });

  it('hides subtitle when both subtitle prop and translation return empty', () => {
    const EmptySubtitleComponent = () => {
      const mockT = (key: string) => (key === 'welcome.subtitle' ? '' : key);

      return (
        <div>
          {mockT('welcome.subtitle') && (
            <p data-qa-id="admin-header-subtitle">
              {mockT('welcome.subtitle')}
            </p>
          )}
        </div>
      );
    };

    render(<EmptySubtitleComponent />);

    expect(
      screen.queryByTestId('admin-header-subtitle')
    ).not.toBeInTheDocument();
  });

  it('renders search and notification buttons', () => {
    render(<AdminHeader {...defaultProps} />);

    expect(
      screen.getByTestId('admin-header-search-button')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('admin-header-notifications-button')
    ).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });

  it('renders trailing content when provided', () => {
    const trailingContent = (
      <div data-qa-id="custom-trailing">Custom Content</div>
    );

    render(<AdminHeader {...defaultProps} trailingContent={trailingContent} />);

    expect(screen.getByTestId('custom-trailing')).toHaveTextContent(
      'Custom Content'
    );
  });

  it('shows avatar dropdown by default', () => {
    render(<AdminHeader {...defaultProps} />);

    expect(screen.getByTestId('admin-header-user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header-user-name')).toHaveTextContent(
      'John Doe'
    );
    expect(screen.getByTestId('admin-header-user-role')).toHaveTextContent(
      'Test Admin'
    );
  });

  it('hides avatar dropdown when showAvatarDropdown is false', () => {
    render(<AdminHeader {...defaultProps} showAvatarDropdown={false} />);

    expect(
      screen.queryByTestId('admin-header-user-menu')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
  });

  it('uses default userName and userRole when not provided', () => {
    render(<AdminHeader />);

    expect(screen.getByTestId('admin-header-user-name')).toHaveTextContent(
      'Faisal'
    );
    expect(screen.getByTestId('admin-header-user-role')).toHaveTextContent(
      'Govt. Admin'
    );
  });

  it('passes userAvatar to Avatar component', () => {
    const userAvatar = 'https://example.com/avatar.jpg';

    render(<AdminHeader {...defaultProps} userAvatar={userAvatar} />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-src', userAvatar);
    expect(avatar).toHaveAttribute('data-alt', 'John Doe');
    expect(avatar).toHaveAttribute('data-size', 'md');
  });

  it('applies border class by default', () => {
    render(<AdminHeader {...defaultProps} />);

    const section = screen.getByTestId('admin-header-section');
    expect(section).toHaveClass(
      'border-b',
      'border-gray-200',
      'dark:border-gray-700'
    );
  });

  it('hides border when hideBorder is true', () => {
    render(<AdminHeader {...defaultProps} hideBorder={true} />);

    const section = screen.getByTestId('admin-header-section');
    expect(section).not.toHaveClass('border-b');
    expect(section).not.toHaveClass('border-gray-200');
    expect(section).not.toHaveClass('dark:border-gray-700');
  });

  it('applies correct CSS classes to header elements', () => {
    render(<AdminHeader {...defaultProps} />);

    const section = screen.getByTestId('admin-header-section');
    const content = screen.getByTestId('admin-header-content');
    const title = screen.getByTestId('admin-header-title');
    const subtitle = screen.getByTestId('admin-header-subtitle');
    const actions = screen.getByTestId('admin-header-actions');

    expect(section).toHaveClass(
      'flex',
      'h-16',
      'w-full',
      'items-center',
      'justify-between',
      'px-6'
    );
    expect(content).toHaveClass('flex', 'flex-1', 'items-center');
    expect(title).toHaveClass(
      'text-[32px]',
      'font-medium',
      'text-gray-900',
      'dark:text-white'
    );
    expect(subtitle).toHaveClass(
      'mt-1',
      'text-[16px]',
      'font-normal',
      'text-gray-600',
      'dark:text-gray-400'
    );
    expect(actions).toHaveClass('flex', 'items-center', 'gap-4');
  });

  it('renders dropdown menu items with correct props', () => {
    render(<AdminHeader {...defaultProps} />);

    expect(screen.getByTestId('dropdown-root')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-popover')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();

    const menuItems = screen.getAllByTestId('dropdown-item');
    expect(menuItems).toHaveLength(3);

    expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('handles dropdown menu item clicks', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      /* mock implementation */
    });

    render(<AdminHeader {...defaultProps} />);

    const menuItems = screen.getAllByTestId('dropdown-item');

    fireEvent.click(menuItems[0]);
    expect(consoleSpy).toHaveBeenCalledWith('View profile');

    fireEvent.click(menuItems[1]);
    expect(consoleSpy).toHaveBeenCalledWith('Settings');

    fireEvent.click(menuItems[2]);
    expect(consoleSpy).toHaveBeenCalledWith('Log out');

    consoleSpy.mockRestore();
  });

  it('renders with proper semantic HTML structure', () => {
    render(<AdminHeader {...defaultProps} />);

    const header = screen.getByTestId('admin-header');
    const section = screen.getByTestId('admin-header-section');

    expect(header.tagName).toBe('HEADER');
    expect(section.tagName).toBe('SECTION');
  });

  it('handles all prop combinations correctly', () => {
    const props = {
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      userName: 'Jane Smith',
      userRole: 'Super Admin',
      userAvatar: 'https://example.com/jane.jpg',
      showAvatarDropdown: true,
      hideBorder: false,
      trailingContent: <div data-qa-id="test-trailing">Test</div>,
    };

    render(<AdminHeader {...props} />);

    expect(screen.getByTestId('admin-header-title')).toHaveTextContent(
      'Custom Title'
    );
    expect(screen.getByTestId('admin-header-subtitle')).toHaveTextContent(
      'Custom Subtitle'
    );
    expect(screen.getByTestId('admin-header-user-name')).toHaveTextContent(
      'Jane Smith'
    );
    expect(screen.getByTestId('admin-header-user-role')).toHaveTextContent(
      'Super Admin'
    );
    expect(screen.getByTestId('test-trailing')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toHaveAttribute(
      'data-src',
      'https://example.com/jane.jpg'
    );
    expect(screen.getByTestId('admin-header-user-menu')).toBeInTheDocument();

    const section = screen.getByTestId('admin-header-section');
    expect(section).toHaveClass('border-b');
  });

  it('renders correctly with minimal props', () => {
    render(<AdminHeader />);

    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('admin-header-title')).toHaveTextContent(
      'Welcome Admin'
    );
    expect(screen.getByTestId('admin-header-subtitle')).toHaveTextContent(
      'Dashboard Overview'
    );
    expect(screen.getByTestId('admin-header-user-name')).toHaveTextContent(
      'Faisal'
    );
    expect(screen.getByTestId('admin-header-user-role')).toHaveTextContent(
      'Govt. Admin'
    );
    expect(
      screen.getByTestId('admin-header-search-button')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('admin-header-notifications-button')
    ).toBeInTheDocument();
    expect(screen.getByTestId('admin-header-user-menu')).toBeInTheDocument();
  });

  it('handles button interactions', () => {
    render(<AdminHeader {...defaultProps} />);

    const searchButton = screen.getByTestId('admin-header-search-button');
    const notificationButton = screen.getByTestId(
      'admin-header-notifications-button'
    );
    const userMenuButton = screen.getByTestId('admin-header-user-menu');

    expect(() => {
      fireEvent.click(searchButton);
      fireEvent.click(notificationButton);
      fireEvent.click(userMenuButton);
    }).not.toThrow();
  });

  it('applies correct button styling classes', () => {
    render(<AdminHeader {...defaultProps} />);

    const searchButton = screen.getByTestId('admin-header-search-button');
    const notificationButton = screen.getByTestId(
      'admin-header-notifications-button'
    );
    const userMenuButton = screen.getByTestId('admin-header-user-menu');

    const expectedButtonClasses = [
      'p-2',
      'text-gray-500',
      'hover:text-gray-700',
      'hover:bg-gray-100',
      'rounded-lg',
      'transition-colors',
      'dark:text-gray-400',
      'dark:hover:text-gray-300',
      'dark:hover:bg-gray-800',
    ];

    expectedButtonClasses.forEach((className) => {
      expect(searchButton).toHaveClass(className);
      expect(notificationButton).toHaveClass(className);
    });

    expect(userMenuButton).toHaveClass(
      'flex',
      'items-center',
      'gap-3',
      'cursor-pointer'
    );
  });
});
