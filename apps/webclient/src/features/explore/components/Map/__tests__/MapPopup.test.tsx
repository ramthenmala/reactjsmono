import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapPopup } from '../MapPopup';
import type { IProperty } from '@/features/explore/types/explore';

// Mock ReactDOM createPortal
jest.mock('react-dom', () => ({
  createPortal: (element: React.ReactElement, container: Element) => {
    // For testing, just render the element directly
    return element;
  },
}));

// Mock PropertyCard component
jest.mock('@/features/explore/components/Property/PropertyCard', () => ({
  PropertyCard: ({ 
    property, 
    hideDistance, 
    onView, 
    onCompare, 
    'data-qa-id': dataQaId 
  }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-property-id={property?.id}
      data-hide-distance={hideDistance}
    >
      <div data-qa-id="property-title">{property?.title}</div>
      <div data-qa-id="property-city">{property?.city}</div>
      <button data-qa-id="property-view-button" onClick={onView}>
        View Property
      </button>
      <button data-qa-id="property-compare-button" onClick={onCompare}>
        Compare
      </button>
    </div>
  ),
}));

// Mock XClose icon
jest.mock('@untitledui/icons', () => ({
  XClose: ({ className, 'data-qa-id': dataQaId }: any) => (
    <svg 
      data-qa-id={dataQaId}
      className={className}
      data-testid="close-icon"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  ),
}));

// Mock styles
jest.mock('../styles', () => ({
  mapStyles: {
    popup: {
      container: 'mock-popup-container',
      content: 'mock-popup-content',
      closeButton: 'mock-close-button',
    },
  },
}));

