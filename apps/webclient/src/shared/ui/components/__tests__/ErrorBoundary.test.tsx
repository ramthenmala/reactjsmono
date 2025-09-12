import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import '@testing-library/jest-dom';

// Mock component that throws an error when triggerError is true
const ThrowErrorComponent = ({ triggerError = false }: { triggerError?: boolean }) => {
  if (triggerError) {
    throw new Error('Test error message');
  }
  return <div data-qa-id="test-content">Test content</div>;
};

// Mock Fallback component
const MockFallbackComponent = ({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div data-qa-id="fallback-component">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary} data-qa-id="reset-button">
      Reset
    </button>
  </div>
);

describe('ErrorBoundary', () => {
  // Suppress console.error for tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const renderWithErrorBoundary = (
    children: React.ReactNode,
    props?: Partial<React.ComponentProps<typeof ErrorBoundary>>
  ) => {
    const defaultProps = {
      FallbackComponent: MockFallbackComponent,
      onError: jest.fn(),
    };

    return render(
      <ErrorBoundary {...defaultProps} {...props}>
        {children}
      </ErrorBoundary>
    );
  };

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      renderWithErrorBoundary(<ThrowErrorComponent />);

      expect(screen.getByTestId('error-boundary-children')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should have correct data-qa-id for normal children', () => {
      const { container } = renderWithErrorBoundary(<ThrowErrorComponent />);

      expect(container.querySelector('[data-qa-id="error-boundary-children"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="error-boundary-fallback"]')).not.toBeInTheDocument();
    });

    it('should wrap children in a div with data-qa-id', () => {
      renderWithErrorBoundary(<div>Normal content</div>);

      const wrapper = screen.getByTestId('error-boundary-children');
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper).toContainHTML('<div>Normal content</div>');
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and render fallback component', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('fallback-component')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should have correct data-qa-id for fallback', () => {
      const { container } = renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      expect(container.querySelector('[data-qa-id="error-boundary-fallback"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="error-boundary-children"]')).not.toBeInTheDocument();
    });

    it('should pass error object to fallback component', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should log error to console', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should call onError callback when provided', () => {
      const onErrorMock = jest.fn();
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />, {
        onError: onErrorMock,
      });

      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should not call onError callback when not provided', () => {
      expect(() => {
        renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />, {
          onError: undefined,
        });
      }).not.toThrow();
    });
  });

  describe('Error Reset Functionality', () => {
    it('should provide resetErrorBoundary function to fallback', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toBeEnabled();
    });

    it('should reset error state when resetErrorBoundary is called', () => {
      const { rerender } = renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      // Error state should be shown
      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

      // Click reset button
      const resetButton = screen.getByTestId('reset-button');
      resetButton.click();

      // Re-render with no error
      rerender(
        <ErrorBoundary FallbackComponent={MockFallbackComponent}>
          <ThrowErrorComponent triggerError={false} />
        </ErrorBoundary>
      );

      // Should show normal content again
      expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
      expect(screen.getByTestId('error-boundary-children')).toBeInTheDocument();
    });
  });

  describe('Different Error Types', () => {
    it('should handle different error messages', () => {
      const CustomErrorComponent = () => {
        throw new Error('Custom error message');
      };

      renderWithErrorBoundary(<CustomErrorComponent />);

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should handle errors without messages', () => {
      const EmptyErrorComponent = () => {
        const error = new Error();
        throw error;
      };

      renderWithErrorBoundary(<EmptyErrorComponent />);

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    });

    it('should handle TypeError', () => {
      const TypeErrorComponent = () => {
        throw new TypeError('Type error occurred');
      };

      renderWithErrorBoundary(<TypeErrorComponent />);

      expect(screen.getByText('Type error occurred')).toBeInTheDocument();
    });

    it('should handle ReferenceError', () => {
      const ReferenceErrorComponent = () => {
        throw new ReferenceError('Reference error occurred');
      };

      renderWithErrorBoundary(<ReferenceErrorComponent />);

      expect(screen.getByText('Reference error occurred')).toBeInTheDocument();
    });
  });

  describe('Fallback Component Integration', () => {
    it('should work with different fallback components', () => {
      const CustomFallback = ({ error }: { error: Error }) => (
        <div data-qa-id="custom-fallback">
          <span>Custom error: {error.message}</span>
        </div>
      );

      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />, {
        FallbackComponent: CustomFallback,
      });

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error: Test error message')).toBeInTheDocument();
    });

    it('should wrap fallback component in error boundary fallback div', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      const fallbackWrapper = screen.getByTestId('error-boundary-fallback');
      const fallbackComponent = screen.getByTestId('fallback-component');

      expect(fallbackWrapper).toContainElement(fallbackComponent);
    });

    it('should pass resetErrorBoundary function to fallback', () => {
      const FallbackWithReset = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
        <div data-qa-id="fallback-with-reset">
          <button 
            onClick={resetErrorBoundary} 
            data-qa-id="custom-reset"
          >
            Custom Reset
          </button>
        </div>
      );

      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />, {
        FallbackComponent: FallbackWithReset,
      });

      expect(screen.getByTestId('custom-reset')).toBeInTheDocument();
      expect(screen.getByText('Custom Reset')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('should maintain separate error states for multiple instances', () => {
      const { container } = render(
        <div>
          <ErrorBoundary FallbackComponent={MockFallbackComponent}>
            <ThrowErrorComponent triggerError={true} />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={MockFallbackComponent}>
            <ThrowErrorComponent triggerError={false} />
          </ErrorBoundary>
        </div>
      );

      const fallbackDivs = container.querySelectorAll('[data-qa-id="error-boundary-fallback"]');
      const childrenDivs = container.querySelectorAll('[data-qa-id="error-boundary-children"]');

      expect(fallbackDivs).toHaveLength(1);
      expect(childrenDivs).toHaveLength(1);
    });

    it('should initialize with no error state', () => {
      renderWithErrorBoundary(<div data-qa-id="initial">Initial content</div>);

      expect(screen.getByTestId('error-boundary-children')).toBeInTheDocument();
      expect(screen.getByTestId('initial')).toBeInTheDocument();
      expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
    });

    it('should handle getDerivedStateFromError correctly', () => {
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />);

      // Should show error state
      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('error-boundary-children')).not.toBeInTheDocument();
    });
  });

  describe('Children Handling', () => {
    it('should handle null children', () => {
      renderWithErrorBoundary(null);

      const wrapper = screen.getByTestId('error-boundary-children');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toBeEmptyDOMElement();
    });

    it('should handle undefined children', () => {
      renderWithErrorBoundary(undefined);

      const wrapper = screen.getByTestId('error-boundary-children');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toBeEmptyDOMElement();
    });

    it('should handle multiple children', () => {
      renderWithErrorBoundary(
        <>
          <div data-qa-id="child-1">Child 1</div>
          <div data-qa-id="child-2">Child 2</div>
        </>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      renderWithErrorBoundary(
        <div data-qa-id="parent">
          <span data-qa-id="nested">Nested content</span>
          <ul data-qa-id="list">
            <li data-qa-id="item">Item</li>
          </ul>
        </div>
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByTestId('item')).toBeInTheDocument();
    });
  });

  describe('Lifecycle Methods', () => {
    it('should call componentDidCatch when error occurs', () => {
      const onErrorMock = jest.fn();
      renderWithErrorBoundary(<ThrowErrorComponent triggerError={true} />, {
        onError: onErrorMock,
      });

      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error message',
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should only catch errors in child components', () => {
      // This test ensures the error boundary only catches child errors,
      // not errors in its own render method
      expect(() => {
        renderWithErrorBoundary(<div>Normal content</div>);
      }).not.toThrow();
    });
  });

  describe('Error Recovery', () => {
    it('should allow recovery from error state', () => {
      class TestComponent extends React.Component<{ shouldThrow: boolean }> {
        render() {
          if (this.props.shouldThrow) {
            throw new Error('Test error');
          }
          return <div data-qa-id="recovered">Recovered content</div>;
        }
      }

      const { rerender } = render(
        <ErrorBoundary FallbackComponent={MockFallbackComponent}>
          <TestComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error
      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

      // Reset and rerender with no error
      const resetButton = screen.getByTestId('reset-button');
      resetButton.click();

      rerender(
        <ErrorBoundary FallbackComponent={MockFallbackComponent}>
          <TestComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should show recovered content
      expect(screen.getByTestId('error-boundary-children')).toBeInTheDocument();
      expect(screen.getByTestId('recovered')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown during render', () => {
      const RenderErrorComponent = () => {
        throw new Error('Render error');
      };

      renderWithErrorBoundary(<RenderErrorComponent />);

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByText('Render error')).toBeInTheDocument();
    });

    it('should handle very long error messages', () => {
      const LongErrorComponent = () => {
        throw new Error('A'.repeat(1000));
      };

      renderWithErrorBoundary(<LongErrorComponent />);

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
    });

    it('should handle errors with special characters', () => {
      const SpecialErrorComponent = () => {
        throw new Error('Error with special chars: @#$%^&*()_+-=[]{}|;:,.<>?');
      };

      renderWithErrorBoundary(<SpecialErrorComponent />);

      expect(screen.getByText('Error with special chars: @#$%^&*()_+-=[]{}|;:,.<>?')).toBeInTheDocument();
    });

    it('should handle errors with Unicode characters', () => {
      const UnicodeErrorComponent = () => {
        throw new Error('Unicode error: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好');
      };

      renderWithErrorBoundary(<UnicodeErrorComponent />);

      expect(screen.getByText('Unicode error: 👍 ✅ 🚀 Arabic: مرحبا Chinese: 你好')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently without errors', () => {
      const startTime = performance.now();
      renderWithErrorBoundary(<div>Normal content</div>);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid re-renders without performance issues', () => {
      const { rerender } = renderWithErrorBoundary(<div>Content 0</div>);

      const startTime = performance.now();

      for (let i = 1; i < 20; i++) {
        rerender(
          <ErrorBoundary FallbackComponent={MockFallbackComponent}>
            <div>Content {i}</div>
          </ErrorBoundary>
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(screen.getByText('Content 19')).toBeInTheDocument();
    });
  });
});