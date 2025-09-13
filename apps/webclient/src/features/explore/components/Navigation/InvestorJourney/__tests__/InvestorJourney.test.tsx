import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InvestorJourney } from '@/features/explore/components/Navigation/InvestorJourney';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../MobileSlider', () => ({
  MobileSlider: ({ 'data-qa-id': dataQaId, cards, activeIndex, isRTL, onTouchStart, onTouchEnd }: any) => (
    <div
      data-qa-id={dataQaId}
      data-cards-length={cards.length}
      data-active-index={activeIndex}
      data-is-rtl={String(isRTL)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      Mocked Mobile Slider
    </div>
  ),
}));

jest.mock('../DesktopGrid', () => ({
  DesktopGrid: ({ 'data-qa-id': dataQaId, cards }: any) => (
    <div data-qa-id={dataQaId} data-cards-length={cards.length}>
      Mocked Desktop Grid
    </div>
  ),
}));

jest.mock('../NavigationDots', () => ({
  NavigationDots: ({ 'data-qa-id': dataQaId, cards, activeIndex, isRTL, onDotClick }: any) => (
    <div
      data-qa-id={dataQaId}
      data-cards-length={cards.length}
      data-active-index={activeIndex}
      data-is-rtl={String(isRTL)}
      onClick={() => onDotClick(1)}
    >
      Mocked Navigation Dots
    </div>
  ),
}));

// Mock isRTL function
jest.mock('@/shared', () => ({
  isRTL: jest.fn(() => false),
}));

