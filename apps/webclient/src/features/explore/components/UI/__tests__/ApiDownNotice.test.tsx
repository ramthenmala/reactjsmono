import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApiDownNotice } from '../ApiDownNotice';

// Mock Hero component
jest.mock('../../../../../shared/ui/components/Hero', () => ({
  Hero: ({ title, subtitle, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId || 'hero'}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

describe('ApiDownNotice', () => {
  describe('Rendering', () => {
    it('should render ApiDownNotice with default data-qa-id', () => {
      render(<ApiDownNotice />);

      expect(screen.getByTestId('api-down-notice')).toBeInTheDocument();
      expect(screen.getByTestId('api-down-notice-hero')).toBeInTheDocument();
      expect(screen.getByTestId('api-down-notice-content')).toBeInTheDocument();
      expect(screen.getByTestId('api-down-notice-container')).toBeInTheDocument();
    });

    it('should render ApiDownNotice with custom data-qa-id', () => {
      render(<ApiDownNotice data-qa-id="custom-notice" />);

      expect(screen.getByTestId('custom-notice')).toBeInTheDocument();
      expect(screen.getByTestId('custom-notice-hero')).toBeInTheDocument();
      expect(screen.getByTestId('custom-notice-content')).toBeInTheDocument();
      expect(screen.getByTestId('custom-notice-container')).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should display the correct title and message', () => {
      render(<ApiDownNotice />);

      expect(screen.getByTestId('api-down-notice-title')).toHaveTextContent('Service temporarily unavailable');
      expect(screen.getByTestId('api-down-notice-message')).toHaveTextContent(
        "We couldn't reach the backend. Please start CMS & API locally, or use mock env:"
      );
    });

    it('should render Hero component with correct props', () => {
      render(<ApiDownNotice />);

      const hero = screen.getByTestId('api-down-notice-hero');
      expect(hero).toBeInTheDocument();
      expect(within(hero).getByText('Service temporarily unavailable')).toBeInTheDocument();
      expect(within(hero).getByText("We couldn't reach the backend. Please start CMS & API locally, or use mock env:")).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render action buttons container', () => {
      render(<ApiDownNotice />);

      expect(screen.getByTestId('api-down-notice-actions')).toBeInTheDocument();
    });

    it('should render retry button with correct attributes', () => {
      render(<ApiDownNotice />);

      const retryButton = screen.getByTestId('api-down-notice-retry-button');
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveTextContent('Retry');
      expect(retryButton).toHaveAttribute('href', '');
      expect(retryButton.tagName).toBe('A');
    });

    it('should render home button with correct attributes', () => {
      render(<ApiDownNotice />);

      const homeButton = screen.getByTestId('api-down-notice-home-button');
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveTextContent('Go Home');
      expect(homeButton).toHaveAttribute('href', '/');
      expect(homeButton.tagName).toBe('A');
    });
  });

  describe('Structure and Layout', () => {
    it('should have correct main element structure', () => {
      render(<ApiDownNotice />);

      const main = screen.getByTestId('api-down-notice');
      expect(main.tagName).toBe('MAIN');
      expect(main).toHaveClass('flex', 'min-h-dvh', 'flex-col');
    });

    it('should have correct section structure', () => {
      render(<ApiDownNotice />);

      const section = screen.getByTestId('api-down-notice-content');
      expect(section.tagName).toBe('SECTION');
      expect(section).toHaveClass('flex', 'flex-1', 'items-center', 'justify-center');
    });

    it('should have correct container structure', () => {
      render(<ApiDownNotice />);

      const container = screen.getByTestId('api-down-notice-container');
      expect(container).toHaveClass('w-full', 'max-w-xl', 'text-center');
    });
  });

  describe('Data QA ID Hierarchy', () => {
    it('should maintain proper hierarchical data-qa-id structure', () => {
      render(<ApiDownNotice data-qa-id="test-notice" />);

      expect(screen.getByTestId('test-notice')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-hero')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-container')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-title')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-message')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-actions')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-retry-button')).toBeInTheDocument();
      expect(screen.getByTestId('test-notice-home-button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ApiDownNotice />);

      // Hero should contain h1 (from mocked Hero component)
      const hero = screen.getByTestId('api-down-notice-hero');
      expect(within(hero).getByRole('heading', { level: 1 })).toBeInTheDocument();

      // Main content should have h2
      const title = screen.getByTestId('api-down-notice-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have proper semantic structure', () => {
      render(<ApiDownNotice />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes to main element', () => {
      render(<ApiDownNotice />);

      const main = screen.getByTestId('api-down-notice');
      expect(main).toHaveClass(
        'flex',
        'min-h-dvh',
        'flex-col',
        'bg-gradient-to-b',
        'from-white',
        'via-[#FAF9FF]',
        'to-[#FAF9FF]'
      );
    });

    it('should apply correct CSS classes to title', () => {
      render(<ApiDownNotice />);

      const title = screen.getByTestId('api-down-notice-title');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'text-[#171B23]');
    });

    it('should apply correct CSS classes to message', () => {
      render(<ApiDownNotice />);

      const message = screen.getByTestId('api-down-notice-message');
      expect(message).toHaveClass('mt-3', 'text-sm', 'text-[#667085]');
    });

    it('should apply correct CSS classes to retry button', () => {
      render(<ApiDownNotice />);

      const retryButton = screen.getByTestId('api-down-notice-retry-button');
      expect(retryButton).toHaveClass(
        'rounded-xl',
        'bg-[#5547B5]',
        'px-5',
        'py-2',
        'text-white'
      );
    });

    it('should apply correct CSS classes to home button', () => {
      render(<ApiDownNotice />);

      const homeButton = screen.getByTestId('api-down-notice-home-button');
      expect(homeButton).toHaveClass(
        'rounded-xl',
        'border',
        'px-5',
        'py-2',
        'text-sm'
      );
    });
  });

  describe('Props Handling', () => {
    it('should work without any props', () => {
      render(<ApiDownNotice />);

      expect(screen.getByTestId('api-down-notice')).toBeInTheDocument();
    });

    it('should handle empty props object', () => {
      render(<ApiDownNotice {...{}} />);

      expect(screen.getByTestId('api-down-notice')).toBeInTheDocument();
    });
  });
});

// Helper function for better testing
function within(element: HTMLElement) {
  return {
    getByText: (text: string) => {
      const textElement = Array.from(element.querySelectorAll('*')).find(
        el => el.textContent === text
      );
      if (!textElement) {
        throw new Error(`Text "${text}" not found within element`);
      }
      return textElement as HTMLElement;
    },
    getByRole: (role: string, options?: { level?: number }) => {
      const roleElement = element.querySelector(`[role="${role}"]`) ||
        (options?.level ? element.querySelector(`h${options.level}`) : null);
      if (!roleElement) {
        throw new Error(`Role "${role}" not found within element`);
      }
      return roleElement as HTMLElement;
    },
  };
}