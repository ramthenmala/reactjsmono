import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConnectRequestsPage } from '../connect-requests';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ConnectRequestsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ConnectRequestsPage />);
    expect(screen.getByTestId('connect-requests-page')).toBeInTheDocument();
  });

  it('renders page container with correct classes', () => {
    render(<ConnectRequestsPage />);

    const page = screen.getByTestId('connect-requests-page');
    expect(page).toHaveClass('space-y-6');
  });

  it('renders title with correct translation key', () => {
    render(<ConnectRequestsPage />);

    const title = screen.getByTestId('connect-requests-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('navigation.connectRequests');
  });

  it('applies correct CSS classes to title', () => {
    render(<ConnectRequestsPage />);

    const title = screen.getByTestId('connect-requests-title');
    expect(title).toHaveClass(
      'text-3xl',
      'font-bold',
      'text-gray-900',
      'dark:text-white',
    );
  });

  it('title is an h1 element', () => {
    render(<ConnectRequestsPage />);

    const title = screen.getByTestId('connect-requests-title');
    expect(title.tagName).toBe('H1');
  });

  it('calls translation function with correct key', () => {
    render(<ConnectRequestsPage />);

    const title = screen.getByTestId('connect-requests-title');
    expect(title).toHaveTextContent('navigation.connectRequests');
  });

  it('maintains component structure', () => {
    render(<ConnectRequestsPage />);

    const page = screen.getByTestId('connect-requests-page');
    const title = screen.getByTestId('connect-requests-title');

    expect(page).toContainElement(title);
  });
});
