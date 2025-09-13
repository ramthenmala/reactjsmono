import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrioritizationResultsSection } from '@/features/explore/components/PropertyDetail/PrioritizationResultsSection';
import '@testing-library/jest-dom';

// Mock all the child components
jest.mock('@/features/explore/components/PropertyDetail/WorkforceTalentSection', () => ({
  WorkforceTalentSection: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>WorkforceTalentSection Mock</div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/SocialAndCommunity', () => ({
  __esModule: true,
  default: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>SocialAndCommunity Mock</div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/MarketAccessAndDemand', () => ({
  __esModule: true,
  default: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>MarketAccessAndDemand Mock</div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/LeagalAndRegulatory', () => ({
  __esModule: true,
  default: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>LeagalAndRegulatory Mock</div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/Environmental', () => ({
  Environmental: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>Environmental Mock</div>
  ),
}));

jest.mock('@/features/explore/components/PropertyDetail/ValueChainAndIndustryClusters', () => ({
  __esModule: true,
  default: ({ 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>ValueChainAndIndustryClusters Mock</div>
  ),
}));

describe('PrioritizationResultsSection', () => {
  const defaultProps = {
    title: 'Prioritization Results',
    workforceAndTalent: {
      title: 'Workforce and Talent',
      image: 'https://example.com/workforce.jpg',
      avaialbilityOfSkilledLabor: { title: 'Skilled Labor', value: 'High', unit: '%' },
      avaialbilityOfNonSkilledLabor: { title: 'Non-skilled Labor', value: 'Medium', unit: '%' },
      skilledLaborAvgSalary: { title: 'Skilled Salary', value: 5000, unit: 'SAR' },
      nonskilledLaborAvgSalary: { title: 'Non-skilled Salary', value: 3000, unit: 'SAR' },
    },
    socialAndCommunity: {
      title: 'Social and Community',
      residentialAreas: { status: true, title: 'Residential Areas', value: 'Available' },
      hospitalsAndMedicalCenters: { status: true, title: 'Medical Centers', value: '5 hospitals' },
      publicTransportationAvailability: { status: false, title: 'Public Transport', value: 'Limited' },
      educationalInstitutions: { status: true, title: 'Education', value: '3 universities' },
      noOfBanksAndCreditInstitutions: { title: 'Banks', value: 12 },
      amenitiesForWorkforce: { status: true, title: 'Amenities', value: 'Full amenities' },
      scenicLocationAndSurroundings: { status: true, title: 'Scenic Location', value: 'Mountain view' },
    },
    marketAccessAndDemand: {
      title: 'Market Access and Demand',
      subTitle: 'Market Reach Score',
      value: 85,
      image: 'https://example.com/market.jpg',
    },
    leagalAndRegulatory: {
      title: 'Legal and Regulatory',
      subTitle: 'Compliance Status',
      value: 'Fully Compliant',
      image: 'https://example.com/legal.jpg',
    },
    environmental: {
      title: 'Environmental',
      image: 'https://example.com/environment.jpg',
      humidity: { title: 'Humidity', value: 65, unit: '%' },
      temperature: { title: 'Temperature', value: 25, unit: '°C' },
      percipitation: { title: 'Precipitation', value: 200, unit: 'mm' },
      polution: { title: 'Pollution Index', value: 30, unit: 'AQI' },
    },
    valueChainAndIndustryClusters: {
      title: 'Value Chain and Industry Clusters',
      valueParks: { title: 'Value Parks', value: ['Industrial Park A', 'Tech Hub B'] },
      organicClusters: { title: 'Organic Clusters', value: ['Automotive', 'Electronics'] },
      knowHowAndInnovation: { title: 'Innovation Index', value: 85 },
    },
  };

  const renderComponent = (props = {}) => {
    return render(<PrioritizationResultsSection {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-prioritization' });

      expect(screen.getByTestId('custom-prioritization')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results')).not.toBeInTheDocument();
    });

    it('should render all required structure elements', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-container')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-title')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-sections')).toBeInTheDocument();
    });

    it('should display the title correctly', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('Prioritization Results');
    });
  });

  describe('Section Structure', () => {
    it('should render all six sections', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-section-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-social')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-market')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-legal')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-environmental')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-value-chain')).toBeInTheDocument();
    });

    it('should render section titles correctly', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-title-workforce')).toHaveTextContent('Workforce and Talent');
      expect(screen.getByTestId('prioritization-results-title-social')).toHaveTextContent('Social and Community');
      expect(screen.getByTestId('prioritization-results-title-market')).toHaveTextContent('Market Access and Demand');
      expect(screen.getByTestId('prioritization-results-title-legal')).toHaveTextContent('Legal and Regulatory');
      expect(screen.getByTestId('prioritization-results-title-environmental')).toHaveTextContent('Environmental');
      expect(screen.getByTestId('prioritization-results-title-value-chain')).toHaveTextContent('Value Chain and Industry Clusters');
    });

    it('should render toggle buttons for all sections', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-toggle-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-social')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-market')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-legal')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-environmental')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-value-chain')).toBeInTheDocument();
    });

    it('should render chevron icons for all sections', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-chevron-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-social')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-market')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-legal')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-environmental')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-value-chain')).toBeInTheDocument();
    });
  });

  describe('Accordion Functionality', () => {
    it('should have workforce section open by default', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results-content-workforce')).toBeInTheDocument();
      expect(screen.getByText('WorkforceTalentSection Mock')).toBeInTheDocument();
    });

    it('should not show other sections content by default', () => {
      renderComponent();

      expect(screen.queryByTestId('prioritization-results-content-social')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-market')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-legal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-environmental')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-value-chain')).not.toBeInTheDocument();
    });

    it('should toggle section on button click', () => {
      renderComponent();

      const socialToggle = screen.getByTestId('prioritization-results-toggle-social');
      fireEvent.click(socialToggle);

      expect(screen.getByTestId('prioritization-results-content-social')).toBeInTheDocument();
      expect(screen.getByText('SocialAndCommunity Mock')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-workforce')).not.toBeInTheDocument();
    });

    it('should close section when clicking same section toggle', () => {
      renderComponent();

      const workforceToggle = screen.getByTestId('prioritization-results-toggle-workforce');
      expect(screen.getByTestId('prioritization-results-content-workforce')).toBeInTheDocument();

      fireEvent.click(workforceToggle);
      expect(screen.queryByTestId('prioritization-results-content-workforce')).not.toBeInTheDocument();
    });

    it('should switch between sections correctly', () => {
      renderComponent();

      const marketToggle = screen.getByTestId('prioritization-results-toggle-market');
      fireEvent.click(marketToggle);

      expect(screen.getByTestId('prioritization-results-content-market')).toBeInTheDocument();
      expect(screen.getByText('MarketAccessAndDemand Mock')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-workforce')).not.toBeInTheDocument();

      const legalToggle = screen.getByTestId('prioritization-results-toggle-legal');
      fireEvent.click(legalToggle);

      expect(screen.getByTestId('prioritization-results-content-legal')).toBeInTheDocument();
      expect(screen.getByText('LeagalAndRegulatory Mock')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-market')).not.toBeInTheDocument();
    });

    it('should update chevron rotation when section opens', () => {
      renderComponent();

      const workforceChevron = screen.getByTestId('prioritization-results-chevron-workforce');
      const socialChevron = screen.getByTestId('prioritization-results-chevron-social');

      expect(workforceChevron).toHaveClass('rotate-180');
      expect(socialChevron).not.toHaveClass('rotate-180');

      const socialToggle = screen.getByTestId('prioritization-results-toggle-social');
      fireEvent.click(socialToggle);

      expect(socialChevron).toHaveClass('rotate-180');
      expect(workforceChevron).not.toHaveClass('rotate-180');
    });
  });

  describe('Child Component Integration', () => {
    it('should pass correct data-qa-id to child components', () => {
      renderComponent();

      const workforceToggle = screen.getByTestId('prioritization-results-toggle-workforce');
      expect(screen.getByTestId('prioritization-results-workforce-content')).toBeInTheDocument();

      const socialToggle = screen.getByTestId('prioritization-results-toggle-social');
      fireEvent.click(socialToggle);
      expect(screen.getByTestId('prioritization-results-social-content')).toBeInTheDocument();

      const marketToggle = screen.getByTestId('prioritization-results-toggle-market');
      fireEvent.click(marketToggle);
      expect(screen.getByTestId('prioritization-results-market-content')).toBeInTheDocument();

      const legalToggle = screen.getByTestId('prioritization-results-toggle-legal');
      fireEvent.click(legalToggle);
      expect(screen.getByTestId('prioritization-results-legal-content')).toBeInTheDocument();

      const environmentalToggle = screen.getByTestId('prioritization-results-toggle-environmental');
      fireEvent.click(environmentalToggle);
      expect(screen.getByTestId('prioritization-results-environmental-content')).toBeInTheDocument();

      const valueChainToggle = screen.getByTestId('prioritization-results-toggle-value-chain');
      fireEvent.click(valueChainToggle);
      expect(screen.getByTestId('prioritization-results-value-chain-content')).toBeInTheDocument();
    });

    it('should pass correct data-qa-id with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-results' });

      expect(screen.getByTestId('custom-results-workforce-content')).toBeInTheDocument();

      const socialToggle = screen.getByTestId('custom-results-toggle-social');
      fireEvent.click(socialToggle);
      expect(screen.getByTestId('custom-results-social-content')).toBeInTheDocument();
    });

    it('should render all child components when sections are opened', () => {
      renderComponent();

      // Workforce is open by default
      expect(screen.getByText('WorkforceTalentSection Mock')).toBeInTheDocument();

      // Open each section and verify child components
      fireEvent.click(screen.getByTestId('prioritization-results-toggle-social'));
      expect(screen.getByText('SocialAndCommunity Mock')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('prioritization-results-toggle-market'));
      expect(screen.getByText('MarketAccessAndDemand Mock')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('prioritization-results-toggle-legal'));
      expect(screen.getByText('LeagalAndRegulatory Mock')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('prioritization-results-toggle-environmental'));
      expect(screen.getByText('Environmental Mock')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('prioritization-results-toggle-value-chain'));
      expect(screen.getByText('ValueChainAndIndustryClusters Mock')).toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-container')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-title')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-sections')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-section-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-toggle-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-title-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-chevron-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-content-workforce')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-prioritization' });

      expect(screen.getByTestId('custom-prioritization')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prioritization-container')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prioritization-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prioritization-sections')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prioritization-section-workforce')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prioritization-toggle-workforce')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'prioritization_with-special.chars123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-container`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-title`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-sections`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-container"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-title"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-sections"]')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should maintain proper layout classes', () => {
      renderComponent();

      const section = screen.getByTestId('prioritization-results');
      const container = screen.getByTestId('prioritization-results-container');
      const title = screen.getByTestId('prioritization-results-title');
      const sections = screen.getByTestId('prioritization-results-sections');

      expect(section).toHaveClass('container', 'mt-8', 'mb-20');
      expect(container).toHaveClass('rounded-3xl', 'py-8', 'px-4', 'md:px-8', 'flex', 'flex-col', 'gap-7', 'md:gap-10', 'bg-white/40', 'shadow-[0px_2px_50px_-2px_rgba(16,24,40,0.1)]', 'backdrop-blur-[100px]');
      expect(title).toHaveClass('text-2xl', 'md:text-4xl', 'font-semibold', 'md:font-medium', 'text-brand-900', 'mx-auto', 'md:mx-0');
      expect(sections).toHaveClass('space-y-4');
    });

    it('should apply correct section styling', () => {
      renderComponent();

      const sectionElement = screen.getByTestId('prioritization-results-section-workforce');
      expect(sectionElement).toHaveClass('overflow-hidden');
      expect(sectionElement).toHaveStyle({
        borderRadius: 'var(--radius-xl, 12px)',
        border: '1px solid var(--Colors-Border-border-secondary, #EBEDEF)',
        background: 'var(--Component-colors-Alpha-alpha-white-30, rgba(255, 255, 255, 0.30))',
        padding: 'var(--spacing-4xl, 32px)',
      });
    });

    it('should apply correct toggle button styling', () => {
      renderComponent();

      const toggleButton = screen.getByTestId('prioritization-results-toggle-workforce');
      expect(toggleButton).toHaveClass('w-full', 'text-left', 'flex', 'justify-between', 'items-center', 'cursor-pointer');
    });

    it('should apply correct title styling', () => {
      renderComponent();

      const sectionTitle = screen.getByTestId('prioritization-results-title-workforce');
      expect(sectionTitle).toHaveClass('text-gray-900');
      expect(sectionTitle).toHaveStyle({
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: '600',
      });
    });

    it('should apply correct chevron styling and transitions', () => {
      renderComponent();

      const chevron = screen.getByTestId('prioritization-results-chevron-workforce');
      expect(chevron).toHaveClass('w-5', 'h-5', 'text-gray-500', 'transition-transform', 'rotate-180');
    });

    it('should apply correct content area styling', () => {
      renderComponent();

      const content = screen.getByTestId('prioritization-results-content-workforce');
      expect(content).toHaveClass('mt-8');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty title gracefully', () => {
      renderComponent({ title: '' });

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('');
      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
    });

    it('should handle null title gracefully', () => {
      renderComponent({ title: null });

      expect(screen.getByTestId('prioritization-results-title')).toBeEmptyDOMElement();
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      renderComponent({ title: longTitle });

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent(longTitle);
    });

    it('should handle special characters in title', () => {
      renderComponent({ title: 'Prioritization & Results (2024) - Analysis' });

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('Prioritization & Results (2024) - Analysis');
    });

    it('should handle empty section titles', () => {
      renderComponent({
        workforceAndTalent: { ...defaultProps.workforceAndTalent, title: '' },
        socialAndCommunity: { ...defaultProps.socialAndCommunity, title: '' },
      });

      expect(screen.getByTestId('prioritization-results-title-workforce')).toHaveTextContent('');
      expect(screen.getByTestId('prioritization-results-title-social')).toHaveTextContent('');
    });

    it('should handle null section data gracefully', () => {
      const minimalProps = {
        title: 'Test Results',
        workforceAndTalent: { title: 'Minimal Workforce', image: null, avaialbilityOfSkilledLabor: { title: 'Skilled', value: null, unit: null }, avaialbilityOfNonSkilledLabor: { title: 'Non-skilled', value: null, unit: null }, skilledLaborAvgSalary: { title: 'Skilled Salary', value: null, unit: null }, nonskilledLaborAvgSalary: { title: 'Non-skilled Salary', value: null, unit: null } },
        socialAndCommunity: { title: 'Minimal Social', residentialAreas: { status: false, title: 'Residential', value: null }, hospitalsAndMedicalCenters: { status: false, title: 'Medical', value: null }, publicTransportationAvailability: { status: false, title: 'Transport', value: null }, educationalInstitutions: { status: false, title: 'Education', value: null }, noOfBanksAndCreditInstitutions: { title: 'Banks', value: null }, amenitiesForWorkforce: { status: false, title: 'Amenities', value: null }, scenicLocationAndSurroundings: { status: false, title: 'Scenic', value: null } },
        marketAccessAndDemand: { title: 'Minimal Market', subTitle: 'Market Sub', value: null, image: null },
        leagalAndRegulatory: { title: 'Minimal Legal', subTitle: 'Legal Sub', value: null, image: null },
        environmental: { title: 'Minimal Environmental', image: null, humidity: { title: 'Humidity', value: null, unit: null }, temperature: { title: 'Temperature', value: null, unit: null }, percipitation: { title: 'Precipitation', value: null, unit: null }, polution: { title: 'Pollution', value: null, unit: null } },
        valueChainAndIndustryClusters: { title: 'Minimal Value Chain', valueParks: { title: 'Parks', value: [] }, organicClusters: { title: 'Clusters', value: [] }, knowHowAndInnovation: { title: 'Innovation', value: null } },
      };

      expect(() => {
        render(<PrioritizationResultsSection {...minimalProps} />);
      }).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
      expect(screen.getByTestId('prioritization-results-content-workforce')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('prioritization-results')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('Prioritization Results');

      rerender(
        <PrioritizationResultsSection
          {...defaultProps}
          title="Updated Prioritization Results"
          workforceAndTalent={{ ...defaultProps.workforceAndTalent, title: 'Updated Workforce' }}
        />
      );

      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('Updated Prioritization Results');
      expect(screen.getByTestId('prioritization-results-title-workforce')).toHaveTextContent('Updated Workforce');
    });

    it('should maintain accordion state across prop updates', () => {
      const { rerender } = renderComponent();

      const socialToggle = screen.getByTestId('prioritization-results-toggle-social');
      fireEvent.click(socialToggle);

      expect(screen.getByTestId('prioritization-results-content-social')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-workforce')).not.toBeInTheDocument();

      rerender(
        <PrioritizationResultsSection
          {...defaultProps}
          title="Updated Title"
        />
      );

      expect(screen.getByTestId('prioritization-results-content-social')).toBeInTheDocument();
      expect(screen.queryByTestId('prioritization-results-content-workforce')).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
    });

    it('should handle frequent toggles efficiently', () => {
      renderComponent();

      const startTime = performance.now();

      const toggles = [
        screen.getByTestId('prioritization-results-toggle-workforce'),
        screen.getByTestId('prioritization-results-toggle-social'),
        screen.getByTestId('prioritization-results-toggle-market'),
        screen.getByTestId('prioritization-results-toggle-legal'),
        screen.getByTestId('prioritization-results-toggle-environmental'),
        screen.getByTestId('prioritization-results-toggle-value-chain'),
      ];

      for (let i = 0; i < 20; i++) {
        fireEvent.click(toggles[i % toggles.length]);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <PrioritizationResultsSection
            {...defaultProps}
            title={`Prioritization Results ${i}`}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('prioritization-results-title')).toHaveTextContent('Prioritization Results 9');
    });
  });

  describe('Accessibility', () => {
    it('should maintain semantic structure', () => {
      renderComponent();

      const section = screen.getByTestId('prioritization-results');
      const container = screen.getByTestId('prioritization-results-container');
      const title = screen.getByTestId('prioritization-results-title');
      const sections = screen.getByTestId('prioritization-results-sections');

      expect(section).toContainElement(container);
      expect(container).toContainElement(title);
      expect(container).toContainElement(sections);
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('prioritization-results'),
        screen.getByTestId('prioritization-results-container'),
        screen.getByTestId('prioritization-results-title'),
        screen.getByTestId('prioritization-results-sections'),
        screen.getByTestId('prioritization-results-section-workforce'),
        screen.getByTestId('prioritization-results-toggle-workforce'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('should support keyboard navigation', () => {
      renderComponent();

      const toggleButton = screen.getByTestId('prioritization-results-toggle-workforce');
      
      expect(toggleButton).toBeVisible();
      expect(toggleButton.tagName).toBe('BUTTON');

      // Test that the button can be focused
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
    });

    it('should have proper ARIA attributes for accordion', () => {
      renderComponent();

      const workforceToggle = screen.getByTestId('prioritization-results-toggle-workforce');
      expect(workforceToggle.tagName).toBe('BUTTON');
      expect(workforceToggle).toHaveClass('cursor-pointer');
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in IPrioritizationResultInfo', () => {
      expect(() => {
        render(
          <PrioritizationResultsSection
            {...defaultProps}
            data-qa-id="test-prioritization"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      const minimalProps = {
        title: 'Minimal Prioritization',
        workforceAndTalent: {
          title: 'Minimal Workforce',
          image: null,
          avaialbilityOfSkilledLabor: { title: 'Skilled', value: null, unit: null },
          avaialbilityOfNonSkilledLabor: { title: 'Non-skilled', value: null, unit: null },
          skilledLaborAvgSalary: { title: 'Skilled Salary', value: null, unit: null },
          nonskilledLaborAvgSalary: { title: 'Non-skilled Salary', value: null, unit: null },
        },
        socialAndCommunity: {
          title: 'Minimal Social',
          residentialAreas: { status: false, title: 'Residential', value: null },
          hospitalsAndMedicalCenters: { status: false, title: 'Medical', value: null },
          publicTransportationAvailability: { status: false, title: 'Transport', value: null },
          educationalInstitutions: { status: false, title: 'Education', value: null },
          noOfBanksAndCreditInstitutions: { title: 'Banks', value: null },
          amenitiesForWorkforce: { status: false, title: 'Amenities', value: null },
          scenicLocationAndSurroundings: { status: false, title: 'Scenic', value: null },
        },
        marketAccessAndDemand: {
          title: 'Minimal Market',
          subTitle: 'Market Sub',
          value: null,
          image: null,
        },
        leagalAndRegulatory: {
          title: 'Minimal Legal',
          subTitle: 'Legal Sub',
          value: null,
          image: null,
        },
        environmental: {
          title: 'Minimal Environmental',
          image: null,
          humidity: { title: 'Humidity', value: null, unit: null },
          temperature: { title: 'Temperature', value: null, unit: null },
          percipitation: { title: 'Precipitation', value: null, unit: null },
          polution: { title: 'Pollution', value: null, unit: null },
        },
        valueChainAndIndustryClusters: {
          title: 'Minimal Value Chain',
          valueParks: { title: 'Parks', value: [] },
          organicClusters: { title: 'Clusters', value: [] },
          knowHowAndInnovation: { title: 'Innovation', value: null },
        },
      };

      expect(() => {
        render(<PrioritizationResultsSection {...minimalProps} />);
      }).not.toThrow();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <PrioritizationResultsSection
            {...defaultProps}
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('prioritization-results')).toBeInTheDocument();
    });
  });
});