import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyGrid } from '@/features/explore/components/Property/PropertyGrid';
import { EViewMode } from '@/features/explore/types/map';
import { IProperty } from '@/features/explore/types/searchFilters';

// Mock child components
jest.mock('@/features/explore/components/Property/PropertyCard', () => ({
  PropertyCard: ({ property, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId || 'property-card'}>
      <span>Property Card: {property.title}</span>
      <span>Property ID: {property.id}</span>
    </div>
  ),
}));

jest.mock('@/features/explore/components/Property/PropertyTable', () => ({
  PropertyTable: ({ properties, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId || 'property-table'}>
      <span>Property Table</span>
      <span>Properties Count: {properties.length}</span>
    </div>
  ),
}));

// Mock properties for testing
const createMockProperty = (id: string, title: string): IProperty => ({
  id,
  slug: `property-${id}`,
  city: 'Test City',
  title,
  area: 1000,
  image: `/images/property-${id}.jpg`,
  electricity: 'Available',
  water: 'Available',
  gas: 'Available',
  status: 'available',
  featured: false,
});

const mockProperties: IProperty[] = Array.from({ length: 15 }, (_, i) =>
  createMockProperty((i + 1).toString(), `Test Property ${i + 1}`)
);

const defaultProps = {
  properties: mockProperties,
  viewMode: EViewMode.split,
  onCompare: jest.fn(),
  onView: jest.fn(),
};