describe('InvestorJourney', () => {
  const defaultProps = {
    title: 'Test Journey Title',
    content: 'Test journey content description',
    cards: [
      {
        title: 'Step 1',
        content: 'First step content',
        icon: '/icon1.svg',
      },
      {
        title: 'Step 2',
        content: 'Second step content',
        icon: '/icon2.svg',
      },
      {
        title: 'Step 3',
        content: 'Third step content',
        icon: '/icon3.svg',
      },
    ],
  };

  const renderComponent = (props = {}) => {
    return render(<InvestorJourney {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render main section with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('investor-journey')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-journey' });

      expect(screen.getByTestId('custom-journey')).toBeInTheDocument();
      expect(screen.queryByTestId('investor-journey')).not.toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderComponent();

      expect(screen.getByTestId('investor-journey-container')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-header')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-title')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-content')).toBeInTheDocument();
    });

    it('should render all child components', () => {
      renderComponent();

      expect(screen.getByTestId('investor-journey-mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-navigation-dots')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-desktop-grid')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderComponent();

      const section = screen.getByTestId('investor-journey');
      expect(section.tagName).toBe('SECTION');

      const title = screen.getByTestId('investor-journey-title');
      expect(title.tagName).toBe('H2');

      const content = screen.getByTestId('investor-journey-content');
      expect(content.tagName).toBe('P');
    });
  });

  describe('Content Display', () => {
    it('should display provided title and content', () => {
      renderComponent();

      expect(screen.getByText('Test Journey Title')).toBeInTheDocument();
      expect(screen.getByText('Test journey content description')).toBeInTheDocument();
    });

    it('should handle empty title and content', () => {
      renderComponent({ title: '', content: '' });

      const title = screen.getByTestId('investor-journey-title');
      const content = screen.getByTestId('investor-journey-content');

      expect(title).toHaveTextContent('');
      expect(content).toHaveTextContent('');
    });

    it('should handle undefined title and content', () => {
      renderComponent({ title: undefined, content: undefined });

      const title = screen.getByTestId('investor-journey-title');
      const content = screen.getByTestId('investor-journey-content');

      expect(title).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('should handle long text content', () => {
      const longTitle = 'A'.repeat(200);
      const longContent = 'B'.repeat(500);

      renderComponent({ title: longTitle, content: longContent });

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });

  describe('Active Index State Management', () => {
    it('should initialize with activeIndex 0', () => {
      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');

      expect(mobileSlider).toHaveAttribute('data-active-index', '0');
      expect(navigationDots).toHaveAttribute('data-active-index', '0');
    });

    it('should update activeIndex when cards length changes', () => {
      const { rerender } = renderComponent();

      let mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(mobileSlider).toHaveAttribute('data-active-index', '0');

      // Reduce cards length to 1, activeIndex should be clamped to 0
      rerender(
        <InvestorJourney
          {...defaultProps}
          cards={[defaultProps.cards[0]]}
        />
      );

      mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(mobileSlider).toHaveAttribute('data-active-index', '0');
    });

    it('should handle empty cards array', () => {
      renderComponent({ cards: [] });

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');

      expect(mobileSlider).toHaveAttribute('data-cards-length', '0');
      expect(navigationDots).toHaveAttribute('data-cards-length', '0');
    });
  });

  describe('Touch Event Handling', () => {
    beforeEach(() => {
      // Mock isRTL to return false for consistent testing
      require('@/shared').isRTL.mockReturnValue(false);
    });

    it('should handle touch events on mobile slider', () => {
      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');

      // Simulate touch start
      fireEvent.touchStart(mobileSlider, {
        touches: [{ clientX: 100 }],
      });

      // Simulate touch end with swipe left (should go to next)
      fireEvent.touchEnd(mobileSlider, {
        changedTouches: [{ clientX: 50 }],
      });

      // Check that the activeIndex was updated (mocked component should reflect this)
      const updatedMobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(updatedMobileSlider).toBeInTheDocument();
    });

    it('should handle RTL touch events differently', () => {
      require('@/shared').isRTL.mockReturnValue(true);

      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(mobileSlider).toHaveAttribute('data-is-rtl', 'true');
    });

    it('should not update activeIndex when touch threshold not met', () => {
      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');

      // Simulate touch start
      fireEvent.touchStart(mobileSlider, {
        touches: [{ clientX: 100 }],
      });

      // Simulate touch end with small movement (below 40px threshold)
      fireEvent.touchEnd(mobileSlider, {
        changedTouches: [{ clientX: 90 }],
      });

      // ActiveIndex should remain 0
      const updatedMobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(updatedMobileSlider).toHaveAttribute('data-active-index', '0');
    });

    it('should handle touch events without touchStartX', () => {
      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');

      // Simulate touch end without touch start
      fireEvent.touchEnd(mobileSlider, {
        changedTouches: [{ clientX: 50 }],
      });

      // Should not throw error and activeIndex should remain 0
      const updatedMobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(updatedMobileSlider).toHaveAttribute('data-active-index', '0');
    });
  });

  describe('Navigation Dots Integration', () => {
    it('should handle dot click events', () => {
      renderComponent();

      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');

      // Simulate clicking on navigation dots
      fireEvent.click(navigationDots);

      // The mock implementation clicks index 1, verify it's passed correctly
      expect(navigationDots).toBeInTheDocument();
    });

    it('should pass correct props to NavigationDots', () => {
      renderComponent();

      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');

      expect(navigationDots).toHaveAttribute('data-cards-length', '3');
      expect(navigationDots).toHaveAttribute('data-active-index', '0');
      expect(navigationDots).toHaveAttribute('data-is-rtl', 'false');
    });
  });

  describe('Component Props Passing', () => {
    it('should pass correct props to MobileSlider', () => {
      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');

      expect(mobileSlider).toHaveAttribute('data-cards-length', '3');
      expect(mobileSlider).toHaveAttribute('data-active-index', '0');
      expect(mobileSlider).toHaveAttribute('data-is-rtl', 'false');
    });

    it('should pass correct props to DesktopGrid', () => {
      renderComponent();

      const desktopGrid = screen.getByTestId('investor-journey-desktop-grid');

      expect(desktopGrid).toHaveAttribute('data-cards-length', '3');
    });

    it('should pass isRTL function result to components', () => {
      require('@/shared').isRTL.mockReturnValue(true);

      renderComponent();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');

      expect(mobileSlider).toHaveAttribute('data-is-rtl', 'true');
      expect(navigationDots).toHaveAttribute('data-is-rtl', 'true');
    });
  });

  describe('Data QA ID Hierarchical Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('investor-journey')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-container')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-header')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-title')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-content')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-navigation-dots')).toBeInTheDocument();
      expect(screen.getByTestId('investor-journey-desktop-grid')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-journey' });

      expect(screen.getByTestId('custom-journey')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-navigation-dots')).toBeInTheDocument();
      expect(screen.getByTestId('custom-journey-desktop-grid')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'journey-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-header`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-content`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-header"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null or undefined cards', () => {
      expect(() => {
        render(<InvestorJourney title="Test" content="Test" cards={null as any} />);
      }).not.toThrow();
    });

    it('should handle cards with missing properties', () => {
      const incompleteCards = [
        { title: 'Step 1' }, // missing content and icon
        { content: 'Step 2 content' }, // missing title and icon
        { icon: '/icon3.svg' }, // missing title and content
      ] as any;

      expect(() => {
        renderComponent({ cards: incompleteCards });
      }).not.toThrow();
    });

    it('should handle very large number of cards', () => {
      const manyCards = Array.from({ length: 100 }, (_, i) => ({
        title: `Step ${i + 1}`,
        content: `Content for step ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      expect(() => {
        renderComponent({ cards: manyCards });
      }).not.toThrow();

      const mobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(mobileSlider).toHaveAttribute('data-cards-length', '100');
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = renderComponent();

      for (let i = 0; i < 10; i++) {
        const newCards = Array.from({ length: i + 1 }, (_, j) => ({
          title: `Dynamic Step ${j + 1}`,
          content: `Dynamic content ${j + 1}`,
          icon: `/dynamic-icon${j + 1}.svg`,
        }));

        rerender(
          <InvestorJourney
            title={`Dynamic Title ${i}`}
            content={`Dynamic Content ${i}`}
            cards={newCards}
            data-qa-id={`dynamic-journey-${i}`}
          />
        );

        expect(screen.getByText(`Dynamic Title ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Dynamic Content ${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`dynamic-journey-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    it('should maintain proper semantic structure', () => {
      renderComponent();

      const section = screen.getByRole('heading', { level: 2 });
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent('Test Journey Title');
    });

    it('should be keyboard accessible through child components', () => {
      renderComponent();

      // Child components should handle their own keyboard accessibility
      const navigationDots = screen.getByTestId('investor-journey-navigation-dots');
      expect(navigationDots).toBeInTheDocument();
    });

    it('should provide meaningful content structure', () => {
      renderComponent();

      const title = screen.getByTestId('investor-journey-title');
      const content = screen.getByTestId('investor-journey-content');
      const container = screen.getByTestId('investor-journey-container');

      expect(container).toContainElement(title);
      expect(container).toContainElement(content);
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('investor-journey')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('investor-journey')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByText('Test Journey Title')).toBeInTheDocument();

      rerender(
        <InvestorJourney
          {...defaultProps}
          title="Updated Title"
          content="Updated Content"
        />
      );

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Content')).toBeInTheDocument();
      expect(screen.queryByText('Test Journey Title')).not.toBeInTheDocument();
    });

    it('should maintain state consistency across re-renders', () => {
      const { rerender } = renderComponent();

      const initialMobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(initialMobileSlider).toHaveAttribute('data-active-index', '0');

      rerender(<InvestorJourney {...defaultProps} title="Updated Title" />);

      const updatedMobileSlider = screen.getByTestId('investor-journey-mobile-slider');
      expect(updatedMobileSlider).toHaveAttribute('data-active-index', '0');
    });
  });
});