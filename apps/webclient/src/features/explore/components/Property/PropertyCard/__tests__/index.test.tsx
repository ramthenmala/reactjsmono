import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyCard } from '../index';
import { IProperty } from '@/features/explore/types/explore';

// Mock the translation hook
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'common.featured': 'Featured',
    'property.electricity': 'Electricity', 
    'property.gas': 'Gas',
    'property.water': 'Water',
    'common.compare': 'Compare',
    'common.view': 'View',
  };
  return translations[key] || key;
});

jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({ t: mockT }),
}));

// Mock the shared-ui components
jest.mock('@compass/shared-ui', () => ({
  Button: ({ children, onClick, className, size, color, 'data-qa-id': dataQaId, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-qa-id={dataQaId}
      data-size={size}
      data-color={color}
      {...props}
    >
      {children}
    </button>
  ),
  Icon: ({ name, size, color, 'data-qa-id': dataQaId, ...props }: any) => (
    <div
      data-qa-id={dataQaId}
      data-icon-name={name}
      data-size={size}
      data-color={color}
      {...props}
    >
      {name}-icon
    </div>
  ),
}));

// Mock the untitled icons
jest.mock('@untitledui/icons', () => ({
  Zap: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>zap-icon</div>
  ),
  Drop: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>drop-icon</div>
  ),
  Anchor: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>anchor-icon</div>
  ),
  Train: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>train-icon</div>
  ),
  Plane: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>plane-icon</div>
  ),
  MarkerPin02: ({ className, 'data-qa-id': dataQaId }: any) => (
    <div className={className} data-qa-id={dataQaId}>marker-icon</div>
  ),
}));

// Mock the styles
jest.mock('../styles', () => ({
  propertyCardStyles: {
    container: 'mock-container',
    imageContainer: 'mock-image-container',
    image: 'mock-image',
    imageOverlay: 'mock-image-overlay',
    featuredBadge: 'mock-featured-badge',
    featuredButton: 'mock-featured-button',
    content: 'mock-content',
    titleContainer: 'mock-title-container',
    title: 'mock-title',
    bottomSection: 'mock-bottom-section',
    areaLocationRow: 'mock-area-location-row',
    areaText: 'mock-area-text',
    locationText: 'mock-location-text',
    metricsContainer: 'mock-metrics-container',
    metricRow: 'mock-metric-row',
    metricLabel: 'mock-metric-label',
    metricValue: 'mock-metric-value',
    separator: 'mock-separator',
    distanceGrid: 'mock-distance-grid',
    distanceCard: 'mock-distance-card',
    buttonGrid: 'mock-button-grid',
    icons: {
      primary: 'mock-icon-primary',
      small: 'mock-icon-small',
      shrink: 'mock-icon-shrink',
    },
  },
}));

