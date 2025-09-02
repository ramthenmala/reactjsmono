import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../app';

// Mock the NxWelcome component since it might have complex logic
jest.mock('../nx-welcome', () => {
  return function MockNxWelcome({ title }: { title: string }) {
    return <div data-testid="nx-welcome">Welcome: {title}</div>;
  };
});

describe('Webclient App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('nx-welcome')).toBeInTheDocument();
  });

  it('displays the correct title for webclient', () => {
    render(<App />);
    expect(
      screen.getByText('Welcome: @compass/webclient')
    ).toBeInTheDocument();
  });

  it('displays the WebClient shared UI demo section', () => {
    render(<App />);
    expect(screen.getByText('WebClient - Shared UI Demo')).toBeInTheDocument();
  });

  it('has proper app structure with padding', () => {
    const { container } = render(<App />);
    const appDiv = container.firstChild as HTMLElement;
    expect(appDiv).toHaveClass('p-8');
  });

  it('displays multiple sections with proper spacing', () => {
    const { container } = render(<App />);
    const sectionsContainer = container.querySelector('.mt-8.space-y-6');
    expect(sectionsContainer).toBeInTheDocument();
  });

  it('renders all button categories', () => {
    render(<App />);

    // Check for webclient specific sections
    expect(screen.getByText('Primary Actions')).toBeInTheDocument();
    expect(screen.getByText('Sign In Options')).toBeInTheDocument();
  });

  it('renders specific button text content', () => {
    render(<App />);

    // Test webclient specific button texts
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });
});
