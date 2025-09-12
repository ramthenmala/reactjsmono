import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RTLWrapper } from './RTLWrapper';

// Mock the LanguageContext
jest.mock('i18n/LanguageContext', () => ({
  useLanguage: jest.fn(),
}));

import { useLanguage } from 'i18n/LanguageContext';

describe('RTLWrapper', () => {
  const mockUseLanguage = useLanguage as jest.MockedFunction<
    typeof useLanguage
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    mockUseLanguage.mockReturnValue({
      language: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
    });

    render(
      <RTLWrapper>
        <div>Test Content</div>
      </RTLWrapper>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies LTR classes when isRTL is false', () => {
    mockUseLanguage.mockReturnValue({
      language: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
    });

    const { container } = render(
      <RTLWrapper>
        <div>Test Content</div>
      </RTLWrapper>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('ltr');
    expect(wrapper).not.toHaveClass('rtl');
    expect(wrapper).toHaveAttribute('dir', 'ltr');
  });

  it('applies RTL classes when isRTL is true', () => {
    mockUseLanguage.mockReturnValue({
      language: 'ar',
      isRTL: true,
      direction: 'rtl',
      changeLanguage: jest.fn(),
    });

    const { container } = render(
      <RTLWrapper>
        <div>Test Content</div>
      </RTLWrapper>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('rtl');
    expect(wrapper).not.toHaveClass('ltr');
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('applies custom className', () => {
    mockUseLanguage.mockReturnValue({
      language: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
    });

    const { container } = render(
      <RTLWrapper className='custom-class'>
        <div>Test Content</div>
      </RTLWrapper>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveClass('rtl-wrapper');
  });

  it('renders multiple children', () => {
    mockUseLanguage.mockReturnValue({
      language: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
    });

    render(
      <RTLWrapper>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </RTLWrapper>,
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });
});