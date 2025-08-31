import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../app';

// Mock the NxWelcome component since it might have complex logic
jest.mock('../nx-welcome', () => {
  return function MockNxWelcome({ title }: { title: string }) {
    return <div data-testid="nx-welcome">Welcome: {title}</div>;
  };
});

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('nx-welcome')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<App />);
    expect(
      screen.getByText('Welcome: @compassnew/compass-admin')
    ).toBeInTheDocument();
  });

  it('displays the shared UI components demo section', () => {
    render(<App />);
    expect(screen.getByText('Shared UI Components Demo')).toBeInTheDocument();
  });

  it('displays buttons section', () => {
    render(<App />);
    expect(screen.getByText('Buttons')).toBeInTheDocument();
  });

  it('displays utility buttons section', () => {
    render(<App />);
    expect(screen.getByText('Utility Buttons')).toBeInTheDocument();
  });

  it('displays social buttons section', () => {
    render(<App />);
    expect(screen.getByText('Social Buttons')).toBeInTheDocument();
  });

  it('displays app store buttons section', () => {
    render(<App />);
    expect(screen.getByText('App Store Buttons')).toBeInTheDocument();
  });

  it('displays tooltips section', () => {
    render(<App />);
    expect(screen.getByText('Tooltips')).toBeInTheDocument();
  });

  it('renders primary button', () => {
    render(<App />);
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
  });

  it('renders secondary button', () => {
    render(<App />);
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
  });

  it('renders tertiary button', () => {
    render(<App />);
    expect(screen.getByText('Tertiary Button')).toBeInTheDocument();
  });
});
