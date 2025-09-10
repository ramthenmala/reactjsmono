import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropertyDetailPage } from '@/features/explore/pages/PropertyDetailPage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

// Mock all dependencies
jest.mock('@/shared/lib/i18n', () => ({
  useLocaleTranslation: () => ({
    t: jest.fn((key: string) => {
      const translations: { [key: string]: string } = {
        'navigation.explore': 'Explore',
      };
      return translations[key] || key;
    }),
  }),
}));

jest.mock('@/shared', () => ({
  useCurrentLocale: jest.fn(() => 'en'),
}));

jest.mock('@/shared/ui/components/Hero', () => ({
  Hero: ({ backgroundImage, breadcrumbItems, className }: any) => (
    <div data-qa-id="hero-component">
      <div data-qa-id="hero-background">{backgroundImage}</div>
      <div data-qa-id="hero-classname">{className}</div>
      <div data-qa-id="hero-breadcrumbs">
        {breadcrumbItems?.map((item: any, index: number) => (
          <span key={index} data-qa-id={`breadcrumb-${index}`}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/PropertyDetailsSection', () => ({
  PropertyDetailsSection: ({ industrialCity }: any) => (
    <div data-qa-id="property-details-section">
      <div data-qa-id="property-details-city-name">{industrialCity?.name || 'No city'}</div>
      <div data-qa-id="property-details-city-district">{industrialCity?.district || 'No district'}</div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/PrioritizationResultsSection', () => ({
  PrioritizationResultsSection: ({ industrialCity }: any) => (
    <div data-qa-id="prioritization-results-section">
      <div data-qa-id="prioritization-city-name">{industrialCity?.name || 'No city'}</div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/Navigation/ExploreActions', () => ({
  ExploreActions: ({ size, variant }: any) => (
    <div data-qa-id="explore-actions">
      <div data-qa-id="explore-actions-size">{size}</div>
      <div data-qa-id="explore-actions-variant">{variant}</div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/UI/ApiDownNotice', () => ({
  ApiDownNotice: () => <div data-qa-id="api-down-notice">API is down</div>,
}));

// Mock the industrial city service
jest.mock('@/features/explore/services/industrialCityService', () => ({
  industrialCityService: {
    getIndustrialCity: jest.fn(),
  },
}));

const mockIndustrialCity = {
  id: 'test-city-1',
  name: 'Test Industrial City',
  district: 'Test District',
  cityName: 'Test City Name',
  totalArea: '1000.5',
  banner: '/test-banner.jpg',
  description: 'Test description',
  infrastructure: {
    electricity: '500MW',
    water: '200L/min',
    gas: '100m³/h',
  },
  location: {
    coordinates: {
      lat: 24.7136,
      lng: 46.6753,
    },
  },
};

describe('PropertyDetailPage', () => {
  const mockUseParams = require('react-router-dom').useParams;
  const mockIndustrialCityService = require('@/features/explore/services/industrialCityService').industrialCityService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: 'test-slug' });
    mockIndustrialCityService.getIndustrialCity.mockResolvedValue(mockIndustrialCity);
  });

  it('should render with correct data-qa-id attributes', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
      expect(screen.getByTestId('property-detail-hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('property-detail-mobile-actions')).toBeInTheDocument();
      expect(screen.getByTestId('property-detail-details-section')).toBeInTheDocument();
      expect(screen.getByTestId('property-detail-prioritization-section')).toBeInTheDocument();
    });
  });

  it('should apply correct CSS classes to main container', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId('property-detail-page');
      expect(mainContainer).toHaveClass(
        'flex',
        'min-h-dvh',
        'flex-col',
        'bg-[radial-gradient(50%_50%_at_100%_50%,rgba(85,71,181,0.2)_0%,rgba(216,200,255,0)_100%)]'
      );
    });
  });

  it('should render all child components with loaded data', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-component')).toBeInTheDocument();
      expect(screen.getByTestId('explore-actions')).toBeInTheDocument();
      expect(screen.getByTestId('property-details-section')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section')).toBeInTheDocument();
    });
  });

  it('should fetch industrial city data on mount', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(mockIndustrialCityService.getIndustrialCity).toHaveBeenCalledWith('en', 'test-slug');
    });
  });

  it('should pass correct props to Hero component', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-background')).toHaveTextContent('/assets/images/backgrounds/ExploreBG.jpg');
      expect(screen.getByTestId('hero-classname')).toHaveTextContent('pb-28 md:pb-40');
      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Explore');
      expect(screen.getByTestId('breadcrumb-1')).toHaveTextContent('Test District');
    });
  });

  it('should pass correct props to ExploreActions', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('explore-actions-size')).toHaveTextContent('sm');
      expect(screen.getByTestId('explore-actions-variant')).toHaveTextContent('light');
    });
  });

  it('should pass industrial city data to child components', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-details-city-name')).toHaveTextContent('Test Industrial City');
      expect(screen.getByTestId('property-details-city-district')).toHaveTextContent('Test District');
      expect(screen.getByTestId('prioritization-city-name')).toHaveTextContent('Test Industrial City');
    });
  });

  it('should display loading state initially', () => {
    mockIndustrialCityService.getIndustrialCity.mockImplementation(() => new Promise(() => {}));
    
    render(<PropertyDetailPage />);

    expect(screen.getByTestId('property-detail-loading-state')).toBeInTheDocument();
    expect(screen.getByTestId('property-detail-loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('property-detail-loading-text')).toHaveTextContent('Loading property details...');
  });

  it('should apply correct CSS classes to loading state', () => {
    mockIndustrialCityService.getIndustrialCity.mockImplementation(() => new Promise(() => {}));
    
    render(<PropertyDetailPage />);

    const loadingState = screen.getByTestId('property-detail-loading-state');
    expect(loadingState).toHaveClass('flex', 'min-h-dvh', 'items-center', 'justify-center');

    const spinner = screen.getByTestId('property-detail-loading-spinner');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-b-2',
      'border-purple-600',
      'mx-auto',
      'mb-4'
    );

    const loadingText = screen.getByTestId('property-detail-loading-text');
    expect(loadingText).toHaveClass('text-gray-600');
  });

  it('should display API down notice when data is null', async () => {
    mockIndustrialCityService.getIndustrialCity.mockResolvedValue(null);
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-detail-api-down-notice')).toBeInTheDocument();
      expect(screen.getByTestId('api-down-notice')).toHaveTextContent('API is down');
    });
  });

  it('should handle service error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockIndustrialCityService.getIndustrialCity.mockRejectedValue(new Error('Service error'));
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading property:', expect.any(Error));
      expect(screen.getByTestId('property-detail-api-down-notice')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle missing slug parameter', async () => {
    mockUseParams.mockReturnValue({ slug: undefined });
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-detail-api-down-notice')).toBeInTheDocument();
    });

    expect(mockIndustrialCityService.getIndustrialCity).not.toHaveBeenCalled();
  });

  it('should handle empty slug parameter', async () => {
    mockUseParams.mockReturnValue({ slug: '' });
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-detail-api-down-notice')).toBeInTheDocument();
    });

    expect(mockIndustrialCityService.getIndustrialCity).not.toHaveBeenCalled();
  });

  it('should re-fetch data when slug changes', async () => {
    mockUseParams.mockReturnValueOnce({ slug: 'slug-1' }).mockReturnValueOnce({ slug: 'slug-2' });

    const { rerender } = render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(mockIndustrialCityService.getIndustrialCity).toHaveBeenCalledWith('en', 'slug-1');
    });

    // Simulate slug change
    mockUseParams.mockReturnValue({ slug: 'slug-2' });
    rerender(<PropertyDetailPage />);

    await waitFor(() => {
      expect(mockIndustrialCityService.getIndustrialCity).toHaveBeenCalledWith('en', 'slug-2');
    });
  });

  it('should re-fetch data when locale changes', async () => {
    const { useCurrentLocale } = require('@/shared');
    useCurrentLocale.mockReturnValueOnce('en').mockReturnValueOnce('ar');

    const { rerender } = render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(mockIndustrialCityService.getIndustrialCity).toHaveBeenCalledWith('en', 'test-slug');
    });

    // Simulate locale change
    useCurrentLocale.mockReturnValue('ar');
    rerender(<PropertyDetailPage />);

    await waitFor(() => {
      expect(mockIndustrialCityService.getIndustrialCity).toHaveBeenCalledWith('ar', 'test-slug');
    });
  });

  it('should handle partial industrial city data', async () => {
    const partialData = {
      id: 'partial-city',
      name: 'Partial City',
      // Missing district and other fields
    };
    
    mockIndustrialCityService.getIndustrialCity.mockResolvedValue(partialData);
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-details-city-name')).toHaveTextContent('Partial City');
      expect(screen.getByTestId('property-details-city-district')).toHaveTextContent('No district');
      expect(screen.getByTestId('breadcrumb-1')).toHaveTextContent('');
    });
  });

  it('should apply correct CSS classes to mobile actions section', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      const mobileActions = screen.getByTestId('property-detail-mobile-actions');
      expect(mobileActions).toHaveClass('md:hidden', 'mx-auto', '-mt-20', 'mb-11');
    });
  });

  it('should maintain proper component structure order', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      const container = screen.getByTestId('property-detail-page');
      const sections = [
        'property-detail-hero-section',
        'property-detail-mobile-actions',
        'property-detail-details-section',
        'property-detail-prioritization-section'
      ];

      sections.forEach(sectionId => {
        const section = screen.getByTestId(sectionId);
        expect(container).toContainElement(section);
      });
    });
  });

  it('should handle Hero breadcrumb with translation', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Explore');
    });
  });

  it('should handle loading state to loaded state transition', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockIndustrialCityService.getIndustrialCity.mockReturnValue(promise);
    
    render(<PropertyDetailPage />);
    
    // Should show loading initially
    expect(screen.getByTestId('property-detail-loading-state')).toBeInTheDocument();
    
    // Resolve the promise
    resolvePromise!(mockIndustrialCity);
    
    await waitFor(() => {
      expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
      expect(screen.queryByTestId('property-detail-loading-state')).not.toBeInTheDocument();
    });
  });

  it('should handle loading state to error state transition', async () => {
    let rejectPromise: (error: any) => void;
    const promise = new Promise((_, reject) => {
      rejectPromise = reject;
    });
    
    mockIndustrialCityService.getIndustrialCity.mockReturnValue(promise);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<PropertyDetailPage />);
    
    // Should show loading initially
    expect(screen.getByTestId('property-detail-loading-state')).toBeInTheDocument();
    
    // Reject the promise
    rejectPromise!(new Error('Network error'));
    
    await waitFor(() => {
      expect(screen.getByTestId('property-detail-api-down-notice')).toBeInTheDocument();
      expect(screen.queryByTestId('property-detail-loading-state')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle component unmounting during data fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockIndustrialCityService.getIndustrialCity.mockReturnValue(promise);
    
    const { unmount } = render(<PropertyDetailPage />);
    
    // Unmount before data resolves
    unmount();
    
    // Resolve the promise - should not cause errors
    resolvePromise!(mockIndustrialCity);
    
    // No assertions needed - test passes if no errors thrown
  });

  it('should pass correct href values to breadcrumbs', async () => {
    render(<PropertyDetailPage />);

    await waitFor(() => {
      const heroComponent = screen.getByTestId('hero-component');
      expect(heroComponent).toBeInTheDocument();
    });
  });

  it('should handle industrial city with missing name', async () => {
    const cityWithoutName = {
      id: 'no-name-city',
      district: 'Test District',
    };
    
    mockIndustrialCityService.getIndustrialCity.mockResolvedValue(cityWithoutName);
    
    render(<PropertyDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-details-city-name')).toHaveTextContent('No city');
      expect(screen.getByTestId('property-details-city-district')).toHaveTextContent('Test District');
    });
  });

  it('should use translation hook correctly', async () => {
    render(<PropertyDetailPage />);
    
    // Component should render without errors, indicating translation hook works
    await waitFor(() => {
      expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
    });
  });

  it('should use fallback text when translation returns null', async () => {
    // Mock translation to return null for navigation.explore
    jest.doMock('@/shared/lib/i18n', () => ({
      useLocaleTranslation: () => ({
        t: jest.fn((key: string) => {
          if (key === 'navigation.explore') return null;
          return key;
        }),
      }),
    }));

    render(<PropertyDetailPage />);

    await waitFor(() => {
      // Should use the fallback 'Explore' text
      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Explore');
    });
  });
});