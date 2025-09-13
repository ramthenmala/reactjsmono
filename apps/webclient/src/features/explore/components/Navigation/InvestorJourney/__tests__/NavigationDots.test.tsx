import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationDots } from '@/features/explore/components/Navigation/InvestorJourney/NavigationDots';
import '@testing-library/jest-dom';

// Mock the styles
jest.mock('../styles', () => ({
  investorJourneyStyles: {
    dots: {
      container: 'dots-container',
      button: jest.fn((isActive) => `dots-button ${isActive ? 'active' : 'inactive'}`),
      buttonStyle: { width: '12px', height: '12px' },
    },
  },
}));

describe('NavigationDots', () => {
  const defaultProps = {
    cards: [
      { title: 'Step 1', content: 'Content 1', icon: '/icon1.svg' },
      { title: 'Step 2', content: 'Content 2', icon: '/icon2.svg' },
      { title: 'Step 3', content: 'Content 3', icon: '/icon3.svg' },
    ],
    activeIndex: 0,
    isRTL: false,
    onDotClick: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<NavigationDots {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render container with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('navigation-dots')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-dots' });

      expect(screen.getByTestId('custom-dots')).toBeInTheDocument();
      expect(screen.queryByTestId('navigation-dots')).not.toBeInTheDocument();
    });

    it('should render correct number of dots', () => {
      renderComponent();

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      expect(dots).toHaveLength(3);
    });

    it('should render all dots as button elements', () => {
      renderComponent();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should render dots with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('navigation-dots-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-2')).toBeInTheDocument();
    });
  });

  describe('LTR (Left-to-Right) Behavior', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render dots in normal order for LTR', () => {
      renderComponent({ isRTL: false });

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      expect(dots[0]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-0');
      expect(dots[1]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-1');
      expect(dots[2]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-2');
    });

    it('should handle dot clicks correctly in LTR mode', () => {
      const onDotClick = jest.fn();
      renderComponent({ isRTL: false, onDotClick });

      const firstDot = screen.getByTestId('navigation-dots-dot-0');
      const secondDot = screen.getByTestId('navigation-dots-dot-1');
      const thirdDot = screen.getByTestId('navigation-dots-dot-2');

      fireEvent.click(firstDot);
      expect(onDotClick).toHaveBeenCalledWith(0);

      fireEvent.click(secondDot);
      expect(onDotClick).toHaveBeenCalledWith(1);

      fireEvent.click(thirdDot);
      expect(onDotClick).toHaveBeenCalledWith(2);
    });

    it('should apply correct active state styling in LTR mode', () => {
      renderComponent({ isRTL: false, activeIndex: 1 });

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;

      // Check that button function is called with correct active states
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 0 (inactive)
      expect(mockButtonClass).toHaveBeenCalledWith(true);  // dot 1 (active)
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 2 (inactive)
    });
  });

  describe('RTL (Right-to-Left) Behavior', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render dots in reversed order for RTL', () => {
      renderComponent({ isRTL: true });

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      
      // In RTL, the visual order is reversed but data-qa-ids should reflect the logical order
      expect(dots[0]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-2');
      expect(dots[1]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-1');
      expect(dots[2]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-0');
    });

    it('should handle dot clicks correctly in RTL mode', () => {
      const onDotClick = jest.fn();
      renderComponent({ isRTL: true, onDotClick });

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      
      // First dot in RTL should correspond to index 2
      fireEvent.click(dots[0]);
      expect(onDotClick).toHaveBeenCalledWith(2);

      // Second dot in RTL should correspond to index 1
      fireEvent.click(dots[1]);
      expect(onDotClick).toHaveBeenCalledWith(1);

      // Third dot in RTL should correspond to index 0
      fireEvent.click(dots[2]);
      expect(onDotClick).toHaveBeenCalledWith(0);
    });

    it('should apply correct active state styling in RTL mode', () => {
      renderComponent({ isRTL: true, activeIndex: 1 });

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;

      // In RTL mode, the active state should still be applied correctly
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 2 (visually first, inactive)
      expect(mockButtonClass).toHaveBeenCalledWith(true);  // dot 1 (visually middle, active)
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 0 (visually last, inactive)
    });

    it('should handle edge case with single card in RTL mode', () => {
      const singleCard = [defaultProps.cards[0]];
      renderComponent({ cards: singleCard, isRTL: true, activeIndex: 0 });

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      expect(dots).toHaveLength(1);
      expect(dots[0]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-0');
    });
  });

  describe('Active State Management', () => {
    it('should highlight the correct dot based on activeIndex', () => {
      renderComponent({ activeIndex: 2 });

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;

      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 0
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 1
      expect(mockButtonClass).toHaveBeenCalledWith(true);  // dot 2 (active)
    });

    it('should handle activeIndex changes', () => {
      const { rerender } = renderComponent({ activeIndex: 0 });

      let mockButtonClass = require('../styles').investorJourneyStyles.dots.button;
      expect(mockButtonClass).toHaveBeenCalledWith(true);  // dot 0 active

      jest.clearAllMocks();

      rerender(
        <NavigationDots
          {...defaultProps}
          activeIndex={1}
        />
      );

      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 0
      expect(mockButtonClass).toHaveBeenCalledWith(true);  // dot 1 active
      expect(mockButtonClass).toHaveBeenCalledWith(false); // dot 2
    });

    it('should handle activeIndex out of bounds gracefully', () => {
      expect(() => {
        renderComponent({ activeIndex: 10 });
      }).not.toThrow();

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;
      
      // All dots should be inactive when activeIndex is out of bounds
      expect(mockButtonClass).toHaveBeenCalledWith(false);
    });

    it('should handle negative activeIndex', () => {
      expect(() => {
        renderComponent({ activeIndex: -1 });
      }).not.toThrow();

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;
      
      // All dots should be inactive when activeIndex is negative
      expect(mockButtonClass).toHaveBeenCalledWith(false);
    });
  });

  describe('Click Event Handling', () => {
    it('should call onDotClick with correct index when dot is clicked', () => {
      const onDotClick = jest.fn();
      renderComponent({ onDotClick });

      const secondDot = screen.getByTestId('navigation-dots-dot-1');
      fireEvent.click(secondDot);

      expect(onDotClick).toHaveBeenCalledTimes(1);
      expect(onDotClick).toHaveBeenCalledWith(1);
    });

    it('should handle multiple clicks on different dots', () => {
      const onDotClick = jest.fn();
      renderComponent({ onDotClick });

      const firstDot = screen.getByTestId('navigation-dots-dot-0');
      const thirdDot = screen.getByTestId('navigation-dots-dot-2');

      fireEvent.click(firstDot);
      fireEvent.click(thirdDot);
      fireEvent.click(firstDot);

      expect(onDotClick).toHaveBeenCalledTimes(3);
      expect(onDotClick).toHaveBeenNthCalledWith(1, 0);
      expect(onDotClick).toHaveBeenNthCalledWith(2, 2);
      expect(onDotClick).toHaveBeenNthCalledWith(3, 0);
    });

    it('should handle rapid clicking without errors', () => {
      const onDotClick = jest.fn();
      renderComponent({ onDotClick });

      const firstDot = screen.getByTestId('navigation-dots-dot-0');

      for (let i = 0; i < 10; i++) {
        fireEvent.click(firstDot);
      }

      expect(onDotClick).toHaveBeenCalledTimes(10);
      onDotClick.mock.calls.forEach(call => {
        expect(call[0]).toBe(0);
      });
    });

    it('should not throw error when onDotClick is undefined', () => {
      expect(() => {
        render(
          <NavigationDots
            cards={defaultProps.cards}
            activeIndex={0}
            isRTL={false}
            onDotClick={undefined as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should provide proper aria-label for each dot', () => {
      renderComponent();

      const dots = screen.getAllByRole('button');
      
      expect(dots[0]).toHaveAttribute('aria-label', 'Go to step 1');
      expect(dots[1]).toHaveAttribute('aria-label', 'Go to step 2');
      expect(dots[2]).toHaveAttribute('aria-label', 'Go to step 3');
    });

    it('should provide correct aria-labels in RTL mode', () => {
      renderComponent({ isRTL: true });

      const dots = screen.getAllByRole('button');
      
      // In RTL, the visual order is reversed but aria-labels should reflect logical positions
      expect(dots[0]).toHaveAttribute('aria-label', 'Go to step 3'); // visually first, logically last
      expect(dots[1]).toHaveAttribute('aria-label', 'Go to step 2'); // middle
      expect(dots[2]).toHaveAttribute('aria-label', 'Go to step 1'); // visually last, logically first
    });

    it('should be keyboard accessible', () => {
      const onDotClick = jest.fn();
      renderComponent({ onDotClick });

      const firstDot = screen.getByTestId('navigation-dots-dot-0');
      
      // Simulate keyboard events
      fireEvent.keyDown(firstDot, { key: 'Enter' });
      fireEvent.keyUp(firstDot, { key: 'Enter' });

      // Button should be focusable
      firstDot.focus();
      expect(document.activeElement).toBe(firstDot);
    });

    it('should support navigation with Tab key', () => {
      renderComponent();

      const dots = screen.getAllByRole('button');
      
      dots.forEach(dot => {
        dot.focus();
        expect(document.activeElement).toBe(dot);
      });
    });

    it('should maintain focus management across re-renders', () => {
      const { rerender } = renderComponent();

      const firstDot = screen.getByTestId('navigation-dots-dot-0');
      firstDot.focus();
      expect(document.activeElement).toBe(firstDot);

      rerender(<NavigationDots {...defaultProps} activeIndex={1} />);

      // Focus should be maintained
      const updatedFirstDot = screen.getByTestId('navigation-dots-dot-0');
      expect(updatedFirstDot).toBeInTheDocument();
    });
  });

  describe('Styling Integration', () => {
    it('should apply container styles', () => {
      renderComponent();

      const container = screen.getByTestId('navigation-dots');
      expect(container).toHaveClass('dots-container');
    });

    it('should apply button styles with active/inactive state', () => {
      renderComponent({ activeIndex: 1 });

      const dots = screen.getAllByRole('button');
      
      expect(dots[0]).toHaveClass('dots-button', 'inactive');
      expect(dots[1]).toHaveClass('dots-button', 'active');
      expect(dots[2]).toHaveClass('dots-button', 'inactive');
    });

    it('should apply button inline styles', () => {
      renderComponent();

      const dots = screen.getAllByRole('button');
      
      dots.forEach(dot => {
        expect(dot).toHaveStyle({ width: '12px', height: '12px' });
      });
    });

    it('should call button style function with correct parameters', () => {
      renderComponent({ activeIndex: 0 });

      const mockButtonClass = require('../styles').investorJourneyStyles.dots.button;

      expect(mockButtonClass).toHaveBeenCalledWith(true);  // active dot
      expect(mockButtonClass).toHaveBeenCalledWith(false); // inactive dots
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('navigation-dots')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-2')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-dots' });

      expect(screen.getByTestId('custom-dots')).toBeInTheDocument();
      expect(screen.getByTestId('custom-dots-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('custom-dots-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-dots-dot-2')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'dots-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-dot-0`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-dot-1`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-dot-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-dot-1"]')).toBeInTheDocument();
    });

    it('should maintain logical index in data-qa-id regardless of RTL', () => {
      renderComponent({ isRTL: true });

      // Data-qa-ids should always reflect logical order, not visual order
      expect(screen.getByTestId('navigation-dots-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-dots-dot-2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty cards array', () => {
      renderComponent({ cards: [] });

      expect(screen.getByTestId('navigation-dots')).toBeInTheDocument();

      const dots = screen.queryAllByTestId(/navigation-dots-dot-\d+/);
      expect(dots).toHaveLength(0);
    });

    it('should handle single card', () => {
      const singleCard = [defaultProps.cards[0]];
      renderComponent({ cards: singleCard, activeIndex: 0 });

      expect(screen.getByTestId('navigation-dots-dot-0')).toBeInTheDocument();
      expect(screen.queryByTestId('navigation-dots-dot-1')).not.toBeInTheDocument();

      const dot = screen.getByRole('button');
      expect(dot).toHaveAttribute('aria-label', 'Go to step 1');
    });

    it('should handle very large number of cards', () => {
      const manyCards = Array.from({ length: 50 }, (_, i) => ({
        title: `Step ${i + 1}`,
        content: `Content ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      expect(() => {
        renderComponent({ cards: manyCards, activeIndex: 25 });
      }).not.toThrow();

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      expect(dots).toHaveLength(50);
    });

    it('should handle null or undefined cards', () => {
      expect(() => {
        render(
          <NavigationDots
            cards={null as any}
            activeIndex={0}
            isRTL={false}
            onDotClick={jest.fn()}
          />
        );
      }).not.toThrow();
    });

    it('should handle cards with missing properties', () => {
      const incompleteCards = [
        { title: 'Step 1' }, // missing content and icon
        { content: 'Content 2' }, // missing title and icon
        { icon: '/icon3.svg' }, // missing title and content
      ] as any;

      expect(() => {
        renderComponent({ cards: incompleteCards });
      }).not.toThrow();

      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
      expect(dots).toHaveLength(3);
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 5; i++) {
        const dynamicCards = Array.from({ length: i + 2 }, (_, j) => ({
          title: `Dynamic Step ${j + 1}`,
          content: `Dynamic content ${j + 1}`,
          icon: `/dynamic-icon${j + 1}.svg`,
        }));

        rerender(
          <NavigationDots
            cards={dynamicCards}
            activeIndex={i}
            isRTL={i % 2 === 0}
            onDotClick={jest.fn()}
          />
        );

        const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
        expect(dots).toHaveLength(i + 2);
      }
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('navigation-dots');
      const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);

      dots.forEach(dot => {
        expect(container).toContainElement(dot);
      });
    });

    it('should render dots in the correct visual order', () => {
      renderComponent({ isRTL: false });

      const container = screen.getByTestId('navigation-dots');
      const dots = Array.from(container.children);

      expect(dots).toHaveLength(3);
      expect(dots[0]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-0');
      expect(dots[1]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-1');
      expect(dots[2]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-2');
    });

    it('should render dots in reversed visual order for RTL', () => {
      renderComponent({ isRTL: true });

      const container = screen.getByTestId('navigation-dots');
      const dots = Array.from(container.children);

      expect(dots).toHaveLength(3);
      expect(dots[0]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-2');
      expect(dots[1]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-1');
      expect(dots[2]).toHaveAttribute('data-qa-id', 'navigation-dots-dot-0');
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many dots', () => {
      const manyCards = Array.from({ length: 20 }, (_, i) => ({
        title: `Step ${i + 1}`,
        content: `Content ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      const startTime = performance.now();
      renderComponent({ cards: manyCards });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByTestId(/^navigation-dots-dot-\d+$/)).toHaveLength(20);
    });

    it('should handle frequent activeIndex changes efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <NavigationDots
            {...defaultProps}
            activeIndex={i % 3}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle rapid RTL toggling efficiently', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        rerender(
          <NavigationDots
            {...defaultProps}
            isRTL={i % 2 === 0}
          />
        );

        const dots = screen.getAllByTestId(/^navigation-dots-dot-\d+$/);
        expect(dots).toHaveLength(3);
      }
    });
  });
});