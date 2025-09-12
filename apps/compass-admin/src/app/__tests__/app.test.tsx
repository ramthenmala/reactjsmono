import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../app';

// Mock the AdminRoutes component
jest.mock('../../router', () => ({
  AdminRoutes: () => <div data-qa-id='admin-routes'>Admin Routes</div>,
}));

// Mock the i18n module
jest.mock('../../i18n');

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('admin-routes')).toBeInTheDocument();
  });

  it('renders AdminRoutes component', () => {
    render(<App />);
    expect(screen.getByText('Admin Routes')).toBeInTheDocument();
  });
});
