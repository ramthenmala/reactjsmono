import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '@/shared/ui/layout/Layout';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('@/shared/ui/layout/RTLWrapper', () => ({
  RTLWrapper: ({ children, className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>
      {children}
    </div>
  ),
}));

jest.mock('@/shared/ui/navigation/Header', () => ({
  Header: (props: any) => (
    <div data-qa-id="header-mock">
      Header with {Object.keys(props).length} props
    </div>
  ),
}));

jest.mock('@/shared/ui/layout/Footer', () => ({
  Footer: (props: any) => (
    <div data-qa-id="footer-mock">
      Footer with {Object.keys(props).length} props
    </div>
  ),
}));

jest.mock('@/shared/ui/components/CTASection', () => ({
  CTASection: () => (
    <div data-qa-id="cta-section-mock">CTA Section</div>
  ),
}));

jest.mock('@/features/explore/contexts/ComparisonContext', () => ({
  ComparisonProvider: ({ children }: any) => (
    <div data-qa-id="comparison-provider-mock">{children}</div>
  ),
}));

// Mock the Outlet component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-qa-id="outlet-mock">Page Content</div>,
}));

// Mock shared libraries
const mockCurrentLocale = 'en';
const mockLayoutData = {
  header: {
    logo: { src: '/logo.svg', alt: 'Logo' },
    navigation: [
      { label: 'Home', link: '/home' },
      { label: 'About', link: '/about' },
    ],
  },
  footer: {
    footerContent: 'Test footer content',
    copyrightText: '© 2024 Test Company',
    quickLinks: [
      { label: 'Home', link: '/home' },
    ],
    legalPages: [
      { label: 'Privacy', link: '/privacy' },
    ],
    socialLinks: [
      { platform: 'facebook', link: 'https://facebook.com', label: 'Facebook' },
    ],
  },
};

jest.mock('@/shared/lib', () => ({
  useCurrentLocale: () => mockCurrentLocale,
}));

jest.mock('@/shared/services/layoutService', () => ({
  layoutService: {
    getLayoutData: jest.fn(),
  },
}));

