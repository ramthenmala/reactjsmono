import React from 'react';
import { render, renderHook, act, screen } from '@testing-library/react';
import { ComparisonProvider, useComparison } from '@/features/explore/contexts/ComparisonContext';
import { ComparisonService } from '@/features/explore/services/comparisonService';
import { IProperty } from '@/features/explore/types/explore';

// Mock the ComparisonService
jest.mock('@/features/explore/services/comparisonService');
const mockedComparisonService = ComparisonService as jest.Mocked<typeof ComparisonService>;

// Mock properties for testing
const mockProperty1: IProperty = {
  id: '1',
  title: 'Test Property 1',
  description: 'Test description 1',
  price: 100000,
  location: 'Test Location 1',
  images: [],
};

const mockProperty2: IProperty = {
  id: '2',
  title: 'Test Property 2',
  description: 'Test description 2',
  price: 200000,
  location: 'Test Location 2',
  images: [],
};

const mockProperty3: IProperty = {
  id: '3',
  title: 'Test Property 3',
  description: 'Test description 3',
  price: 300000,
  location: 'Test Location 3',
  images: [],
};

// Test component to access context values
const TestComponent = () => {
  const context = useComparison();
  return (
    <div>
      <span data-qa-id="comparison-count">{context.comparisonCount}</span>
      <span data-qa-id="comparison-list">{JSON.stringify(context.comparisonList.map(p => p.id))}</span>
      <button 
        data-qa-id="add-property-1" 
        onClick={() => context.addToComparison(mockProperty1)}
      >
        Add Property 1
      </button>
      <button 
        data-qa-id="add-property-2" 
        onClick={() => context.addToComparison(mockProperty2)}
      >
        Add Property 2
      </button>
      <button 
        data-qa-id="remove-property-1" 
        onClick={() => context.removeFromComparison('1')}
      >
        Remove Property 1
      </button>
      <button 
        data-qa-id="clear-comparison" 
        onClick={() => context.clearComparison()}
      >
        Clear Comparison
      </button>
      <span data-qa-id="is-in-comparison-1">
        {context.isInComparison('1') ? 'true' : 'false'}
      </span>
    </div>
  );
};

