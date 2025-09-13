import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyTable } from '@/features/explore/components/Property/PropertyTable';
import type { IPropertyTableProps } from '@/features/explore/types/propertyTable';
import type { IProperty } from '@/features/explore/types/explore';

// Mock the shared UI components
jest.mock('@compass/shared-ui', () => ({
  ButtonUtility: ({ onClick, tooltip, size, color, 'data-qa-id': dataQaId, ...props }: any) => (
    <button 
      onClick={onClick}
      title={tooltip}
      data-qa-id={dataQaId}
      data-size={size}
      data-color={color}
      {...props}
    >
      Compare Button
    </button>
  ),
  Table: ({ children, size, 'data-qa-id': dataQaId, ...props }: any) => (
    <table data-qa-id={dataQaId} data-size={size} {...props}>
      {children}
    </table>
  ),
  TableCard: {
    Root: ({ children, 'data-qa-id': dataQaId, ...props }: any) => (
      <div data-qa-id={dataQaId} {...props}>
        {children}
      </div>
    ),
  },
}));

// Add Table subcomponents to the mock
Object.assign(jest.requireMock('@compass/shared-ui').Table, {
  Header: ({ children, 'data-qa-id': dataQaId, ...props }: any) => (
    <thead data-qa-id={dataQaId} {...props}>
      {children}
    </thead>
  ),
  Head: ({ label, 'data-qa-id': dataQaId, className, ...props }: any) => (
    <th data-qa-id={dataQaId} className={className} {...props}>
      {label}
    </th>
  ),
  Body: ({ children, items, 'data-qa-id': dataQaId, ...props }: any) => (
    <tbody data-qa-id={dataQaId} {...props}>
      {items.map((item: any) => children(item))}
    </tbody>
  ),
  Row: ({ children, id, 'data-qa-id': dataQaId, ...props }: any) => (
    <tr data-qa-id={dataQaId} data-id={id} {...props}>
      {children}
    </tr>
  ),
  Cell: ({ children, className, 'data-qa-id': dataQaId, ...props }: any) => (
    <td data-qa-id={dataQaId} className={className} {...props}>
      {children}
    </td>
  ),
});

// Mock the UntitledUI icons
jest.mock('@untitledui/icons', () => ({
  Copy01: ({ className, ...props }: any) => (
    <span className={className} {...props}>
      Copy-Icon
    </span>
  ),
}));

