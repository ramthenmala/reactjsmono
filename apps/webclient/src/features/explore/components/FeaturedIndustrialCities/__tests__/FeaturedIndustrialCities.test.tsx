'use client';

import { render, screen, fireEvent, act } from '@testing-library/react';
import { FeaturedIndustrialCities } from '../index';
import { featuredCitiesStyles } from '../styles';
import { PropertyCard } from '@/features/explore/components/Property/PropertyCard';
import { useCurrentLocale } from '@/router';
import { featuredData } from '@/features/explore/data/exploreLandingData';

// Mock dependencies
jest.mock('@/router', () => ({
  useCurrentLocale: jest.fn(),
}));

jest.mock('@/features/explore/components/Property/PropertyCard', () => ({
  PropertyCard: jest.fn(({ property }) => (
    <div data-testid={`property-card-${property.id}`}>
      Property Card for {property.id}
    </div>
  )),
}));

jest.mock('@/features/explore/data/exploreLandingData', () => ({
  featuredData: {
    en: [
      { id: 'property-1', title: 'Property 1' },
      { id: 'property-2', title: 'Property 2' },
      { id: 'property-3', title: 'Property 3' },
    ],
    ar: [
      { id: 'property-ar-1', title: 'خاصية 1' },
      { id: 'property-ar-2', title: 'خاصية 2' },
      { id: 'property-ar-3', title: 'خاصية 3' },
    ],
  },
}));

jest.mock('../styles', () => ({
  featuredCitiesStyles: {
    section: {
      base: 'mocked-section-base',
      style: { background: 'mocked-background' },
    },
    backgroundPattern: {
      container: 'mocked-background-container',
      style: { transform: 'mocked-transform' },
      image: { objectFit: 'contain' },
    },
    content: {
      wrapper: 'mocked-content-wrapper',
      header: {
        container: 'mocked-header-container',
        title: 'mocked-title-class',
        subtitle: 'mocked-subtitle-class',
      },
    },
    mobileSlider: {
      container: 'mocked-mobile-container',
      containerStyle: { touchAction: 'pan-x' },
      track: jest.fn(() => 'mocked-track-class'),
      trackStyle: jest.fn(() => ({ transform: 'translateX(0%)' })),
      slide: jest.fn(() => ({ minWidth: '100%' })),
    },
    dots: {
      container: 'mocked-dots-container',
      button: jest.fn(() => 'mocked-dot-button'),
      buttonStyle: { cursor: 'pointer' },
    },
    desktopGrid: 'mocked-desktop-grid',
  },
}));

const mockUseCurrentLocale = useCurrentLocale as jest.MockedFunction<typeof useCurrentLocale>;

