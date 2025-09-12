import {
  createScrollToSection,
  createUrlForSection,
  extractHashFromUrl,
  findActiveSection,
  isAnalyticsAnchor,
} from '../scroll-spy';
import type { AnalyticsSectionId } from '../../types/features';

// Mock document methods
const mockScrollIntoView = jest.fn();
const mockGetElementById = jest.fn();

// Store original implementations
const originalGetElementById = document.getElementById;
const originalWindowScrollY = Object.getOwnPropertyDescriptor(
  window,
  'scrollY',
);

describe('scroll-spy utilities', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
    mockGetElementById.mockClear();

    // Mock document.getElementById
    document.getElementById = mockGetElementById;
  });

  afterAll(() => {
    // Restore original implementations
    document.getElementById = originalGetElementById;
    if (originalWindowScrollY) {
      Object.defineProperty(window, 'scrollY', originalWindowScrollY);
    }
  });

  describe('createScrollToSection', () => {
    it('creates a function that scrolls to section when element exists', () => {
      const mockElement = {
        scrollIntoView: mockScrollIntoView,
      } as unknown as HTMLElement;

      mockGetElementById.mockReturnValue(mockElement);

      const scrollToSection = createScrollToSection('en');
      const result = scrollToSection('test-section');

      expect(mockGetElementById).toHaveBeenCalledWith('test-section');
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
      expect(result).toBe(true);
    });

    it('returns false when element does not exist', () => {
      mockGetElementById.mockReturnValue(null);

      const scrollToSection = createScrollToSection('en');
      const result = scrollToSection('non-existent-section');

      expect(mockGetElementById).toHaveBeenCalledWith('non-existent-section');
      expect(mockScrollIntoView).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('works with different locales', () => {
      const mockElement = {
        scrollIntoView: mockScrollIntoView,
      } as unknown as HTMLElement;

      mockGetElementById.mockReturnValue(mockElement);

      const scrollToSectionAr = createScrollToSection('ar');
      const result = scrollToSectionAr('section-ar');

      expect(mockGetElementById).toHaveBeenCalledWith('section-ar');
      expect(result).toBe(true);
    });

    it('handles empty section id', () => {
      mockGetElementById.mockReturnValue(null);

      const scrollToSection = createScrollToSection('en');
      const result = scrollToSection('');

      expect(mockGetElementById).toHaveBeenCalledWith('');
      expect(result).toBe(false);
    });
  });

  describe('createUrlForSection', () => {
    it('creates correct URL for English locale', () => {
      const result = createUrlForSection('en', 'investor-insights');
      expect(result).toBe('/en/analytics#investor-insights');
    });

    it('creates correct URL for Arabic locale', () => {
      const result = createUrlForSection('ar', 'national');
      expect(result).toBe('/ar/analytics#national');
    });

    it('handles all valid section IDs', () => {
      const sectionIds: AnalyticsSectionId[] = [
        'investor-insights',
        'industrial-city-insights',
        'national',
        'regional',
        'city-metrics',
        'sector-view',
      ];

      sectionIds.forEach(sectionId => {
        const result = createUrlForSection('en', sectionId);
        expect(result).toBe(`/en/analytics#${sectionId}`);
      });
    });

    it('works with custom locale strings', () => {
      const result = createUrlForSection('fr', 'regional');
      expect(result).toBe('/fr/analytics#regional');
    });
  });

  describe('extractHashFromUrl', () => {
    it('extracts hash from URL with hash', () => {
      const result = extractHashFromUrl('#investor-insights');
      expect(result).toBe('investor-insights');
    });

    it('extracts hash from complex hash', () => {
      const result = extractHashFromUrl('#section-with-dashes');
      expect(result).toBe('section-with-dashes');
    });

    it('handles empty hash', () => {
      const result = extractHashFromUrl('#');
      expect(result).toBe('');
    });

    it('handles URL without hash character', () => {
      const result = extractHashFromUrl('investor-insights');
      expect(result).toBe('nvestor-insights'); // removes first character
    });

    it('handles empty string', () => {
      const result = extractHashFromUrl('');
      expect(result).toBe('');
    });

    it('handles special characters in hash', () => {
      const result = extractHashFromUrl('#city-metrics-2024');
      expect(result).toBe('city-metrics-2024');
    });
  });

  describe('findActiveSection', () => {
    beforeEach(() => {
      // Mock window.scrollY
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true,
      });
    });

    it('returns null when no sections match', () => {
      mockGetElementById.mockReturnValue(null);

      const sections: AnalyticsSectionId[] = ['investor-insights', 'national'];
      const result = findActiveSection(sections);

      expect(result).toBe(null);
    });

    it('returns the correct active section', () => {
      const mockElement1 = { offsetTop: 100 } as HTMLElement;
      const mockElement2 = { offsetTop: 300 } as HTMLElement;

      mockGetElementById
        .mockReturnValueOnce(mockElement2) // 'national' - checked first (reverse order)
        .mockReturnValueOnce(mockElement1); // 'investor-insights'

      // Set scroll position to 250 (+ default offset 100 = 350)
      Object.defineProperty(window, 'scrollY', { value: 250 });

      const sections: AnalyticsSectionId[] = ['investor-insights', 'national'];
      const result = findActiveSection(sections);

      expect(result).toBe('national');
    });

    it('uses custom scroll offset', () => {
      const mockElement = { offsetTop: 200 } as HTMLElement;
      mockGetElementById.mockReturnValue(mockElement);

      Object.defineProperty(window, 'scrollY', { value: 150 });

      const sections: AnalyticsSectionId[] = ['investor-insights'];

      // With offset 50: scrollPosition = 150 + 50 = 200, equals offsetTop
      const resultWithOffset = findActiveSection(sections, 50);
      expect(resultWithOffset).toBe('investor-insights');

      // With offset 30: scrollPosition = 150 + 30 = 180, less than offsetTop
      const resultWithSmallOffset = findActiveSection(sections, 30);
      expect(resultWithSmallOffset).toBe(null);
    });

    it('handles multiple sections and returns the most relevant one', () => {
      const sections: AnalyticsSectionId[] = [
        'investor-insights',
        'national',
        'regional',
      ];

      // Mock elements with increasing offsetTop values
      const mockElements = [
        { offsetTop: 500 }, // regional
        { offsetTop: 300 }, // national
        { offsetTop: 100 }, // investor-insights
      ];

      mockGetElementById
        .mockReturnValueOnce(mockElements[0] as HTMLElement) // regional (checked first)
        .mockReturnValueOnce(mockElements[1] as HTMLElement) // national
        .mockReturnValueOnce(mockElements[2] as HTMLElement); // investor-insights

      Object.defineProperty(window, 'scrollY', { value: 250 }); // + 100 offset = 350

      const result = findActiveSection(sections);
      expect(result).toBe('national'); // offsetTop 300 <= scrollPosition 350
    });

    it('handles sections that do not exist in DOM', () => {
      mockGetElementById
        .mockReturnValueOnce(null) // first section doesn't exist
        .mockReturnValue({ offsetTop: 100 } as HTMLElement); // second section exists

      Object.defineProperty(window, 'scrollY', { value: 150 });

      const sections: AnalyticsSectionId[] = [
        'non-existent',
        'investor-insights',
      ];
      const result = findActiveSection(sections);

      expect(result).toBe('investor-insights');
    });

    it('returns null for empty sections array', () => {
      const result = findActiveSection([]);
      expect(result).toBe(null);
    });
  });

  describe('isAnalyticsAnchor', () => {
    it('returns true for URLs containing analytics#', () => {
      expect(isAnalyticsAnchor('/en/analytics#investor-insights')).toBe(true);
      expect(isAnalyticsAnchor('/ar/analytics#national')).toBe(true);
      expect(isAnalyticsAnchor('analytics#section')).toBe(true);
    });

    it('returns false for URLs not containing analytics#', () => {
      expect(isAnalyticsAnchor('/en/dashboard')).toBe(false);
      expect(isAnalyticsAnchor('/ar/users')).toBe(false);
      expect(isAnalyticsAnchor('#investor-insights')).toBe(false);
      expect(isAnalyticsAnchor('/en/analytics')).toBe(false); // no hash
    });

    it('returns false for empty string', () => {
      expect(isAnalyticsAnchor('')).toBe(false);
    });

    it('handles partial matches correctly', () => {
      expect(isAnalyticsAnchor('analytics')).toBe(false); // no hash
      expect(isAnalyticsAnchor('#analytics')).toBe(false); // hash first
      expect(isAnalyticsAnchor('other-analytics#section')).toBe(true); // contains analytics#
    });

    it('is case sensitive', () => {
      expect(isAnalyticsAnchor('Analytics#section')).toBe(false);
      expect(isAnalyticsAnchor('ANALYTICS#section')).toBe(false);
    });

    it('handles special characters', () => {
      expect(isAnalyticsAnchor('/en/analytics#investor-insights-2024')).toBe(
        true,
      );
      expect(isAnalyticsAnchor('/ar/analytics#city_metrics')).toBe(true);
    });
  });
});
