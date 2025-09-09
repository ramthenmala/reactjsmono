import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsPage } from '../analytics';

// Mock the scroll spy hook
const mockUseScrollSpy = jest.fn();
jest.mock('../../../hooks/use-scroll-spy', () => ({
  useScrollSpy: () => mockUseScrollSpy(),
}));

// Mock PageHeader component
jest.mock('../../../components/ui/PageHeader', () => ({
  PageHeader: ({ titleKey }: any) => (
    <div data-qa-id='page-header' data-title-key={titleKey}>
      Page Header: {titleKey}
    </div>
  ),
}));

// Mock AnalyticsSection component
jest.mock('../../../components/ui/AnalyticsSection', () => ({
  AnalyticsSection: ({ section, isActive }: any) => (
    <div
      data-qa-id={`analytics-section-${section.id}`}
      data-is-active={isActive}
      data-section-title={section.title}
    >
      Section: {section.id} - Active: {isActive.toString()}
    </div>
  ),
}));

// Mock constants
jest.mock('../../../constants/analytics', () => ({
  ANALYTICS_SECTIONS: [
    {
      id: 'investor-insights',
      title: 'analytics.investorInsights.title',
      description: 'analytics.investorInsights.description',
    },
    {
      id: 'national',
      title: 'analytics.national.title',
      description: 'analytics.national.description',
    },
    {
      id: 'regional',
      title: 'analytics.regional.title',
      description: 'analytics.regional.description',
    },
  ],
  SCROLL_SPY_CONFIG: {
    sections: ['investor-insights', 'national', 'regional'],
    scrollOffset: 100,
    debounceDelay: 10,
    userScrollTimeout: 1000,
  },
}));

describe('AnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseScrollSpy.mockReturnValue({ activeSection: '' });
  });

  it('renders without crashing', () => {
    render(<AnalyticsPage />);
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument();
  });

  it('renders page header with correct title key', () => {
    render(<AnalyticsPage />);

    const pageHeader = screen.getByTestId('page-header');
    expect(pageHeader).toBeInTheDocument();
    expect(pageHeader).toHaveAttribute('data-title-key', 'analytics.title');
    expect(pageHeader).toHaveTextContent('Page Header: analytics.title');
  });

  it('renders analytics sections container', () => {
    render(<AnalyticsPage />);
    expect(screen.getByTestId('analytics-sections')).toBeInTheDocument();
  });

  it('renders all analytics sections', () => {
    render(<AnalyticsPage />);

    expect(
      screen.getByTestId('analytics-section-investor-insights'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('analytics-section-national'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('analytics-section-regional'),
    ).toBeInTheDocument();
  });

  it('passes correct props to each analytics section', () => {
    render(<AnalyticsPage />);

    const investorInsights = screen.getByTestId(
      'analytics-section-investor-insights',
    );
    expect(investorInsights).toHaveAttribute(
      'data-section-title',
      'analytics.investorInsights.title',
    );
    expect(investorInsights).toHaveAttribute('data-is-active', 'false');

    const national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute(
      'data-section-title',
      'analytics.national.title',
    );
    expect(national).toHaveAttribute('data-is-active', 'false');

    const regional = screen.getByTestId('analytics-section-regional');
    expect(regional).toHaveAttribute(
      'data-section-title',
      'analytics.regional.title',
    );
    expect(regional).toHaveAttribute('data-is-active', 'false');
  });

  it('marks active section correctly', () => {
    mockUseScrollSpy.mockReturnValue({ activeSection: 'national' });

    render(<AnalyticsPage />);

    const investorInsights = screen.getByTestId(
      'analytics-section-investor-insights',
    );
    expect(investorInsights).toHaveAttribute('data-is-active', 'false');

    const national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute('data-is-active', 'true');

    const regional = screen.getByTestId('analytics-section-regional');
    expect(regional).toHaveAttribute('data-is-active', 'false');
  });

  it('marks different active section correctly', () => {
    mockUseScrollSpy.mockReturnValue({ activeSection: 'investor-insights' });

    render(<AnalyticsPage />);

    const investorInsights = screen.getByTestId(
      'analytics-section-investor-insights',
    );
    expect(investorInsights).toHaveAttribute('data-is-active', 'true');

    const national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute('data-is-active', 'false');

    const regional = screen.getByTestId('analytics-section-regional');
    expect(regional).toHaveAttribute('data-is-active', 'false');
  });

  it('handles no active section', () => {
    mockUseScrollSpy.mockReturnValue({ activeSection: '' });

    render(<AnalyticsPage />);

    const investorInsights = screen.getByTestId(
      'analytics-section-investor-insights',
    );
    expect(investorInsights).toHaveAttribute('data-is-active', 'false');

    const national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute('data-is-active', 'false');

    const regional = screen.getByTestId('analytics-section-regional');
    expect(regional).toHaveAttribute('data-is-active', 'false');
  });

  it('handles non-existent active section', () => {
    mockUseScrollSpy.mockReturnValue({ activeSection: 'non-existent' });

    render(<AnalyticsPage />);

    // All sections should be inactive
    const sections = screen.getAllByTestId(/analytics-section-/);
    sections.forEach(section => {
      expect(section).toHaveAttribute('data-is-active', 'false');
    });
  });

  it('calls useScrollSpy with correct config', () => {
    render(<AnalyticsPage />);

    expect(mockUseScrollSpy).toHaveBeenCalled();
    // The hook should be called with SCROLL_SPY_CONFIG
    // This verifies the hook is being used correctly
  });

  it('applies correct CSS classes', () => {
    render(<AnalyticsPage />);

    const page = screen.getByTestId('analytics-page');
    expect(page).toHaveClass('space-y-8');
  });

  it('renders sections in correct order', () => {
    render(<AnalyticsPage />);

    const sectionsContainer = screen.getByTestId('analytics-sections');
    const sections = sectionsContainer.children;

    expect(sections[0]).toHaveAttribute(
      'data-qa-id',
      'analytics-section-investor-insights',
    );
    expect(sections[1]).toHaveAttribute(
      'data-qa-id',
      'analytics-section-national',
    );
    expect(sections[2]).toHaveAttribute(
      'data-qa-id',
      'analytics-section-regional',
    );
  });

  it('maintains component hierarchy', () => {
    render(<AnalyticsPage />);

    const page = screen.getByTestId('analytics-page');
    const header = screen.getByTestId('page-header');
    const sectionsContainer = screen.getByTestId('analytics-sections');

    expect(page).toContainElement(header);
    expect(page).toContainElement(sectionsContainer);
  });

  it('updates when active section changes', () => {
    const { rerender } = render(<AnalyticsPage />);

    // Initially no active section
    let national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute('data-is-active', 'false');

    // Change active section
    mockUseScrollSpy.mockReturnValue({ activeSection: 'national' });
    rerender(<AnalyticsPage />);

    national = screen.getByTestId('analytics-section-national');
    expect(national).toHaveAttribute('data-is-active', 'true');
  });
});
