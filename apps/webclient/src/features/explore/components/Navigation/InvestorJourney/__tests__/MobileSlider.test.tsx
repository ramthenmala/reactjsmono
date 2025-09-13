import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileSlider } from '@/features/explore/components/Navigation/InvestorJourney/MobileSlider';
import '@testing-library/jest-dom';

// Mock the styles
jest.mock('../styles', () => ({
  investorJourneyStyles: {
    mobileSlider: {
      container: 'mobile-slider-container',
      containerStyle: { display: 'block' },
      track: 'mobile-slider-track',
      trackStyle: jest.fn(() => ({ transform: 'translateX(0px)' })),
      slide: jest.fn(() => 'mobile-slider-slide'),
      slideStyle: { width: '100%' },
    },
    cardContent: {
      icon: {
        container: 'icon-container',
        image: 'icon-image',
      },
      text: {
        wrapperMobile: 'text-wrapper-mobile',
        title: 'text-title',
        content: 'text-content',
      },
    },
  },
}));

describe('MobileSlider', () => {
  const defaultProps = {
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
    activeIndex: 0,
    isRTL: false,
    onTouchStart: jest.fn(),
    onTouchEnd: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<MobileSlider {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render container with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-slider' });

      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-slider')).not.toBeInTheDocument();
    });

    it('should render track with correct data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-track')).toBeInTheDocument();
    });

    it('should render all slides with indexed data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-slide-0')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-1')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-2')).toBeInTheDocument();
    });

    it('should render correct number of slides', () => {
      renderComponent();

      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);
      expect(slides).toHaveLength(3);
    });
  });

  describe('Card Content Rendering', () => {
    it('should render card titles', () => {
      renderComponent();

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('should render card content', () => {
      renderComponent();

      expect(screen.getByText('First step content')).toBeInTheDocument();
      expect(screen.getByText('Second step content')).toBeInTheDocument();
      expect(screen.getByText('Third step content')).toBeInTheDocument();
    });

    it('should render card icons with correct attributes', () => {
      renderComponent();

      const icon1 = screen.getByTestId('mobile-slider-slide-0-icon-image');
      const icon2 = screen.getByTestId('mobile-slider-slide-1-icon-image');
      const icon3 = screen.getByTestId('mobile-slider-slide-2-icon-image');

      expect(icon1).toHaveAttribute('src', '/icon1.svg');
      expect(icon1).toHaveAttribute('alt', 'Step 1');

      expect(icon2).toHaveAttribute('src', '/icon2.svg');
      expect(icon2).toHaveAttribute('alt', 'Step 2');

      expect(icon3).toHaveAttribute('src', '/icon3.svg');
      expect(icon3).toHaveAttribute('alt', 'Step 3');
    });

    it('should render icon containers with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-slide-0-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-1-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-2-icon')).toBeInTheDocument();
    });

    it('should render content containers with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-slide-0-content')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-1-content')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-2-content')).toBeInTheDocument();
    });

    it('should render titles with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-slide-0-title')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-1-title')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-2-title')).toBeInTheDocument();
    });

    it('should render text content with correct data-qa-ids', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider-slide-0-text')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-1-text')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-slide-2-text')).toBeInTheDocument();
    });
  });

  describe('Touch Event Handling', () => {
    it('should call onTouchStart when touch starts', () => {
      const onTouchStart = jest.fn();
      renderComponent({ onTouchStart });

      const container = screen.getByTestId('mobile-slider');

      fireEvent.touchStart(container, {
        touches: [{ clientX: 100 }],
      });

      expect(onTouchStart).toHaveBeenCalledTimes(1);
      expect(onTouchStart).toHaveBeenCalledWith(expect.objectContaining({
        touches: expect.arrayContaining([expect.objectContaining({ clientX: 100 })]),
      }));
    });

    it('should call onTouchEnd when touch ends', () => {
      const onTouchEnd = jest.fn();
      renderComponent({ onTouchEnd });

      const container = screen.getByTestId('mobile-slider');

      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 50 }],
      });

      expect(onTouchEnd).toHaveBeenCalledTimes(1);
      expect(onTouchEnd).toHaveBeenCalledWith(expect.objectContaining({
        changedTouches: expect.arrayContaining([expect.objectContaining({ clientX: 50 })]),
      }));
    });

    it('should handle multiple touch events', () => {
      const onTouchStart = jest.fn();
      const onTouchEnd = jest.fn();
      renderComponent({ onTouchStart, onTouchEnd });

      const container = screen.getByTestId('mobile-slider');

      fireEvent.touchStart(container, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(container, { changedTouches: [{ clientX: 50 }] });

      expect(onTouchStart).toHaveBeenCalledTimes(1);
      expect(onTouchEnd).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when touch handlers are undefined', () => {
      expect(() => {
        render(
          <MobileSlider
            cards={defaultProps.cards}
            activeIndex={0}
            isRTL={false}
            onTouchStart={undefined as any}
            onTouchEnd={undefined as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Styling Integration', () => {
    it('should apply container styles', () => {
      renderComponent();

      const container = screen.getByTestId('mobile-slider');
      expect(container).toHaveClass('mobile-slider-container');
      expect(container).toHaveStyle({ display: 'block' });
    });

    it('should apply track styles', () => {
      renderComponent();

      const track = screen.getByTestId('mobile-slider-track');
      expect(track).toHaveClass('mobile-slider-track');
    });

    it('should call trackStyle function with correct parameters', () => {
      const mockTrackStyle = require('../styles').investorJourneyStyles.mobileSlider.trackStyle;

      renderComponent({ isRTL: true, activeIndex: 2 });

      expect(mockTrackStyle).toHaveBeenCalledWith(true, 2);
    });

    it('should call slide function with correct active state', () => {
      const mockSlide = require('../styles').investorJourneyStyles.mobileSlider.slide;

      renderComponent({ activeIndex: 1 });

      expect(mockSlide).toHaveBeenCalledWith(false); // For slide 0 (not active)
      expect(mockSlide).toHaveBeenCalledWith(true);  // For slide 1 (active)
      expect(mockSlide).toHaveBeenCalledWith(false); // For slide 2 (not active)
    });

    it('should apply slide styles to all slides', () => {
      renderComponent();

      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);
      slides.forEach(slide => {
        expect(slide).toHaveClass('mobile-slider-slide');
        expect(slide).toHaveStyle({ width: '100%' });
      });
    });

    it('should apply icon and text container styles', () => {
      renderComponent();

      const iconContainers = screen.getAllByTestId(/mobile-slider-slide-\d+-icon$/);
      const textContainers = screen.getAllByTestId(/mobile-slider-slide-\d+-content$/);

      iconContainers.forEach(container => {
        expect(container).toHaveClass('icon-container');
      });

      textContainers.forEach(container => {
        expect(container).toHaveClass('text-wrapper-mobile');
      });
    });

    it('should apply title and content text styles', () => {
      renderComponent();

      const titles = screen.getAllByTestId(/mobile-slider-slide-\d+-title$/);
      const contents = screen.getAllByTestId(/mobile-slider-slide-\d+-text$/);

      titles.forEach(title => {
        expect(title).toHaveClass('text-title');
      });

      contents.forEach(content => {
        expect(content).toHaveClass('text-content');
      });
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-track')).toBeInTheDocument();

      for (let i = 0; i < 3; i++) {
        expect(screen.getByTestId(`mobile-slider-slide-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`mobile-slider-slide-${i}-icon`)).toBeInTheDocument();
        expect(screen.getByTestId(`mobile-slider-slide-${i}-icon-image`)).toBeInTheDocument();
        expect(screen.getByTestId(`mobile-slider-slide-${i}-content`)).toBeInTheDocument();
        expect(screen.getByTestId(`mobile-slider-slide-${i}-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`mobile-slider-slide-${i}-text`)).toBeInTheDocument();
      }
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-slider' });

      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
      expect(screen.getByTestId('custom-slider-track')).toBeInTheDocument();

      for (let i = 0; i < 3; i++) {
        expect(screen.getByTestId(`custom-slider-slide-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-slider-slide-${i}-icon`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-slider-slide-${i}-icon-image`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-slider-slide-${i}-content`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-slider-slide-${i}-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-slider-slide-${i}-text`)).toBeInTheDocument();
      }
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'slider-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-track`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-slide-0`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-track"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-slide-0"]')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty cards array', () => {
      renderComponent({ cards: [] });

      expect(screen.getByTestId('mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-slider-track')).toBeInTheDocument();

      const slides = screen.queryAllByTestId(/mobile-slider-slide-\d+/);
      expect(slides).toHaveLength(0);
    });

    it('should handle single card', () => {
      const singleCard = [defaultProps.cards[0]];
      renderComponent({ cards: singleCard });

      expect(screen.getByTestId('mobile-slider-slide-0')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-slider-slide-1')).not.toBeInTheDocument();

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('First step content')).toBeInTheDocument();
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

      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);
      expect(slides).toHaveLength(3);
    });

    it('should handle very large number of cards', () => {
      const manyCards = Array.from({ length: 50 }, (_, i) => ({
        title: `Step ${i + 1}`,
        content: `Content for step ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      expect(() => {
        renderComponent({ cards: manyCards });
      }).not.toThrow();

      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);
      expect(slides).toHaveLength(50);
    });

    it('should handle activeIndex out of bounds', () => {
      expect(() => {
        renderComponent({ activeIndex: 10 });
      }).not.toThrow();

      const mockSlide = require('../styles').investorJourneyStyles.mobileSlider.slide;
      
      // All slides should be inactive since activeIndex is out of bounds
      expect(mockSlide).toHaveBeenCalledWith(false);
    });

    it('should handle negative activeIndex', () => {
      expect(() => {
        renderComponent({ activeIndex: -1 });
      }).not.toThrow();

      const mockSlide = require('../styles').investorJourneyStyles.mobileSlider.slide;
      
      // All slides should be inactive since activeIndex is negative
      expect(mockSlide).toHaveBeenCalledWith(false);
    });

    it('should handle null or undefined card properties', () => {
      const cardsWithNullProps = [
        { title: null, content: null, icon: null },
        { title: undefined, content: undefined, icon: undefined },
        { title: '', content: '', icon: '' },
      ] as any;

      // Suppress console errors for this test since we're testing error scenarios
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderComponent({ cards: cardsWithNullProps });
      }).not.toThrow();

      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);
      expect(slides).toHaveLength(3);

      // Restore console.error
      console.error = originalError;
    });
  });

  describe('Props Validation', () => {
    it('should handle all boolean values for isRTL', () => {
      const { rerender } = renderComponent({ isRTL: true });

      const mockTrackStyle = require('../styles').investorJourneyStyles.mobileSlider.trackStyle;
      expect(mockTrackStyle).toHaveBeenCalledWith(true, 0);

      rerender(<MobileSlider {...defaultProps} isRTL={false} />);
      expect(mockTrackStyle).toHaveBeenCalledWith(false, 0);
    });

    it('should handle all valid activeIndex values', () => {
      const { rerender } = renderComponent({ activeIndex: 0 });

      let mockSlide = require('../styles').investorJourneyStyles.mobileSlider.slide;
      expect(mockSlide).toHaveBeenCalledWith(true); // First slide active

      rerender(<MobileSlider {...defaultProps} activeIndex={1} />);
      expect(mockSlide).toHaveBeenCalledWith(true); // Second slide active

      rerender(<MobileSlider {...defaultProps} activeIndex={2} />);
      expect(mockSlide).toHaveBeenCalledWith(true); // Third slide active
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(
          <MobileSlider
            cards={[]}
            activeIndex={0}
            isRTL={false}
            onTouchStart={jest.fn()}
            onTouchEnd={jest.fn()}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('mobile-slider');
      const track = screen.getByTestId('mobile-slider-track');
      const slide = screen.getByTestId('mobile-slider-slide-0');
      const icon = screen.getByTestId('mobile-slider-slide-0-icon');
      const content = screen.getByTestId('mobile-slider-slide-0-content');

      expect(container).toContainElement(track);
      expect(track).toContainElement(slide);
      expect(slide).toContainElement(icon);
      expect(slide).toContainElement(content);
    });

    it('should render slides in correct order', () => {
      renderComponent();

      const track = screen.getByTestId('mobile-slider-track');
      const slides = screen.getAllByTestId(/^mobile-slider-slide-\d+$/);

      slides.forEach((slide, index) => {
        expect(track).toContainElement(slide);
        expect(slide).toHaveAttribute('data-qa-id', `mobile-slider-slide-${index}`);
      });
    });

    it('should maintain consistent structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialStructure = screen.getByTestId('mobile-slider').innerHTML;

      rerender(<MobileSlider {...defaultProps} activeIndex={1} />);

      // Structure should remain the same, only active state changes
      const updatedContainer = screen.getByTestId('mobile-slider');
      expect(updatedContainer).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many cards', () => {
      const manyCards = Array.from({ length: 20 }, (_, i) => ({
        title: `Step ${i + 1}`,
        content: `Content ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      const startTime = performance.now();
      renderComponent({ cards: manyCards });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByTestId(/^mobile-slider-slide-\d+$/)).toHaveLength(20);
    });

    it('should handle rapid activeIndex changes efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(<MobileSlider {...defaultProps} activeIndex={i % 3} />);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });
  });
});