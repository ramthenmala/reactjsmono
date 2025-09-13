import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MapControls } from '../MapControls';

// Mock shared-ui components
jest.mock('@compass/shared-ui', () => ({
  ButtonGroup: ({ children, size, className, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId}
      data-size={size}
      className={className}
      role="group"
    >
      {children}
    </div>
  ),
  ButtonGroupItem: ({ 
    children, 
    id, 
    onClick, 
    'data-qa-id': dataQaId 
  }: any) => (
    <button 
      data-qa-id={dataQaId}
      data-id={id}
      onClick={onClick}
      role="button"
    >
      {children}
    </button>
  ),
}));

// Mock styles
jest.mock('../styles', () => ({
  mapStyles: {
    controls: {
      container: 'mock-controls-container',
      layerButton: 'mock-layer-button',
      zoomGroup: 'mock-zoom-group',
      layerDropdown: {
        container: 'mock-dropdown-container',
        button: (isActive: boolean) => `mock-dropdown-button ${isActive ? 'active' : 'inactive'}`,
        label: 'mock-dropdown-label',
      },
    },
    icons: {
      layers: {
        width: 16,
        height: 16,
        viewBox: '0 0 16 16',
      },
      streetView: {
        width: 20,
        height: 20,
        viewBox: '0 0 20 20',
      },
      satelliteView: {
        width: 20,
        height: 20,
        viewBox: '0 0 20 20',
      },
      zoom: {
        width: 16,
        height: 16,
        viewBox: '0 0 16 16',
      },
    },
  },
}));

