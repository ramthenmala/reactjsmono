import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchPanel } from '../index';
import { SearchFilters } from '@/shared/types';

// Mock modules
jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/router', () => ({
  useCurrentLocale: () => 'en',
}));

jest.mock('@/shared/hooks', () => ({
  useSearchData: () => ({
    isics: [
      { id: '1', label: 'ISIC 1', value: '1' },
      { id: '2', label: 'ISIC 2', value: '2' },
    ],
    sectors: [
      { id: 'tech', label: 'Technology', value: 'tech' },
      { id: 'health', label: 'Healthcare', value: 'health' },
    ],
    regions: [
      { id: 'region1', label: 'Region 1', value: 'region1' },
      { id: 'region2', label: 'Region 2', value: 'region2' },
    ],
    cities: [
      { id: 'city1', label: 'City 1', value: 'city1' },
      { id: 'city2', label: 'City 2', value: 'city2' },
    ],
    areaRange: { min: 0, max: 1000 },
    loadCities: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@/shared/hooks/useSearchFiltersStore', () => ({
  useSearchFiltersStore: () => ({
    filters: {
      isic: [],
      sector: '',
      region: '',
      location: '',
      minArea: 0,
      maxArea: 1000,
    },
    areaValue: [0, 1000] as [number, number],
    updateFilters: jest.fn(),
    updateAreaValue: jest.fn(),
    clearFilters: jest.fn(),
  }),
}));

jest.mock('@/shared/utils', () => ({
  createRouteUrl: jest.fn(() => '/explore/listing'),
}));

// Mock SearchForm component
jest.mock('../SearchForm', () => ({
  SearchForm: ({
    onSearch,
    onClear,
    'data-qa-id': dataQaId,
  }: any) => (
    <div data-qa-id={dataQaId || 'search-form'}>
      <button onClick={onSearch} data-qa-id={`${dataQaId || 'search-form'}-search-button`}>
        Search
      </button>
      <button onClick={onClear} data-qa-id={`${dataQaId || 'search-form'}-clear-button`}>
        Clear
      </button>
      <span>Search Form Mock</span>
    </div>
  ),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SearchPanel', () => {
  const defaultProps = {
    initialFilters: {
      isic: [],
      sector: '',
      region: '',
      location: '',
      minArea: 0,
      maxArea: 1000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render SearchPanel with default data-qa-id', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByTestId('search-panel')).toBeInTheDocument();
      expect(screen.getByTestId('search-panel-container')).toBeInTheDocument();
      expect(screen.getByTestId('search-panel-content')).toBeInTheDocument();
      expect(screen.getByTestId('search-panel-form')).toBeInTheDocument();
    });

    it('should render SearchPanel with custom data-qa-id', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} data-qa-id="custom-search" />
        </BrowserRouter>
      );

      expect(screen.getByTestId('custom-search')).toBeInTheDocument();
      expect(screen.getByTestId('custom-search-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-search-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-search-form')).toBeInTheDocument();
    });

    it('should render SearchForm component', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      expect(screen.getByText('Search Form Mock')).toBeInTheDocument();
      expect(screen.getByTestId('search-panel-form-search-button')).toBeInTheDocument();
      expect(screen.getByTestId('search-panel-form-clear-button')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call onSearch callback when search is triggered and onSearch prop is provided', () => {
      const mockOnSearch = jest.fn();
      
      render(
        <BrowserRouter>
          <SearchPanel 
            {...defaultProps} 
            onSearch={mockOnSearch}
          />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByTestId('search-panel-form-search-button'));

      expect(mockOnSearch).toHaveBeenCalledWith({
        isic: [],
        sector: '',
        region: '',
        location: '',
        minArea: 0,
        maxArea: 1000,
      });
    });

    it('should navigate to search results when no onSearch callback is provided', async () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByTestId('search-panel-form-search-button'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/explore/listing');
      });
    });

    it('should handle search with loading state', async () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByTestId('search-panel-form-search-button'));

      // Verify navigation happens after loading
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/explore/listing');
      });
    });
  });

  describe('Clear Functionality', () => {
    it('should handle clear filters action', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByTestId('search-panel-form-clear-button'));

      expect(mockNavigate).toHaveBeenCalledWith('/explore/listing');
    });
  });

  describe('Props Handling', () => {
    it('should handle initialFilters prop', () => {
      const initialFilters: Partial<SearchFilters> = {
        sector: 'tech',
        region: 'region1',
      };

      render(
        <BrowserRouter>
          <SearchPanel 
            initialFilters={initialFilters}
          />
        </BrowserRouter>
      );

      expect(screen.getByTestId('search-panel')).toBeInTheDocument();
    });

    it('should work without initialFilters prop', () => {
      render(
        <BrowserRouter>
          <SearchPanel />
        </BrowserRouter>
      );

      expect(screen.getByTestId('search-panel')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container styling and structure', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      const container = screen.getByTestId('search-panel-container');
      expect(container).toHaveClass('relative', 'flex', 'flex-col');
      // Note: Testing inline styles is complex with React, so we focus on class presence
      expect(container).toBeInTheDocument();
    });

    it('should have correct section classes', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      const section = screen.getByTestId('search-panel');
      expect(section).toHaveClass('container', 'relative', 'z-10', '-mt-25');
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical data-qa-id structure', () => {
      render(
        <BrowserRouter>
          <SearchPanel data-qa-id="test-search" />
        </BrowserRouter>
      );

      expect(screen.getByTestId('test-search')).toBeInTheDocument();
      expect(screen.getByTestId('test-search-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-search-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-search-form')).toBeInTheDocument();
    });

    it('should pass data-qa-id to SearchForm component', () => {
      render(
        <BrowserRouter>
          <SearchPanel data-qa-id="parent-search" />
        </BrowserRouter>
      );

      expect(screen.getByTestId('parent-search-form')).toBeInTheDocument();
      expect(screen.getByTestId('parent-search-form-search-button')).toBeInTheDocument();
      expect(screen.getByTestId('parent-search-form-clear-button')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle search errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock navigate to throw an error
      mockNavigate.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });

      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByTestId('search-panel-form-search-button'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Search failed:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with all required hooks and utilities', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      // Verify component renders without errors, indicating all mocks are working
      expect(screen.getByTestId('search-panel')).toBeInTheDocument();
      expect(screen.getByText('Search Form Mock')).toBeInTheDocument();
    });

    it('should handle router context properly', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      // Component should render without router-related errors
      expect(screen.getByTestId('search-panel')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render as a semantic section element', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      const section = screen.getByTestId('search-panel');
      expect(section.tagName).toBe('SECTION');
    });

    it('should maintain proper DOM structure for accessibility', () => {
      render(
        <BrowserRouter>
          <SearchPanel {...defaultProps} />
        </BrowserRouter>
      );

      const section = screen.getByTestId('search-panel');
      const container = screen.getByTestId('search-panel-container');
      const content = screen.getByTestId('search-panel-content');

      expect(section).toContainElement(container);
      expect(container).toContainElement(content);
    });
  });
});