describe('ComparisonContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockedComparisonService.getComparisonList.mockReturnValue([]);
    mockedComparisonService.addToComparison.mockReturnValue({
      success: true,
      message: 'Property added successfully',
      properties: [mockProperty1],
    });
    mockedComparisonService.removeFromComparison.mockReturnValue({
      properties: [],
    });
    mockedComparisonService.clearComparison.mockReturnValue(undefined);
  });

  describe('ComparisonProvider', () => {
    it('should render children', () => {
      render(
        <ComparisonProvider>
          <div data-qa-id="test-child">Test Child</div>
        </ComparisonProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should load initial comparison list from ComparisonService on mount', () => {
      const initialList = [mockProperty1, mockProperty2];
      mockedComparisonService.getComparisonList.mockReturnValue(initialList);

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(mockedComparisonService.getComparisonList).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('comparison-count')).toHaveTextContent('2');
      expect(screen.getByTestId('comparison-list')).toHaveTextContent('["1","2"]');
    });
  });

  describe('useComparison hook', () => {
    it('should throw error when used outside ComparisonProvider', () => {
      const TestComponentWithoutProvider = () => {
        useComparison();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponentWithoutProvider />)).toThrow(
        'useComparison must be used within a ComparisonProvider'
      );
    });

    it('should provide context value when used within ComparisonProvider', () => {
      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      expect(result.current).toHaveProperty('comparisonList');
      expect(result.current).toHaveProperty('addToComparison');
      expect(result.current).toHaveProperty('removeFromComparison');
      expect(result.current).toHaveProperty('clearComparison');
      expect(result.current).toHaveProperty('isInComparison');
      expect(result.current).toHaveProperty('comparisonCount');
    });
  });

  describe('Context functionality', () => {
    it('should have initial empty comparison list', () => {
      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
      expect(screen.getByTestId('comparison-list')).toHaveTextContent('[]');
    });

    it('should add property to comparison successfully', () => {
      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Property added successfully',
        properties: [mockProperty1],
      });

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      act(() => {
        screen.getByTestId('add-property-1').click();
      });

      expect(mockedComparisonService.addToComparison).toHaveBeenCalledWith(mockProperty1);
      expect(screen.getByTestId('comparison-count')).toHaveTextContent('1');
      expect(screen.getByTestId('comparison-list')).toHaveTextContent('["1"]');
    });

    it('should handle failed property addition', () => {
      mockedComparisonService.addToComparison.mockReturnValue({
        success: false,
        message: 'Cannot add more properties',
        properties: [],
      });

      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      act(() => {
        const response = result.current.addToComparison(mockProperty1);
        expect(response).toEqual({
          success: false,
          message: 'Cannot add more properties',
        });
      });

      expect(result.current.comparisonCount).toBe(0);
    });

    it('should remove property from comparison', () => {
      // Setup initial state with property
      mockedComparisonService.getComparisonList.mockReturnValue([mockProperty1]);
      mockedComparisonService.removeFromComparison.mockReturnValue({
        properties: [],
      });

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      act(() => {
        screen.getByTestId('remove-property-1').click();
      });

      expect(mockedComparisonService.removeFromComparison).toHaveBeenCalledWith('1');
      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
    });

    it('should clear all properties from comparison', () => {
      // Setup initial state with properties
      mockedComparisonService.getComparisonList.mockReturnValue([mockProperty1, mockProperty2]);

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      act(() => {
        screen.getByTestId('clear-comparison').click();
      });

      expect(mockedComparisonService.clearComparison).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
      expect(screen.getByTestId('comparison-list')).toHaveTextContent('[]');
    });

    it('should check if property is in comparison', () => {
      mockedComparisonService.getComparisonList.mockReturnValue([mockProperty1]);

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('true');
    });

    it('should return false when property is not in comparison', () => {
      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('false');
    });

    it('should update comparison count when properties are added', () => {
      const { rerender } = render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      // Add first property
      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Property added successfully',
        properties: [mockProperty1],
      });

      act(() => {
        screen.getByTestId('add-property-1').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('1');

      // Add second property
      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Property added successfully',
        properties: [mockProperty1, mockProperty2],
      });

      act(() => {
        screen.getByTestId('add-property-2').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('2');
    });

    it('should maintain state consistency across multiple operations', () => {
      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      // Add property 1
      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Property added successfully',
        properties: [mockProperty1],
      });

      act(() => {
        screen.getByTestId('add-property-1').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('true');

      // Add property 2
      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Property added successfully',
        properties: [mockProperty1, mockProperty2],
      });

      act(() => {
        screen.getByTestId('add-property-2').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('2');

      // Remove property 1
      mockedComparisonService.removeFromComparison.mockReturnValue({
        properties: [mockProperty2],
      });

      act(() => {
        screen.getByTestId('remove-property-1').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('false');

      // Clear all
      act(() => {
        screen.getByTestId('clear-comparison').click();
      });

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty property list gracefully', () => {
      mockedComparisonService.getComparisonList.mockReturnValue([]);

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
      expect(screen.getByTestId('comparison-list')).toHaveTextContent('[]');
      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('false');
    });

    it('should handle service errors gracefully', () => {
      mockedComparisonService.addToComparison.mockReturnValue({
        success: false,
        message: 'Service error occurred',
        properties: [],
      });

      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      act(() => {
        const response = result.current.addToComparison(mockProperty1);
        expect(response.success).toBe(false);
        expect(response.message).toBe('Service error occurred');
      });

      expect(result.current.comparisonCount).toBe(0);
    });

    it('should handle removing non-existent property', () => {
      mockedComparisonService.removeFromComparison.mockReturnValue({
        properties: [],
      });

      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      act(() => {
        screen.getByTestId('remove-property-1').click();
      });

      expect(mockedComparisonService.removeFromComparison).toHaveBeenCalledWith('1');
      expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
    });

    it('should handle checking non-existent property in empty list', () => {
      render(
        <ComparisonProvider>
          <TestComponent />
        </ComparisonProvider>
      );

      expect(screen.getByTestId('is-in-comparison-1')).toHaveTextContent('false');
    });
  });

  describe('Return value structure', () => {
    it('should return addToComparison result with correct structure', () => {
      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      mockedComparisonService.addToComparison.mockReturnValue({
        success: true,
        message: 'Success message',
        properties: [mockProperty1],
      });

      act(() => {
        const addResult = result.current.addToComparison(mockProperty1);
        expect(addResult).toEqual({
          success: true,
          message: 'Success message',
        });
      });
    });

    it('should return addToComparison result with failure structure', () => {
      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      mockedComparisonService.addToComparison.mockReturnValue({
        success: false,
        message: 'Error message',
        properties: [],
      });

      act(() => {
        const addResult = result.current.addToComparison(mockProperty1);
        expect(addResult).toEqual({
          success: false,
          message: 'Error message',
        });
      });
    });
  });

  describe('Property comparison functionality', () => {
    it('should correctly identify property in comparison list', () => {
      mockedComparisonService.getComparisonList.mockReturnValue([
        mockProperty1,
        mockProperty2,
        mockProperty3,
      ]);

      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      expect(result.current.isInComparison('1')).toBe(true);
      expect(result.current.isInComparison('2')).toBe(true);
      expect(result.current.isInComparison('3')).toBe(true);
      expect(result.current.isInComparison('4')).toBe(false);
    });

    it('should handle property comparison with mixed property types', () => {
      const mixedProperties = [
        { ...mockProperty1, id: 'string-id' },
        { ...mockProperty2, id: '123' },
        { ...mockProperty3, id: 'uuid-style-id-123' },
      ];

      mockedComparisonService.getComparisonList.mockReturnValue(mixedProperties);

      const { result } = renderHook(() => useComparison(), {
        wrapper: ComparisonProvider,
      });

      expect(result.current.isInComparison('string-id')).toBe(true);
      expect(result.current.isInComparison('123')).toBe(true);
      expect(result.current.isInComparison('uuid-style-id-123')).toBe(true);
      expect(result.current.isInComparison('non-existent')).toBe(false);
    });
  });
});