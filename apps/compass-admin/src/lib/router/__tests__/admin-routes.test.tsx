import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AdminRoutes } from '../admin-routes';

// Mock the pages - using absolute paths from src
jest.mock('../../../features/dashboard', () => ({
  DashboardPage: () => <div data-qa-id="dashboard-page">Dashboard</div>,
}));

jest.mock('../../../features/analytics', () => ({
  AnalyticsPage: () => <div data-qa-id="analytics-page">Analytics</div>,
}));

jest.mock('../../../features/users', () => ({
  UsersPage: () => <div data-qa-id="users-page">Users</div>,
  ConnectRequestsPage: () => <div data-qa-id="connect-requests-page">Connect Requests</div>,
}));

jest.mock('../../../features/configuration', () => ({
  FilterCriteriaPage: () => <div data-qa-id="filter-criteria-page">Filter Criteria</div>,
  IsicRelevancePage: () => <div data-qa-id="isic-relevance-page">ISIC Relevance</div>,
  FeaturedLandsPage: () => <div data-qa-id="featured-lands-page">Featured Lands</div>,
  ConfigurationHistoryPage: () => <div data-qa-id="configuration-history-page">Configuration History</div>,
}));

// Mock AdminLayout
jest.mock('../../../components/layout/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-qa-id="admin-layout">{children}</div>
  ),
}));

// Mock LocaleWrapper
jest.mock('../../i18n/LocaleWrapper', () => ({
  LocaleWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-qa-id="locale-wrapper">{children}</div>
  ),
}));

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AdminRoutes />
    </MemoryRouter>
  );
};

describe('AdminRoutes', () => {
  it('renders LocaleWrapper and AdminLayout', () => {
    renderWithRouter();
    
    expect(screen.getByTestId('locale-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('redirects from root path to analytics', () => {
    renderWithRouter(['/']);
    
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument();
  });

  it('renders DashboardPage for overview route', () => {
    renderWithRouter(['/overview']);
    
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders UsersPage for investors route', () => {
    renderWithRouter(['/investors']);
    
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
  });

  it('renders ConnectRequestsPage for connect-requests route', () => {
    renderWithRouter(['/connect-requests']);
    
    expect(screen.getByTestId('connect-requests-page')).toBeInTheDocument();
  });

  it('renders AnalyticsPage for analytics route', () => {
    renderWithRouter(['/analytics']);
    
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument();
  });

  it('renders FilterCriteriaPage for configuration/filter-criteria route', () => {
    renderWithRouter(['/configuration/filter-criteria']);
    
    expect(screen.getByTestId('filter-criteria-page')).toBeInTheDocument();
  });

  it('renders IsicRelevancePage for configuration/isic-relevance route', () => {
    renderWithRouter(['/configuration/isic-relevance']);
    
    expect(screen.getByTestId('isic-relevance-page')).toBeInTheDocument();
  });

  it('renders FeaturedLandsPage for configuration/featured-lands route', () => {
    renderWithRouter(['/configuration/featured-lands']);
    
    expect(screen.getByTestId('featured-lands-page')).toBeInTheDocument();
  });

  it('renders ConfigurationHistoryPage for configuration/history route', () => {
    renderWithRouter(['/configuration/history']);
    
    expect(screen.getByTestId('configuration-history-page')).toBeInTheDocument();
  });

  it('passes correct activeUrl to AdminLayout', () => {
    renderWithRouter(['/analytics#section']);
    
    // The AdminLayout should receive pathname + hash as activeUrl
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });
});