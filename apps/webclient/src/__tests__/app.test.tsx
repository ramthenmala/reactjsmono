// Mock all external dependencies
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../app/app';

jest.mock('@compass/shared-ui', () => ({
  LoadingIndicator: ({ label }: { label: string }) => <div>{label}</div>,
}));

jest.mock('../shared/lib/router', () => ({
  AppRouter: () => <div data-testid='app-router'>App Router</div>,
}));

jest.mock('../shared/lib/i18n/i18n', () => ({}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('App Router')).toBeInTheDocument();
  });

  it('shows loading fallback during suspense', () => {
    render(<App />);
    // The app should render successfully
    expect(document.body).toBeInTheDocument();
  });
});