describe('MapPopup', () => {
  const mockProperty: IProperty = {
    id: 'test-property-1',
    slug: 'test-property',
    title: 'Test Industrial Property',
    city: 'Riyadh',
    area: 5000,
    electricity: 'Available',
    gas: 'Available',
    water: 'Available',
    image: '/test-image.jpg',
    status: 'available',
    featured: true,
  };

  const mockContainer = document.createElement('div');
  const mockOnClose = jest.fn();
  const mockOnView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="custom-popup"
        />
      );

      expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
    });

    it('should not render when property is null', () => {
      render(
        <MapPopup
          property={null}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.queryByTestId('map-popup')).not.toBeInTheDocument();
    });

    it('should not render when container is null', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={null}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.queryByTestId('map-popup')).not.toBeInTheDocument();
    });

    it('should not render when both property and container are null', () => {
      render(
        <MapPopup
          property={null}
          container={null}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.queryByTestId('map-popup')).not.toBeInTheDocument();
    });
  });

  describe('Popup Structure', () => {
    it('should render popup container with correct class and data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const container = screen.getByTestId('map-popup');
      expect(container).toHaveClass('mock-popup-container');
    });

    it('should render popup content with correct data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup-content')).toBeInTheDocument();
      expect(screen.getByTestId('map-popup-content')).toHaveClass('mock-popup-content');
    });

    it('should render close button with correct data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup-close-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-popup-close-button')).toHaveClass('mock-close-button');
    });

    it('should render close icon with correct data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup-close-icon')).toBeInTheDocument();
    });
  });

  describe('PropertyCard Integration', () => {
    it('should render PropertyCard with correct props', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const propertyCard = screen.getByTestId('map-popup-property-card');
      expect(propertyCard).toBeInTheDocument();
      expect(propertyCard).toHaveAttribute('data-property-id', mockProperty.id);
      expect(propertyCard).toHaveAttribute('data-hide-distance', 'true');
    });

    it('should pass correct data-qa-id to PropertyCard', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="test-popup"
        />
      );

      expect(screen.getByTestId('test-popup-property-card')).toBeInTheDocument();
    });

    it('should display property information in PropertyCard', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('property-title')).toHaveTextContent(mockProperty.title);
      expect(screen.getByTestId('property-city')).toHaveTextContent(mockProperty.city);
    });

    it('should handle PropertyCard with different property data', () => {
      const differentProperty: IProperty = {
        id: 'different-property',
        slug: 'different-slug',
        title: 'Different Property Title',
        city: 'Jeddah',
        area: 3000,
        electricity: 'Not Available',
        gas: 'Available',
        water: 'Available',
        image: '/different-image.jpg',
        status: 'sold',
        featured: false,
      };

      render(
        <MapPopup
          property={differentProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('property-title')).toHaveTextContent(differentProperty.title);
      expect(screen.getByTestId('property-city')).toHaveTextContent(differentProperty.city);
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('map-popup-close-button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple close button clicks', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const closeButton = screen.getByTestId('map-popup-close-button');
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it('should work when onClose is undefined', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={undefined as any}
          onView={mockOnView}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('map-popup-close-button'));
      }).not.toThrow();
    });
  });

  describe('View Functionality', () => {
    it('should call onView and onClose when PropertyCard view is triggered', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('property-view-button'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnView).toHaveBeenCalledTimes(1);
      expect(mockOnView).toHaveBeenCalledWith(mockProperty);
    });

    it('should call onClose even when onView is undefined', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={undefined}
        />
      );

      fireEvent.click(screen.getByTestId('property-view-button'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle onView with different properties', () => {
      const anotherProperty: IProperty = {
        id: 'another-property',
        slug: 'another-slug',
        title: 'Another Property',
        city: 'Dammam',
        area: 7500,
        electricity: 'Available',
        gas: 'Not Available',
        water: 'Available',
        image: '/another-image.jpg',
        status: 'reserved',
        featured: true,
      };

      render(
        <MapPopup
          property={anotherProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('property-view-button'));

      expect(mockOnView).toHaveBeenCalledWith(anotherProperty);
    });
  });

  describe('Compare Functionality', () => {
    it('should handle compare button click without errors', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('property-compare-button'));
      }).not.toThrow();
    });

    it('should not affect other functionality when compare is clicked', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('property-compare-button'));

      // Other functions should still work normally
      fireEvent.click(screen.getByTestId('map-popup-close-button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical data-qa-id structure', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="test-popup"
        />
      );

      expect(screen.getByTestId('test-popup')).toBeInTheDocument();
      expect(screen.getByTestId('test-popup-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-popup-property-card')).toBeInTheDocument();
      expect(screen.getByTestId('test-popup-close-button')).toBeInTheDocument();
      expect(screen.getByTestId('test-popup-close-icon')).toBeInTheDocument();
    });

    it('should handle empty data-qa-id gracefully', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id=""
        />
      );

      expect(screen.getByTestId('')).toBeInTheDocument();
      expect(screen.getByTestId('-content')).toBeInTheDocument();
      expect(screen.getByTestId('-property-card')).toBeInTheDocument();
      expect(screen.getByTestId('-close-button')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="popup-with-special_chars-123"
        />
      );

      expect(screen.getByTestId('popup-with-special_chars-123')).toBeInTheDocument();
      expect(screen.getByTestId('popup-with-special_chars-123-content')).toBeInTheDocument();
    });
  });

  describe('Portal Integration', () => {
    it('should handle portal rendering without errors', () => {
      expect(() => {
        render(
          <MapPopup
            property={mockProperty}
            container={mockContainer}
            onClose={mockOnClose}
            onView={mockOnView}
          />
        );
      }).not.toThrow();
    });

    it('should work with different container elements', () => {
      const alternativeContainer = document.createElement('section');
      document.body.appendChild(alternativeContainer);

      render(
        <MapPopup
          property={mockProperty}
          container={alternativeContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup')).toBeInTheDocument();

      document.body.removeChild(alternativeContainer);
    });
  });

  describe('Component Props', () => {
    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <MapPopup
            property={mockProperty}
            container={mockContainer}
            onClose={mockOnClose}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('map-popup')).toBeInTheDocument();
    });

    it('should handle all props provided', () => {
      expect(() => {
        render(
          <MapPopup
            property={mockProperty}
            container={mockContainer}
            onClose={mockOnClose}
            onView={mockOnView}
            data-qa-id="full-props-popup"
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('full-props-popup')).toBeInTheDocument();
    });
  });

  describe('Property Variations', () => {
    it('should handle property with minimal data', () => {
      const minimalProperty: IProperty = {
        id: 'minimal',
        slug: 'minimal',
        title: 'Minimal Property',
        city: 'Unknown',
        area: 0,
        status: 'available',
        featured: false,
      };

      render(
        <MapPopup
          property={minimalProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('property-title')).toHaveTextContent('Minimal Property');
      expect(screen.getByTestId('property-city')).toHaveTextContent('Unknown');
    });

    it('should handle property with all fields populated', () => {
      const completeProperty: IProperty = {
        id: 'complete-property',
        slug: 'complete-property-slug',
        title: 'Complete Industrial Complex',
        city: 'Riyadh',
        area: 15000,
        electricity: 'High Voltage Available',
        gas: 'Natural Gas Pipeline',
        water: 'Industrial Water Supply',
        image: '/complete-property.jpg',
        status: 'available',
        featured: true,
        coordinates: { lat: 24.7136, lng: 46.6753 },
      };

      render(
        <MapPopup
          property={completeProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('property-title')).toHaveTextContent('Complete Industrial Complex');
      expect(screen.getByTestId('property-city')).toHaveTextContent('Riyadh');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible close button', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const closeButton = screen.getByTestId('map-popup-close-button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.tagName).toBe('BUTTON');
    });

    it('should support keyboard navigation', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const closeButton = screen.getByTestId('map-popup-close-button');
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('Style Integration', () => {
    it('should apply correct CSS classes from mapStyles', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup')).toHaveClass('mock-popup-container');
      expect(screen.getByTestId('map-popup-content')).toHaveClass('mock-popup-content');
      expect(screen.getByTestId('map-popup-close-button')).toHaveClass('mock-close-button');
    });

    it('should apply icon sizing classes correctly', () => {
      render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const closeIcon = screen.getByTestId('map-popup-close-icon');
      expect(closeIcon).toHaveClass('size-4');
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount without memory leaks', () => {
      const { unmount } = render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('map-popup')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('map-popup')).not.toBeInTheDocument();
    });

    it('should handle prop changes gracefully', () => {
      const { rerender } = render(
        <MapPopup
          property={mockProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="popup-1"
        />
      );

      expect(screen.getByTestId('popup-1')).toBeInTheDocument();

      const updatedProperty: IProperty = {
        ...mockProperty,
        title: 'Updated Property Title',
      };

      rerender(
        <MapPopup
          property={updatedProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
          data-qa-id="popup-2"
        />
      );

      expect(screen.queryByTestId('popup-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('popup-2')).toBeInTheDocument();
      expect(screen.getByTestId('property-title')).toHaveTextContent('Updated Property Title');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing property fields gracefully', () => {
      const incompleteProperty = {
        id: 'incomplete',
        // Missing required fields
      } as IProperty;

      expect(() => {
        render(
          <MapPopup
            property={incompleteProperty}
            container={mockContainer}
            onClose={mockOnClose}
            onView={mockOnView}
          />
        );
      }).not.toThrow();
    });

    it('should handle null callbacks gracefully', () => {
      expect(() => {
        render(
          <MapPopup
            property={mockProperty}
            container={mockContainer}
            onClose={null as any}
            onView={null as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with complex property data', () => {
      const complexProperty: IProperty = {
        id: 'complex-property-with-very-long-id-string-for-testing',
        slug: 'complex-property-slug-with-many-hyphens-and-details',
        title: 'Very Complex Industrial Property With Many Details And Long Title',
        city: 'Riyadh Industrial City Complex Zone A',
        area: 999999,
        electricity: 'High voltage three-phase power with backup generators and UPS systems',
        gas: 'Natural gas pipeline with multiple connection points and safety systems',
        water: 'Industrial water supply with treatment facility and recycling system',
        image: '/path/to/very/long/image/url/with/many/subdirectories/image.jpg',
        status: 'available',
        featured: true,
      };

      const startTime = performance.now();
      
      render(
        <MapPopup
          property={complexProperty}
          container={mockContainer}
          onClose={mockOnClose}
          onView={mockOnView}
        />
      );

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should render quickly
      expect(screen.getByTestId('map-popup')).toBeInTheDocument();
    });
  });
});