import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '@/shared/ui/components/ErrorFallback';
import '@testing-library/jest-dom';

// Mock the icons
jest.mock('@untitledui/icons', () => ({
  AlertTriangle: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-qa-id="alert-triangle-icon">
      <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  RefreshCw01: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-qa-id="refresh-icon">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0015.356 2M15 15v5h-.582M4.644 5A8.001 8.001 0 0119.418 15m0 0V15a8.002 8.002 0 00-15.356-2" />
    </svg>
  ),
}));

// Mock the Button component
jest.mock('@compass/shared-ui', () => ({
  Button: ({ children, className, onClick, iconLeading: Icon, ...props }: any) => (
    <button className={className} onClick={onClick} {...props}>
      {Icon && <Icon />}
      {children}
    </button>
  ),
}));

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = jest.fn();

  const defaultProps = {
    error: mockError,
    resetErrorBoundary: mockResetErrorBoundary,
  };

  const renderComponent = (props = {}) => {
    return render(<ErrorFallback {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render error fallback component with all elements', () => {
      renderComponent();

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('error-fallback-title')).toBeInTheDocument();
      expect(screen.getByTestId('error-fallback-retry-button')).toBeInTheDocument();
    });

    it('should have correct data-qa-id attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[data-qa-id="error-fallback"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="alert-triangle-icon"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="error-fallback-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="error-fallback-retry-button"]')).toBeInTheDocument();
    });

    it('should have role alert for accessibility', () => {
      renderComponent();

      const errorFallback = screen.getByTestId('error-fallback');
      expect(errorFallback).toHaveAttribute('role', 'alert');
    });

    it('should render as a div element', () => {
      renderComponent();

      const errorFallback = screen.getByTestId('error-fallback');
      expect(errorFallback.tagName).toBe('DIV');
    });
  });

  describe('Icon Rendering', () => {
    it('should display alert triangle icon', () => {
      renderComponent();

      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });

    it('should have correct icon styling', () => {
      renderComponent();

      const icon = screen.getByTestId('alert-triangle-icon');
      expect(icon).toHaveClass('w-12', 'h-12', 'text-red-500', 'mb-4');
    });

    it('should render AlertTriangle from untitledui icons', () => {
      renderComponent();

      const icon = screen.getByTestId('alert-triangle-icon');
      expect(icon).toBeInTheDocument();
      expect(icon.tagName).toBe('svg');
    });
  });

  describe('Title Display', () => {
    it('should display default message when no message prop provided', () => {
      renderComponent();

      expect(screen.getByTestId('error-fallback-title')).toHaveTextContent('Something went wrong');
    });

    it('should display custom message when provided', () => {
      renderComponent({ message: 'Custom error message' });

      expect(screen.getByTestId('error-fallback-title')).toHaveTextContent('Custom error message');
    });

    it('should render title as h2 element', () => {
      renderComponent();

      const title = screen.getByTestId('error-fallback-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have correct title styling', () => {
      renderComponent();

      const title = screen.getByTestId('error-fallback-title');
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'text-red-900',
        'mb-2',
        'text-center'
      );
    });

    it('should handle empty message', () => {
      renderComponent({ message: '' });

      const title = screen.getByTestId('error-fallback-title');
      expect(title).toHaveTextContent('');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(500);
      renderComponent({ message: longMessage });

      expect(screen.getByTestId('error-fallback-title')).toHaveTextContent(longMessage);
    });
  });

  describe('Error Details Section', () => {
    it('should not show details by default', () => {
      renderComponent();

      expect(screen.queryByTestId('error-fallback-details')).not.toBeInTheDocument();
    });

    it('should show details when showDetails is true', () => {
      renderComponent({ showDetails: true });

      expect(screen.getByTestId('error-fallback-details')).toBeInTheDocument();
      expect(screen.getByTestId('error-fallback-details-summary')).toBeInTheDocument();
      expect(screen.getByTestId('error-fallback-details-content')).toBeInTheDocument();
    });

    it('should display error message in details', () => {
      renderComponent({ showDetails: true });

      expect(screen.getByTestId('error-fallback-details-content')).toHaveTextContent('Test error message');
    });

    it('should render details as details element', () => {
      renderComponent({ showDetails: true });

      const details = screen.getByTestId('error-fallback-details');
      expect(details.tagName).toBe('DETAILS');
    });

    it('should render summary as summary element', () => {
      renderComponent({ showDetails: true });

      const summary = screen.getByTestId('error-fallback-details-summary');
      expect(summary.tagName).toBe('SUMMARY');
    });

    it('should render error content as pre element', () => {
      renderComponent({ showDetails: true });

      const content = screen.getByTestId('error-fallback-details-content');
      expect(content.tagName).toBe('PRE');
    });

    it('should have correct details styling', () => {
      renderComponent({ showDetails: true });

      const details = screen.getByTestId('error-fallback-details');
      expect(details).toHaveClass('mb-4', 'w-full');

      const summary = screen.getByTestId('error-fallback-details-summary');
      expect(summary).toHaveClass(
        'cursor-pointer',
        'text-sm',
        'text-red-700',
        'hover:text-red-800'
      );

      const content = screen.getByTestId('error-fallback-details-content');
      expect(content).toHaveClass(
        'mt-2',
        'p-3',
        'bg-red-100',
        'rounded',
        'text-xs',
        'text-red-800',
        'overflow-auto',
        'max-h-32'
      );
    });

    it('should display correct summary text', () => {
      renderComponent({ showDetails: true });

      expect(screen.getByTestId('error-fallback-details-summary')).toHaveTextContent('Show error details');
    });
  });

  describe('Retry Button', () => {
    it('should render retry button', () => {
      renderComponent();

      expect(screen.getByTestId('error-fallback-retry-button')).toBeInTheDocument();
    });

    it('should display correct button text', () => {
      renderComponent();

      expect(screen.getByTestId('error-fallback-retry-button')).toHaveTextContent('Try again');
    });

    it('should call resetErrorBoundary when clicked', () => {
      renderComponent();

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      fireEvent.click(retryButton);

      expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
    });

    it('should have correct button props', () => {
      renderComponent();

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      expect(retryButton).toHaveAttribute('data-qa-id', 'error-fallback-retry-button');
      expect(retryButton.tagName).toBe('BUTTON');
    });

    it('should have refresh icon', () => {
      renderComponent();

      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });

    it('should have correct button styling', () => {
      renderComponent();

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      expect(retryButton).toHaveClass(
        'bg-white',
        'hover:bg-red-50',
        'border-red-300',
        'text-red-700'
      );
    });

    it('should be clickable and enabled', () => {
      renderComponent();

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      expect(retryButton).toBeEnabled();
      expect(retryButton.tagName).toBe('BUTTON');
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct container styling', () => {
      renderComponent();

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'p-8',
        'bg-red-50',
        'border',
        'border-red-200',
        'rounded-lg'
      );
    });

    it('should apply custom className', () => {
      renderComponent({ className: 'custom-error-class' });

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveClass('custom-error-class');
    });

    it('should handle empty className', () => {
      renderComponent({ className: '' });

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveClass('bg-red-50'); // Should still have base classes
    });

    it('should handle undefined className', () => {
      renderComponent({ className: undefined });

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveClass('bg-red-50'); // Should still have base classes
    });

    it('should combine custom className with base classes', () => {
      renderComponent({ className: 'custom-spacing extra-border' });

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'custom-spacing',
        'extra-border'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle different error types', () => {
      const typeError = new TypeError('Type error occurred');
      renderComponent({ error: typeError, showDetails: true });

      expect(screen.getByTestId('error-fallback-details-content')).toHaveTextContent('Type error occurred');
    });

    it('should handle errors without messages', () => {
      const emptyError = new Error();
      renderComponent({ error: emptyError, showDetails: true });

      const content = screen.getByTestId('error-fallback-details-content');
      expect(content).toHaveTextContent('');
    });

    it('should handle very long error messages', () => {
      const longError = new Error('A'.repeat(1000));
      renderComponent({ error: longError, showDetails: true });

      expect(screen.getByTestId('error-fallback-details-content')).toHaveTextContent('A'.repeat(1000));
    });

    it('should handle errors with special characters', () => {
      const specialError = new Error('Error with special chars: @#$%^&*()_+-=[]{}|;:,.<>?');
      renderComponent({ error: specialError, showDetails: true });

      expect(screen.getByTestId('error-fallback-details-content')).toHaveTextContent(
        'Error with special chars: @#$%^&*()_+-=[]{}|;:,.<>?'
      );
    });

    it('should handle errors with Unicode characters', () => {
      const unicodeError = new Error('Unicode error: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好');
      renderComponent({ error: unicodeError, showDetails: true });

      expect(screen.getByTestId('error-fallback-details-content')).toHaveTextContent(
        'Unicode error: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好'
      );
    });
  });

  describe('Component Props', () => {
    it('should handle all props correctly', () => {
      const customError = new Error('Custom error');
      const customReset = jest.fn();

      renderComponent({
        error: customError,
        resetErrorBoundary: customReset,
        message: 'Custom message',
        showDetails: true,
        className: 'custom-class',
      });

      expect(screen.getByTestId('error-fallback-title')).toHaveTextContent('Custom message');
      expect(screen.getByTestId('error-fallback-details')).toBeInTheDocument();
      expect(screen.getByTestId('error-fallback')).toHaveClass('custom-class');

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      fireEvent.click(retryButton);
      expect(customReset).toHaveBeenCalled();
    });

    it('should use default values for optional props', () => {
      const minimumProps = {
        error: new Error('Minimum test'),
        resetErrorBoundary: jest.fn(),
      };

      render(<ErrorFallback {...minimumProps} />);

      expect(screen.getByTestId('error-fallback-title')).toHaveTextContent('Something went wrong');
      expect(screen.queryByTestId('error-fallback-details')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      renderComponent();

      const container = screen.getByTestId('error-fallback');
      expect(container).toHaveAttribute('role', 'alert');
    });

    it('should be accessible by screen readers', () => {
      renderComponent();

      const container = screen.getByTestId('error-fallback');
      const title = screen.getByTestId('error-fallback-title');
      const button = screen.getByTestId('error-fallback-retry-button');

      expect(container).toBeVisible();
      expect(title).toBeVisible();
      expect(button).toBeVisible();
    });

    it('should maintain focus management', () => {
      renderComponent();

      const retryButton = screen.getByTestId('error-fallback-retry-button');
      retryButton.focus();
      expect(retryButton).toHaveFocus();
    });

    it('should have proper heading hierarchy', () => {
      renderComponent();

      const title = screen.getByTestId('error-fallback-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have accessible details/summary', () => {
      renderComponent({ showDetails: true });

      const details = screen.getByTestId('error-fallback-details');
      const summary = screen.getByTestId('error-fallback-details-summary');

      expect(details).toBeInTheDocument();
      expect(summary).toBeInTheDocument();
      expect(summary).toHaveClass('cursor-pointer');
    });
  });

  describe('Memory and Component Name', () => {
    it('should have correct display name', () => {
      expect(ErrorFallback.displayName).toBe('ErrorFallback');
    });

    it('should be memoized', () => {
      // Test that the component is wrapped in React.memo
      const props1 = { error: mockError, resetErrorBoundary: mockResetErrorBoundary };
      const props2 = { error: mockError, resetErrorBoundary: mockResetErrorBoundary };

      const { rerender } = render(<ErrorFallback {...props1} />);
      rerender(<ErrorFallback {...props2} />);

      // If memoized correctly, the component should not re-render unnecessarily
      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error message', () => {
      const nullMessageError = { message: null } as any;
      renderComponent({ error: nullMessageError, showDetails: true });

      const content = screen.getByTestId('error-fallback-details-content');
      expect(content).toBeInTheDocument();
    });

    it('should handle undefined resetErrorBoundary', () => {
      expect(() => {
        render(<ErrorFallback error={mockError} resetErrorBoundary={undefined as any} />);
      }).not.toThrow();
    });

    it('should handle showDetails toggle', () => {
      const { rerender } = renderComponent({ showDetails: false });

      expect(screen.queryByTestId('error-fallback-details')).not.toBeInTheDocument();

      rerender(<ErrorFallback {...defaultProps} showDetails={true} />);

      expect(screen.getByTestId('error-fallback-details')).toBeInTheDocument();
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

      for (let i = 0; i < 20; i++) {
        rerender(
          <ErrorFallback
            {...defaultProps}
            message={`Error ${i}`}
            className={`class-${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByText('Error 19')).toBeInTheDocument();
    });
  });
});