import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageHeader } from '../PageHeader';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PageHeader', () => {
  const defaultProps = {
    titleKey: 'test.title',
  };

  it('renders without crashing', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('displays the translated title', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByTestId('page-header-title')).toHaveTextContent(
      'test.title',
    );
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<PageHeader {...defaultProps} className={customClass} />);
    expect(screen.getByTestId('page-header')).toHaveClass(customClass);
  });

  it('shows border by default', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByTestId('page-header')).toHaveClass(
      'border-b',
      'border-gray-200',
      'pb-5',
    );
  });

  it('hides border when showBorder is false', () => {
    render(<PageHeader {...defaultProps} showBorder={false} />);
    expect(screen.getByTestId('page-header')).not.toHaveClass(
      'border-b',
      'border-gray-200',
      'pb-5',
    );
  });

  it('applies dark mode border classes', () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByTestId('page-header')).toHaveClass(
      'dark:border-gray-700',
    );
  });

  it('has correct heading structure', () => {
    render(<PageHeader {...defaultProps} />);
    const title = screen.getByTestId('page-header-title');
    expect(title.tagName).toBe('H1');
    expect(title).toHaveClass(
      'text-3xl',
      'font-bold',
      'text-gray-900',
      'dark:text-white',
    );
  });
});
