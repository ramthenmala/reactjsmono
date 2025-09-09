import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UsersPage } from '../users';

describe('UsersPage', () => {
  it('renders without crashing', () => {
    render(<UsersPage />);
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
  });

  it('displays correct content', () => {
    render(<UsersPage />);
    expect(screen.getByText('Users Page Content')).toBeInTheDocument();
  });

  it('has correct data-qa-id', () => {
    render(<UsersPage />);
    const page = screen.getByTestId('users-page');
    expect(page).toHaveAttribute('data-qa-id', 'users-page');
  });

  it('renders as a div element', () => {
    render(<UsersPage />);
    const page = screen.getByTestId('users-page');
    expect(page.tagName).toBe('DIV');
  });
});
