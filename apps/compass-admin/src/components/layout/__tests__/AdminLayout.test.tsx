import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminLayout } from '../AdminLayout';

import { useParams } from 'react-router-dom';
import { getNavigationItems } from '../../navigation/navigation';

// Mock all external dependencies first
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        'welcome.title': 'Welcome Admin',
        'welcome.subtitle': 'Dashboard Overview',
      };
      return translations[key] || key;
    },
  }),
}));

// Use __mocks__ folder for @compass/shared-ui
jest.mock('@compass/shared-ui');

jest.mock('../../navigation/navigation', () => ({
  getNavigationItems: jest.fn(),
}));

jest.mock('../../navigation/LanguageSwitcher', () => ({
  LanguageSwitcher: () => (
    <div data-qa-id='language-switcher'>Language Switcher</div>
  ),
}));

jest.mock('../AdminHeader', () => ({
  AdminHeader: ({
    title,
    subtitle,
    userName,
    userRole,
    trailingContent,
    hideBorder,
  }) => (
    <div data-qa-id='admin-header'>
      <div data-qa-id='header-title'>{title}</div>
      <div data-qa-id='header-subtitle'>{subtitle}</div>
      <div data-qa-id='header-user'>{userName}</div>
      <div data-qa-id='header-role'>{userRole}</div>
      <div data-qa-id='header-border'>{hideBorder?.toString()}</div>
      <div data-qa-id='header-trailing'>{trailingContent}</div>
    </div>
  ),
}));

// Get the mocked functions
const mockUseParams = jest.mocked(useParams);
const mockGetNavigationItems = jest.mocked(getNavigationItems);

describe('AdminLayout', () => {
  const mockNavigationItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/en/dashboard' },
    { id: 'analytics', label: 'Analytics', href: '/en/analytics' },
    { id: 'users', label: 'Users', href: '/en/users' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ locale: 'en' });
    mockGetNavigationItems.mockReturnValue(mockNavigationItems);
  });

  it('renders without crashing', () => {
    render(
      <AdminLayout>
        <div data-qa-id='test-content'>Test Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('renders main layout structure', () => {
    render(
      <AdminLayout>
        <div data-qa-id='child-content'>Child Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('admin-layout-content')).toBeInTheDocument();
    expect(screen.getByTestId('admin-layout-main')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('passes correct activeUrl to SidebarNavigationSimple', () => {
    const activeUrl = '/en/dashboard';

    render(
      <AdminLayout activeUrl={activeUrl}>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('sidebar-active-url')).toHaveTextContent(
      activeUrl,
    );
  });

  it('passes showAccountCard as false to SidebarNavigationSimple', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('sidebar-show-account')).toHaveTextContent(
      'false',
    );
  });

  it('calls getNavigationItems with correct locale', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(mockGetNavigationItems).toHaveBeenCalledWith(
      'en',
      expect.any(Function),
    );
  });

  it('uses default locale when locale param is not available', () => {
    mockUseParams.mockReturnValue({});

    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(mockGetNavigationItems).toHaveBeenCalledWith(
      'en',
      expect.any(Function),
    );
  });

  it('uses provided locale from router params', () => {
    mockUseParams.mockReturnValue({ locale: 'ar' });

    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(mockGetNavigationItems).toHaveBeenCalledWith(
      'ar',
      expect.any(Function),
    );
  });

  it('renders AdminHeader with correct props', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Welcome Admin',
    );
    expect(screen.getByTestId('header-subtitle')).toHaveTextContent(
      'Dashboard Overview',
    );
    expect(screen.getByTestId('header-user')).toHaveTextContent('Faisal');
    expect(screen.getByTestId('header-role')).toHaveTextContent('Govt. Admin');
    expect(screen.getByTestId('header-border')).toHaveTextContent('false');
  });

  it('includes LanguageSwitcher in AdminHeader trailing content', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('renders children content in main area', () => {
    const testContent = (
      <div data-qa-id='complex-content'>
        <h2>Page Title</h2>
        <p>Page content</p>
        <button>Action Button</button>
      </div>
    );

    render(<AdminLayout>{testContent}</AdminLayout>);

    const main = screen.getByTestId('admin-layout-main');
    expect(main).toContainElement(screen.getByTestId('complex-content'));
    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('applies correct CSS classes to layout elements', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    const layout = screen.getByTestId('admin-layout');
    expect(layout).toHaveClass(
      'min-h-screen',
      'bg-gray-50',
      'dark:bg-gray-900',
    );

    const content = screen.getByTestId('admin-layout-content');
    expect(content).toHaveClass('lg:ps-72', 'flex', 'flex-col', 'min-h-screen');

    const main = screen.getByTestId('admin-layout-main');
    expect(main).toHaveClass('flex-1', 'px-4', 'py-8', 'sm:px-6', 'lg:px-8');
  });

  it('renders with proper semantic HTML structure', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    const layout = screen.getByTestId('admin-layout');
    const main = screen.getByTestId('admin-layout-main');

    expect(layout.tagName).toBe('DIV');
    expect(main.tagName).toBe('MAIN');
  });

  it('handles multiple children correctly', () => {
    render(
      <AdminLayout>
        <div data-qa-id='child-1'>Child 1</div>
        <div data-qa-id='child-2'>Child 2</div>
        <span data-qa-id='child-3'>Child 3</span>
      </AdminLayout>,
    );

    const main = screen.getByTestId('admin-layout-main');
    expect(main).toContainElement(screen.getByTestId('child-1'));
    expect(main).toContainElement(screen.getByTestId('child-2'));
    expect(main).toContainElement(screen.getByTestId('child-3'));
  });

  it('handles missing activeUrl gracefully', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    const activeUrlElement = screen.getByTestId('sidebar-active-url');
    expect(activeUrlElement).toBeEmptyDOMElement();
  });

  it('passes navigation items to sidebar', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('sidebar-items-count')).toHaveTextContent('3');
  });

  it('maintains layout structure with different locales', () => {
    const locales = ['en', 'ar', 'fr', 'de'];

    locales.forEach(locale => {
      mockUseParams.mockReturnValue({ locale });
      mockGetNavigationItems.mockClear();

      const { unmount } = render(
        <AdminLayout activeUrl={`/${locale}/dashboard`}>
          <div data-qa-id={`content-${locale}`}>Content for {locale}</div>
        </AdminLayout>,
      );

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
      expect(screen.getByTestId('admin-layout-content')).toBeInTheDocument();
      expect(screen.getByTestId('admin-layout-main')).toBeInTheDocument();
      expect(screen.getByTestId(`content-${locale}`)).toBeInTheDocument();
      expect(mockGetNavigationItems).toHaveBeenCalledWith(
        locale,
        expect.any(Function),
      );

      unmount();
    });
  });

  it('passes translation function to getNavigationItems', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>,
    );

    const translationFunction = mockGetNavigationItems.mock.calls[0][1];
    expect(typeof translationFunction).toBe('function');

    expect(translationFunction('welcome.title')).toBe('Welcome Admin');
    expect(translationFunction('unknown.key')).toBe('unknown.key');
  });

  it('maintains consistent component structure across renders', () => {
    const { rerender } = render(
      <AdminLayout activeUrl='/en/dashboard'>
        <div data-qa-id='content-1'>Content 1</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('content-1')).toBeInTheDocument();

    rerender(
      <AdminLayout activeUrl='/ar/analytics'>
        <div data-qa-id='content-2'>Content 2</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    expect(screen.getByTestId('content-2')).toBeInTheDocument();
    expect(screen.queryByTestId('content-1')).not.toBeInTheDocument();
  });
});