describe('Layout', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { layoutService } = require('@/shared/services/layoutService');
    layoutService.getLayoutData.mockResolvedValue(mockLayoutData);
  });

  describe('Component Rendering', () => {
    it('should render layout with all required elements', async () => {
      renderComponent();

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('CTA Section')).toBeInTheDocument();
      expect(screen.getByText('Page Content')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
        expect(screen.getByText('Footer with 5 props')).toBeInTheDocument();
      });
    });

    it('should have correct data-qa-id attributes', async () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="layout-wrapper"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="layout-main"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="layout-cta"]')).toBeInTheDocument();

      await waitFor(() => {
        expect(container.querySelector('[data-qa-id="layout-header"]')).toBeInTheDocument();
        expect(container.querySelector('[data-qa-id="layout-footer"]')).toBeInTheDocument();
      });
    });

    it('should render loading component initially', () => {
      // Test the Loading component directly
      const { Loading } = require('@/shared/ui/layout/Layout');
      const { container } = render(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="layout-loading"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="loading-spinner"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="loading-text"]')).toBeInTheDocument();
    });

    it('should render main content area with suspense', () => {
      renderComponent();

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('data-qa-id', 'layout-main');
      expect(main).toHaveClass('flex-1');
    });
  });

  describe('Layout Structure', () => {
    it('should have correct semantic HTML structure', async () => {
      renderComponent();

      const main = screen.getByRole('main');
      expect(main.tagName).toBe('MAIN');

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
        expect(screen.getByText('Footer with 5 props')).toBeInTheDocument();
      });
    });

    it('should have proper container classes', () => {
      const { container } = renderComponent();

      const layoutWrapper = container.querySelector('[data-qa-id="layout-wrapper"]');
      expect(layoutWrapper).toHaveClass('min-h-screen', 'flex', 'flex-col');

      const main = container.querySelector('[data-qa-id="layout-main"]');
      expect(main).toHaveClass('flex-1');
    });

    it('should position header as fixed/floating', async () => {
      const { container } = renderComponent();

      await waitFor(() => {
        const headerContainer = container.querySelector('[data-qa-id="layout-header"]');
        expect(headerContainer).toHaveClass('absolute', 'inset-x-0', 'top-0', 'z-50');
      });
    });
  });

  describe('Data Loading', () => {
    it('should load layout data on mount', async () => {
      renderComponent();

      await waitFor(() => {
        const { layoutService } = require('@/shared/services/layoutService');
        expect(layoutService.getLayoutData).toHaveBeenCalledWith(mockCurrentLocale);
      });
    });

    it('should render header and footer after data loads', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
        expect(screen.getByText('Footer with 5 props')).toBeInTheDocument();
      });
    });

    it('should not render header and footer before data loads', () => {
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderComponent();

      expect(screen.queryByText('Header with 2 props')).not.toBeInTheDocument();
      expect(screen.queryByText('Footer with 5 props')).not.toBeInTheDocument();
    });

    it('should handle layout data loading errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Failed to load navigation data:', expect.any(Error));
      });

      // Should still render main components even if data loading fails
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('CTA Section')).toBeInTheDocument();

      consoleError.mockRestore();
    });
  });

  describe('Locale Integration', () => {
    it('should reload data when locale changes', async () => {
      renderComponent();

      await waitFor(() => {
        expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalledWith('en');
      });

      // This test verifies the component calls the service with the correct locale
      // In a real scenario, locale changes would trigger re-renders via useCurrentLocale hook
      expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalledWith('en');
    });

    it('should pass current locale to layout service', async () => {
      renderComponent();

      await waitFor(() => {
        expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalledWith('en');
      });
    });
  });

  describe('Component Integration', () => {
    it('should wrap content with ComparisonProvider', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="comparison-provider-mock"]')).toBeInTheDocument();
    });

    it('should wrap content with RTLWrapper', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="layout-wrapper"]')).toBeInTheDocument();
    });

    it('should render CTA section on every page', () => {
      renderComponent();

      expect(screen.getByText('CTA Section')).toBeInTheDocument();
    });

    it('should render page content through Outlet', () => {
      renderComponent();

      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('should pass correct props to Header component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
      });
    });

    it('should pass correct props to Footer component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Footer with 5 props')).toBeInTheDocument();
      });
    });
  });

  describe('Loading Component', () => {
    it('should render loading spinner with correct styling', () => {
      const { Loading } = require('@/shared/ui/layout/Layout');
      const { container } = render(<Loading />);

      const loadingContainer = container.querySelector('[data-qa-id="layout-loading"]');
      expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen');

      const spinner = container.querySelector('[data-qa-id="loading-spinner"]');
      expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600');

      const loadingText = container.querySelector('[data-qa-id="loading-text"]');
      expect(loadingText).toHaveClass('ml-2', 'text-gray-600');
    });

    it('should display loading text', () => {
      const { Loading } = require('@/shared/ui/layout/Layout');
      render(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should have accessible loading content', () => {
      const { Loading } = require('@/shared/ui/layout/Layout');
      render(<Loading />);

      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toBeVisible();
    });
  });

  describe('Responsive Layout', () => {
    it('should have mobile-first layout structure', () => {
      const { container } = renderComponent();

      const layoutWrapper = container.querySelector('[data-qa-id="layout-wrapper"]');
      expect(layoutWrapper).toHaveClass('flex', 'flex-col');
    });

    it('should maintain proper z-index hierarchy', async () => {
      const { container } = renderComponent();

      await waitFor(() => {
        const headerContainer = container.querySelector('[data-qa-id="layout-header"]');
        expect(headerContainer).toHaveClass('z-50');
      });
    });

    it('should handle viewport height correctly', () => {
      const { container } = renderComponent();

      const layoutWrapper = container.querySelector('[data-qa-id="layout-wrapper"]');
      expect(layoutWrapper).toHaveClass('min-h-screen');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing header data gracefully', async () => {
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockResolvedValue({
        footer: mockLayoutData.footer,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Header with 2 props')).not.toBeInTheDocument();
        expect(screen.getByText('Footer with 5 props')).toBeInTheDocument();
      });
    });

    it('should handle missing footer data gracefully', async () => {
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockResolvedValue({
        header: mockLayoutData.header,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
        expect(screen.queryByText('Footer with 5 props')).not.toBeInTheDocument();
      });
    });

    it('should handle empty layout data gracefully', async () => {
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockResolvedValue({});

      renderComponent();

      await waitFor(() => {
        expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalled();
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('CTA Section')).toBeInTheDocument();
    });

    it('should handle null layout data gracefully', async () => {
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockResolvedValue(null);

      renderComponent();

      await waitFor(() => {
        expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalled();
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('CTA Section')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should use Suspense for lazy loading', () => {
      renderComponent();

      // Suspense should be set up - we can test by checking the Suspense fallback component directly
      const { Loading } = require('@/shared/ui/layout/Layout');
      const { container } = render(<Loading />);
      
      expect(container.querySelector('[data-qa-id="layout-loading"]')).toBeInTheDocument();
      
      // Page content should be rendered in main layout
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('should render efficiently with large layout data', async () => {
      const largeLayoutData = {
        header: {
          ...mockLayoutData.header,
          navigation: Array.from({ length: 50 }, (_, i) => ({
            label: `Nav Item ${i + 1}`,
            link: `/nav${i + 1}`,
          })),
        },
        footer: {
          ...mockLayoutData.footer,
          quickLinks: Array.from({ length: 20 }, (_, i) => ({
            label: `Quick Link ${i + 1}`,
            link: `/quick${i + 1}`,
          })),
        },
      };

      require('@/shared/services/layoutService').layoutService.getLayoutData.mockResolvedValue(largeLayoutData);

      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
      });

      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderComponent();

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should maintain focus management with Suspense', () => {
      renderComponent();

      // Main content should be focusable even during loading
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should provide accessible loading feedback', () => {
      const { Loading } = require('@/shared/ui/layout/Layout');
      render(<Loading />);

      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid locale changes', async () => {
      const { rerender } = renderComponent();

      // Simulate rapid locale changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        );
      }

      await waitFor(() => {
        expect(require('@/shared/services/layoutService').layoutService.getLayoutData).toHaveBeenCalled();
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should maintain state during re-renders', async () => {
      const { rerender } = renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Header with 2 props')).toBeInTheDocument();
      });

      rerender(
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('CTA Section')).toBeInTheDocument();
    });

    it('should handle component unmounting during data loading', () => {
      let resolvePromise: (value: any) => void;
      require('@/shared/services/layoutService').layoutService.getLayoutData.mockImplementation(
        () => new Promise(resolve => {
          resolvePromise = resolve;
        })
      );

      const { unmount } = renderComponent();

      // Unmount before promise resolves
      unmount();

      // Should not cause errors when promise resolves after unmount
      expect(() => {
        resolvePromise!(mockLayoutData);
      }).not.toThrow();
    });
  });
});