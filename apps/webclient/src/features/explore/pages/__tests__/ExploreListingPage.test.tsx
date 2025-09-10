import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExploreListingPage } from '@/features/explore/pages/ExploreListingPage';

// Mock all dependencies
jest.mock('@/shared/lib/i18n', () => ({
  useLocaleTranslation: () => ({
    t: jest.fn((key: string, options?: any) => {
      const translations: { [key: string]: string } = {
        'navigation.explore': 'Explore',
        'explore.listing': 'Search Results',
        'explore.results.title': 'Available Industrial Cities',
        'explore.results.count': `${options?.count || 0} industrial cities found`,
      };
      return translations[key] || key;
    }),
    currentLanguage: 'en',
  }),
}));

jest.mock('@/shared/lib/router/routerUtils', () => ({
  useLocaleNavigate: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@/shared', () => ({
  useCurrentLocale: jest.fn(() => 'en'),
}));

jest.mock('@/shared/ui/components/Hero', () => ({
  Hero: ({ backgroundImage, breadcrumbItems }: any) => (
    <div data-qa-id="hero-component">
      <div data-qa-id="hero-background">{backgroundImage}</div>
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

jest.mock('@/features/explore/components/Property/PropertyGrid', () => ({
  PropertyGrid: ({ properties, viewMode, onView, onCompare }: any) => (
    <div data-qa-id="property-grid">
      <div data-qa-id="property-grid-view-mode">{viewMode}</div>
      <div data-qa-id="property-grid-count">{properties?.length || 0}</div>
      <div data-qa-id="property-grid-properties">
        {properties?.map((property: any, index: number) => (
          <div key={index} data-qa-id={`property-${index}`}>
            <span data-qa-id={`property-${index}-name`}>{property.name}</span>
            <button 
              data-qa-id={`property-${index}-view`}
              onClick={() => onView?.(property)}
            >
              View
            </button>
            <button 
              data-qa-id={`property-${index}-compare`}
              onClick={() => onCompare?.(property)}
            >
              Compare
            </button>
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/UI/ViewControls', () => ({
  ViewControls: ({ viewMode, onViewModeChange }: any) => (
    <div data-qa-id="view-controls">
      <div data-qa-id="current-view-mode">{viewMode}</div>
      <button 
        data-qa-id="view-mode-split"
        onClick={() => onViewModeChange?.('split')}
      >
        Split
      </button>
      <button 
        data-qa-id="view-mode-list"
        onClick={() => onViewModeChange?.('list')}
      >
        List
      </button>
      <button 
        data-qa-id="view-mode-map"
        onClick={() => onViewModeChange?.('map')}
      >
        Map
      </button>
    </div>
  ),
}));

jest.mock('@/features/explore/components/Search/SearchPanel', () => ({
  SearchPanel: () => <div data-qa-id="search-panel">Search Panel</div>,
}));

jest.mock('@/features/explore/components/Map', () => ({
  Map: ({ points, className, onMarkerClick }: any) => (
    <div data-qa-id="map-component" className={className}>
      <div data-qa-id="map-points-count">{points?.length || 0}</div>
      <div data-qa-id="map-points">
        {points?.map((point: any, index: number) => (
          <button
            key={index}
            data-qa-id={`map-marker-${index}`}
            onClick={() => onMarkerClick?.(point)}
          >
            {point.name}
          </button>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('@/features/explore/contexts/ComparisonContext', () => ({
  useComparison: () => ({
    addToComparison: jest.fn((property) => ({
      success: true,
      message: `Added ${property.name} to comparison`,
    })),
  }),
}));

jest.mock('@/features/explore/constants', () => ({
  EXPLORE_PAGE_CONFIGS: {
    listing: {
      layout: {
        className: 'listing-layout',
        background: 'listing-bg',
      },
      hero: {
        backgroundImage: '/test-listing-bg.jpg',
      },
    },
  },
}));

// Mock the search service
jest.mock('@/features/explore/services/searchService', () => ({
  searchService: {
    getSearchData: jest.fn(),
  },
}));

// Mock data
const mockSearchData = {
  cities: [
    {
      id: 'city-1',
      name: 'Industrial City 1',
      cityName: 'Main City',
      totalArea: '1000.5',
      banner: '/city1-banner.jpg',
      totalElectricityCapacity: '500MW',
      totalWaterCapacity: '200L/min',
      totalGasCapacity: '100m³/h',
    },
    {
      id: 'city-2',
      name: 'Industrial City 2',
      cityName: 'Secondary City',
      totalArea: '750.25',
      banner: '/city2-banner.jpg',
      totalElectricityCapacity: '300MW',
    },
  ],
};


describe('ExploreListingPage', () => {
  const mockSearchService = require('@/features/explore/services/searchService').searchService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchService.getSearchData.mockResolvedValue(mockSearchData);
  });

  it('should render with correct data-qa-id attributes', async () => {
    render(<ExploreListingPage />);

    expect(screen.getByTestId('explore-listing-page')).toBeInTheDocument();
    expect(screen.getByTestId('explore-listing-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('explore-listing-search-section')).toBeInTheDocument();
    expect(screen.getByTestId('explore-listing-results-section')).toBeInTheDocument();
  });

  it('should apply correct CSS classes from config', () => {
    render(<ExploreListingPage />);

    const mainContainer = screen.getByTestId('explore-listing-page');
    expect(mainContainer).toHaveClass('listing-layout', 'listing-bg');
  });

  it('should fetch search data on mount', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(mockSearchService.getSearchData).toHaveBeenCalledWith('en');
    });
  });

  it('should display loading state initially', () => {
    mockSearchService.getSearchData.mockImplementation(() => new Promise(() => {}));
    
    render(<ExploreListingPage />);

    expect(screen.getByTestId('explore-listing-loading-text')).toHaveTextContent('Loading properties...');
    expect(screen.getByTestId('explore-listing-loading-spinner')).toBeInTheDocument();
  });

  it('should display properties after loading', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('explore-listing-results-count')).toHaveTextContent('2 industrial cities found');
      expect(screen.getByTestId('property-grid-count')).toHaveTextContent('2');
    });
  });

  it('should handle error state', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockSearchService.getSearchData.mockRejectedValue(new Error('API Error'));

    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('explore-listing-error-text')).toHaveTextContent('Error: API Error');
      expect(screen.getByTestId('explore-listing-error-state')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle view mode changes', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('current-view-mode')).toHaveTextContent('split');
    });

    fireEvent.click(screen.getByTestId('view-mode-list'));
    expect(screen.getByTestId('current-view-mode')).toHaveTextContent('list');

    fireEvent.click(screen.getByTestId('view-mode-map'));
    expect(screen.getByTestId('current-view-mode')).toHaveTextContent('map');
  });

  it('should render full map view when viewMode is map', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('view-mode-map'));
    });

    expect(screen.getByTestId('explore-listing-full-map-view')).toBeInTheDocument();
  });

  it('should render property action buttons', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-0-view')).toBeInTheDocument();
      expect(screen.getByTestId('property-0-compare')).toBeInTheDocument();
    });
  });

  it('should render map markers', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('map-marker-0')).toBeInTheDocument();
      expect(screen.getByTestId('map-marker-1')).toBeInTheDocument();
    });
  });

  it('should transform search data correctly', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-0-name')).toHaveTextContent('Industrial City 1');
      expect(screen.getByTestId('property-1-name')).toHaveTextContent('Industrial City 2');
    });
  });

  it('should handle empty cities array', async () => {
    mockSearchService.getSearchData.mockResolvedValue({ cities: [] });
    
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('explore-listing-results-count')).toHaveTextContent('0 industrial cities found');
      expect(screen.getByTestId('property-grid-count')).toHaveTextContent('0');
    });
  });

  it('should handle missing cities property', async () => {
    mockSearchService.getSearchData.mockResolvedValue({});
    
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('explore-listing-results-count')).toHaveTextContent('0 industrial cities found');
      expect(screen.getByTestId('property-grid-count')).toHaveTextContent('0');
    });
  });

  it('should call search service with current locale', async () => {
    render(<ExploreListingPage />);

    await waitFor(() => {
      expect(mockSearchService.getSearchData).toHaveBeenCalledWith('en');
    });
  });
});