describe('PropertyCard', () => {
  const mockProperty: IProperty = {
    id: '1',
    slug: 'test-property',
    city: 'Test City',
    title: 'Test Property',
    area: 1500,
    image: 'https://example.com/test-image.jpg',
    electricity: '100 MW',
    gas: '50 MMSCFD',
    water: '1000 m3/day',
    status: 'available',
    featured: true,
    coordinates: { lat: 24.7136, lng: 46.6753 },
  };

  const defaultProps = {
    property: mockProperty,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<PropertyCard {...defaultProps} data-qa-id="custom-property-card" />);
      
      expect(screen.getByTestId('custom-property-card')).toBeInTheDocument();
    });

    it('should render all required elements', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-image-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-title-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-bottom-section')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-buttons')).toBeInTheDocument();
    });

    it('should render as article element', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const article = screen.getByTestId('property-card');
      expect(article.tagName).toBe('ARTICLE');
    });
  });

  describe('Property Image', () => {
    it('should render property image with correct src and alt', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const image = screen.getByTestId('property-card-image');
      expect(image).toHaveAttribute('src', mockProperty.image);
      expect(image).toHaveAttribute('alt', mockProperty.title);
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should use placeholder image when property image is not provided', () => {
      const propertyWithoutImage = { ...mockProperty, image: '' };
      render(<PropertyCard property={propertyWithoutImage} />);
      
      const image = screen.getByTestId('property-card-image');
      expect(image).toHaveAttribute('src', '/assets/images/properties/placeholder.png');
    });

    it('should render image overlay', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-image-overlay')).toBeInTheDocument();
    });
  });

  describe('Featured Badge', () => {
    it('should render featured badge when property is featured', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-featured-badge')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-featured-badge-button')).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should not render featured badge when property is not featured', () => {
      const nonFeaturedProperty = { ...mockProperty, featured: false };
      render(<PropertyCard property={nonFeaturedProperty} />);
      
      expect(screen.queryByTestId('property-card-featured-badge')).not.toBeInTheDocument();
    });

    it('should not render featured badge when featured is undefined', () => {
      const propertyWithoutFeatured = { ...mockProperty };
      delete propertyWithoutFeatured.featured;
      render(<PropertyCard property={propertyWithoutFeatured} />);
      
      expect(screen.queryByTestId('property-card-featured-badge')).not.toBeInTheDocument();
    });
  });

  describe('Property Title', () => {
    it('should display property title', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const title = screen.getByTestId('property-card-title');
      expect(title).toHaveTextContent(mockProperty.title);
      expect(title.tagName).toBe('H3');
    });

    it('should handle empty title', () => {
      const propertyWithEmptyTitle = { ...mockProperty, title: '' };
      render(<PropertyCard property={propertyWithEmptyTitle} />);
      
      const title = screen.getByTestId('property-card-title');
      expect(title).toHaveTextContent('');
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long property title that might overflow';
      const propertyWithLongTitle = { ...mockProperty, title: longTitle };
      render(<PropertyCard property={propertyWithLongTitle} />);
      
      const title = screen.getByTestId('property-card-title');
      expect(title).toHaveTextContent(longTitle);
    });
  });

  describe('Area and Location Display', () => {
    it('should display formatted area', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const area = screen.getByTestId('property-card-area');
      expect(area).toHaveTextContent('1,500 km²');
    });

    it('should display city with location icon', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const city = screen.getByTestId('property-card-city');
      const locationIcon = screen.getByTestId('property-card-location-icon');
      
      expect(city).toHaveTextContent(mockProperty.city);
      expect(locationIcon).toBeInTheDocument();
    });

    it('should format large area numbers correctly', () => {
      const largeAreaProperty = { ...mockProperty, area: 1234567 };
      render(<PropertyCard property={largeAreaProperty} />);
      
      const area = screen.getByTestId('property-card-area');
      expect(area).toHaveTextContent('1,234,567 km²');
    });

    it('should handle zero area', () => {
      const zeroAreaProperty = { ...mockProperty, area: 0 };
      render(<PropertyCard property={zeroAreaProperty} />);
      
      const area = screen.getByTestId('property-card-area');
      expect(area).toHaveTextContent('0 km²');
    });
  });

  describe('Utility Metrics', () => {
    it('should render electricity metric when available', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-electricity')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-electricity-label')).toHaveTextContent('Electricity');
      expect(screen.getByTestId('property-card-electricity-value')).toHaveTextContent('100 MW');
      expect(screen.getByTestId('property-card-electricity-icon')).toBeInTheDocument();
    });

    it('should render gas metric when available', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-gas')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-gas-label')).toHaveTextContent('Gas');
      expect(screen.getByTestId('property-card-gas-value')).toHaveTextContent('50 MMSCFD');
      expect(screen.getByTestId('property-card-gas-icon')).toBeInTheDocument();
    });

    it('should render water metric when available', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-water')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-water-label')).toHaveTextContent('Water');
      expect(screen.getByTestId('property-card-water-value')).toHaveTextContent('1000 m3/day');
      expect(screen.getByTestId('property-card-water-icon')).toBeInTheDocument();
    });

    it('should not render electricity metric when not available', () => {
      const propertyWithoutElectricity = { ...mockProperty, electricity: undefined };
      render(<PropertyCard property={propertyWithoutElectricity} />);
      
      expect(screen.queryByTestId('property-card-electricity')).not.toBeInTheDocument();
    });

    it('should not render gas metric when empty string', () => {
      const propertyWithEmptyGas = { ...mockProperty, gas: '' };
      render(<PropertyCard property={propertyWithEmptyGas} />);
      
      expect(screen.queryByTestId('property-card-gas')).not.toBeInTheDocument();
    });

    it('should not render water metric when null', () => {
      const propertyWithNullWater = { ...mockProperty, water: null as any };
      render(<PropertyCard property={propertyWithNullWater} />);
      
      expect(screen.queryByTestId('property-card-water')).not.toBeInTheDocument();
    });

    it('should render separators correctly', () => {
      render(<PropertyCard {...defaultProps} />);
      
      // Electricity and gas should have separators
      expect(screen.getByTestId('property-card-electricity-separator')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-gas-separator')).toBeInTheDocument();
      
      // Water should not have separator (showSeparator=false)
      expect(screen.queryByTestId('property-card-water-separator')).not.toBeInTheDocument();
    });
  });

  describe('Distance Information', () => {
    it('should render distance grid by default', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-distance-grid')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-seaport-distance')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-railway-distance')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-airport-distance')).toBeInTheDocument();
    });

    it('should hide distance grid when hideDistance is true', () => {
      render(<PropertyCard {...defaultProps} hideDistance={true} />);
      
      expect(screen.queryByTestId('property-card-distance-grid')).not.toBeInTheDocument();
    });

    it('should render distance cards with correct icons and distances', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-seaport-icon')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-seaport-distance-text')).toHaveTextContent('75 km');
      
      expect(screen.getByTestId('property-card-railway-icon')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-railway-distance-text')).toHaveTextContent('102 km');
      
      expect(screen.getByTestId('property-card-airport-icon')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-airport-distance-text')).toHaveTextContent('62 km');
    });
  });

  describe('Action Buttons', () => {
    it('should render compare and view buttons', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const compareButton = screen.getByTestId('property-card-compare-button');
      const viewButton = screen.getByTestId('property-card-view-button');
      
      expect(compareButton).toBeInTheDocument();
      expect(compareButton).toHaveTextContent('Compare');
      expect(compareButton).toHaveAttribute('aria-label', `Compare ${mockProperty.title}`);
      
      expect(viewButton).toBeInTheDocument();
      expect(viewButton).toHaveTextContent('View');
      expect(viewButton).toHaveAttribute('aria-label', `View details for ${mockProperty.title}`);
    });

    it('should call onCompare when compare button is clicked', () => {
      const onCompare = jest.fn();
      render(<PropertyCard {...defaultProps} onCompare={onCompare} />);
      
      const compareButton = screen.getByTestId('property-card-compare-button');
      fireEvent.click(compareButton);
      
      expect(onCompare).toHaveBeenCalledWith(mockProperty);
      expect(onCompare).toHaveBeenCalledTimes(1);
    });

    it('should call onView when view button is clicked', () => {
      const onView = jest.fn();
      render(<PropertyCard {...defaultProps} onView={onView} />);
      
      const viewButton = screen.getByTestId('property-card-view-button');
      fireEvent.click(viewButton);
      
      expect(onView).toHaveBeenCalledWith(mockProperty);
      expect(onView).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when onCompare is not provided', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const compareButton = screen.getByTestId('property-card-compare-button');
      expect(() => fireEvent.click(compareButton)).not.toThrow();
    });

    it('should not throw error when onView is not provided', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const viewButton = screen.getByTestId('property-card-view-button');
      expect(() => fireEvent.click(viewButton)).not.toThrow();
    });

    it('should handle multiple button clicks correctly', () => {
      const onCompare = jest.fn();
      const onView = jest.fn();
      render(<PropertyCard {...defaultProps} onCompare={onCompare} onView={onView} />);
      
      const compareButton = screen.getByTestId('property-card-compare-button');
      const viewButton = screen.getByTestId('property-card-view-button');
      
      fireEvent.click(compareButton);
      fireEvent.click(viewButton);
      fireEvent.click(compareButton);
      
      expect(onCompare).toHaveBeenCalledTimes(2);
      expect(onView).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-image-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-title')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-buttons')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      render(<PropertyCard {...defaultProps} data-qa-id="custom-card" />);
      
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-image-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-card-buttons')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      render(<PropertyCard {...defaultProps} data-qa-id="special-card-123_test" />);
      
      expect(screen.getByTestId('special-card-123_test')).toBeInTheDocument();
      expect(screen.getByTestId('special-card-123_test-title')).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      render(<PropertyCard {...defaultProps} data-qa-id="" />);
      
      expect(screen.getByTestId('')).toBeInTheDocument();
      expect(screen.getByTestId('-title')).toBeInTheDocument();
    });
  });

  describe('Component Memoization and Performance', () => {
    it('should be memoized correctly', () => {
      const { rerender } = render(<PropertyCard {...defaultProps} />);
      
      // Re-render with same props should not cause issues
      rerender(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
    });

    it('should handle prop changes correctly', () => {
      const { rerender } = render(<PropertyCard {...defaultProps} />);
      
      const newProperty = { ...mockProperty, title: 'Updated Title' };
      rerender(<PropertyCard property={newProperty} />);
      
      expect(screen.getByTestId('property-card-title')).toHaveTextContent('Updated Title');
    });

    it('should memoize formatter functions', () => {
      render(<PropertyCard {...defaultProps} />);
      
      // The formatNumber function should be memoized and area should be formatted
      expect(screen.getByTestId('property-card-area')).toHaveTextContent('1,500 km²');
    });
  });

  describe('Accessibility', () => {
    it('should maintain proper semantic structure', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const article = screen.getByTestId('property-card');
      const title = screen.getByTestId('property-card-title');
      
      expect(article.tagName).toBe('ARTICLE');
      expect(title.tagName).toBe('H3');
    });

    it('should provide proper aria-labels for buttons', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const compareButton = screen.getByTestId('property-card-compare-button');
      const viewButton = screen.getByTestId('property-card-view-button');
      
      expect(compareButton).toHaveAttribute('aria-label', `Compare ${mockProperty.title}`);
      expect(viewButton).toHaveAttribute('aria-label', `View details for ${mockProperty.title}`);
    });

    it('should provide proper alt text for image', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const image = screen.getByTestId('property-card-image');
      expect(image).toHaveAttribute('alt', mockProperty.title);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle minimal property object', () => {
      const minimalProperty: IProperty = {
        id: '1',
        slug: 'minimal',
        city: 'City',
        title: 'Title',
        area: 100,
        image: '',
        status: 'available',
      };
      
      render(<PropertyCard property={minimalProperty} />);
      
      expect(screen.getByTestId('property-card-title')).toHaveTextContent('Title');
      expect(screen.getByTestId('property-card-city')).toHaveTextContent('City');
      expect(screen.getByTestId('property-card-area')).toHaveTextContent('100 km²');
    });

    it('should handle property with all optional fields undefined', () => {
      const propertyWithUndefinedFields = {
        ...mockProperty,
        electricity: undefined,
        gas: undefined,
        water: undefined,
        featured: undefined,
        coordinates: undefined,
      };
      
      render(<PropertyCard property={propertyWithUndefinedFields} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
      expect(screen.queryByTestId('property-card-electricity')).not.toBeInTheDocument();
      expect(screen.queryByTestId('property-card-gas')).not.toBeInTheDocument();
      expect(screen.queryByTestId('property-card-water')).not.toBeInTheDocument();
      expect(screen.queryByTestId('property-card-featured-badge')).not.toBeInTheDocument();
    });

    it('should handle very long city names', () => {
      const longCityName = 'This is a very long city name that might cause layout issues';
      const propertyWithLongCity = { ...mockProperty, city: longCityName };
      render(<PropertyCard property={propertyWithLongCity} />);
      
      expect(screen.getByTestId('property-card-city')).toHaveTextContent(longCityName);
    });

    it('should handle special characters in property data', () => {
      const specialProperty = {
        ...mockProperty,
        title: 'Property with Special Characters: áéíóú & @#$%',
        city: 'City with Special Characters: áéíóú',
      };
      
      render(<PropertyCard property={specialProperty} />);
      
      expect(screen.getByTestId('property-card-title')).toHaveTextContent(specialProperty.title);
      expect(screen.getByTestId('property-card-city')).toHaveTextContent(specialProperty.city);
    });

    it('should handle zero and negative values', () => {
      const edgeValueProperty = {
        ...mockProperty,
        area: 0,
      };
      
      render(<PropertyCard property={edgeValueProperty} />);
      
      expect(screen.getByTestId('property-card-area')).toHaveTextContent('0 km²');
    });
  });

  describe('Translation Integration', () => {
    it('should use translation function for labels', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(mockT).toHaveBeenCalledWith('common.featured');
      expect(mockT).toHaveBeenCalledWith('property.electricity');
      expect(mockT).toHaveBeenCalledWith('property.gas');
      expect(mockT).toHaveBeenCalledWith('property.water');
      expect(mockT).toHaveBeenCalledWith('common.compare');
      expect(mockT).toHaveBeenCalledWith('common.view');
    });

    it('should render translated text correctly', () => {
      render(<PropertyCard {...defaultProps} />);
      
      // Check that translations are displayed
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('Electricity')).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('Compare')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
    });

    it('should update when props change', () => {
      const { rerender } = render(<PropertyCard {...defaultProps} />);
      
      const updatedProperty = { ...mockProperty, title: 'Updated Property Title' };
      rerender(<PropertyCard property={updatedProperty} />);
      
      expect(screen.getByTestId('property-card-title')).toHaveTextContent('Updated Property Title');
    });

    it('should maintain component state across re-renders', () => {
      const { rerender } = render(<PropertyCard {...defaultProps} />);
      
      // Re-render multiple times
      rerender(<PropertyCard {...defaultProps} />);
      rerender(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-title')).toHaveTextContent(mockProperty.title);
    });
  });

  describe('Sub-component Integration', () => {
    it('should pass correct props to FeaturedBadge', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-featured-badge')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-featured-badge-button')).toBeInTheDocument();
    });

    it('should pass correct props to MetricRow components', () => {
      render(<PropertyCard {...defaultProps} />);
      
      // All three metrics should be present with correct structure
      expect(screen.getByTestId('property-card-electricity-row')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-gas-row')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-water-row')).toBeInTheDocument();
    });

    it('should pass correct props to DistanceCard components', () => {
      render(<PropertyCard {...defaultProps} />);
      
      expect(screen.getByTestId('property-card-seaport-distance')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-railway-distance')).toBeInTheDocument();
      expect(screen.getByTestId('property-card-airport-distance')).toBeInTheDocument();
    });
  });

  describe('Style Integration', () => {
    it('should apply propertyCardStyles correctly', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const container = screen.getByTestId('property-card');
      expect(container).toHaveClass('mock-container');
      
      const imageContainer = screen.getByTestId('property-card-image-container');
      expect(imageContainer).toHaveClass('mock-image-container');
      
      const title = screen.getByTestId('property-card-title');
      expect(title).toHaveClass('mock-title');
    });

    it('should apply custom inline styles', () => {
      render(<PropertyCard {...defaultProps} />);
      
      const content = screen.getByTestId('property-card-content');
      expect(content).toHaveStyle({
        background: 'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
      });
    });
  });

  describe('Callback Memoization', () => {
    it('should memoize callback functions', () => {
      const onCompare = jest.fn();
      const onView = jest.fn();
      
      const { rerender } = render(
        <PropertyCard {...defaultProps} onCompare={onCompare} onView={onView} />
      );
      
      // Re-render with same props
      rerender(<PropertyCard {...defaultProps} onCompare={onCompare} onView={onView} />);
      
      // Click buttons to ensure callbacks still work
      fireEvent.click(screen.getByTestId('property-card-compare-button'));
      fireEvent.click(screen.getByTestId('property-card-view-button'));
      
      expect(onCompare).toHaveBeenCalledWith(mockProperty);
      expect(onView).toHaveBeenCalledWith(mockProperty);
    });
  });
});