describe('PropertyTable', () => {
  const mockProperties: IProperty[] = [
    {
      id: '1',
      slug: 'property-1',
      title: 'Industrial City 1',
      city: 'Riyadh',
      area: 1500,
      image: '/image1.jpg',
      electricity: '50 MW',
      gas: '100 MMSCFD',
      water: '1000 m3/day',
      status: 'available',
    },
    {
      id: '2',
      slug: 'property-2',
      title: 'Industrial City 2',
      city: 'Jeddah',
      area: 2000,
      image: '/image2.jpg',
      electricity: '75 MW',
      gas: '150 MMSCFD',
      water: '1500 m3/day',
      status: 'available',
    },
    {
      id: '3',
      slug: 'property-3',
      title: 'Industrial City 3',
      city: 'Dammam',
      area: 1200,
      image: '/image3.jpg',
      status: 'available',
    },
  ];

  const mockCallbacks = {
    onView: jest.fn(),
    onCompare: jest.fn(),
    onPageChange: jest.fn(),
  };

  const defaultProps: IPropertyTableProps = {
    properties: mockProperties,
    ...mockCallbacks,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<PropertyTable {...defaultProps} />);

      expect(screen.getByTestId('property-table')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-container')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-table')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<PropertyTable {...defaultProps} data-qa-id="custom-table" />);

      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
      expect(screen.getByTestId('custom-table-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-table-table')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(<PropertyTable {...defaultProps} />);

      expect(screen.getByTestId('property-table')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes', () => {
      render(<PropertyTable {...defaultProps} data-qa-id="test-table" />);

      // Root elements
      expect(screen.getByTestId('test-table')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-table')).toBeInTheDocument();

      // Header elements
      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-sl-no')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-title')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-city')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-area')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-electricity')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-gas')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-water')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-header-actions')).toBeInTheDocument();

      // Body elements
      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();

      // Row elements for first property
      expect(screen.getByTestId('test-table-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-sl-no-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-title-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-city-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-area-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-electricity-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-gas-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-water-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-cell-actions-1')).toBeInTheDocument();

      // Pagination elements
      expect(screen.getByTestId('test-table-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-pagination-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-pagination-previous')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-pagination-numbers')).toBeInTheDocument();
      expect(screen.getByTestId('test-table-pagination-next')).toBeInTheDocument();
    });

    it('should maintain hierarchy with different qa-id', () => {
      render(<PropertyTable {...defaultProps} data-qa-id="industrial-table" />);

      expect(screen.getByTestId('industrial-table')).toBeInTheDocument();
      expect(screen.getByTestId('industrial-table-header')).toBeInTheDocument();
      expect(screen.getByTestId('industrial-table-body')).toBeInTheDocument();
      expect(screen.getByTestId('industrial-table-pagination')).toBeInTheDocument();
    });
  });

  describe('Table Header', () => {
    it('should render all column headers', () => {
      render(<PropertyTable {...defaultProps} />);

      expect(screen.getByText('Sl No.')).toBeInTheDocument();
      expect(screen.getByText('Industrial City')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Available Land')).toBeInTheDocument();
      expect(screen.getByText('Electricity')).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
    });

    it('should apply correct header classes', () => {
      render(<PropertyTable {...defaultProps} />);

      const slNoHeader = screen.getByTestId('property-table-header-sl-no');
      const titleHeader = screen.getByTestId('property-table-header-title');

      expect(slNoHeader).toHaveClass('w-20');
      expect(titleHeader).toHaveClass('w-full', 'max-w-1/4');
    });
  });

  describe('Table Body and Rows', () => {
    it('should render all property rows', () => {
      render(<PropertyTable {...defaultProps} />);

      mockProperties.forEach(property => {
        expect(screen.getByTestId(`property-table-row-${property.id}`)).toBeInTheDocument();
      });
    });

    it('should display property data correctly', () => {
      render(<PropertyTable {...defaultProps} />);

      // Check first property
      expect(screen.getByText('Industrial City 1')).toBeInTheDocument();
      expect(screen.getByText('Riyadh')).toBeInTheDocument();
      expect(screen.getByText('1,500 km²')).toBeInTheDocument();
      expect(screen.getByText('50 MW')).toBeInTheDocument();
      expect(screen.getByText('100 MMSCFD')).toBeInTheDocument();
      expect(screen.getByText('1000 m3/day')).toBeInTheDocument();

      // Check second property
      expect(screen.getByText('Industrial City 2')).toBeInTheDocument();
      expect(screen.getByText('Jeddah')).toBeInTheDocument();
      expect(screen.getByText('2,000 km²')).toBeInTheDocument();
    });

    it('should display serial numbers correctly', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} itemsPerPage={10} />);

      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByText('2.')).toBeInTheDocument();
      expect(screen.getByText('3.')).toBeInTheDocument();
    });

    it('should calculate serial numbers for different pages', () => {
      render(<PropertyTable {...defaultProps} currentPage={2} itemsPerPage={10} />);

      expect(screen.getByText('11.')).toBeInTheDocument();
      expect(screen.getByText('12.')).toBeInTheDocument();
      expect(screen.getByText('13.')).toBeInTheDocument();
    });

    it('should handle missing optional properties', () => {
      render(<PropertyTable {...defaultProps} />);

      // Property 3 has no electricity, gas, or water
      const row3 = screen.getByTestId('property-table-row-3');
      expect(row3).toBeInTheDocument();

      // Should show dashes for missing values
      expect(screen.getAllByText('-')).toHaveLength(3); // 3 missing values for property 3
    });

    it('should format area numbers with locale string', () => {
      render(<PropertyTable {...defaultProps} />);

      expect(screen.getByText('1,500 km²')).toBeInTheDocument();
      expect(screen.getByText('2,000 km²')).toBeInTheDocument();
      expect(screen.getByText('1,200 km²')).toBeInTheDocument();
    });
  });

  describe('Title Button Interactions', () => {
    it('should call onView when title button is clicked', () => {
      render(<PropertyTable {...defaultProps} />);

      const titleButton = screen.getByTestId('property-table-title-button-1');
      fireEvent.click(titleButton);

      expect(mockCallbacks.onView).toHaveBeenCalledWith(mockProperties[0]);
    });

    it('should call onView for different properties', () => {
      render(<PropertyTable {...defaultProps} />);

      const titleButton2 = screen.getByTestId('property-table-title-button-2');
      fireEvent.click(titleButton2);

      expect(mockCallbacks.onView).toHaveBeenCalledWith(mockProperties[1]);
    });

    it('should not call onView when onView prop is not provided', () => {
      const { onView, ...propsWithoutOnView } = defaultProps;
      render(<PropertyTable {...propsWithoutOnView} />);

      const titleButton = screen.getByTestId('property-table-title-button-1');
      fireEvent.click(titleButton);

      // Should not throw error
      expect(titleButton).toBeInTheDocument();
    });
  });

  describe('Compare Button Interactions', () => {
    it('should render compare buttons for all properties', () => {
      render(<PropertyTable {...defaultProps} />);

      mockProperties.forEach(property => {
        expect(screen.getByTestId(`property-table-compare-button-${property.id}`)).toBeInTheDocument();
      });
    });

    it('should call onCompare when compare button is clicked', () => {
      render(<PropertyTable {...defaultProps} />);

      const compareButton = screen.getByTestId('property-table-compare-button-1');
      fireEvent.click(compareButton);

      expect(mockCallbacks.onCompare).toHaveBeenCalledWith(mockProperties[0]);
    });

    it('should call onCompare for different properties', () => {
      render(<PropertyTable {...defaultProps} />);

      const compareButton3 = screen.getByTestId('property-table-compare-button-3');
      fireEvent.click(compareButton3);

      expect(mockCallbacks.onCompare).toHaveBeenCalledWith(mockProperties[2]);
    });

    it('should not call onCompare when onCompare prop is not provided', () => {
      const { onCompare, ...propsWithoutOnCompare } = defaultProps;
      render(<PropertyTable {...propsWithoutOnCompare} />);

      const compareButton = screen.getByTestId('property-table-compare-button-1');
      fireEvent.click(compareButton);

      // Should not throw error
      expect(compareButton).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination controls', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={5} />);

      expect(screen.getByTestId('property-table-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-pagination-previous')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-pagination-next')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-pagination-numbers')).toBeInTheDocument();
    });

    it('should render page number buttons', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={5} />);

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByTestId(`property-table-pagination-page-${i}`)).toBeInTheDocument();
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should handle pagination with more than 10 pages', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={15} />);

      // Should show first 10 pages
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByTestId(`property-table-pagination-page-${i}`)).toBeInTheDocument();
      }

      // Should show ellipsis and last page
      expect(screen.getByTestId('property-table-pagination-ellipsis')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-pagination-page-15')).toBeInTheDocument();
    });

    it('should call onPageChange when page button is clicked', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={5} />);

      const page3Button = screen.getByTestId('property-table-pagination-page-3');
      fireEvent.click(page3Button);

      expect(mockCallbacks.onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when previous button is clicked', () => {
      render(<PropertyTable {...defaultProps} currentPage={3} totalPages={5} />);

      const previousButton = screen.getByTestId('property-table-pagination-previous');
      fireEvent.click(previousButton);

      expect(mockCallbacks.onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange when next button is clicked', () => {
      render(<PropertyTable {...defaultProps} currentPage={2} totalPages={5} />);

      const nextButton = screen.getByTestId('property-table-pagination-next');
      fireEvent.click(nextButton);

      expect(mockCallbacks.onPageChange).toHaveBeenCalledWith(3);
    });

    it('should disable previous button on first page', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={5} />);

      const previousButton = screen.getByTestId('property-table-pagination-previous');
      expect(previousButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<PropertyTable {...defaultProps} currentPage={5} totalPages={5} />);

      const nextButton = screen.getByTestId('property-table-pagination-next');
      expect(nextButton).toBeDisabled();
    });

    it('should apply active styling to current page', () => {
      render(<PropertyTable {...defaultProps} currentPage={3} totalPages={5} />);

      const page3Button = screen.getByTestId('property-table-pagination-page-3');
      expect(page3Button).toHaveClass('bg-blue-600', 'text-white');

      const page1Button = screen.getByTestId('property-table-pagination-page-1');
      expect(page1Button).toHaveClass('text-gray-700');
      expect(page1Button).not.toHaveClass('bg-blue-600');
    });

    it('should not call onPageChange when buttons are disabled', () => {
      render(<PropertyTable {...defaultProps} currentPage={1} totalPages={5} />);

      const previousButton = screen.getByTestId('property-table-pagination-previous');
      fireEvent.click(previousButton);

      expect(mockCallbacks.onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('should render with empty properties array', () => {
      render(<PropertyTable {...defaultProps} properties={[]} />);

      expect(screen.getByTestId('property-table')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-header')).toBeInTheDocument();
      expect(screen.getByTestId('property-table-body')).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('should use default values when optional props are not provided', () => {
      const minimalProps: IPropertyTableProps = {
        properties: mockProperties,
      };

      render(<PropertyTable {...minimalProps} />);

      expect(screen.getByTestId('property-table')).toBeInTheDocument();
      expect(screen.getByText('1.')).toBeInTheDocument(); // currentPage = 1
    });

    it('should handle pagination defaults', () => {
      render(<PropertyTable {...defaultProps} />);

      // Should default to currentPage=1, totalPages=1
      const previousButton = screen.getByTestId('property-table-pagination-previous');
      const nextButton = screen.getByTestId('property-table-pagination-next');

      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      render(<PropertyTable {...defaultProps} />);

      const root = screen.getByTestId('property-table');
      const container = screen.getByTestId('property-table-container');
      const table = screen.getByTestId('property-table-table');

      expect(root).toContainElement(container);
      expect(container).toContainElement(table);
    });

    it('should render table with correct size', () => {
      render(<PropertyTable {...defaultProps} />);

      const table = screen.getByTestId('property-table-table');
      expect(table).toHaveAttribute('data-size', 'md');
    });

    it('should apply overflow-x-auto to container', () => {
      render(<PropertyTable {...defaultProps} />);

      const container = screen.getByTestId('property-table-container');
      expect(container).toHaveClass('overflow-x-auto');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper aria-label for table', () => {
      render(<PropertyTable {...defaultProps} />);

      const table = screen.getByTestId('property-table-table');
      expect(table).toHaveAttribute('aria-label', 'Industrial Cities');
    });

    it('should provide proper data-qa-id attributes for testing', () => {
      render(<PropertyTable {...defaultProps} data-qa-id="accessible-table" />);

      expect(screen.getByTestId('accessible-table')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-table-header')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-table-body')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-table-pagination')).toBeInTheDocument();
    });

    it('should maintain semantic table structure', () => {
      render(<PropertyTable {...defaultProps} />);

      const table = screen.getByTestId('property-table-table');
      const header = screen.getByTestId('property-table-header');
      const body = screen.getByTestId('property-table-body');

      expect(table.tagName).toBe('TABLE');
      expect(header.tagName).toBe('THEAD');
      expect(body.tagName).toBe('TBODY');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large numbers in area formatting', () => {
      const largeAreaProperties: IProperty[] = [
        {
          ...mockProperties[0],
          area: 1234567,
        },
      ];

      render(<PropertyTable {...defaultProps} properties={largeAreaProperties} />);

      expect(screen.getByText('1,234,567 km²')).toBeInTheDocument();
    });

    it('should handle zero area', () => {
      const zeroAreaProperties: IProperty[] = [
        {
          ...mockProperties[0],
          area: 0,
        },
      ];

      render(<PropertyTable {...defaultProps} properties={zeroAreaProperties} />);

      expect(screen.getByText('0 km²')).toBeInTheDocument();
    });

    it('should handle special characters in property data', () => {
      const specialCharProperties: IProperty[] = [
        {
          ...mockProperties[0],
          title: 'City with émojis 🏭 & symbols',
          city: 'Riyadh-Central',
        },
      ];

      render(<PropertyTable {...defaultProps} properties={specialCharProperties} />);

      expect(screen.getByText('City with émojis 🏭 & symbols')).toBeInTheDocument();
      expect(screen.getByText('Riyadh-Central')).toBeInTheDocument();
    });

    it('should handle very high page numbers', () => {
      render(<PropertyTable {...defaultProps} currentPage={999} totalPages={1000} itemsPerPage={5} />);

      // Serial numbers should be calculated correctly
      expect(screen.getByText('4991.')).toBeInTheDocument(); // (999-1) * 5 + 1
      expect(screen.getByText('4992.')).toBeInTheDocument();
      expect(screen.getByText('4993.')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with large datasets', () => {
      const largePropertyList = Array.from({ length: 100 }, (_, i) => ({
        ...mockProperties[0],
        id: `property-${i}`,
        title: `Industrial City ${i}`,
      }));

      const renderStart = performance.now();
      render(<PropertyTable {...defaultProps} properties={largePropertyList} />);
      const renderEnd = performance.now();

      expect(renderEnd - renderStart).toBeLessThan(100);
      expect(screen.getByTestId('property-table')).toBeInTheDocument();
    });

    it('should be memoized correctly', () => {
      expect(PropertyTable.displayName).toBe('PropertyTable');
    });
  });

  describe('Integration', () => {
    it('should work with different property configurations', () => {
      const variedProperties: IProperty[] = [
        mockProperties[0], // Full data
        mockProperties[2], // Missing utilities
        {
          id: '4',
          slug: 'minimal-property',
          title: 'Minimal Property',
          city: 'Test City',
          area: 100,
          image: '/test.jpg',
          status: 'available',
        },
      ];

      render(<PropertyTable {...defaultProps} properties={variedProperties} />);

      expect(screen.getByTestId('property-table')).toBeInTheDocument();
      expect(screen.getByText('Minimal Property')).toBeInTheDocument();
    });

    it('should handle all callback combinations', () => {
      const allCallbacks = {
        onView: jest.fn(),
        onCompare: jest.fn(),
        onPageChange: jest.fn(),
      };

      render(<PropertyTable properties={mockProperties} {...allCallbacks} />);

      // Test all interactions
      fireEvent.click(screen.getByTestId('property-table-title-button-1'));
      fireEvent.click(screen.getByTestId('property-table-compare-button-1'));
      fireEvent.click(screen.getByTestId('property-table-pagination-page-1'));

      expect(allCallbacks.onView).toHaveBeenCalled();
      expect(allCallbacks.onCompare).toHaveBeenCalled();
      expect(allCallbacks.onPageChange).toHaveBeenCalled();
    });
  });
});