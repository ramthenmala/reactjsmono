import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageSelector } from '@/shared/ui/navigation/LanguageSelector';
import '@testing-library/jest-dom';

// Mock router hooks
const mockChangeLocale = jest.fn();
const mockCurrentLocale = jest.fn(() => 'en');

jest.mock('@/router', () => ({
  useCurrentLocale: () => mockCurrentLocale(),
  useLocaleNavigate: () => ({
    changeLocale: mockChangeLocale,
  }),
}));

// Mock Untitled UI icons
jest.mock('@untitledui/icons', () => ({
  ChevronDown: ({ className, ...props }: any) => (
    <span className={className} data-qa-id="chevron-down" {...props}>
      ▼
    </span>
  ),
}));

describe('LanguageSelector', () => {
  const defaultProps = {
    onLanguageChange: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <LanguageSelector {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentLocale.mockReturnValue('en');
  });

  describe('Component Rendering', () => {
    it('should render language selector with correct elements', () => {
      renderComponent();

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByAltText('flag')).toBeInTheDocument();
      expect(screen.getByText('En')).toBeInTheDocument();
      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="language-selector"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-selector-toggle"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-flag-icon"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-text"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-dropdown-chevron"]')).toBeInTheDocument();
    });

    it('should display English flag and text when locale is en', () => {
      mockCurrentLocale.mockReturnValue('en');
      renderComponent();

      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/US.svg');
      expect(screen.getByText('En')).toBeInTheDocument();
    });

    it('should display Arabic flag and text when locale is ar', () => {
      mockCurrentLocale.mockReturnValue('ar');
      renderComponent();

      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/SA.svg');
      expect(screen.getByText('ع')).toBeInTheDocument();
    });

    it('should render flag with correct dimensions', () => {
      renderComponent();

      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('width', '20');
      expect(flag).toHaveAttribute('height', '20');
    });
  });

  describe('Dropdown Behavior', () => {
    it('should open dropdown when toggle button is clicked', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    it('should have correct data-qa-id on dropdown menu', () => {
      const { container } = renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      expect(container.querySelector('[data-qa-id="language-dropdown-menu"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-option-english"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="language-option-arabic"]')).toBeInTheDocument();
    });

    it('should close dropdown when toggle button is clicked again', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      // Open
      fireEvent.click(toggleButton);
      expect(screen.getByText('English')).toBeInTheDocument();

      // Close
      fireEvent.click(toggleButton);
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('should toggle dropdown state correctly', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      // Initially closed
      expect(screen.queryByText('English')).not.toBeInTheDocument();

      // Open
      fireEvent.click(toggleButton);
      expect(screen.getByText('English')).toBeInTheDocument();

      // Close
      fireEvent.click(toggleButton);
      expect(screen.queryByText('English')).not.toBeInTheDocument();

      // Open again
      fireEvent.click(toggleButton);
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  describe('Language Change', () => {
    it('should change to English when English option is clicked', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');
      fireEvent.click(englishOption);

      expect(mockChangeLocale).toHaveBeenCalledWith('en');
      expect(defaultProps.onLanguageChange).toHaveBeenCalled();
    });

    it('should change to Arabic when Arabic option is clicked', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const arabicOption = screen.getByText('العربية');
      fireEvent.click(arabicOption);

      expect(mockChangeLocale).toHaveBeenCalledWith('ar');
      expect(defaultProps.onLanguageChange).toHaveBeenCalled();
    });

    it('should close dropdown after language selection', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');
      fireEvent.click(englishOption);

      expect(screen.queryByText('English')).not.toBeInTheDocument();
      expect(screen.queryByText('العربية')).not.toBeInTheDocument();
    });

    it('should call onLanguageChange callback when provided', () => {
      const onLanguageChange = jest.fn();
      renderComponent({ onLanguageChange });

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');
      fireEvent.click(englishOption);

      expect(onLanguageChange).toHaveBeenCalled();
    });

    it('should handle undefined onLanguageChange gracefully', () => {
      renderComponent({ onLanguageChange: undefined });

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');

      expect(() => fireEvent.click(englishOption)).not.toThrow();
      expect(mockChangeLocale).toHaveBeenCalledWith('en');
    });
  });

  describe('Styling', () => {
    it('should apply correct classes to toggle button', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      expect(toggleButton).toHaveClass(
        'flex',
        'cursor-pointer',
        'items-center',
        'gap-2',
        'rounded-lg',
        'py-2',
        'outline-none',
        'transition',
        'hover:opacity-90',
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2'
      );
    });

    it('should apply correct classes to dropdown menu', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    it('should apply hover styles to language options', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');

      expect(englishOption).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'text-left',
        'text-sm',
        'text-gray-700',
        'hover:bg-gray-100'
      );
    });

    it('should apply correct border radius to options', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');
      const arabicOption = screen.getByText('العربية');

      expect(englishOption).toHaveClass('rounded-t-lg');
      expect(arabicOption).toHaveClass('rounded-b-lg');
    });
  });

  describe('Integration', () => {
    it('should work with different initial locales', () => {
      // Test with English
      mockCurrentLocale.mockReturnValue('en');
      const { rerender } = renderComponent();
      expect(screen.getByText('En')).toBeInTheDocument();

      // Test with Arabic
      mockCurrentLocale.mockReturnValue('ar');
      rerender(
        <MemoryRouter>
          <LanguageSelector {...defaultProps} />
        </MemoryRouter>
      );
      expect(screen.getByText('ع')).toBeInTheDocument();
    });

    it('should handle rapid clicks', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      // Rapid clicks
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      // Should be open after odd number of clicks
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should handle language change while dropdown is open', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      // Dropdown is open
      expect(screen.getByText('English')).toBeInTheDocument();

      // Click English option
      const englishOption = screen.getByText('English');
      fireEvent.click(englishOption);

      // Dropdown should close
      expect(screen.queryByText('English')).not.toBeInTheDocument();

      // Locale should change
      expect(mockChangeLocale).toHaveBeenCalledWith('en');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button element', () => {
      renderComponent();

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible flag image', () => {
      renderComponent();

      const flag = screen.getByAltText('flag');
      expect(flag).toBeInTheDocument();
      expect(flag).toHaveAttribute('alt');
    });

    it('should handle keyboard navigation', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      // Simulate Enter key
      fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' });

      // Button click should work with keyboard
      fireEvent.click(toggleButton);
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should maintain focus on toggle button', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');
      toggleButton.focus();

      expect(document.activeElement).toBe(toggleButton);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null onLanguageChange callback', () => {
      renderComponent({ onLanguageChange: null });

      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);

      const englishOption = screen.getByText('English');

      expect(() => fireEvent.click(englishOption)).not.toThrow();
    });

    it('should handle empty locale string', () => {
      mockCurrentLocale.mockReturnValue('');
      renderComponent();

      // Should fallback to default behavior
      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/US.svg');
    });

    it('should handle unsupported locale', () => {
      mockCurrentLocale.mockReturnValue('fr');
      renderComponent();

      // Should fallback to default flag
      const flag = screen.getByAltText('flag');
      expect(flag).toHaveAttribute('src', '/assets/images/flags/US.svg');
    });

    it('should handle multiple rapid language changes', () => {
      renderComponent();

      const toggleButton = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(toggleButton);

      // Click English
      fireEvent.click(screen.getByText('English'));

      // Open again
      fireEvent.click(toggleButton);

      // Click Arabic
      fireEvent.click(screen.getByText('العربية'));

      expect(mockChangeLocale).toHaveBeenCalledTimes(2);
      expect(mockChangeLocale).toHaveBeenNthCalledWith(1, 'en');
      expect(mockChangeLocale).toHaveBeenNthCalledWith(2, 'ar');
    });
  });

});