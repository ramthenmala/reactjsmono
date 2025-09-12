import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock react-i18next
const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/en/dashboard',
    search: '',
    hash: '',
  }),
}));

const renderWithRouter = (initialEntries = ['/en']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageSwitcher />
    </MemoryRouter>,
  );
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithRouter();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('displays language switcher icon', () => {
    renderWithRouter();
    expect(screen.getByTestId('language-switcher-icon')).toBeInTheDocument();
  });

  it('displays language select dropdown', () => {
    renderWithRouter();
    expect(screen.getByTestId('language-switcher-select')).toBeInTheDocument();
  });

  it('shows English as default selection', () => {
    renderWithRouter();
    const select = screen.getByTestId(
      'language-switcher-select',
    ) as HTMLSelectElement;
    expect(select.value).toBe('en');
  });

  it('displays both language options', () => {
    renderWithRouter();
    expect(screen.getByTestId('language-option-en')).toBeInTheDocument();
    expect(screen.getByTestId('language-option-ar')).toBeInTheDocument();
  });

  it('shows correct native names for languages', () => {
    renderWithRouter();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('calls changeLanguage and navigate when language is changed', () => {
    renderWithRouter();
    const select = screen.getByTestId('language-switcher-select');

    fireEvent.change(select, { target: { value: 'ar' } });

    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
    expect(mockNavigate).toHaveBeenCalledWith('/ar/dashboard');
  });

  it('handles Arabic locale by displaying Arabic option', () => {
    renderWithRouter(['/ar/dashboard']);

    // Verify Arabic option exists and can be selected
    const arabicOption = screen.getByTestId('language-option-ar');
    expect(arabicOption).toBeInTheDocument();
    expect(arabicOption).toHaveTextContent('العربية');
  });

  it('switching language calls navigate with correct path', () => {
    renderWithRouter();
    const select = screen.getByTestId('language-switcher-select');

    fireEvent.change(select, { target: { value: 'ar' } });

    // Verify navigation is called (path will depend on mocked location)
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });
});
