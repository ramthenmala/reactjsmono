import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardPage } from '../dashboard';

describe('DashboardPage', () => {
  it('renders without crashing', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('displays correct content', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard Page Content')).toBeInTheDocument();
  });

  it('has correct data-qa-id', () => {
    render(<DashboardPage />);
    const page = screen.getByTestId('dashboard-page');
    expect(page).toHaveAttribute('data-qa-id', 'dashboard-page');
  });

  it('renders as a div element', () => {
    render(<DashboardPage />);
    const page = screen.getByTestId('dashboard-page');
    expect(page.tagName).toBe('DIV');
  });
});
