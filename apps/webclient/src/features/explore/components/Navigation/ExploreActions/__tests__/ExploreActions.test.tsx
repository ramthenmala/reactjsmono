import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExploreActions } from '@/features/explore/components/Navigation/ExploreActions';
import type { ExploreActionsProps } from '@/features/explore/types/exploreActions';

// Mock the i18n hook
jest.mock('@/i18n', () => ({
  useLocaleTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.compare': 'Compare',
        'common.share': 'Share',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the shared UI components
jest.mock('@compass/shared-ui', () => ({
  Button: ({ children, className, size, color, 'data-qa-id': dataQaId, ...props }: any) => (
    <button 
      className={className} 
      data-qa-id={dataQaId}
      data-size={size}
      data-color={color}
      {...props}
    >
      {children}
    </button>
  ),
  Icon: ({ name, className, 'data-qa-id': dataQaId, ...props }: any) => (
    <span 
      className={className} 
      data-qa-id={dataQaId}
      data-icon-name={name}
      {...props}
    >
      Icon-{name}
    </span>
  ),
}));

// Mock the UntitledUI icons
jest.mock('@untitledui/icons', () => ({
  Share01: ({ className, 'data-qa-id': dataQaId, 'data-icon': dataIcon, ...props }: any) => (
    <span 
      className={className} 
      data-qa-id={dataQaId}
      data-icon={dataIcon}
      {...props}
    >
      Share01-Icon
    </span>
  ),
}));

describe('ExploreActions', () => {
  const defaultProps: ExploreActionsProps = {};

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<ExploreActions {...defaultProps} />);

      expect(screen.getByTestId('explore-actions')).toBeInTheDocument();
      expect(screen.getByTestId('explore-actions-compare-button')).toBeInTheDocument();
      expect(screen.getByTestId('explore-actions-share-button')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      render(<ExploreActions {...defaultProps} data-qa-id="custom-actions" />);

      expect(screen.getByTestId('custom-actions')).toBeInTheDocument();
      expect(screen.getByTestId('custom-actions-compare-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-actions-share-button')).toBeInTheDocument();
    });

    it('should use default data-qa-id when not provided', () => {
      render(<ExploreActions {...defaultProps} />);

      expect(screen.getByTestId('explore-actions')).toBeInTheDocument();
    });
  });

  describe('Hierarchical data-qa-id Structure', () => {
    it('should create proper hierarchical data-qa-id attributes', () => {
      render(<ExploreActions {...defaultProps} data-qa-id="test-actions" />);

      expect(screen.getByTestId('test-actions')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-compare-button')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-compare-icon')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-compare-text')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-share-button')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-share-icon')).toBeInTheDocument();
      expect(screen.getByTestId('test-actions-share-text')).toBeInTheDocument();
    });

    it('should maintain hierarchy with different qa-id', () => {
      render(<ExploreActions {...defaultProps} data-qa-id="navbar-actions" />);

      expect(screen.getByTestId('navbar-actions')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-compare-button')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-compare-icon')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-compare-text')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-share-button')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-share-icon')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-actions-share-text')).toBeInTheDocument();
    });
  });

  describe('Button Properties', () => {
    it('should apply correct button size', () => {
      render(<ExploreActions {...defaultProps} size="md" />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(compareButton).toHaveAttribute('data-size', 'md');
      expect(shareButton).toHaveAttribute('data-size', 'md');
    });

    it('should default to small size when not provided', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(compareButton).toHaveAttribute('data-size', 'sm');
      expect(shareButton).toHaveAttribute('data-size', 'sm');
    });

    it('should apply correct button color', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(compareButton).toHaveAttribute('data-color', 'tertiary');
      expect(shareButton).toHaveAttribute('data-color', 'tertiary');
    });

    it('should handle all size variants', () => {
      const { rerender } = render(<ExploreActions {...defaultProps} size="sm" />);
      expect(screen.getByTestId('explore-actions-compare-button')).toHaveAttribute('data-size', 'sm');

      rerender(<ExploreActions {...defaultProps} size="md" />);
      expect(screen.getByTestId('explore-actions-compare-button')).toHaveAttribute('data-size', 'md');

      rerender(<ExploreActions {...defaultProps} size="lg" />);
      expect(screen.getByTestId('explore-actions-compare-button')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Variant Styling', () => {
    it('should apply light variant by default', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      expect(compareButton).toHaveClass('bg-white/50');
    });

    it('should apply light variant when explicitly set', () => {
      render(<ExploreActions {...defaultProps} variant="light" />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      expect(compareButton).toHaveClass('bg-white/50');
    });

    it('should apply dark variant', () => {
      render(<ExploreActions {...defaultProps} variant="dark" />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(compareButton).toHaveClass('bg-black/50');
      expect(shareButton).toHaveClass('bg-black/50');
    });

    it('should include common button styles for both variants', () => {
      const { rerender } = render(<ExploreActions {...defaultProps} variant="light" />);
      
      let compareButton = screen.getByTestId('explore-actions-compare-button');
      expect(compareButton).toHaveClass('relative', 'overflow-hidden', 'rounded-xl', 'backdrop-blur-xl');

      rerender(<ExploreActions {...defaultProps} variant="dark" />);
      
      compareButton = screen.getByTestId('explore-actions-compare-button');
      expect(compareButton).toHaveClass('relative', 'overflow-hidden', 'rounded-xl', 'backdrop-blur-xl');
    });
  });

  describe('Content Display', () => {
    it('should display compare button text', () => {
      render(<ExploreActions {...defaultProps} />);

      expect(screen.getByText('Compare')).toBeInTheDocument();
      expect(screen.getByTestId('explore-actions-compare-text')).toHaveTextContent('Compare');
    });

    it('should display share button text', () => {
      render(<ExploreActions {...defaultProps} />);

      expect(screen.getByText('Share')).toBeInTheDocument();
      expect(screen.getByTestId('explore-actions-share-text')).toHaveTextContent('Share');
    });

    it('should render compare icon', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareIcon = screen.getByTestId('explore-actions-compare-icon');
      expect(compareIcon).toBeInTheDocument();
      expect(compareIcon).toHaveAttribute('data-icon-name', 'compare');
      expect(compareIcon).toHaveTextContent('Icon-compare');
    });

    it('should render share icon', () => {
      render(<ExploreActions {...defaultProps} />);

      const shareIcon = screen.getByTestId('explore-actions-share-icon');
      expect(shareIcon).toBeInTheDocument();
      expect(shareIcon).toHaveAttribute('data-icon', 'true');
      expect(shareIcon).toHaveTextContent('Share01-Icon');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to container', () => {
      render(<ExploreActions {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('explore-actions');
      expect(container).toHaveClass('custom-class');
    });

    it('should combine custom className with default classes', () => {
      render(<ExploreActions {...defaultProps} className="extra-spacing" />);

      const container = screen.getByTestId('explore-actions');
      expect(container).toHaveClass('flex', 'items-center', 'gap-3', 'extra-spacing');
    });

    it('should handle empty className', () => {
      render(<ExploreActions {...defaultProps} className="" />);

      const container = screen.getByTestId('explore-actions');
      expect(container).toHaveClass('flex', 'items-center', 'gap-3');
    });

    it('should handle undefined className', () => {
      render(<ExploreActions {...defaultProps} className={undefined} />);

      const container = screen.getByTestId('explore-actions');
      expect(container).toHaveClass('flex', 'items-center', 'gap-3');
    });
  });

  describe('Icon Styling', () => {
    it('should apply correct classes to compare icon', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareIcon = screen.getByTestId('explore-actions-compare-icon');
      expect(compareIcon).toHaveClass('me-2', 'inline-block', 'size-5', 'relative', 'z-10');
    });

    it('should apply correct classes to share icon', () => {
      render(<ExploreActions {...defaultProps} />);

      const shareIcon = screen.getByTestId('explore-actions-share-icon');
      expect(shareIcon).toHaveClass('me-2', 'inline-block', 'size-5', 'relative', 'z-10');
    });

    it('should apply correct classes to text elements', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareText = screen.getByTestId('explore-actions-compare-text');
      const shareText = screen.getByTestId('explore-actions-share-text');

      expect(compareText).toHaveClass('relative', 'z-10');
      expect(shareText).toHaveClass('relative', 'z-10');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      render(<ExploreActions {...defaultProps} />);

      const container = screen.getByTestId('explore-actions');
      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(container).toContainElement(compareButton);
      expect(container).toContainElement(shareButton);
    });

    it('should contain icons and text within buttons', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');
      const compareIcon = screen.getByTestId('explore-actions-compare-icon');
      const shareIcon = screen.getByTestId('explore-actions-share-icon');
      const compareText = screen.getByTestId('explore-actions-compare-text');
      const shareText = screen.getByTestId('explore-actions-share-text');

      expect(compareButton).toContainElement(compareIcon);
      expect(compareButton).toContainElement(compareText);
      expect(shareButton).toContainElement(shareIcon);
      expect(shareButton).toContainElement(shareText);
    });

    it('should render container as div element', () => {
      render(<ExploreActions {...defaultProps} />);

      const container = screen.getByTestId('explore-actions');
      expect(container.tagName).toBe('DIV');
    });

    it('should render buttons as button elements', () => {
      render(<ExploreActions {...defaultProps} />);

      const compareButton = screen.getByTestId('explore-actions-compare-button');
      const shareButton = screen.getByTestId('explore-actions-share-button');

      expect(compareButton.tagName).toBe('BUTTON');
      expect(shareButton.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility', () => {
    it('should provide proper data-qa-id attributes for testing', () => {
      render(<ExploreActions {...defaultProps} data-qa-id="accessible-actions" />);

      expect(screen.getByTestId('accessible-actions')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-compare-button')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-compare-icon')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-compare-text')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-share-button')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-share-icon')).toBeInTheDocument();
      expect(screen.getByTestId('accessible-actions-share-text')).toBeInTheDocument();
    });

    it('should maintain semantic button structure', () => {
      render(<ExploreActions {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);

      expect(buttons[0]).toHaveTextContent('Compare');
      expect(buttons[1]).toHaveTextContent('Share');
    });

    it('should have accessible button text', () => {
      render(<ExploreActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props at minimal values', () => {
      render(<ExploreActions size="sm" variant="light" className="" data-qa-id="min-props" />);

      expect(screen.getByTestId('min-props')).toBeInTheDocument();
      expect(screen.getByTestId('min-props-compare-button')).toHaveAttribute('data-size', 'sm');
      expect(screen.getByTestId('min-props-compare-button')).toHaveClass('bg-white/50');
    });

    it('should handle all props at maximum complexity', () => {
      render(
        <ExploreActions
          size="lg"
          variant="dark"
          className="complex-styling with-multiple-classes"
          data-qa-id="complex-test-actions"
        />
      );

      const container = screen.getByTestId('complex-test-actions');
      const compareButton = screen.getByTestId('complex-test-actions-compare-button');

      expect(container).toHaveClass('complex-styling', 'with-multiple-classes');
      expect(compareButton).toHaveAttribute('data-size', 'lg');
      expect(compareButton).toHaveClass('bg-black/50');
    });

    it('should work correctly when used multiple times', () => {
      const { rerender } = render(<ExploreActions data-qa-id="first-actions" />);
      expect(screen.getByTestId('first-actions')).toBeInTheDocument();

      rerender(<ExploreActions data-qa-id="second-actions" />);
      expect(screen.getByTestId('second-actions')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const renderStart = performance.now();
      render(<ExploreActions {...defaultProps} />);
      const renderEnd = performance.now();

      // Component should render quickly (under 100ms)
      expect(renderEnd - renderStart).toBeLessThan(100);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = render(<ExploreActions {...defaultProps} variant="light" />);

      const start = performance.now();
      for (let i = 0; i < 10; i++) {
        rerender(<ExploreActions {...defaultProps} variant={i % 2 === 0 ? 'light' : 'dark'} />);
      }
      const end = performance.now();

      // Multiple re-renders should complete quickly
      expect(end - start).toBeLessThan(100);
    });

    it('should handle frequent variant changes efficiently', () => {
      const { rerender } = render(<ExploreActions {...defaultProps} variant="light" />);

      const start = performance.now();
      rerender(<ExploreActions {...defaultProps} variant="dark" />);
      rerender(<ExploreActions {...defaultProps} variant="light" />);
      rerender(<ExploreActions {...defaultProps} variant="dark" />);
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
    });
  });

  describe('Default Export', () => {
    it('should have default export available', () => {
      expect(ExploreActions).toBeDefined();
      expect(typeof ExploreActions).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should work with different combinations of props', () => {
      const combinations = [
        { size: 'sm' as const, variant: 'light' as const },
        { size: 'md' as const, variant: 'light' as const },
        { size: 'lg' as const, variant: 'light' as const },
        { size: 'sm' as const, variant: 'dark' as const },
        { size: 'md' as const, variant: 'dark' as const },
        { size: 'lg' as const, variant: 'dark' as const },
      ];

      combinations.forEach((props, index) => {
        const { unmount } = render(<ExploreActions {...props} data-qa-id={`combo-${index}`} />);
        expect(screen.getByTestId(`combo-${index}`)).toBeInTheDocument();
        expect(screen.getByTestId(`combo-${index}-compare-button`)).toHaveAttribute('data-size', props.size);
        unmount();
      });
    });

    it('should work with complex className combinations', () => {
      const classNames = [
        'simple',
        'multiple classes here',
        'with-hyphens and_underscores',
        'responsive md:flex lg:block',
        '',
      ];

      classNames.forEach((className, index) => {
        const { unmount } = render(<ExploreActions className={className} data-qa-id={`class-${index}`} />);
        expect(screen.getByTestId(`class-${index}`)).toBeInTheDocument();
        if (className) {
          className.split(' ').forEach(cls => {
            if (cls) expect(screen.getByTestId(`class-${index}`)).toHaveClass(cls);
          });
        }
        unmount();
      });
    });
  });
});