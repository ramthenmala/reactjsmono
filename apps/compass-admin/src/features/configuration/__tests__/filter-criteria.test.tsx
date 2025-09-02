import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterCriteriaPage } from '../filter-criteria';

// Mock PageHeader component
jest.mock('../../../components/ui/PageHeader', () => ({
  PageHeader: ({ titleKey }: any) => (
    <div data-qa-id="page-header" data-title-key={titleKey}>
      Page Header: {titleKey}
    </div>
  ),
}));

describe('FilterCriteriaPage', () => {
  it('renders without crashing', () => {
    render(<FilterCriteriaPage />);
    expect(screen.getByTestId('filter-criteria-page')).toBeInTheDocument();
  });

  it('renders page header with correct title key', () => {
    render(<FilterCriteriaPage />);
    
    const pageHeader = screen.getByTestId('page-header');
    expect(pageHeader).toBeInTheDocument();
    expect(pageHeader).toHaveAttribute('data-title-key', 'configuration.filterCriteria.title');
    expect(pageHeader).toHaveTextContent('Page Header: configuration.filterCriteria.title');
  });

  it('applies correct CSS classes', () => {
    render(<FilterCriteriaPage />);
    
    const page = screen.getByTestId('filter-criteria-page');
    expect(page).toHaveClass('space-y-6');
  });

  it('maintains component structure', () => {
    render(<FilterCriteriaPage />);
    
    const page = screen.getByTestId('filter-criteria-page');
    const header = screen.getByTestId('page-header');
    
    expect(page).toContainElement(header);
  });

  it('renders as a div element', () => {
    render(<FilterCriteriaPage />);
    
    const page = screen.getByTestId('filter-criteria-page');
    expect(page.tagName).toBe('DIV');
  });
});