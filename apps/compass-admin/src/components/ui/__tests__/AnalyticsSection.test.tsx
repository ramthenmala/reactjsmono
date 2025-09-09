import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsSection } from '../AnalyticsSection';
import type { AnalyticsSection as AnalyticsSectionType } from '../../../types/features';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'analytics.sections.national.title': 'National Analytics',
        'analytics.sections.national.description':
          'National level insights and data',
        'analytics.sections.regional.title': 'Regional Analytics',
        'analytics.sections.regional.description':
          'Regional level insights and data',
        'analytics.sections.investorInsights.title': 'Investor Insights',
        'analytics.sections.investorInsights.description':
          'Investor behavior and trends',
      };
      return translations[key] || key;
    },
  }),
}));

describe('AnalyticsSection', () => {
  const mockSectionWithDescription: AnalyticsSectionType = {
    id: 'national',
    title: 'analytics.sections.national.title',
    description: 'analytics.sections.national.description',
  };

  const mockSectionWithoutDescription: AnalyticsSectionType = {
    id: 'regional',
    title: 'analytics.sections.regional.title',
  };

  it('renders without crashing', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    expect(
      screen.getByTestId('analytics-section-national')
    ).toBeInTheDocument();
  });

  it('renders section with correct id and data-qa-id', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const section = screen.getByTestId('analytics-section-national');
    expect(section).toHaveAttribute('id', 'national');
    expect(section.tagName).toBe('SECTION');
  });

  it('displays translated title', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const title = screen.getByTestId('analytics-section-title-national');
    expect(title).toHaveTextContent('National Analytics');
    expect(title.tagName).toBe('H2');
  });

  it('displays translated description when provided', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const description = screen.getByTestId(
      'analytics-section-description-national'
    );
    expect(description).toHaveTextContent('National level insights and data');
    expect(description.tagName).toBe('P');
  });

  it('does not render description when not provided', () => {
    render(<AnalyticsSection section={mockSectionWithoutDescription} />);

    expect(
      screen.queryByTestId('analytics-section-description-regional')
    ).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to section', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const section = screen.getByTestId('analytics-section-national');
    expect(section).toHaveClass('scroll-mt-8', 'min-h-96');
  });

  it('applies correct CSS classes to title', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const title = screen.getByTestId('analytics-section-title-national');
    expect(title).toHaveClass(
      'text-2xl',
      'font-bold',
      'text-gray-900',
      'dark:text-white',
      'mb-4'
    );
  });

  it('applies correct CSS classes to description', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const description = screen.getByTestId(
      'analytics-section-description-national'
    );
    expect(description).toHaveClass(
      'text-gray-600',
      'dark:text-gray-400',
      'mb-6'
    );
  });

  it('handles different section IDs correctly', () => {
    const sections: AnalyticsSectionType[] = [
      {
        id: 'investor-insights',
        title: 'analytics.sections.investorInsights.title',
        description: 'analytics.sections.investorInsights.description',
      },
      {
        id: 'regional',
        title: 'analytics.sections.regional.title',
        description: 'analytics.sections.regional.description',
      },
      {
        id: 'city-metrics',
        title: 'City Metrics',
      },
    ];

    sections.forEach((section, index) => {
      const { unmount } = render(<AnalyticsSection section={section} />);

      expect(
        screen.getByTestId(`analytics-section-${section.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`analytics-section-title-${section.id}`)
      ).toBeInTheDocument();

      if (section.description) {
        expect(
          screen.getByTestId(`analytics-section-description-${section.id}`)
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByTestId(`analytics-section-description-${section.id}`)
        ).not.toBeInTheDocument();
      }

      unmount();
    });
  });

  it('handles isActive prop (currently unused but part of interface)', () => {
    const { unmount } = render(
      <AnalyticsSection section={mockSectionWithDescription} isActive={true} />
    );
    expect(
      screen.getByTestId('analytics-section-national')
    ).toBeInTheDocument();
    unmount();

    render(
      <AnalyticsSection section={mockSectionWithDescription} isActive={false} />
    );
    expect(
      screen.getByTestId('analytics-section-national')
    ).toBeInTheDocument();
  });

  it('handles translation keys that are not found', () => {
    const sectionWithUnknownKeys: AnalyticsSectionType = {
      id: 'national',
      title: 'unknown.title.key',
      description: 'unknown.description.key',
    };

    render(<AnalyticsSection section={sectionWithUnknownKeys} />);

    expect(
      screen.getByTestId('analytics-section-title-national')
    ).toHaveTextContent('unknown.title.key');
    expect(
      screen.getByTestId('analytics-section-description-national')
    ).toHaveTextContent('unknown.description.key');
  });

  it('renders all possible section IDs correctly', () => {
    const sectionIds = [
      'investor-insights',
      'industrial-city-insights',
      'national',
      'regional',
      'city-metrics',
      'sector-view',
    ] as const;

    sectionIds.forEach((id) => {
      const section: AnalyticsSectionType = {
        id,
        title: `Title for ${id}`,
        description: `Description for ${id}`,
      };

      const { unmount } = render(<AnalyticsSection section={section} />);

      expect(screen.getByTestId(`analytics-section-${id}`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`analytics-section-title-${id}`)
      ).toHaveTextContent(`Title for ${id}`);
      expect(
        screen.getByTestId(`analytics-section-description-${id}`)
      ).toHaveTextContent(`Description for ${id}`);

      unmount();
    });
  });

  it('handles empty description string', () => {
    const sectionWithEmptyDescription: AnalyticsSectionType = {
      id: 'national',
      title: 'analytics.sections.national.title',
      description: '',
    };

    render(<AnalyticsSection section={sectionWithEmptyDescription} />);

    // Empty string is falsy, so description should not be rendered
    expect(
      screen.queryByTestId('analytics-section-description-national')
    ).not.toBeInTheDocument();
  });

  it('handles very long titles and descriptions', () => {
    const longTitle = 'A'.repeat(100);
    const longDescription = 'B'.repeat(500);

    const sectionWithLongContent: AnalyticsSectionType = {
      id: 'national',
      title: longTitle,
      description: longDescription,
    };

    render(<AnalyticsSection section={sectionWithLongContent} />);

    expect(
      screen.getByTestId('analytics-section-title-national')
    ).toHaveTextContent(longTitle);
    expect(
      screen.getByTestId('analytics-section-description-national')
    ).toHaveTextContent(longDescription);
  });

  it('maintains proper semantic HTML structure', () => {
    render(<AnalyticsSection section={mockSectionWithDescription} />);

    const section = screen.getByTestId('analytics-section-national');
    const title = screen.getByTestId('analytics-section-title-national');
    const description = screen.getByTestId(
      'analytics-section-description-national'
    );

    expect(section.tagName).toBe('SECTION');
    expect(title.tagName).toBe('H2');
    expect(description.tagName).toBe('P');

    // Check hierarchy
    expect(section).toContainElement(title);
    expect(section).toContainElement(description);
  });
});
