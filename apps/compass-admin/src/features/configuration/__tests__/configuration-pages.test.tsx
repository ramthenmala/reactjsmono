import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IsicRelevancePage } from '../isic-relevance';
import { FeaturedLandsPage } from '../featured-lands';
import { ConfigurationHistoryPage } from '../configuration-history';

// Mock PageHeader component
jest.mock('../../../components/ui/PageHeader', () => ({
  PageHeader: ({ titleKey }: any) => (
    <div data-qa-id="page-header" data-title-key={titleKey}>
      Page Header: {titleKey}
    </div>
  ),
}));

describe('Configuration Pages', () => {
  describe('IsicRelevancePage', () => {
    it('renders without crashing', () => {
      render(<IsicRelevancePage />);
      expect(screen.getByTestId('isic-relevance-page')).toBeInTheDocument();
    });

    it('renders page header with correct title key', () => {
      render(<IsicRelevancePage />);

      const pageHeader = screen.getByTestId('page-header');
      expect(pageHeader).toBeInTheDocument();
      expect(pageHeader).toHaveAttribute(
        'data-title-key',
        'configuration.isicRelevance.title'
      );
    });

    it('applies correct CSS classes', () => {
      render(<IsicRelevancePage />);

      const page = screen.getByTestId('isic-relevance-page');
      expect(page).toHaveClass('space-y-6');
    });

    it('maintains component structure', () => {
      render(<IsicRelevancePage />);

      const page = screen.getByTestId('isic-relevance-page');
      const header = screen.getByTestId('page-header');

      expect(page).toContainElement(header);
    });
  });

  describe('FeaturedLandsPage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders without crashing', () => {
      render(<FeaturedLandsPage />);
      expect(screen.getByTestId('featured-lands-page')).toBeInTheDocument();
    });

    it('renders page header with correct title key', () => {
      render(<FeaturedLandsPage />);

      const pageHeader = screen.getByTestId('page-header');
      expect(pageHeader).toBeInTheDocument();
      expect(pageHeader).toHaveAttribute(
        'data-title-key',
        'configuration.featuredLands.title'
      );
    });

    it('applies correct CSS classes', () => {
      render(<FeaturedLandsPage />);

      const page = screen.getByTestId('featured-lands-page');
      expect(page).toHaveClass('space-y-6');
    });

    it('maintains component structure', () => {
      render(<FeaturedLandsPage />);

      const page = screen.getByTestId('featured-lands-page');
      const header = screen.getByTestId('page-header');

      expect(page).toContainElement(header);
    });
  });

  describe('ConfigurationHistoryPage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders without crashing', () => {
      render(<ConfigurationHistoryPage />);
      expect(
        screen.getByTestId('configuration-history-page')
      ).toBeInTheDocument();
    });

    it('renders page header with correct title key', () => {
      render(<ConfigurationHistoryPage />);

      const pageHeader = screen.getByTestId('page-header');
      expect(pageHeader).toBeInTheDocument();
      expect(pageHeader).toHaveAttribute(
        'data-title-key',
        'configuration.configurationHistory.title'
      );
    });

    it('applies correct CSS classes', () => {
      render(<ConfigurationHistoryPage />);

      const page = screen.getByTestId('configuration-history-page');
      expect(page).toHaveClass('space-y-6');
    });

    it('maintains component structure', () => {
      render(<ConfigurationHistoryPage />);

      const page = screen.getByTestId('configuration-history-page');
      const header = screen.getByTestId('page-header');

      expect(page).toContainElement(header);
    });
  });

  describe('All Configuration Pages', () => {
    const configPages = [
      {
        Component: IsicRelevancePage,
        testId: 'isic-relevance-page',
        titleKey: 'configuration.isicRelevance.title',
      },
      {
        Component: FeaturedLandsPage,
        testId: 'featured-lands-page',
        titleKey: 'configuration.featuredLands.title',
      },
      {
        Component: ConfigurationHistoryPage,
        testId: 'configuration-history-page',
        titleKey: 'configuration.configurationHistory.title',
      },
    ];

    configPages.forEach(({ Component, testId, titleKey }) => {
      it(`${Component.name} renders as div element`, () => {
        render(<Component />);

        const page = screen.getByTestId(testId);
        expect(page.tagName).toBe('DIV');
      });

      it(`${Component.name} has consistent structure`, () => {
        render(<Component />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
        expect(screen.getByTestId('page-header')).toBeInTheDocument();
        expect(screen.getByTestId('page-header')).toHaveAttribute(
          'data-title-key',
          titleKey
        );
      });
    });
  });
});
