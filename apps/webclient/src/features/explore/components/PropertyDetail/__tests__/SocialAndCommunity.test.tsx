import React from 'react';
import { render, screen } from '@testing-library/react';
import SocialAndCommunity from '@/features/explore/components/PropertyDetail/SocialAndCommunity';
import '@testing-library/jest-dom';

jest.mock('../../UI/StatCard', () => ({
  __esModule: true,
  default: ({ label, value, icon, 'data-qa-id': dataQaId }: any) => (
    <div data-qa-id={dataQaId}>
      <div data-qa-id={`${dataQaId}-label`}>{label}</div>
      <div data-qa-id={`${dataQaId}-value`}>{value}</div>
      <div data-qa-id={`${dataQaId}-icon`}>{icon}</div>
    </div>
  ),
}));

jest.mock('@compass/shared-ui', () => ({
  BadgeWithIcon: ({ type, color, size, iconTrailing, children, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId || 'badge-with-icon'}
      data-type={type}
      data-color={color}
      data-size={size}
      data-icon-trailing={iconTrailing?.name || 'icon'}
    >
      {children}
    </div>
  ),
  BadgeWithDot: ({ type, color, size, children, 'data-qa-id': dataQaId }: any) => (
    <div 
      data-qa-id={dataQaId || 'badge-with-dot'}
      data-type={type}
      data-color={color}
      data-size={size}
    >
      {children}
    </div>
  ),
}));

jest.mock('@untitledui/icons', () => ({
  Bank: ({ className, strokeWidth }: any) => (
    <div data-qa-id="bank-icon" className={className} data-stroke-width={strokeWidth}>Bank</div>
  ),
  BookClosed: ({ className, strokeWidth }: any) => (
    <div data-qa-id="book-closed-icon" className={className} data-stroke-width={strokeWidth}>BookClosed</div>
  ),
  Building03: ({ className, strokeWidth }: any) => (
    <div data-qa-id="building03-icon" className={className} data-stroke-width={strokeWidth}>Building03</div>
  ),
  Bus: ({ className, strokeWidth }: any) => (
    <div data-qa-id="bus-icon" className={className} data-stroke-width={strokeWidth}>Bus</div>
  ),
  Check: () => <div data-qa-id="check-icon">Check</div>,
  Home02: ({ className, strokeWidth }: any) => (
    <div data-qa-id="home02-icon" className={className} data-stroke-width={strokeWidth}>Home02</div>
  ),
  Map02: ({ className, strokeWidth }: any) => (
    <div data-qa-id="map02-icon" className={className} data-stroke-width={strokeWidth}>Map02</div>
  ),
  Tool01: ({ className, strokeWidth }: any) => (
    <div data-qa-id="tool01-icon" className={className} data-stroke-width={strokeWidth}>Tool01</div>
  ),
  X: () => <div data-qa-id="x-icon">X</div>,
}));

