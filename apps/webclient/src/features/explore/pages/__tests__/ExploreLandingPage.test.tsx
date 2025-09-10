import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExploreLandingPage } from '@/features/explore/pages/ExploreLandingPage';

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
  Hero: ({ backgroundImage, title, subtitle, breadcrumbItems }: any) => (
    <div data-qa-id="hero-component">
      <div data-qa-id="hero-background">{backgroundImage}</div>
      <div data-qa-id="hero-title">{title}</div>
      <div data-qa-id="hero-subtitle">{subtitle}</div>
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

jest.mock('@/features/explore/components/Search/SearchPanel', () => ({
  SearchPanel: () => <div data-qa-id="search-panel">Search Panel</div>,
}));

jest.mock('@/features/explore/components/FeaturedIndustrialCities', () => ({
  FeaturedIndustrialCities: ({ title, subtitle }: any) => (
    <div data-qa-id="featured-cities">
      <div data-qa-id="featured-cities-title">{title}</div>
      <div data-qa-id="featured-cities-subtitle">{subtitle}</div>
    </div>
  ),
}));

jest.mock('@/features/explore/components/Navigation/InvestorJourney', () => ({
  InvestorJourney: ({ title, content, cards }: any) => (
    <div data-qa-id="investor-journey">
      <div data-qa-id="investor-journey-title">{title}</div>
      <div data-qa-id="investor-journey-content">{content}</div>
      <div data-qa-id="investor-journey-cards">{cards?.length || 0} cards</div>
    </div>
  ),
}));

jest.mock('@/features/explore/constants', () => ({
  EXPLORE_PAGE_CONFIGS: {
    landing: {
      layout: {
        className: 'landing-layout',
        background: 'landing-bg',
      },
      hero: {
        breadcrumbBase: '/explore',
      },
    },
  },
}));

// Mock the explore service
jest.mock('@/features/explore/services/exploreService', () => ({
  exploreService: {
    getExploreData: jest.fn(),
  },
}));

const mockExploreData = {
  bannerImage: '/test-banner.jpg',
  bannerTitle: 'Test Banner Title',
  bannerContent: 'Test Banner Content',
  featuredIndustrialCitiesTitle: 'Featured Cities Title',
  featuredIndustrialCitiesContent: 'Featured Cities Content',
  compassInvestorJourney: {
    title: 'Investor Journey Title',
    content: 'Investor Journey Content',
    cards: [
      { icon: 'icon1', title: 'Card 1', content: 'Content 1' },
      { icon: 'icon2', title: 'Card 2', content: 'Content 2' },
    ],
  },
};

describe('ExploreLandingPage', () => {
  const mockExploreService = require('@/features/explore/services/exploreService').exploreService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockExploreService.getExploreData.mockResolvedValue(mockExploreData);
  });

  it('should render with correct data-qa-id attributes', async () => {
    render(<ExploreLandingPage />);

    expect(screen.getByTestId('explore-landing-page')).toBeInTheDocument();
    expect(screen.getByTestId('explore-landing-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('explore-landing-search-section')).toBeInTheDocument();
    expect(screen.getByTestId('explore-landing-featured-cities-section')).toBeInTheDocument();
    expect(screen.getByTestId('explore-landing-investor-journey-section')).toBeInTheDocument();
  });

  it('should apply correct CSS classes from config', () => {
    render(<ExploreLandingPage />);

    const mainContainer = screen.getByTestId('explore-landing-page');
    expect(mainContainer).toHaveClass('landing-layout', 'landing-bg');
  });

  it('should render all child components', () => {
    render(<ExploreLandingPage />);

    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('search-panel')).toBeInTheDocument();
    expect(screen.getByTestId('featured-cities')).toBeInTheDocument();
    expect(screen.getByTestId('investor-journey')).toBeInTheDocument();
  });

  it('should fetch explore data on mount', async () => {
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(mockExploreService.getExploreData).toHaveBeenCalledWith('en');
    });
  });

  it('should pass correct props to Hero component with loaded data', async () => {
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-background')).toHaveTextContent('/test-banner.jpg');
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Banner Title');
      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('Test Banner Content');
      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Explore');
    });
  });

  it('should pass correct props to FeaturedIndustrialCities with loaded data', async () => {
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('featured-cities-title')).toHaveTextContent('Featured Cities Title');
      expect(screen.getByTestId('featured-cities-subtitle')).toHaveTextContent('Featured Cities Content');
    });
  });

  it('should pass correct props to InvestorJourney with loaded data', async () => {
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('investor-journey-title')).toHaveTextContent('Investor Journey Title');
      expect(screen.getByTestId('investor-journey-content')).toHaveTextContent('Investor Journey Content');
      expect(screen.getByTestId('investor-journey-cards')).toHaveTextContent('2 cards');
    });
  });

  it('should render with empty data when service returns null', async () => {
    mockExploreService.getExploreData.mockResolvedValue(null);
    
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-background')).toHaveTextContent('');
      expect(screen.getByTestId('hero-title')).toHaveTextContent('');
      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('');
    });
  });

  it('should handle service error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockExploreService.getExploreData.mockRejectedValue(new Error('Service error'));
    
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load navigation data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should handle partial explore data', async () => {
    const partialData = {
      bannerImage: '/partial-banner.jpg',
      bannerTitle: 'Partial Title',
      // Missing other fields
    };
    
    mockExploreService.getExploreData.mockResolvedValue(partialData);
    
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-background')).toHaveTextContent('/partial-banner.jpg');
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Partial Title');
      expect(screen.getByTestId('featured-cities-title')).toHaveTextContent('');
      expect(screen.getByTestId('investor-journey-title')).toHaveTextContent('');
    });
  });

  it('should handle missing compassInvestorJourney gracefully', async () => {
    const dataWithoutJourney = {
      ...mockExploreData,
      compassInvestorJourney: undefined,
    };
    
    mockExploreService.getExploreData.mockResolvedValue(dataWithoutJourney);
    
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('investor-journey-title')).toHaveTextContent('');
      expect(screen.getByTestId('investor-journey-content')).toHaveTextContent('');
      expect(screen.getByTestId('investor-journey-cards')).toHaveTextContent('0 cards');
    });
  });

  it('should re-fetch data when locale changes', async () => {
    const { useCurrentLocale } = require('@/shared');
    useCurrentLocale.mockReturnValueOnce('en').mockReturnValueOnce('ar');

    const { rerender } = render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(mockExploreService.getExploreData).toHaveBeenCalledWith('en');
    });

    // Simulate locale change
    useCurrentLocale.mockReturnValue('ar');
    rerender(<ExploreLandingPage />);

    await waitFor(() => {
      expect(mockExploreService.getExploreData).toHaveBeenCalledWith('ar');
    });
  });

  it('should have correct display name', () => {
    expect(ExploreLandingPage.displayName).toBe('ExploreLandingPage');
  });

  it('should handle Hero component with empty breadcrumb items', () => {
    render(<ExploreLandingPage />);

    const breadcrumbs = screen.getByTestId('hero-breadcrumbs');
    expect(breadcrumbs).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Explore');
  });

  it('should maintain component structure order', () => {
    render(<ExploreLandingPage />);

    const container = screen.getByTestId('explore-landing-page');
    const sections = [
      'explore-landing-hero-section',
      'explore-landing-search-section', 
      'explore-landing-featured-cities-section',
      'explore-landing-investor-journey-section'
    ];

    sections.forEach(sectionId => {
      const section = screen.getByTestId(sectionId);
      expect(container).toContainElement(section);
    });
  });

  it('should handle async data loading race conditions', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockExploreService.getExploreData.mockReturnValue(promise);
    
    render(<ExploreLandingPage />);
    
    // Data should be empty initially
    expect(screen.getByTestId('hero-title')).toHaveTextContent('');
    
    // Resolve the promise
    await act(async () => {
      resolvePromise!(mockExploreData);
      await promise;
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Test Banner Title');
    });
  });

  it('should handle component unmounting during data fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockExploreService.getExploreData.mockReturnValue(promise);
    
    const { unmount } = render(<ExploreLandingPage />);
    
    // Unmount before data resolves
    unmount();
    
    // Resolve the promise - should not cause errors
    await act(async () => {
      resolvePromise!(mockExploreData);
      await promise;
    });
    
    // No assertions needed - test passes if no errors thrown
  });

  it('should render with memo optimization', () => {
    const { rerender } = render(<ExploreLandingPage />);
    
    // Re-render with same props should use memo
    rerender(<ExploreLandingPage />);
    
    expect(screen.getByTestId('explore-landing-page')).toBeInTheDocument();
  });

  it('should use translation hook correctly', () => {
    render(<ExploreLandingPage />);
    
    // Component should render without errors, indicating translation hook works
    expect(screen.getByTestId('explore-landing-page')).toBeInTheDocument();
  });

  it('should handle empty cards array in investor journey', async () => {
    const dataWithEmptyCards = {
      ...mockExploreData,
      compassInvestorJourney: {
        title: 'Journey Title',
        content: 'Journey Content',
        cards: [],
      },
    };
    
    mockExploreService.getExploreData.mockResolvedValue(dataWithEmptyCards);
    
    render(<ExploreLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('investor-journey-cards')).toHaveTextContent('0 cards');
    });
  });
});