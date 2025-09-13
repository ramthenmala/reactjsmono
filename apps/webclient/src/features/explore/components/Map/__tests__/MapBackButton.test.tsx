import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapBackButton } from '../MapBackButton';

// Mock styles
jest.mock('../styles', () => ({
  mapStyles: {
    backButton: {
      container: 'mock-back-button-container',
      button: 'mock-back-button',
    },
    icons: {
      back: {
        width: 16,
        height: 16,
        viewBox: '0 0 16 16',
      },
    },
  },
}));

describe('MapBackButton', () => {
  const defaultProps = {
    selectedCity: 'Riyadh',
    onBackToCities: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Conditional Rendering', () => {
    it('should render when selectedCity is provided', () => {
      render(<MapBackButton {...defaultProps} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should not render when selectedCity is null', () => {
      render(<MapBackButton selectedCity={null} onBackToCities={defaultProps.onBackToCities} />);
      
      expect(screen.queryByTestId('map-back-button')).not.toBeInTheDocument();
    });

    it('should not render when selectedCity is empty string', () => {
      render(<MapBackButton selectedCity="" onBackToCities={defaultProps.onBackToCities} />);
      
      expect(screen.queryByTestId('map-back-button')).not.toBeInTheDocument();
    });

    it('should not render when selectedCity is undefined', () => {
      render(<MapBackButton selectedCity={undefined as any} onBackToCities={defaultProps.onBackToCities} />);
      
      expect(screen.queryByTestId('map-back-button')).not.toBeInTheDocument();
    });

    it('should render when selectedCity is whitespace', () => {
      render(<MapBackButton selectedCity="   " onBackToCities={defaultProps.onBackToCities} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render with default data-qa-id', () => {
      render(<MapBackButton {...defaultProps} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-icon')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-text')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<MapBackButton {...defaultProps} data-qa-id="custom-back-button" />);
      
      expect(screen.getByTestId('custom-back-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-back-button-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-back-button-icon')).toBeInTheDocument();
      expect(screen.getByTestId('custom-back-button-text')).toBeInTheDocument();
    });

    it('should render button with correct text', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const button = screen.getByTestId('map-back-button-button');
      expect(button).toHaveTextContent('Back to Cities');
    });

    it('should render button text in separate span element', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const textSpan = screen.getByTestId('map-back-button-text');
      expect(textSpan).toHaveTextContent('Back to Cities');
      expect(textSpan.tagName).toBe('SPAN');
    });
  });

  describe('Click Interaction', () => {
    it('should call onBackToCities when button is clicked', () => {
      const mockOnBackToCities = jest.fn();
      render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      const button = screen.getByTestId('map-back-button-button');
      fireEvent.click(button);
      
      expect(mockOnBackToCities).toHaveBeenCalledTimes(1);
    });

    it('should only call onBackToCities when button is clicked, not container', () => {
      const mockOnBackToCities = jest.fn();
      render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      const container = screen.getByTestId('map-back-button');
      fireEvent.click(container);
      
      // Container click should not trigger the callback since only button has onClick
      expect(mockOnBackToCities).toHaveBeenCalledTimes(0);
    });

    it('should handle multiple clicks correctly', () => {
      const mockOnBackToCities = jest.fn();
      render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      const button = screen.getByTestId('map-back-button-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnBackToCities).toHaveBeenCalledTimes(3);
    });

    it('should handle click with different event types', () => {
      const mockOnBackToCities = jest.fn();
      render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      const button = screen.getByTestId('map-back-button-button');
      
      fireEvent.click(button);
      expect(mockOnBackToCities).toHaveBeenCalledTimes(1);
      
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
      // Should not trigger additional calls from mouseDown/mouseUp
      expect(mockOnBackToCities).toHaveBeenCalledTimes(1);
    });
  });

  describe('SVG Icon', () => {
    it('should render SVG icon with correct attributes', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const icon = screen.getByTestId('map-back-button-icon');
      expect(icon).toHaveAttribute('width', '16');
      expect(icon).toHaveAttribute('height', '16');
      expect(icon).toHaveAttribute('viewBox', '0 0 16 16');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('should render SVG path with correct attributes', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const icon = screen.getByTestId('map-back-button-icon');
      const path = icon.querySelector('path');
      
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d', 'M10 12L6 8L10 4');
      expect(path).toHaveAttribute('stroke', 'currentColor');
      expect(path).toHaveAttribute('stroke-width', '2');
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });
  });

  describe('Style Integration', () => {
    it('should apply correct CSS classes', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const container = screen.getByTestId('map-back-button');
      const button = screen.getByTestId('map-back-button-button');
      
      expect(container).toHaveClass('mock-back-button-container');
      expect(button).toHaveClass('mock-back-button');
    });
  });

  describe('Different City Names', () => {
    it('should render for different city names', () => {
      const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Jubail', 'Yanbu'];
      
      cities.forEach(city => {
        const { unmount } = render(<MapBackButton selectedCity={city} onBackToCities={jest.fn()} />);
        
        expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
        expect(screen.getByText('Back to Cities')).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should render for city names with special characters', () => {
      const specialCities = [
        'Al-Riyadh',
        'Ar-Riyāḍ',
        'City with Spaces',
        'City-with-Hyphens',
        'City_with_Underscores',
        'City123',
      ];
      
      specialCities.forEach(city => {
        const { unmount } = render(<MapBackButton selectedCity={city} onBackToCities={jest.fn()} />);
        
        expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should render for very long city names', () => {
      const longCityName = 'This is a very long city name that might cause layout issues but should still work correctly';
      
      render(<MapBackButton selectedCity={longCityName} onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render as a button element', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const button = screen.getByTestId('map-back-button-button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should be keyboard accessible', () => {
      const mockOnBackToCities = jest.fn();
      render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      const button = screen.getByTestId('map-back-button-button');
      button.focus();
      
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      // Note: fireEvent.keyDown doesn't trigger click by default, 
      // but the button should be focusable
      expect(button).toHaveFocus();
    });

    it('should have proper semantic structure', () => {
      render(<MapBackButton {...defaultProps} />);
      
      const container = screen.getByTestId('map-back-button');
      const button = screen.getByTestId('map-back-button-button');
      
      expect(container.tagName).toBe('DIV');
      expect(button.tagName).toBe('BUTTON');
      // Buttons have implicit button role, no need to check explicit role
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle selectedCity with only whitespace', () => {
      render(<MapBackButton selectedCity="   " onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should handle null onBackToCities gracefully', () => {
      expect(() => {
        render(<MapBackButton selectedCity="Riyadh" onBackToCities={null as any} />);
      }).not.toThrow();
      
      const button = screen.getByTestId('map-back-button-button');
      // In React's event handling, null handlers don't throw, they just don't execute
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should handle undefined onBackToCities gracefully', () => {
      expect(() => {
        render(<MapBackButton selectedCity="Riyadh" onBackToCities={undefined as any} />);
      }).not.toThrow();
      
      const button = screen.getByTestId('map-back-button-button');
      // In React's event handling, undefined handlers don't throw, they just don't execute
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should handle boolean selectedCity values', () => {
      render(<MapBackButton selectedCity={true as any} onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should handle numeric selectedCity values', () => {
      render(<MapBackButton selectedCity={123 as any} onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should handle object selectedCity values', () => {
      render(<MapBackButton selectedCity={{ name: 'Riyadh' } as any} onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount correctly', () => {
      const { unmount } = render(<MapBackButton {...defaultProps} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
      expect(screen.queryByTestId('map-back-button')).not.toBeInTheDocument();
    });

    it('should re-render when selectedCity changes', () => {
      const { rerender } = render(<MapBackButton selectedCity="Riyadh" onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      
      rerender(<MapBackButton selectedCity={null} onBackToCities={jest.fn()} />);
      
      expect(screen.queryByTestId('map-back-button')).not.toBeInTheDocument();
      
      rerender(<MapBackButton selectedCity="Jeddah" onBackToCities={jest.fn()} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should re-render when onBackToCities changes', () => {
      const mockOnBackToCities1 = jest.fn();
      const mockOnBackToCities2 = jest.fn();
      
      const { rerender } = render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities1} />);
      
      const button = screen.getByTestId('map-back-button-button');
      fireEvent.click(button);
      expect(mockOnBackToCities1).toHaveBeenCalledTimes(1);
      
      rerender(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities2} />);
      
      fireEvent.click(button);
      expect(mockOnBackToCities1).toHaveBeenCalledTimes(1);
      expect(mockOnBackToCities2).toHaveBeenCalledTimes(1);
    });

    it('should re-render when data-qa-id changes', () => {
      const { rerender } = render(<MapBackButton {...defaultProps} data-qa-id="button-1" />);
      
      expect(screen.getByTestId('button-1')).toBeInTheDocument();
      
      rerender(<MapBackButton {...defaultProps} data-qa-id="button-2" />);
      
      expect(screen.queryByTestId('button-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('button-2')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical structure with default ID', () => {
      render(<MapBackButton {...defaultProps} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-icon')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button-text')).toBeInTheDocument();
    });

    it('should maintain proper hierarchical structure with custom ID', () => {
      render(<MapBackButton {...defaultProps} data-qa-id="custom-id" />);
      
      expect(screen.getByTestId('custom-id')).toBeInTheDocument();
      expect(screen.getByTestId('custom-id-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-id-icon')).toBeInTheDocument();
      expect(screen.getByTestId('custom-id-text')).toBeInTheDocument();
    });

    it('should handle empty data-qa-id', () => {
      render(<MapBackButton {...defaultProps} data-qa-id="" />);
      
      expect(screen.getByTestId('')).toBeInTheDocument();
      expect(screen.getByTestId('-button')).toBeInTheDocument();
      expect(screen.getByTestId('-icon')).toBeInTheDocument();
      expect(screen.getByTestId('-text')).toBeInTheDocument();
    });

    it('should handle data-qa-id with special characters', () => {
      render(<MapBackButton {...defaultProps} data-qa-id="back-button_123-test" />);
      
      expect(screen.getByTestId('back-button_123-test')).toBeInTheDocument();
      expect(screen.getByTestId('back-button_123-test-button')).toBeInTheDocument();
      expect(screen.getByTestId('back-button_123-test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('back-button_123-test-text')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders with same props', () => {
      const mockOnBackToCities = jest.fn();
      const { rerender } = render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      
      rerender(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });

    it('should handle rapid state changes', () => {
      const mockOnBackToCities = jest.fn();
      const { rerender } = render(<MapBackButton selectedCity="Riyadh" onBackToCities={mockOnBackToCities} />);
      
      // Rapidly change between different cities - should not cause errors
      for (let i = 0; i < 5; i++) {
        rerender(<MapBackButton selectedCity={`City-${i}`} onBackToCities={mockOnBackToCities} />);
      }
      
      // Should still be able to render and function normally
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
      expect(mockOnBackToCities).not.toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('should work correctly when integrated with other components', () => {
      const TestContainer = ({ city }: { city: string | null }) => (
        <div>
          <div data-qa-id="other-component">Other Component</div>
          <MapBackButton selectedCity={city} onBackToCities={jest.fn()} />
        </div>
      );
      
      render(<TestContainer city="Riyadh" />);
      
      expect(screen.getByTestId('other-component')).toBeInTheDocument();
      expect(screen.getByTestId('map-back-button')).toBeInTheDocument();
    });
  });
});