describe('SocialAndCommunity', () => {
  const defaultProps = {
    title: 'Social and Community',
    residentialAreas: {
      status: true,
      title: 'Residential Areas',
      value: 'Available',
    },
    hospitalsAndMedicalCenters: {
      status: true,
      title: 'Hospitals and Medical Centers',
      value: '5 hospitals',
    },
    publicTransportationAvailability: {
      status: false,
      title: 'Public Transportation',
      value: 'Limited',
    },
    educationalInstitutions: {
      status: true,
      title: 'Educational Institutions',
      value: '3 universities',
    },
    noOfBanksAndCreditInstitutions: {
      title: 'Banks and Credit Institutions',
      value: 12,
    },
    amenitiesForWorkforce: {
      status: true,
      title: 'Amenities for Workforce',
      value: 'Full amenities',
    },
    scenicLocationAndSurroundings: {
      status: true,
      title: 'Scenic Location',
      value: 'Mountain view',
    },
  };

  const renderComponent = (props = {}) => {
    return render(<SocialAndCommunity {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-social' });

      expect(screen.getByTestId('custom-social')).toBeInTheDocument();
      expect(screen.queryByTestId('social-community')).not.toBeInTheDocument();
    });

    it('should render all required grid elements', () => {
      renderComponent();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-main-grid')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-secondary-grid')).toBeInTheDocument();
    });

    it('should render all StatCard components', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-residential')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-medical')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-transport')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-education')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-banks')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-amenities')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-scenic')).toBeInTheDocument();
    });
  });

  describe('Residential Areas', () => {
    it('should display residential areas with success badge when status is true', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent('Residential Areas');
      const badge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveAttribute('data-size', 'lg');
      expect(badge).toHaveTextContent('Available');
    });

    it('should display residential areas with error badge when status is false', () => {
      renderComponent({
        residentialAreas: {
          status: false,
          title: 'Residential Areas',
          value: 'Not Available',
        },
      });

      const badge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('Not Available');
    });

    it('should render residential areas icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('home02-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render residential areas when null', () => {
      renderComponent({ residentialAreas: null });

      expect(screen.queryByTestId('social-community-residential')).not.toBeInTheDocument();
    });
  });

  describe('Hospitals and Medical Centers', () => {
    it('should display medical centers with success badge when status is true', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-medical-label')).toHaveTextContent('Hospitals and Medical Centers');
      const badge = screen.getByTestId('social-community-medical-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveTextContent('5 hospitals');
    });

    it('should display medical centers with error badge when status is false', () => {
      renderComponent({
        hospitalsAndMedicalCenters: {
          status: false,
          title: 'Medical Centers',
          value: 'None available',
        },
      });

      const badge = screen.getByTestId('social-community-medical-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('None available');
    });

    it('should render medical centers icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('building03-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render medical centers when null', () => {
      renderComponent({ hospitalsAndMedicalCenters: null });

      expect(screen.queryByTestId('social-community-medical')).not.toBeInTheDocument();
    });
  });

  describe('Public Transportation', () => {
    it('should display transportation with error badge when status is false', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-transport-label')).toHaveTextContent('Public Transportation');
      const badge = screen.getByTestId('social-community-transport-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('Limited');
    });

    it('should display transportation with success badge when status is true', () => {
      renderComponent({
        publicTransportationAvailability: {
          status: true,
          title: 'Public Transportation',
          value: 'Excellent',
        },
      });

      const badge = screen.getByTestId('social-community-transport-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveTextContent('Excellent');
    });

    it('should render transportation icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('bus-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render transportation when null', () => {
      renderComponent({ publicTransportationAvailability: null });

      expect(screen.queryByTestId('social-community-transport')).not.toBeInTheDocument();
    });
  });

  describe('Educational Institutions', () => {
    it('should display education with success badge when status is true', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-education-label')).toHaveTextContent('Educational Institutions');
      const badge = screen.getByTestId('social-community-education-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveTextContent('3 universities');
    });

    it('should display education with error badge when status is false', () => {
      renderComponent({
        educationalInstitutions: {
          status: false,
          title: 'Educational Institutions',
          value: 'No universities',
        },
      });

      const badge = screen.getByTestId('social-community-education-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('No universities');
    });

    it('should render education icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('book-closed-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render education when null', () => {
      renderComponent({ educationalInstitutions: null });

      expect(screen.queryByTestId('social-community-education')).not.toBeInTheDocument();
    });
  });

  describe('Banks and Credit Institutions', () => {
    it('should display banks with BadgeWithDot', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-banks-label')).toHaveTextContent('Banks and Credit Institutions');
      const badge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      expect(badge).toHaveAttribute('data-type', 'pill-color');
      expect(badge).toHaveAttribute('data-color', 'blue-light');
      expect(badge).toHaveAttribute('data-size', 'lg');
      expect(badge).toHaveTextContent('12');
    });

    it('should render banks icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('bank-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render banks when null', () => {
      renderComponent({ noOfBanksAndCreditInstitutions: null });

      expect(screen.queryByTestId('social-community-banks')).not.toBeInTheDocument();
    });

    it('should handle zero banks value', () => {
      renderComponent({
        noOfBanksAndCreditInstitutions: {
          title: 'Banks',
          value: 0,
        },
      });

      const badge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      expect(badge).toHaveTextContent('0');
    });
  });

  describe('Amenities for Workforce', () => {
    it('should display amenities with success badge when status is true', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-amenities-label')).toHaveTextContent('Amenities for Workforce');
      const badge = screen.getByTestId('social-community-amenities-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveTextContent('Full amenities');
    });

    it('should display amenities with error badge when status is false', () => {
      renderComponent({
        amenitiesForWorkforce: {
          status: false,
          title: 'Amenities',
          value: 'Limited amenities',
        },
      });

      const badge = screen.getByTestId('social-community-amenities-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('Limited amenities');
    });

    it('should render amenities icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('tool01-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render amenities when null', () => {
      renderComponent({ amenitiesForWorkforce: null });

      expect(screen.queryByTestId('social-community-amenities')).not.toBeInTheDocument();
    });
  });

  describe('Scenic Location and Surroundings', () => {
    it('should display scenic location with success badge when status is true', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-scenic-label')).toHaveTextContent('Scenic Location');
      const badge = screen.getByTestId('social-community-scenic-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'success');
      expect(badge).toHaveTextContent('Mountain view');
    });

    it('should display scenic location with error badge when status is false', () => {
      renderComponent({
        scenicLocationAndSurroundings: {
          status: false,
          title: 'Scenic Location',
          value: 'Industrial area',
        },
      });

      const badge = screen.getByTestId('social-community-scenic-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveAttribute('data-color', 'error');
      expect(badge).toHaveTextContent('Industrial area');
    });

    it('should render scenic location icon correctly', () => {
      renderComponent();

      const icon = screen.getByTestId('map02-icon');
      expect(icon).toHaveClass('size-11');
      expect(icon).toHaveAttribute('data-stroke-width', '1');
    });

    it('should not render scenic location when null', () => {
      renderComponent({ scenicLocationAndSurroundings: null });

      expect(screen.queryByTestId('social-community-scenic')).not.toBeInTheDocument();
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-main-grid')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-secondary-grid')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-residential')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-medical')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-transport')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-education')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-banks')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-amenities')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-scenic')).toBeInTheDocument();
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-social' });

      expect(screen.getByTestId('custom-social')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-main-grid')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-secondary-grid')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-residential')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-medical')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-transport')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-education')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-banks')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-amenities')).toBeInTheDocument();
      expect(screen.getByTestId('custom-social-scenic')).toBeInTheDocument();
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'social_with-special.chars123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-main-grid`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-secondary-grid`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-residential`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-main-grid"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-secondary-grid"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-residential"]')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should maintain proper layout classes', () => {
      renderComponent();

      const container = screen.getByTestId('social-community');
      const mainGrid = screen.getByTestId('social-community-main-grid');
      const secondaryGrid = screen.getByTestId('social-community-secondary-grid');

      expect(container).toHaveClass('flex', 'flex-col', 'gap-4');
      expect(mainGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
      expect(secondaryGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4');
    });

    it('should distribute components correctly between grids', () => {
      renderComponent();

      const mainGrid = screen.getByTestId('social-community-main-grid');
      const secondaryGrid = screen.getByTestId('social-community-secondary-grid');

      // Main grid should contain residential, medical, transport
      expect(mainGrid).toContainElement(screen.getByTestId('social-community-residential'));
      expect(mainGrid).toContainElement(screen.getByTestId('social-community-medical'));
      expect(mainGrid).toContainElement(screen.getByTestId('social-community-transport'));

      // Secondary grid should contain education, banks, amenities, scenic
      expect(secondaryGrid).toContainElement(screen.getByTestId('social-community-education'));
      expect(secondaryGrid).toContainElement(screen.getByTestId('social-community-banks'));
      expect(secondaryGrid).toContainElement(screen.getByTestId('social-community-amenities'));
      expect(secondaryGrid).toContainElement(screen.getByTestId('social-community-scenic'));
    });

    it('should maintain grid structure with missing components', () => {
      renderComponent({
        residentialAreas: null,
        hospitalsAndMedicalCenters: null,
        educationalInstitutions: null,
      });

      const mainGrid = screen.getByTestId('social-community-main-grid');
      const secondaryGrid = screen.getByTestId('social-community-secondary-grid');

      expect(mainGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
      expect(secondaryGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4');

      expect(screen.queryByTestId('social-community-residential')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-medical')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-education')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle all null values gracefully', () => {
      renderComponent({
        residentialAreas: null,
        hospitalsAndMedicalCenters: null,
        publicTransportationAvailability: null,
        educationalInstitutions: null,
        noOfBanksAndCreditInstitutions: null,
        amenitiesForWorkforce: null,
        scenicLocationAndSurroundings: null,
      });

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-main-grid')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-secondary-grid')).toBeInTheDocument();

      expect(screen.queryByTestId('social-community-residential')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-medical')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-transport')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-education')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-banks')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-amenities')).not.toBeInTheDocument();
      expect(screen.queryByTestId('social-community-scenic')).not.toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      renderComponent({
        residentialAreas: {
          status: true,
          title: '',
          value: '',
        },
        noOfBanksAndCreditInstitutions: {
          title: '',
          value: null,
        },
      });

      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent('');
      expect(screen.getByTestId('social-community-banks-label')).toHaveTextContent('');
      
      const residentialBadge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      const banksBadge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      
      expect(residentialBadge).toHaveTextContent('');
      expect(banksBadge).toBeEmptyDOMElement();
    });

    it('should handle very long text content', () => {
      const longTitle = 'A'.repeat(200);
      const longValue = 'B'.repeat(100);

      renderComponent({
        residentialAreas: {
          status: true,
          title: longTitle,
          value: longValue,
        },
      });

      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent(longTitle);
      const badge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveTextContent(longValue);
    });

    it('should handle special characters in content', () => {
      renderComponent({
        residentialAreas: {
          status: true,
          title: 'Residential Areas & Housing (2024)',
          value: 'Available > 80% capacity',
        },
      });

      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent('Residential Areas & Housing (2024)');
      const badge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(badge).toHaveTextContent('Available > 80% capacity');
    });

    it('should handle large numeric values for banks', () => {
      renderComponent({
        noOfBanksAndCreditInstitutions: {
          title: 'Banks',
          value: 999999,
        },
      });

      const badge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      expect(badge).toHaveTextContent('999999');
    });

    it('should handle negative numbers for banks', () => {
      renderComponent({
        noOfBanksAndCreditInstitutions: {
          title: 'Banks',
          value: -5,
        },
      });

      const badge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      expect(badge).toHaveTextContent('-5');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle mounting and unmounting gracefully', () => {
      const { unmount } = renderComponent();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();

      unmount();

      expect(screen.queryByTestId('social-community')).not.toBeInTheDocument();
    });

    it('should update when props change', () => {
      const { rerender } = renderComponent();

      const initialBadge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(initialBadge).toHaveAttribute('data-color', 'success');
      expect(initialBadge).toHaveTextContent('Available');

      rerender(
        <SocialAndCommunity
          {...defaultProps}
          residentialAreas={{
            status: false,
            title: 'Updated Residential',
            value: 'Not Available',
          }}
        />
      );

      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent('Updated Residential');
      const updatedBadge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(updatedBadge).toHaveAttribute('data-color', 'error');
      expect(updatedBadge).toHaveTextContent('Not Available');
    });

    it('should maintain component structure across re-renders', () => {
      const { rerender } = renderComponent();

      const initialMainGrid = screen.getByTestId('social-community-main-grid');
      const initialSecondaryGrid = screen.getByTestId('social-community-secondary-grid');
      expect(initialMainGrid.children).toHaveLength(3); // residential, medical, transport
      expect(initialSecondaryGrid.children).toHaveLength(4); // education, banks, amenities, scenic

      rerender(
        <SocialAndCommunity
          {...defaultProps}
          residentialAreas={null}
          educationalInstitutions={null}
        />
      );

      const updatedMainGrid = screen.getByTestId('social-community-main-grid');
      const updatedSecondaryGrid = screen.getByTestId('social-community-secondary-grid');
      expect(updatedMainGrid).toBeInTheDocument();
      expect(updatedSecondaryGrid).toBeInTheDocument();
      expect(updatedMainGrid.children).toHaveLength(2); // medical, transport
      expect(updatedSecondaryGrid.children).toHaveLength(3); // banks, amenities, scenic
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('social-community')).toBeInTheDocument();
    });

    it('should handle frequent re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        rerender(
          <SocialAndCommunity
            {...defaultProps}
            residentialAreas={{
              status: i % 2 === 0,
              title: `Residential ${i}`,
              value: `Status ${i}`,
            }}
          />
        );
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
      expect(screen.getByTestId('social-community-residential-label')).toHaveTextContent('Residential 9');
    });
  });

  describe('Accessibility', () => {
    it('should maintain semantic structure', () => {
      renderComponent();

      const container = screen.getByTestId('social-community');
      const mainGrid = screen.getByTestId('social-community-main-grid');
      const secondaryGrid = screen.getByTestId('social-community-secondary-grid');

      expect(container).toContainElement(mainGrid);
      expect(container).toContainElement(secondaryGrid);
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const elements = [
        screen.getByTestId('social-community'),
        screen.getByTestId('social-community-main-grid'),
        screen.getByTestId('social-community-secondary-grid'),
        screen.getByTestId('social-community-residential'),
        screen.getByTestId('social-community-medical'),
        screen.getByTestId('social-community-transport'),
        screen.getByTestId('social-community-education'),
        screen.getByTestId('social-community-banks'),
        screen.getByTestId('social-community-amenities'),
        screen.getByTestId('social-community-scenic'),
      ];

      elements.forEach(element => {
        expect(element).toBeVisible();
      });
    });

    it('should render proper icon classes for accessibility', () => {
      renderComponent();

      const icons = [
        screen.getByTestId('home02-icon'),
        screen.getByTestId('building03-icon'),
        screen.getByTestId('bus-icon'),
        screen.getByTestId('book-closed-icon'),
        screen.getByTestId('bank-icon'),
        screen.getByTestId('tool01-icon'),
        screen.getByTestId('map02-icon'),
      ];

      icons.forEach(icon => {
        expect(icon).toHaveClass('size-11');
        expect(icon).toHaveAttribute('data-stroke-width', '1');
      });
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in ISocialAndCommunity', () => {
      expect(() => {
        render(
          <SocialAndCommunity
            {...defaultProps}
            data-qa-id="test-social"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      const minimalProps = {
        title: 'Minimal Social',
        residentialAreas: null,
        hospitalsAndMedicalCenters: null,
        publicTransportationAvailability: null,
        educationalInstitutions: null,
        noOfBanksAndCreditInstitutions: {
          title: 'Banks',
          value: 1,
        },
        amenitiesForWorkforce: null,
        scenicLocationAndSurroundings: null,
      };

      expect(() => {
        render(<SocialAndCommunity {...minimalProps} />);
      }).not.toThrow();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-banks')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(
          <SocialAndCommunity
            {...defaultProps}
            data-qa-id={undefined}
          />
        );
      }).not.toThrow();

      expect(screen.getByTestId('social-community')).toBeInTheDocument();
    });
  });

  describe('Integration with StatCard, BadgeWithIcon, and BadgeWithDot', () => {
    it('should pass correct props to StatCards', () => {
      renderComponent();

      expect(screen.getByTestId('social-community-residential')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-medical')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-transport')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-education')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-banks')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-amenities')).toBeInTheDocument();
      expect(screen.getByTestId('social-community-scenic')).toBeInTheDocument();
    });

    it('should render BadgeWithIcon components with correct props for status-based badges', () => {
      renderComponent();

      const statusBadges = [
        screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]'),
        screen.getByTestId('social-community-medical-value').querySelector('[data-qa-id="badge-with-icon"]'),
        screen.getByTestId('social-community-transport-value').querySelector('[data-qa-id="badge-with-icon"]'),
        screen.getByTestId('social-community-education-value').querySelector('[data-qa-id="badge-with-icon"]'),
        screen.getByTestId('social-community-amenities-value').querySelector('[data-qa-id="badge-with-icon"]'),
        screen.getByTestId('social-community-scenic-value').querySelector('[data-qa-id="badge-with-icon"]'),
      ];

      statusBadges.forEach(badge => {
        expect(badge).toHaveAttribute('data-type', 'pill-color');
        expect(badge).toHaveAttribute('data-size', 'lg');
      });
    });

    it('should render BadgeWithDot component with correct props for banks', () => {
      renderComponent();

      const banksBadge = screen.getByTestId('social-community-banks-value').querySelector('[data-qa-id="badge-with-dot"]');
      expect(banksBadge).toHaveAttribute('data-type', 'pill-color');
      expect(banksBadge).toHaveAttribute('data-color', 'blue-light');
      expect(banksBadge).toHaveAttribute('data-size', 'lg');
    });

    it('should render icons from @untitledui/icons with correct props', () => {
      renderComponent();

      const icons = [
        { testId: 'home02-icon', expectedClass: 'size-11' },
        { testId: 'building03-icon', expectedClass: 'size-11' },
        { testId: 'bus-icon', expectedClass: 'size-11' },
        { testId: 'book-closed-icon', expectedClass: 'size-11' },
        { testId: 'bank-icon', expectedClass: 'size-11' },
        { testId: 'tool01-icon', expectedClass: 'size-11' },
        { testId: 'map02-icon', expectedClass: 'size-11' },
      ];

      icons.forEach(({ testId, expectedClass }) => {
        const icon = screen.getByTestId(testId);
        expect(icon).toHaveClass(expectedClass);
        expect(icon).toHaveAttribute('data-stroke-width', '1');
      });
    });
  });

  describe('Status-based Badge Color Logic', () => {
    it('should correctly assign badge colors based on status for residential areas', () => {
      // Test true status
      renderComponent({
        residentialAreas: { status: true, title: 'Residential', value: 'Available' }
      });
      
      const trueBadge = screen.getByTestId('social-community-residential-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(trueBadge).toHaveAttribute('data-color', 'success');
    });

    it('should correctly assign badge colors based on status for medical centers', () => {
      // Test false status  
      renderComponent({
        hospitalsAndMedicalCenters: { status: false, title: 'Medical', value: 'None' }
      });
      
      const falseBadge = screen.getByTestId('social-community-medical-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(falseBadge).toHaveAttribute('data-color', 'error');
    });

    it('should correctly assign badge colors based on status for public transportation', () => {
      // Test false status (default)
      renderComponent();
      
      const falseBadge = screen.getByTestId('social-community-transport-value').querySelector('[data-qa-id="badge-with-icon"]');
      expect(falseBadge).toHaveAttribute('data-color', 'error');
    });
  });
});