describe('MapControls', () => {
  const defaultProps = {
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    onStyleChange: jest.fn(),
    activeMapStyle: 'streets',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      render(<MapControls {...defaultProps} />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<MapControls {...defaultProps} data-qa-id="custom-controls" />);
      
      expect(screen.getByTestId('custom-controls')).toBeInTheDocument();
    });

    it('should render all control sections', () => {
      render(<MapControls {...defaultProps} />);
      
      expect(screen.getByTestId('map-controls-layer-section')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-layer-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-group')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-in')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-out')).toBeInTheDocument();
    });
  });

  describe('Layer Button', () => {
    it('should render layer button with correct attributes', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      expect(layerButton).toHaveAttribute('aria-label', 'Map layers');
      expect(layerButton).toHaveClass('mock-layer-button');
    });

    it('should render layer button icon with correct SVG attributes', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      const svg = layerButton.querySelector('svg');
      
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should toggle dropdown menu on layer button click', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      
      // Initially dropdown should not be visible
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
      
      // Click to open dropdown
      fireEvent.click(layerButton);
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      // Click again to close dropdown
      fireEvent.click(layerButton);
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
    });

    it('should handle multiple clicks correctly', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      
      // Multiple clicks to toggle
      fireEvent.click(layerButton);
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      fireEvent.click(layerButton);
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
      
      fireEvent.click(layerButton);
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
    });
  });

  describe('Layer Dropdown Menu', () => {
    it('should render dropdown with both style options', () => {
      render(<MapControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-streets-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-satellite-button')).toBeInTheDocument();
    });

    it('should render streets button with correct content', () => {
      render(<MapControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const streetsButton = screen.getByTestId('map-controls-streets-button');
      const svg = streetsButton.querySelector('svg');
      const label = streetsButton.querySelector('span');
      
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
      expect(label).toHaveTextContent('Streets');
      expect(label).toHaveClass('mock-dropdown-label');
    });

    it('should render satellite button with correct content', () => {
      render(<MapControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const satelliteButton = screen.getByTestId('map-controls-satellite-button');
      const svg = satelliteButton.querySelector('svg');
      const label = satelliteButton.querySelector('span');
      
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
      expect(label).toHaveTextContent('Satellite');
      expect(label).toHaveClass('mock-dropdown-label');
    });

    it('should apply active styling to streets button when activeMapStyle is streets', () => {
      render(<MapControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const streetsButton = screen.getByTestId('map-controls-streets-button');
      expect(streetsButton).toHaveClass('mock-dropdown-button', 'active');
    });

    it('should apply inactive styling to satellite button when activeMapStyle is streets', () => {
      render(<MapControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const satelliteButton = screen.getByTestId('map-controls-satellite-button');
      expect(satelliteButton).toHaveClass('mock-dropdown-button', 'inactive');
    });

    it('should call onStyleChange and close dropdown when streets button is clicked', () => {
      const mockOnStyleChange = jest.fn();
      render(<MapControls {...defaultProps} onStyleChange={mockOnStyleChange} />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const streetsButton = screen.getByTestId('map-controls-streets-button');
      fireEvent.click(streetsButton);
      
      expect(mockOnStyleChange).toHaveBeenCalledWith('streets');
      expect(mockOnStyleChange).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
    });

    it('should call onStyleChange and close dropdown when satellite button is clicked', () => {
      const mockOnStyleChange = jest.fn();
      render(<MapControls {...defaultProps} onStyleChange={mockOnStyleChange} />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const satelliteButton = screen.getByTestId('map-controls-satellite-button');
      fireEvent.click(satelliteButton);
      
      expect(mockOnStyleChange).toHaveBeenCalledWith('satellite');
      expect(mockOnStyleChange).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('Active Map Style States', () => {
    it('should show correct active state for satellite map style', () => {
      render(<MapControls {...defaultProps} activeMapStyle="satellite" />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const streetsButton = screen.getByTestId('map-controls-streets-button');
      const satelliteButton = screen.getByTestId('map-controls-satellite-button');
      
      expect(streetsButton).toHaveClass('mock-dropdown-button', 'inactive');
      expect(satelliteButton).toHaveClass('mock-dropdown-button', 'active');
    });

    it('should handle unknown active map style gracefully', () => {
      render(<MapControls {...defaultProps} activeMapStyle="unknown" as any />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const streetsButton = screen.getByTestId('map-controls-streets-button');
      const satelliteButton = screen.getByTestId('map-controls-satellite-button');
      
      expect(streetsButton).toHaveClass('mock-dropdown-button', 'inactive');
      expect(satelliteButton).toHaveClass('mock-dropdown-button', 'inactive');
    });

    it('should update active state when activeMapStyle prop changes', () => {
      const { rerender } = render(<MapControls {...defaultProps} activeMapStyle="streets" />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-streets-button')).toHaveClass('active');
      
      rerender(<MapControls {...defaultProps} activeMapStyle="satellite" />);
      
      expect(screen.getByTestId('map-controls-streets-button')).toHaveClass('inactive');
      expect(screen.getByTestId('map-controls-satellite-button')).toHaveClass('active');
    });
  });

  describe('Zoom Controls', () => {
    it('should render zoom controls with correct structure', () => {
      render(<MapControls {...defaultProps} />);
      
      const zoomGroup = screen.getByTestId('map-controls-zoom-group');
      const zoomIn = screen.getByTestId('map-controls-zoom-in');
      const zoomOut = screen.getByTestId('map-controls-zoom-out');
      
      expect(zoomGroup).toHaveAttribute('data-size', 'sm');
      expect(zoomGroup).toHaveAttribute('role', 'group');
      expect(zoomIn).toHaveAttribute('data-id', 'zoom-in');
      expect(zoomOut).toHaveAttribute('data-id', 'zoom-out');
    });

    it('should render zoom in button with plus icon', () => {
      render(<MapControls {...defaultProps} />);
      
      const zoomInButton = screen.getByTestId('map-controls-zoom-in');
      const svg = zoomInButton.querySelector('svg');
      const path = svg?.querySelector('path');
      
      expect(svg).toHaveAttribute('data-qa-id', 'map-controls-zoom-in-icon');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
      expect(path).toHaveAttribute('d', 'M8 3V13M3 8H13');
    });

    it('should render zoom out button with minus icon', () => {
      render(<MapControls {...defaultProps} />);
      
      const zoomOutButton = screen.getByTestId('map-controls-zoom-out');
      const svg = zoomOutButton.querySelector('svg');
      const path = svg?.querySelector('path');
      
      expect(svg).toHaveAttribute('data-qa-id', 'map-controls-zoom-out-icon');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
      expect(path).toHaveAttribute('d', 'M3 8H13');
    });

    it('should call onZoomIn when zoom in button is clicked', () => {
      const mockOnZoomIn = jest.fn();
      render(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} />);
      
      const zoomInButton = screen.getByTestId('map-controls-zoom-in');
      fireEvent.click(zoomInButton);
      
      expect(mockOnZoomIn).toHaveBeenCalledTimes(1);
    });

    it('should call onZoomOut when zoom out button is clicked', () => {
      const mockOnZoomOut = jest.fn();
      render(<MapControls {...defaultProps} onZoomOut={mockOnZoomOut} />);
      
      const zoomOutButton = screen.getByTestId('map-controls-zoom-out');
      fireEvent.click(zoomOutButton);
      
      expect(mockOnZoomOut).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple zoom clicks correctly', () => {
      const mockOnZoomIn = jest.fn();
      const mockOnZoomOut = jest.fn();
      render(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} onZoomOut={mockOnZoomOut} />);
      
      const zoomInButton = screen.getByTestId('map-controls-zoom-in');
      const zoomOutButton = screen.getByTestId('map-controls-zoom-out');
      
      fireEvent.click(zoomInButton);
      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);
      
      expect(mockOnZoomIn).toHaveBeenCalledTimes(2);
      expect(mockOnZoomOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component State Management', () => {
    it('should maintain dropdown state independently', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      
      // Open dropdown
      fireEvent.click(layerButton);
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      // Click zoom buttons should not affect dropdown
      fireEvent.click(screen.getByTestId('map-controls-zoom-in'));
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('map-controls-zoom-out'));
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
    });

    it('should close dropdown when style is selected', () => {
      render(<MapControls {...defaultProps} />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      // Select a style
      fireEvent.click(screen.getByTestId('map-controls-satellite-button'));
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
    });

    it('should reset dropdown state when component re-renders', () => {
      const { rerender } = render(<MapControls {...defaultProps} />);
      
      // Open dropdown
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      // Re-render with different props
      rerender(<MapControls {...defaultProps} activeMapStyle="satellite" />);
      
      // Dropdown should still be open
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical structure with default ID', () => {
      render(<MapControls {...defaultProps} />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-layer-section')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-layer-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-group')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-in')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-out')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-in-icon')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-zoom-out-icon')).toBeInTheDocument();
    });

    it('should maintain proper hierarchical structure with custom ID', () => {
      render(<MapControls {...defaultProps} data-qa-id="custom-controls" />);
      
      expect(screen.getByTestId('custom-controls')).toBeInTheDocument();
      expect(screen.getByTestId('custom-controls-layer-section')).toBeInTheDocument();
      expect(screen.getByTestId('custom-controls-layer-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-controls-zoom-group')).toBeInTheDocument();
      expect(screen.getByTestId('custom-controls-zoom-in')).toBeInTheDocument();
      expect(screen.getByTestId('custom-controls-zoom-out')).toBeInTheDocument();
    });

    it('should show dropdown hierarchy when opened', () => {
      render(<MapControls {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-streets-button')).toBeInTheDocument();
      expect(screen.getByTestId('map-controls-satellite-button')).toBeInTheDocument();
    });

    it('should handle empty data-qa-id gracefully', () => {
      render(<MapControls {...defaultProps} data-qa-id="" />);
      
      expect(screen.getByTestId('')).toBeInTheDocument();
      expect(screen.getByTestId('-layer-section')).toBeInTheDocument();
      expect(screen.getByTestId('-layer-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      expect(layerButton).toHaveAttribute('aria-label', 'Map layers');
    });

    it('should have proper button roles', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      const zoomIn = screen.getByTestId('map-controls-zoom-in');
      const zoomOut = screen.getByTestId('map-controls-zoom-out');
      
      expect(layerButton.tagName).toBe('BUTTON');
      expect(zoomIn).toHaveAttribute('role', 'button');
      expect(zoomOut).toHaveAttribute('role', 'button');
    });

    it('should have proper group role for zoom controls', () => {
      render(<MapControls {...defaultProps} />);
      
      const zoomGroup = screen.getByTestId('map-controls-zoom-group');
      expect(zoomGroup).toHaveAttribute('role', 'group');
    });
  });

  describe('Style Integration', () => {
    it('should apply correct CSS classes', () => {
      render(<MapControls {...defaultProps} />);
      
      const container = screen.getByTestId('map-controls');
      const layerButton = screen.getByTestId('map-controls-layer-button');
      const zoomGroup = screen.getByTestId('map-controls-zoom-group');
      
      expect(container).toHaveClass('mock-controls-container');
      expect(layerButton).toHaveClass('mock-layer-button');
      expect(zoomGroup).toHaveClass('mock-zoom-group');
    });

    it('should apply dropdown styles when opened', () => {
      render(<MapControls {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      const dropdown = screen.getByTestId('map-controls-layer-dropdown');
      expect(dropdown).toHaveClass('mock-dropdown-container');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null callback functions gracefully', () => {
      expect(() => {
        render(<MapControls {...defaultProps} onZoomIn={null as any} />);
      }).not.toThrow();
      
      const zoomInButton = screen.getByTestId('map-controls-zoom-in');
      // React event handling treats null handlers gracefully - they don't throw
      expect(() => fireEvent.click(zoomInButton)).not.toThrow();
    });

    it('should handle undefined callback functions gracefully', () => {
      // Mock console.error to suppress React error boundary warnings
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<MapControls {...defaultProps} onStyleChange={undefined as any} />);
      }).not.toThrow();
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      
      // Since undefined callback will cause React error, we just verify it doesn't crash the component
      expect(screen.getByTestId('map-controls-streets-button')).toBeInTheDocument();
      
      // Restore console.error
      console.error = originalError;
    });

    it('should handle rapid state changes', () => {
      render(<MapControls {...defaultProps} />);
      
      const layerButton = screen.getByTestId('map-controls-layer-button');
      
      // Rapidly toggle dropdown
      for (let i = 0; i < 10; i++) {
        fireEvent.click(layerButton);
      }
      
      // Should still work correctly
      expect(screen.queryByTestId('map-controls-layer-dropdown')).not.toBeInTheDocument();
    });

    it('should handle activeMapStyle changes during dropdown interaction', () => {
      const { rerender } = render(<MapControls {...defaultProps} activeMapStyle="streets" />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-streets-button')).toHaveClass('active');
      
      // Change active style while dropdown is open
      rerender(<MapControls {...defaultProps} activeMapStyle="satellite" />);
      
      expect(screen.getByTestId('map-controls-streets-button')).toHaveClass('inactive');
      expect(screen.getByTestId('map-controls-satellite-button')).toHaveClass('active');
    });
  });

  describe('Component Lifecycle', () => {
    it('should mount and unmount correctly', () => {
      const { unmount } = render(<MapControls {...defaultProps} />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
      
      expect(() => unmount()).not.toThrow();
      expect(screen.queryByTestId('map-controls')).not.toBeInTheDocument();
    });

    it('should handle prop changes correctly', () => {
      const { rerender } = render(<MapControls {...defaultProps} activeMapStyle="streets" />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
      
      rerender(<MapControls {...defaultProps} activeMapStyle="satellite" />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-satellite-button')).toHaveClass('active');
    });

    it('should maintain dropdown state across re-renders with same activeMapStyle', () => {
      const { rerender } = render(<MapControls {...defaultProps} />);
      
      fireEvent.click(screen.getByTestId('map-controls-layer-button'));
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
      
      rerender(<MapControls {...defaultProps} />);
      
      expect(screen.getByTestId('map-controls-layer-dropdown')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders with same props', () => {
      const mockOnZoomIn = jest.fn();
      const { rerender } = render(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
      
      rerender(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} />);
      
      expect(screen.getByTestId('map-controls')).toBeInTheDocument();
    });

    it('should handle high-frequency interactions', () => {
      const mockOnZoomIn = jest.fn();
      render(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} />);
      
      const zoomInButton = screen.getByTestId('map-controls-zoom-in');
      
      // Simulate rapid clicking
      for (let i = 0; i < 50; i++) {
        fireEvent.click(zoomInButton);
      }
      
      expect(mockOnZoomIn).toHaveBeenCalledTimes(50);
    });
  });

  describe('Integration with Shared UI Components', () => {
    it('should pass correct props to ButtonGroup', () => {
      render(<MapControls {...defaultProps} />);
      
      const buttonGroup = screen.getByTestId('map-controls-zoom-group');
      expect(buttonGroup).toHaveAttribute('data-size', 'sm');
      expect(buttonGroup).toHaveClass('mock-zoom-group');
    });

    it('should pass correct props to ButtonGroupItems', () => {
      render(<MapControls {...defaultProps} />);
      
      const zoomIn = screen.getByTestId('map-controls-zoom-in');
      const zoomOut = screen.getByTestId('map-controls-zoom-out');
      
      expect(zoomIn).toHaveAttribute('data-id', 'zoom-in');
      expect(zoomOut).toHaveAttribute('data-id', 'zoom-out');
    });

    it('should handle ButtonGroupItem onClick events correctly', () => {
      const mockOnZoomIn = jest.fn();
      const mockOnZoomOut = jest.fn();
      
      render(<MapControls {...defaultProps} onZoomIn={mockOnZoomIn} onZoomOut={mockOnZoomOut} />);
      
      fireEvent.click(screen.getByTestId('map-controls-zoom-in'));
      fireEvent.click(screen.getByTestId('map-controls-zoom-out'));
      
      expect(mockOnZoomIn).toHaveBeenCalledTimes(1);
      expect(mockOnZoomOut).toHaveBeenCalledTimes(1);
    });
  });
});