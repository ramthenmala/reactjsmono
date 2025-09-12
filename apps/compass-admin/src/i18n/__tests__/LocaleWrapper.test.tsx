import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocaleWrapper } from '../LocaleWrapper';

// Mock react-i18next
const mockChangeLanguage = jest.fn();
const mockI18n = {
  language: 'fr', // Default to different language so changeLanguage gets called
  changeLanguage: mockChangeLanguage,
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

describe('LocaleWrapper', () => {
  const TestComponent = () => <div data-qa-id='test-content'>Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.dir = 'ltr';
    document.documentElement.className = '';
    document.documentElement.lang = '';

    // Set default mock values
    mockUseParams.mockReturnValue({ locale: 'en' });
    mockUseLocation.mockReturnValue({ pathname: '/en/dashboard' });
    mockNavigate.mockClear();
  });

  it('renders children content', () => {
    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('calls changeLanguage with locale', () => {
    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('sets document direction for LTR', () => {
    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(document.documentElement.dir).toBe('ltr');
  });

  it('adds locale CSS class', () => {
    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(document.documentElement.classList.contains('locale-en')).toBe(true);
  });

  it('sets document lang attribute', () => {
    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(document.documentElement.lang).toBe('en');
  });

  it('handles Arabic locale correctly', () => {
    mockUseParams.mockReturnValue({ locale: 'ar' });
    mockUseLocation.mockReturnValue({ pathname: '/ar/dashboard' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.classList.contains('locale-ar')).toBe(true);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });

  it('redirects when no locale is provided', () => {
    mockUseParams.mockReturnValue({});
    mockUseLocation.mockReturnValue({ pathname: '/dashboard' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/en/dashboard', {
      replace: true,
    });
  });

  it('redirects when unsupported locale is provided', () => {
    mockUseParams.mockReturnValue({ locale: 'fr' });
    mockUseLocation.mockReturnValue({ pathname: '/fr/dashboard' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    // Since '/fr/dashboard' doesn't start with '/en' or '/ar', it takes the else branch
    expect(mockNavigate).toHaveBeenCalledWith('/en/fr/dashboard', {
      replace: true,
    });
  });

  it('replaces existing locale in path when redirecting from ar to en', () => {
    mockUseParams.mockReturnValue({ locale: 'unsupported' });
    mockUseLocation.mockReturnValue({ pathname: '/ar/analytics' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/en/analytics', {
      replace: true,
    });
  });

  it('replaces existing locale in path when redirecting from en to en', () => {
    mockUseParams.mockReturnValue({ locale: 'invalid' });
    mockUseLocation.mockReturnValue({ pathname: '/en/users' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/en/users', { replace: true });
  });

  it('handles paths without locale prefix', () => {
    mockUseParams.mockReturnValue({ locale: null });
    mockUseLocation.mockReturnValue({ pathname: '/configuration' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(mockNavigate).toHaveBeenCalledWith('/en/configuration', {
      replace: true,
    });
  });

  it('removes previous locale classes when switching', () => {
    // Add existing classes
    document.documentElement.classList.add(
      'locale-ar',
      'locale-en',
      'other-class',
    );

    mockUseParams.mockReturnValue({ locale: 'en' });
    mockUseLocation.mockReturnValue({ pathname: '/en/dashboard' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    expect(document.documentElement.classList.contains('locale-ar')).toBe(
      false,
    );
    expect(document.documentElement.classList.contains('locale-en')).toBe(true);
    expect(document.documentElement.classList.contains('other-class')).toBe(
      true,
    );
  });

  it('does not call changeLanguage if language is already set', () => {
    // Temporarily set the i18n language to match the locale
    mockI18n.language = 'en';
    mockChangeLanguage.mockClear();

    mockUseParams.mockReturnValue({ locale: 'en' });
    mockUseLocation.mockReturnValue({ pathname: '/en/dashboard' });

    render(
      <LocaleWrapper>
        <TestComponent />
      </LocaleWrapper>,
    );

    // changeLanguage should not be called since language is already 'en'
    expect(mockChangeLanguage).not.toHaveBeenCalled();

    // Reset for other tests
    mockI18n.language = 'fr';
  });
});