describe('PropertyGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View Mode Handling', () => {
    it('should return null when viewMode is map', () => {
      const { container } = render(
        <PropertyGrid {...defaultProps} viewMode={EViewMode.map} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render table view when viewMode is list', () => {
      render(
        <PropertyGrid {...defaultProps} viewMode={EViewMode.list} />
      );

      expect(screen.getByTestId('property-grid-list-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-table')).toBeInTheDocument();
      expect(screen.getByText('Property Table')).toBeInTheDocument();
    });

    it('should render card grid when viewMode is split', () => {
      render(
        <PropertyGrid {...defaultProps} viewMode={EViewMode.split} />
      );

      expect(screen.getByTestId('property-grid-split-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-card-grid')).toBeInTheDocument();
    });
  });

  describe('Card Grid Rendering', () => {
    it('should render property cards in split mode', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 4)} 
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 2')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 3')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 4')).toBeInTheDocument();
    });

    it('should apply correct data-qa-id to property cards', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 2)} 
          viewMode={EViewMode.split}
          data-qa-id="test-grid"
        />
      );

      expect(screen.getByTestId('test-grid-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-card-1')).toBeInTheDocument();
    });

    it('should render empty grid when no properties', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={[]} 
          viewMode={EViewMode.split} 
        />
      );

      const cardGrid = screen.getByTestId('property-grid-card-grid');
      expect(cardGrid).toBeInTheDocument();
      expect(cardGrid).toBeEmptyDOMElement();
    });
  });

  describe('Pagination - Split Mode', () => {
    it('should show pagination when there are more than 4 properties in split mode', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)} 
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.getByTestId('property-grid-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-prev')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-next')).toBeInTheDocument();
    });

    it('should hide pagination when there are 4 or fewer properties in split mode', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 4)} 
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.queryByTestId('property-grid-pagination')).not.toBeInTheDocument();
    });

    it('should display correct page numbers', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 12)} // 3 pages with 4 items each
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.getByTestId('property-grid-pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-page-2')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-page-3')).toBeInTheDocument();
    });

    it('should navigate to next page when next button is clicked', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)} 
          viewMode={EViewMode.split} 
        />
      );

      // Initially shows first 4 properties
      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.queryByText('Property Card: Test Property 5')).not.toBeInTheDocument();

      // Click next button
      fireEvent.click(screen.getByTestId('property-grid-pagination-next'));

      // Should show next 4 properties
      expect(screen.queryByText('Property Card: Test Property 1')).not.toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 5')).toBeInTheDocument();
    });

    it('should navigate to previous page when prev button is clicked', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)} 
          viewMode={EViewMode.split} 
        />
      );

      // Go to page 2 first
      fireEvent.click(screen.getByTestId('property-grid-pagination-next'));
      expect(screen.getByText('Property Card: Test Property 5')).toBeInTheDocument();

      // Click previous button
      fireEvent.click(screen.getByTestId('property-grid-pagination-prev'));

      // Should be back to first 4 properties
      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.queryByText('Property Card: Test Property 5')).not.toBeInTheDocument();
    });

    it('should navigate to specific page when page number is clicked', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 12)} 
          viewMode={EViewMode.split} 
        />
      );

      // Click on page 3
      fireEvent.click(screen.getByTestId('property-grid-pagination-page-3'));

      // Should show properties 9-12
      expect(screen.getByText('Property Card: Test Property 9')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 10')).toBeInTheDocument();
      expect(screen.queryByText('Property Card: Test Property 1')).not.toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)} 
          viewMode={EViewMode.split} 
        />
      );

      const prevButton = screen.getByTestId('property-grid-pagination-prev');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)} 
          viewMode={EViewMode.split} 
        />
      );

      // Go to last page
      fireEvent.click(screen.getByTestId('property-grid-pagination-page-2'));

      const nextButton = screen.getByTestId('property-grid-pagination-next');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Pagination - List Mode', () => {
    it('should not render pagination controls in list mode (handled by PropertyTable)', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties} 
          viewMode={EViewMode.list} 
        />
      );

      expect(screen.queryByTestId('property-grid-pagination')).not.toBeInTheDocument();
    });

    it('should pass pagination props to PropertyTable', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties} 
          viewMode={EViewMode.list} 
        />
      );

      // PropertyTable should receive first 10 properties (ITEMS_PER_PAGE_LIST)
      expect(screen.getByText('Properties Count: 10')).toBeInTheDocument();
    });
  });

  describe('Ellipsis in Pagination', () => {
    it('should show ellipsis when there are more than 5 pages', () => {
      const manyProperties = Array.from({ length: 30 }, (_, i) =>
        createMockProperty((i + 1).toString(), `Property ${i + 1}`)
      );

      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={manyProperties} 
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.getByTestId('property-grid-pagination-ellipsis')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('should not show ellipsis when there are 5 or fewer pages', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 12)} // 3 pages
          viewMode={EViewMode.split} 
        />
      );

      expect(screen.queryByTestId('property-grid-pagination-ellipsis')).not.toBeInTheDocument();
    });
  });

  describe('Custom data-qa-id', () => {
    it('should use custom data-qa-id when provided', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          viewMode={EViewMode.split}
          data-qa-id="custom-grid"
        />
      );

      expect(screen.getByTestId('custom-grid-split-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-grid-card-grid')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          viewMode={EViewMode.split}
        />
      );

      expect(screen.getByTestId('property-grid-split-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-card-grid')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes in split mode', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)}
          viewMode={EViewMode.split}
          data-qa-id="test-grid"
        />
      );

      expect(screen.getByTestId('test-grid-split-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-card-grid')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-pagination-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-pagination-prev')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-pagination-next')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-pagination-numbers')).toBeInTheDocument();
    });

    it('should create proper hierarchical data-qa-id attributes in list mode', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          viewMode={EViewMode.list}
          data-qa-id="test-grid"
        />
      );

      expect(screen.getByTestId('test-grid-list-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-grid-table')).toBeInTheDocument();
    });
  });

  describe('Callback Functions', () => {
    it('should pass callback functions to PropertyCard components', () => {
      const mockOnCompare = jest.fn();
      const mockOnView = jest.fn();

      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 2)}
          viewMode={EViewMode.split}
          onCompare={mockOnCompare}
          onView={mockOnView}
        />
      );

      // Verify PropertyCard components are rendered (mocked components will receive the callbacks)
      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 2')).toBeInTheDocument();
    });

    it('should pass callback functions to PropertyTable component', () => {
      const mockOnCompare = jest.fn();
      const mockOnView = jest.fn();

      render(
        <PropertyGrid 
          {...defaultProps} 
          viewMode={EViewMode.list}
          onCompare={mockOnCompare}
          onView={mockOnView}
        />
      );

      // Verify PropertyTable component is rendered (mocked component will receive the callbacks)
      expect(screen.getByText('Property Table')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single property correctly', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={[mockProperties[0]]}
          viewMode={EViewMode.split}
        />
      );

      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.queryByTestId('property-grid-pagination')).not.toBeInTheDocument();
    });

    it('should handle exactly 4 properties without pagination', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 4)}
          viewMode={EViewMode.split}
        />
      );

      expect(screen.getByText('Property Card: Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property Card: Test Property 4')).toBeInTheDocument();
      expect(screen.queryByTestId('property-grid-pagination')).not.toBeInTheDocument();
    });

    it('should handle exactly 5 properties with pagination', () => {
      render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 5)}
          viewMode={EViewMode.split}
        />
      );

      expect(screen.getByTestId('property-grid-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-page-1')).toBeInTheDocument();
      expect(screen.getByTestId('property-grid-pagination-page-2')).toBeInTheDocument();
    });

    it('should maintain current page when properties list changes', () => {
      const { rerender } = render(
        <PropertyGrid 
          {...defaultProps} 
          properties={mockProperties.slice(0, 8)}
          viewMode={EViewMode.split}
        />
      );

      // Go to page 2
      fireEvent.click(screen.getByTestId('property-grid-pagination-next'));
      expect(screen.getByText('Property Card: Test Property 5')).toBeInTheDocument();

      // Change properties but keep same length
      const newProperties = Array.from({ length: 8 }, (_, i) =>
        createMockProperty((i + 1).toString(), `New Property ${i + 1}`)
      );

      rerender(
        <PropertyGrid 
          {...defaultProps} 
          properties={newProperties}
          viewMode={EViewMode.split}
        />
      );

      // Should still be on page 2
      expect(screen.getByText('Property Card: New Property 5')).toBeInTheDocument();
    });
  });
});