describe('FeaturedIndustrialCities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentLocale.mockReturnValue('en');
  });

  const defaultProps = {
    title: 'Featured Industrial Cities',
    subtitle: 'Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.',
  };

  const renderComponent = (props = {}) => {
    return render(<FeaturedIndustrialCities {...defaultProps} {...props} />);
  };

  describe('Component Rendering', () => {
    it('should render featured industrial cities component with all elements', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-content')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-header')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-desktop-grid')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities')).toHaveAttribute('data-qa-id', 'featured-industrial-cities');
      expect(screen.getByTestId('featured-industrial-cities-background-pattern')).toHaveAttribute('data-qa-id', 'featured-industrial-cities-background-pattern');
      expect(screen.getByTestId('featured-industrial-cities-background-image')).toHaveAttribute('data-qa-id', 'featured-industrial-cities-background-image');
      expect(screen.getByTestId('featured-industrial-cities-title')).toHaveAttribute('data-qa-id', 'featured-industrial-cities-title');
      expect(screen.getByTestId('featured-industrial-cities-subtitle')).toHaveAttribute('data-qa-id', 'featured-industrial-cities-subtitle');
    });

    it('should render as section element', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      expect(section.tagName).toBe('SECTION');
    });
  });

  describe('Content Display', () => {
    it('should display default title and subtitle', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities-title')).toHaveTextContent('Featured Industrial Cities');
      expect(screen.getByTestId('featured-industrial-cities-subtitle')).toHaveTextContent('Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.');
    });

    it('should display custom title and subtitle when provided', () => {
      const customProps = {
        title: 'Custom Industrial Cities',
        subtitle: 'Custom subtitle text',
      };
      renderComponent(customProps);
      
      expect(screen.getByTestId('featured-industrial-cities-title')).toHaveTextContent('Custom Industrial Cities');
      expect(screen.getByTestId('featured-industrial-cities-subtitle')).toHaveTextContent('Custom subtitle text');
    });

    it('should render title as h2 element', () => {
      renderComponent();
      
      const title = screen.getByTestId('featured-industrial-cities-title');
      expect(title.tagName).toBe('H2');
    });

    it('should render subtitle as p element', () => {
      renderComponent();
      
      const subtitle = screen.getByTestId('featured-industrial-cities-subtitle');
      expect(subtitle.tagName).toBe('P');
    });
  });

  describe('Background Elements', () => {
    it('should render background pattern with correct attributes', () => {
      renderComponent();
      
      const backgroundPattern = screen.getByTestId('featured-industrial-cities-background-pattern');
      expect(backgroundPattern).toHaveAttribute('aria-hidden');
      expect(backgroundPattern).toHaveClass('mocked-background-container');
    });

    it('should render background image with correct src and alt', () => {
      renderComponent();
      
      const backgroundImage = screen.getByTestId('featured-industrial-cities-background-image');
      expect(backgroundImage).toHaveAttribute('src', '/assets/images/backgrounds/background-pattern-decorative.png');
      expect(backgroundImage).toHaveAttribute('alt', '');
      expect(backgroundImage.tagName).toBe('IMG');
    });

    it('should apply correct styles to background elements', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      expect(section).toHaveClass('mocked-section-base');
    });
  });

  describe('Locale and Data Handling', () => {
    it('should use English data when locale is en', () => {
      mockUseCurrentLocale.mockReturnValue('en');
      renderComponent();
      
      // Verify PropertyCard was called with English data (check if first property is included)
      const calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-1')).toBe(true);
    });

    it('should use Arabic data when locale is ar', () => {
      mockUseCurrentLocale.mockReturnValue('ar');
      renderComponent();
      
      // Verify PropertyCard was called with Arabic data (check if first property is included)
      const calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-ar-1')).toBe(true);
    });

    it('should detect RTL direction for Arabic locale', () => {
      mockUseCurrentLocale.mockReturnValue('ar');
      renderComponent();
      
      expect(featuredCitiesStyles.mobileSlider.track).toHaveBeenCalledWith(true);
    });

    it('should detect LTR direction for English locale', () => {
      mockUseCurrentLocale.mockReturnValue('en');
      renderComponent();
      
      expect(featuredCitiesStyles.mobileSlider.track).toHaveBeenCalledWith(false);
    });
  });

  describe('Mobile Slider Functionality', () => {
    it('should render mobile slider with correct structure', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      const mobileTrack = screen.getByTestId('featured-industrial-cities-mobile-track');
      
      expect(mobileSlider).toBeInTheDocument();
      expect(mobileTrack).toBeInTheDocument();
      expect(mobileSlider).toContainElement(mobileTrack);
    });

    it('should render correct number of slides', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities-mobile-slide-0')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-slide-1')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-slide-2')).toBeInTheDocument();
    });

    it('should initialize with first slide active', () => {
      renderComponent();
      
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenCalledWith(0);
      expect(featuredCitiesStyles.mobileSlider.slide).toHaveBeenCalledWith(true);
    });

    it('should handle touch events', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      
      const touchStartEvent = {
        touches: [{ clientX: 100 }],
      };
      
      const touchEndEvent = {
        changedTouches: [{ clientX: 50 }],
      };
      
      fireEvent.touchStart(mobileSlider, touchStartEvent);
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      
      // Should advance to next slide due to swipe left
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenCalledWith(1);
    });

    it('should clamp slide index within valid range', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      
      // Try to swipe past the last slide
      const touchStartEvent = { touches: [{ clientX: 100 }] };
      const touchEndEvent = { changedTouches: [{ clientX: 0 }] };
      
      // Simulate multiple swipes to reach the end
      fireEvent.touchStart(mobileSlider, touchStartEvent);
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      fireEvent.touchStart(mobileSlider, touchStartEvent);
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      fireEvent.touchStart(mobileSlider, touchStartEvent);
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      fireEvent.touchStart(mobileSlider, touchStartEvent);
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      
      // Should not exceed the maximum index
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenLastCalledWith(2);
    });

    it('should handle swipe threshold correctly', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      
      // Small swipe below threshold
      const smallSwipeStart = { touches: [{ clientX: 100 }] };
      const smallSwipeEnd = { changedTouches: [{ clientX: 70 }] };
      
      fireEvent.touchStart(mobileSlider, smallSwipeStart);
      fireEvent.touchEnd(mobileSlider, smallSwipeEnd);
      
      // Should remain on first slide
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenLastCalledWith(0);
    });
  });

  describe('Mobile Navigation Dots', () => {
    it('should render correct number of dots', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-2')).toBeInTheDocument();
    });

    it('should render dots container', () => {
      renderComponent();
      
      const dotsContainer = screen.getByTestId('featured-industrial-cities-mobile-dots');
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer).toHaveClass('mocked-dots-container');
    });

    it('should handle dot clicks', () => {
      renderComponent();
      
      const secondDot = screen.getByTestId('featured-industrial-cities-mobile-dot-1');
      
      fireEvent.click(secondDot);
      
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenCalledWith(1);
    });

    it('should render dots as button elements', () => {
      renderComponent();
      
      const dot = screen.getByTestId('featured-industrial-cities-mobile-dot-0');
      expect(dot.tagName).toBe('BUTTON');
    });

    it('should have correct aria-label for dots', () => {
      renderComponent();
      
      const firstDot = screen.getByTestId('featured-industrial-cities-mobile-dot-0');
      const secondDot = screen.getByTestId('featured-industrial-cities-mobile-dot-1');
      
      expect(firstDot).toHaveAttribute('aria-label', 'Go to card 1');
      expect(secondDot).toHaveAttribute('aria-label', 'Go to card 2');
    });

    it('should reverse dot order for RTL locale', () => {
      mockUseCurrentLocale.mockReturnValue('ar');
      renderComponent();
      
      // In RTL, the visual order should be reversed
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-2')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-mobile-dot-0')).toBeInTheDocument();
    });
  });

  describe('Desktop Grid', () => {
    it('should render desktop grid with correct structure', () => {
      renderComponent();
      
      const desktopGrid = screen.getByTestId('featured-industrial-cities-desktop-grid');
      expect(desktopGrid).toBeInTheDocument();
      expect(desktopGrid).toHaveClass('mocked-desktop-grid');
    });

    it('should render correct number of desktop cards', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities-desktop-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-desktop-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-desktop-card-2')).toBeInTheDocument();
    });

    it('should contain PropertyCard components in desktop grid', () => {
      renderComponent();
      
      const desktopCard = screen.getByTestId('featured-industrial-cities-desktop-card-0');
      const propertyCard = desktopCard.querySelector('[data-testid="property-card-property-1"]');
      expect(propertyCard).toBeInTheDocument();
    });
  });

  describe('Data QA ID Prop Handling', () => {
    it('should use default data-qa-id when not provided', () => {
      renderComponent();
      
      expect(screen.getByTestId('featured-industrial-cities')).toHaveAttribute('data-qa-id', 'featured-industrial-cities');
    });

    it('should use custom data-qa-id when provided', () => {
      renderComponent({ 'data-qa-id': 'custom-cities' });
      
      expect(screen.getByTestId('custom-cities')).toBeInTheDocument();
      expect(screen.queryByTestId('featured-industrial-cities')).not.toBeInTheDocument();
    });

    it('should create dynamic child data-qa-ids based on main id', () => {
      const testCases = [
        { main: 'test-cities', expected: 'test-cities-title' },
        { main: 'industrial-zones', expected: 'industrial-zones-subtitle' },
        { main: 'featured-areas', expected: 'featured-areas-mobile-slider' },
      ];

      testCases.forEach(({ main, expected }) => {
        const { unmount } = renderComponent({ 'data-qa-id': main });
        expect(screen.getByTestId(main)).toBeInTheDocument();
        
        const titleElement = screen.getByTestId(expected.includes('title') ? expected : `${main}-title`);
        expect(titleElement).toHaveAttribute('data-qa-id', expected.includes('title') ? expected : `${main}-title`);
        
        unmount();
      });
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'cities-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });
      
      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toHaveAttribute('data-qa-id', `${specialId}-title`);
    });

    it('should handle empty string data-qa-id', () => {
      renderComponent({ 'data-qa-id': '' });
      
      expect(screen.getByTestId('')).toBeInTheDocument();
    });
  });

  describe('Component Structure and Hierarchy', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      const content = screen.getByTestId('featured-industrial-cities-content');
      const header = screen.getByTestId('featured-industrial-cities-header');
      
      expect(section).toContainElement(content);
      expect(content).toContainElement(header);
    });

    it('should render elements in correct order', () => {
      renderComponent();
      
      const content = screen.getByTestId('featured-industrial-cities-content');
      const children = Array.from(content.children);
      
      expect(children[0]).toHaveAttribute('data-qa-id', 'featured-industrial-cities-header');
      expect(children[1]).toHaveAttribute('data-qa-id', 'featured-industrial-cities-mobile-slider');
      expect(children[2]).toHaveAttribute('data-qa-id', 'featured-industrial-cities-mobile-dots');
      expect(children[3]).toHaveAttribute('data-qa-id', 'featured-industrial-cities-desktop-grid');
    });

    it('should maintain mobile and desktop sections separately', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      const desktopGrid = screen.getByTestId('featured-industrial-cities-desktop-grid');
      
      expect(mobileSlider).not.toContainElement(desktopGrid);
      expect(desktopGrid).not.toContainElement(mobileSlider);
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive classes to mobile elements', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      const mobileDots = screen.getByTestId('featured-industrial-cities-mobile-dots');
      
      expect(mobileSlider).toHaveClass('mocked-mobile-container');
      expect(mobileDots).toHaveClass('mocked-dots-container');
    });

    it('should apply responsive classes to desktop elements', () => {
      renderComponent();
      
      const desktopGrid = screen.getByTestId('featured-industrial-cities-desktop-grid');
      expect(desktopGrid).toHaveClass('mocked-desktop-grid');
    });

    it('should handle different screen sizes correctly', () => {
      renderComponent();
      
      // Both mobile and desktop elements should exist
      expect(screen.getByTestId('featured-industrial-cities-mobile-slider')).toBeInTheDocument();
      expect(screen.getByTestId('featured-industrial-cities-desktop-grid')).toBeInTheDocument();
    });
  });

  describe('PropertyCard Integration', () => {
    it('should render PropertyCard components', () => {
      renderComponent();
      
      expect(PropertyCard).toHaveBeenCalledTimes(6); // 3 for mobile + 3 for desktop
    });

    it('should pass correct props to PropertyCard components', () => {
      renderComponent();
      
      // Check that PropertyCard was called with all properties
      const calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-1')).toBe(true);
      expect(calls.some(call => call[0].property.id === 'property-2')).toBe(true);
      expect(calls.some(call => call[0].property.id === 'property-3')).toBe(true);
    });

    it('should render PropertyCard in both mobile and desktop sections', () => {
      renderComponent();
      
      const mobileSlide = screen.getByTestId('featured-industrial-cities-mobile-slide-0');
      const desktopCard = screen.getByTestId('featured-industrial-cities-desktop-card-0');
      
      // Check if PropertyCard components exist in both sections
      expect(PropertyCard).toHaveBeenCalledTimes(6); // 3 properties × 2 sections
      
      // Check desktop section contains a PropertyCard
      const propertyCard = desktopCard.querySelector('[data-testid="property-card-property-1"]');
      expect(propertyCard).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined title gracefully', () => {
      renderComponent({ title: undefined });
      
      const title = screen.getByTestId('featured-industrial-cities-title');
      expect(title).toHaveTextContent('Featured Industrial Cities'); // Default value is used
    });

    it('should handle undefined subtitle gracefully', () => {
      renderComponent({ subtitle: undefined });
      
      const subtitle = screen.getByTestId('featured-industrial-cities-subtitle');
      expect(subtitle).toHaveTextContent('Site Selection Roadmap to Navigate, Compare, Invest - Seamlessly.'); // Default value is used
    });

    it('should handle empty title and subtitle', () => {
      renderComponent({ title: '', subtitle: '' });
      
      const title = screen.getByTestId('featured-industrial-cities-title');
      const subtitle = screen.getByTestId('featured-industrial-cities-subtitle');
      
      expect(title).toHaveTextContent('');
      expect(subtitle).toHaveTextContent('');
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200);
      renderComponent({ title: longTitle });
      
      const title = screen.getByTestId('featured-industrial-cities-title');
      expect(title).toHaveTextContent(longTitle);
    });

    it('should handle special characters in title and subtitle', () => {
      const specialTitle = 'Title with émojis 🏭 & special chars!';
      const specialSubtitle = 'Subtitle with @#$%^&*() characters';
      
      renderComponent({ title: specialTitle, subtitle: specialSubtitle });
      
      expect(screen.getByTestId('featured-industrial-cities-title')).toHaveTextContent(specialTitle);
      expect(screen.getByTestId('featured-industrial-cities-subtitle')).toHaveTextContent(specialSubtitle);
    });

    it('should handle touch events with null touchStartX', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      
      // Touch end without touch start
      const touchEndEvent = {
        changedTouches: [{ clientX: 50 }],
      };
      
      fireEvent.touchEnd(mobileSlider, touchEndEvent);
      
      // Should remain on initial slide
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenLastCalledWith(0);
    });

    it('should handle locale changes dynamically', () => {
      const { rerender } = renderComponent();
      
      // Initially should render English data
      let calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-1')).toBe(true);
      
      mockUseCurrentLocale.mockReturnValue('ar');
      rerender(<FeaturedIndustrialCities {...defaultProps} />);
      
      // Should now render Arabic data
      calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-ar-1')).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = renderComponent();
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        rerender(<FeaturedIndustrialCities {...defaultProps} title={`Title ${i}`} />);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid slide changes efficiently', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        const dot = screen.getByTestId(`featured-industrial-cities-mobile-dot-${i % 3}`);
        fireEvent.click(dot);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      const title = screen.getByTestId('featured-industrial-cities-title');
      const subtitle = screen.getByTestId('featured-industrial-cities-subtitle');
      
      expect(section).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
      expect(subtitle.tagName).toBe('P');
    });

    it('should maintain semantic structure', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      expect(section.tagName).toBe('SECTION');
      
      const title = screen.getByTestId('featured-industrial-cities-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have proper aria attributes', () => {
      renderComponent();
      
      const backgroundPattern = screen.getByTestId('featured-industrial-cities-background-pattern');
      expect(backgroundPattern).toHaveAttribute('aria-hidden');
      
      const dots = screen.getAllByRole('button');
      dots.forEach((dot, index) => {
        expect(dot).toHaveAttribute('aria-label', `Go to card ${index + 1}`);
      });
    });

    it('should handle keyboard navigation', () => {
      renderComponent();
      
      const firstDot = screen.getByTestId('featured-industrial-cities-mobile-dot-0');
      firstDot.focus();
      
      expect(document.activeElement).toBe(firstDot);
      
      fireEvent.keyDown(firstDot, { key: 'Enter' });
      fireEvent.click(firstDot);
      
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenCalledWith(0);
    });
  });

  describe('Integration', () => {
    it('should work correctly when used multiple times', () => {
      const { unmount: unmount1 } = renderComponent({ 'data-qa-id': 'cities-1' });
      expect(screen.getByTestId('cities-1')).toBeInTheDocument();
      unmount1();
      
      const { unmount: unmount2 } = renderComponent({ 'data-qa-id': 'cities-2' });
      expect(screen.getByTestId('cities-2')).toBeInTheDocument();
      unmount2();
    });

    it('should maintain independent state for multiple instances', () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');
      document.body.appendChild(container1);
      document.body.appendChild(container2);
      
      render(<FeaturedIndustrialCities {...defaultProps} data-qa-id="instance-1" />, { container: container1 });
      render(<FeaturedIndustrialCities {...defaultProps} data-qa-id="instance-2" />, { container: container2 });
      
      expect(container1.querySelector('[data-qa-id="instance-1"]')).toBeInTheDocument();
      expect(container2.querySelector('[data-qa-id="instance-2"]')).toBeInTheDocument();
      
      // Cleanup
      document.body.removeChild(container1);
      document.body.removeChild(container2);
    });

    it('should work with different featured data configurations', () => {
      renderComponent();
      
      // PropertyCard should be called with properties from the mock data
      const calls = (PropertyCard as jest.Mock).mock.calls;
      expect(calls.some(call => call[0].property.id === 'property-1')).toBe(true);
      expect(calls.some(call => call[0].property.id === 'property-2')).toBe(true);
      expect(calls.some(call => call[0].property.id === 'property-3')).toBe(true);
    });
  });

  describe('Style Integration', () => {
    it('should apply featuredCitiesStyles correctly', () => {
      renderComponent();
      
      const section = screen.getByTestId('featured-industrial-cities');
      expect(section).toHaveClass('mocked-section-base');
      
      const backgroundPattern = screen.getByTestId('featured-industrial-cities-background-pattern');
      expect(backgroundPattern).toHaveClass('mocked-background-container');
    });

    it('should call style functions with correct parameters', () => {
      renderComponent();
      
      expect(featuredCitiesStyles.mobileSlider.track).toHaveBeenCalledWith(false); // LTR for English
      expect(featuredCitiesStyles.mobileSlider.trackStyle).toHaveBeenCalledWith(0);
      expect(featuredCitiesStyles.mobileSlider.slide).toHaveBeenCalledWith(true);
    });

    it('should maintain style consistency across components', () => {
      renderComponent();
      
      const mobileSlider = screen.getByTestId('featured-industrial-cities-mobile-slider');
      const desktopGrid = screen.getByTestId('featured-industrial-cities-desktop-grid');
      
      expect(mobileSlider).toHaveClass('mocked-mobile-container');
      expect(desktopGrid).toHaveClass('mocked-desktop-grid');
    });
  });
});