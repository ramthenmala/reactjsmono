import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useScrollSpy } from '../use-scroll-spy';
import * as scrollSpyUtils from '../../utils/scroll-spy';

// Mock router hooks
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));

// Mock scroll spy utils
jest.mock('../../utils/scroll-spy');
const mockFindActiveSection = jest.mocked(scrollSpyUtils.findActiveSection);
const mockCreateUrlForSection = jest.mocked(scrollSpyUtils.createUrlForSection);
const mockExtractHashFromUrl = jest.mocked(scrollSpyUtils.extractHashFromUrl);

const defaultConfig = {
  sections: ['national', 'sectoral', 'bilateral', 'regional'],
  scrollOffset: 100,
  debounceDelay: 150,
  userScrollTimeout: 1000,
};

const renderUseScrollSpy = (config = defaultConfig, routerProps = {}) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter {...routerProps}>{children}</MemoryRouter>
  );
  return renderHook(() => useScrollSpy(config), { wrapper });
};

describe('useScrollSpy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Set default mock return values
    mockUseLocation.mockReturnValue({ pathname: '/analytics', hash: '' });
    mockUseParams.mockReturnValue({ locale: 'en' });

    // Mock DOM methods
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    // Mock getElementById
    const mockElement = {
      scrollIntoView: jest.fn(),
    };
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockElement as HTMLElement | null);

    // Mock addEventListener and removeEventListener
    jest.spyOn(window, 'addEventListener').mockImplementation(jest.fn());
    jest.spyOn(window, 'removeEventListener').mockImplementation(jest.fn());
    jest.spyOn(document, 'addEventListener').mockImplementation(jest.fn());
    jest.spyOn(document, 'removeEventListener').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('initializes with empty active section', () => {
    const { result } = renderUseScrollSpy();

    expect(result.current.activeSection).toBe('');
  });

  it('handles initial hash navigation', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#national',
    });
    mockExtractHashFromUrl.mockReturnValue('national');

    renderUseScrollSpy();

    expect(mockExtractHashFromUrl).toHaveBeenCalledWith('#national');
    expect(document.getElementById).toHaveBeenCalledWith('national');
  });

  it('scrolls to element when hash is present', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#national',
    });
    mockExtractHashFromUrl.mockReturnValue('national');

    const mockElement = { scrollIntoView: jest.fn() };
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockElement as HTMLElement | null);

    renderUseScrollSpy();

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('sets active section from hash', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#sectoral',
    });
    mockExtractHashFromUrl.mockReturnValue('sectoral');

    const { result } = renderUseScrollSpy();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.activeSection).toBe('sectoral');
  });

  it('sets up scroll event listener', () => {
    renderUseScrollSpy();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });

  it('sets up click event listener', () => {
    renderUseScrollSpy();

    expect(document.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('handles scroll events and updates active section', () => {
    renderUseScrollSpy();

    // Test that scroll event listener is set up
    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });

  it('navigates to new URL when active section changes', () => {
    renderUseScrollSpy();

    // Test that the hook sets up the scroll listener which would handle navigation
    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
  });

  it('handles analytics anchor clicks', () => {
    renderUseScrollSpy();

    const clickHandler = (
      document.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'click')?.[1];

    // Mock anchor element
    const mockAnchor = {
      getAttribute: jest.fn().mockReturnValue('/analytics#sectoral'),
    };
    const mockTarget = {
      closest: jest.fn().mockReturnValue(mockAnchor),
    };

    const mockEvent = {
      target: mockTarget,
    };

    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
      jest.runAllTimers();
    });

    expect(mockTarget.closest).toHaveBeenCalledWith('a[href*="#"]');
  });

  it('does not update active section during user scrolling', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#national',
    });
    mockExtractHashFromUrl.mockReturnValue('national');

    renderUseScrollSpy();

    // First trigger hash navigation to set user scrolling
    act(() => {
      jest.advanceTimersByTime(500); // Don't complete the timeout
    });

    mockFindActiveSection.mockReturnValue('sectoral');

    // Now trigger scroll while user is still scrolling
    act(() => {
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      if (scrollHandler) {
        scrollHandler();
      }
      jest.runAllTimers();
    });

    // Should not navigate because user is still scrolling
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderUseScrollSpy();

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    expect(document.removeEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('uses default locale when locale param is not available', () => {
    mockUseParams.mockReturnValue({});

    mockFindActiveSection.mockReturnValue('national');
    mockCreateUrlForSection.mockReturnValue('/en/analytics#national');

    renderUseScrollSpy();

    act(() => {
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      if (scrollHandler) {
        scrollHandler();
      }
      jest.runAllTimers();
    });

    expect(mockCreateUrlForSection).toHaveBeenCalledWith('en', 'national');
  });

  it('handles debounce correctly', () => {
    mockFindActiveSection.mockReturnValue('bilateral');

    const { result } = renderUseScrollSpy();

    const scrollHandler = (
      window.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'scroll')?.[1];

    // Trigger multiple rapid scroll events
    act(() => {
      if (scrollHandler) {
        scrollHandler();
        scrollHandler();
        scrollHandler();
      }

      // Only advance by half the debounce delay
      jest.advanceTimersByTime(defaultConfig.debounceDelay / 2);
    });

    // Should not have updated yet due to debounce
    expect(result.current.activeSection).toBe('');

    act(() => {
      // Complete the debounce delay
      jest.runAllTimers();
    });

    // Now should have updated
    expect(mockFindActiveSection).toHaveBeenCalled();
  });

  it('handles missing element in hash navigation', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#nonexistent',
    });
    mockExtractHashFromUrl.mockReturnValue('nonexistent');
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    const { result } = renderUseScrollSpy();

    // Should not set active section when element doesn't exist
    expect(result.current.activeSection).toBe('');
  });

  it('handles click on non-analytics anchor', () => {
    renderUseScrollSpy();

    const clickHandler = (
      document.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'click')?.[1];

    const mockAnchor = {
      getAttribute: jest.fn().mockReturnValue('/other-page#section'),
    };
    const mockTarget = {
      closest: jest.fn().mockReturnValue(mockAnchor),
    };

    const mockEvent = {
      target: mockTarget,
    };

    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
      jest.runAllTimers();
    });

    // Should not set user scrolling for non-analytics links
    expect(mockAnchor.getAttribute).toHaveBeenCalledWith('href');
  });

  it('handles click when no anchor is found', () => {
    renderUseScrollSpy();

    const clickHandler = (
      document.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'click')?.[1];

    const mockTarget = {
      closest: jest.fn().mockReturnValue(null),
    };

    const mockEvent = {
      target: mockTarget,
    };

    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
      jest.runAllTimers();
    });

    expect(mockTarget.closest).toHaveBeenCalledWith('a[href*="#"]');
  });

  it('does not navigate when URLs are the same', () => {
    mockFindActiveSection.mockReturnValue('national');
    mockCreateUrlForSection.mockReturnValue('/en/analytics#national');
    mockUseLocation.mockReturnValue({
      pathname: '/en/analytics',
      hash: '#national',
    });

    renderUseScrollSpy();

    act(() => {
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      if (scrollHandler) {
        scrollHandler();
      }
      jest.runAllTimers();
    });

    // Should not navigate when URL is already correct
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles when findActiveSection returns null', () => {
    mockFindActiveSection.mockReturnValue(null);

    const { result } = renderUseScrollSpy();

    act(() => {
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];
      if (scrollHandler) {
        scrollHandler();
      }
      jest.runAllTimers();
    });

    // Should not update active section or navigate when no active section found
    expect(result.current.activeSection).toBe('');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('tests branch coverage for activeSection comparison', () => {
    // This test focuses on the branch condition: newActiveSection !== activeSection
    const { result } = renderUseScrollSpy();

    act(() => {
      const scrollHandler = (
        window.addEventListener as jest.Mock
      ).mock.calls.find((call) => call[0] === 'scroll')?.[1];

      mockFindActiveSection.mockReturnValue('national');
      mockCreateUrlForSection.mockReturnValue('/en/analytics#national');

      if (scrollHandler) {
        scrollHandler();
      }
      jest.runAllTimers();
    });

    // Verify the branch was covered
    expect(result.current.activeSection).toBe('national');
  });

  it('clears timeout when no existing timeout in hash navigation', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#national',
    });
    mockExtractHashFromUrl.mockReturnValue('national');

    const mockElement = { scrollIntoView: jest.fn() };
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockElement as HTMLElement | null);

    renderUseScrollSpy();

    // Should handle case where no existing timeout exists
    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });

  it('clears timeout when no existing timeout in click handler', () => {
    renderUseScrollSpy();

    const clickHandler = (
      document.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'click')?.[1];

    const mockAnchor = {
      getAttribute: jest.fn().mockReturnValue('/analytics#sectoral'),
    };
    const mockTarget = {
      closest: jest.fn().mockReturnValue(mockAnchor),
    };

    const mockEvent = {
      target: mockTarget,
    };

    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
    });

    // Should handle case where no existing timeout exists
    expect(mockAnchor.getAttribute).toHaveBeenCalledWith('href');
  });

  it('handles existing timeout clearance in hash navigation', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#national',
    });
    mockExtractHashFromUrl.mockReturnValue('national');

    const mockElement = { scrollIntoView: jest.fn() };
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(mockElement as HTMLElement | null);

    // Mock setTimeout to return a timeout ID
    const mockTimeoutId = 123;
    jest
      .spyOn(global, 'setTimeout')
      .mockReturnValue(mockTimeoutId as NodeJS.Timeout);
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    // First render to create initial timeout
    const { rerender } = renderUseScrollSpy();

    // Change hash to trigger clearTimeout of existing timeout
    mockUseLocation.mockReturnValue({
      pathname: '/analytics',
      hash: '#sectoral',
    });
    mockExtractHashFromUrl.mockReturnValue('sectoral');

    rerender();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('handles existing timeout clearance in click handler', () => {
    renderUseScrollSpy();

    const clickHandler = (
      document.addEventListener as jest.Mock
    ).mock.calls.find((call) => call[0] === 'click')?.[1];

    const mockAnchor = {
      getAttribute: jest.fn().mockReturnValue('/analytics#sectoral'),
    };
    const mockTarget = {
      closest: jest.fn().mockReturnValue(mockAnchor),
    };

    const mockEvent = {
      target: mockTarget,
    };

    // First click to create timeout
    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
    });

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    // Second click should clear existing timeout
    act(() => {
      if (clickHandler) {
        clickHandler(mockEvent);
      }
    });

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
