import React from 'react';
import { render, screen } from '@testing-library/react';
import { DesktopGrid } from '@/features/explore/components/Navigation/InvestorJourney/DesktopGrid';
import '@testing-library/jest-dom';

// Mock the styles
jest.mock('../cardStyles', () => ({
  cardStyles: {
    base: 'card-base',
    hover: 'card-hover',
    icon: 'card-icon',
  },
}));

jest.mock('../styles', () => ({
  investorJourneyStyles: {
    desktopGrid: {
      container: 'desktop-grid-container',
      card: {
        wrapper: 'desktop-grid-card-wrapper',
      },
    },
    cardContent: {
      icon: {
        image: 'card-content-icon-image',
      },
      text: {
        wrapper: 'card-content-text-wrapper',
        title: 'card-content-text-title',
        content: 'card-content-text-content',
      },
    },
  },
}));

describe('DesktopGrid', () => {
  const defaultProps = {
    cards: [
      {
        title: 'Investment Research',
        content: 'Comprehensive market analysis and investment opportunities',
        icon: '/icon-research.svg',
      },
      {
        title: 'Portfolio Management',
        content: 'Professional portfolio optimization and risk management',
        icon: '/icon-portfolio.svg',
      },
      {
        title: 'Market Insights',
        content: 'Real-time market data and expert insights',
        icon: '/icon-insights.svg',
      },
    ],
  };

  const renderComponent = (props = {}) => {
    return render(<DesktopGrid {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render container with default data-qa-id', () => {
      renderComponent();

      expect(screen.getByTestId('desktop-grid')).toBeInTheDocument();
    });

    it('should render with custom data-qa-id', () => {
      renderComponent({ 'data-qa-id': 'custom-grid' });

      expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-grid')).not.toBeInTheDocument();
    });

    it('should render correct number of cards', () => {
      renderComponent();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      expect(cards).toHaveLength(3);
    });

    it('should render all card elements with indexed data-qa-ids', () => {
      renderComponent();

      for (let i = 0; i < 3; i++) {
        expect(screen.getByTestId(`desktop-grid-card-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-icon`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-icon-image`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-content`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-text`)).toBeInTheDocument();
      }
    });
  });

  describe('Card Content Rendering', () => {
    it('should render card titles', () => {
      renderComponent();

      expect(screen.getByText('Investment Research')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
      expect(screen.getByText('Market Insights')).toBeInTheDocument();
    });

    it('should render card content text', () => {
      renderComponent();

      expect(screen.getByText('Comprehensive market analysis and investment opportunities')).toBeInTheDocument();
      expect(screen.getByText('Professional portfolio optimization and risk management')).toBeInTheDocument();
      expect(screen.getByText('Real-time market data and expert insights')).toBeInTheDocument();
    });

    it('should render card icons with correct attributes', () => {
      renderComponent();

      const icon1 = screen.getByTestId('desktop-grid-card-0-icon-image');
      const icon2 = screen.getByTestId('desktop-grid-card-1-icon-image');
      const icon3 = screen.getByTestId('desktop-grid-card-2-icon-image');

      expect(icon1).toHaveAttribute('src', '/icon-research.svg');
      expect(icon1).toHaveAttribute('alt', 'Investment Research');

      expect(icon2).toHaveAttribute('src', '/icon-portfolio.svg');
      expect(icon2).toHaveAttribute('alt', 'Portfolio Management');

      expect(icon3).toHaveAttribute('src', '/icon-insights.svg');
      expect(icon3).toHaveAttribute('alt', 'Market Insights');
    });

    it('should render all icon images as img elements', () => {
      renderComponent();

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);

      images.forEach((img, index) => {
        expect(img).toHaveAttribute('src', defaultProps.cards[index].icon);
        expect(img).toHaveAttribute('alt', defaultProps.cards[index].title);
      });
    });
  });

  describe('Styling Integration', () => {
    it('should apply container styles', () => {
      renderComponent();

      const container = screen.getByTestId('desktop-grid');
      expect(container).toHaveClass('desktop-grid-container');
    });

    it('should apply card wrapper styles', () => {
      renderComponent();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      cards.forEach(card => {
        expect(card).toHaveClass('card-base');
        expect(card).toHaveClass('card-hover');
        expect(card).toHaveClass('desktop-grid-card-wrapper');
      });
    });

    it('should apply icon container styles', () => {
      renderComponent();

      const iconContainers = screen.getAllByTestId(/desktop-grid-card-\d+-icon$/);
      iconContainers.forEach(container => {
        expect(container).toHaveClass('card-icon');
      });
    });

    it('should apply icon image styles', () => {
      renderComponent();

      const iconImages = screen.getAllByTestId(/desktop-grid-card-\d+-icon-image$/);
      iconImages.forEach(image => {
        expect(image).toHaveClass('card-content-icon-image');
      });
    });

    it('should apply content wrapper styles', () => {
      renderComponent();

      const contentWrappers = screen.getAllByTestId(/desktop-grid-card-\d+-content$/);
      contentWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('card-content-text-wrapper');
      });
    });

    it('should apply title styles', () => {
      renderComponent();

      const titles = screen.getAllByTestId(/desktop-grid-card-\d+-title$/);
      titles.forEach(title => {
        expect(title).toHaveClass('card-content-text-title');
        expect(title.tagName).toBe('H3');
      });
    });

    it('should apply content text styles', () => {
      renderComponent();

      const contentTexts = screen.getAllByTestId(/desktop-grid-card-\d+-text$/);
      contentTexts.forEach(text => {
        expect(text).toHaveClass('card-content-text-content');
        expect(text.tagName).toBe('P');
      });
    });
  });

  describe('Data QA ID Structure', () => {
    it('should create hierarchical data-qa-ids with default base', () => {
      renderComponent();

      expect(screen.getByTestId('desktop-grid')).toBeInTheDocument();

      for (let i = 0; i < 3; i++) {
        expect(screen.getByTestId(`desktop-grid-card-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-icon`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-icon-image`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-content`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`desktop-grid-card-${i}-text`)).toBeInTheDocument();
      }
    });

    it('should create hierarchical data-qa-ids with custom base', () => {
      renderComponent({ 'data-qa-id': 'custom-grid' });

      expect(screen.getByTestId('custom-grid')).toBeInTheDocument();

      for (let i = 0; i < 3; i++) {
        expect(screen.getByTestId(`custom-grid-card-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-grid-card-${i}-icon`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-grid-card-${i}-icon-image`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-grid-card-${i}-content`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-grid-card-${i}-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`custom-grid-card-${i}-text`)).toBeInTheDocument();
      }
    });

    it('should handle special characters in data-qa-id', () => {
      const specialId = 'grid-with_special-chars.123';
      renderComponent({ 'data-qa-id': specialId });

      expect(screen.getByTestId(specialId)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-card-0`)).toBeInTheDocument();
      expect(screen.getByTestId(`${specialId}-card-0-icon`)).toBeInTheDocument();
    });

    it('should handle empty string data-qa-id', () => {
      const { container } = renderComponent({ 'data-qa-id': '' });

      expect(container.querySelector('[data-qa-id=""]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-card-0"]')).toBeInTheDocument();
      expect(container.querySelector('[data-qa-id="-card-0-icon"]')).toBeInTheDocument();
    });

    it('should maintain consistent numbering across all cards', () => {
      renderComponent();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      cards.forEach((card, index) => {
        expect(card).toHaveAttribute('data-qa-id', `desktop-grid-card-${index}`);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty cards array', () => {
      renderComponent({ cards: [] });

      expect(screen.getByTestId('desktop-grid')).toBeInTheDocument();

      const cards = screen.queryAllByTestId(/desktop-grid-card-\d+/);
      expect(cards).toHaveLength(0);
    });

    it('should handle single card', () => {
      const singleCard = [defaultProps.cards[0]];
      renderComponent({ cards: singleCard });

      expect(screen.getByTestId('desktop-grid-card-0')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-grid-card-1')).not.toBeInTheDocument();

      expect(screen.getByText('Investment Research')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive market analysis and investment opportunities')).toBeInTheDocument();
    });

    it('should handle cards with missing properties', () => {
      const incompleteCards = [
        { title: 'Title Only' }, // missing content and icon
        { content: 'Content Only' }, // missing title and icon
        { icon: '/icon-only.svg' }, // missing title and content
        {}, // completely empty
      ] as any;

      expect(() => {
        renderComponent({ cards: incompleteCards });
      }).not.toThrow();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      expect(cards).toHaveLength(4);
    });

    it('should handle null or undefined card properties', () => {
      const cardsWithNullProps = [
        { title: null, content: null, icon: null },
        { title: undefined, content: undefined, icon: undefined },
        { title: '', content: '', icon: '' },
      ] as any;

      // Suppress console errors for this test since we're testing error scenarios
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderComponent({ cards: cardsWithNullProps });
      }).not.toThrow();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      expect(cards).toHaveLength(3);

      // Restore console.error
      console.error = originalError;
    });

    it('should handle very long text content', () => {
      const longTextCards = [
        {
          title: 'A'.repeat(200),
          content: 'B'.repeat(500),
          icon: '/icon.svg',
        },
      ];

      expect(() => {
        renderComponent({ cards: longTextCards });
      }).not.toThrow();

      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
      expect(screen.getByText('B'.repeat(500))).toBeInTheDocument();
    });

    it('should handle very large number of cards', () => {
      const manyCards = Array.from({ length: 50 }, (_, i) => ({
        title: `Card ${i + 1}`,
        content: `Content for card ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      expect(() => {
        renderComponent({ cards: manyCards });
      }).not.toThrow();

      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
      expect(cards).toHaveLength(50);
    });

    it('should handle special characters in card content', () => {
      const specialCharCards = [
        {
          title: 'Title with émojis 🚀 and spéciàl chärs',
          content: 'Content with HTML <tags> & entities &amp; symbols ©®™',
          icon: '/icon-special.svg',
        },
      ];

      expect(() => {
        renderComponent({ cards: specialCharCards });
      }).not.toThrow();

      expect(screen.getByText('Title with émojis 🚀 and spéciàl chärs')).toBeInTheDocument();
      expect(screen.getByText('Content with HTML <tags> & entities &amp; symbols ©®™')).toBeInTheDocument();
    });

    it('should handle invalid icon URLs', () => {
      const cardsWithInvalidIcons = [
        {
          title: 'Valid Icon',
          content: 'Valid content',
          icon: 'not-a-valid-url',
        },
        {
          title: 'Data URL Icon',
          content: 'Data URL content',
          icon: 'data:image/svg+xml;base64,invalid-data',
        },
      ];

      expect(() => {
        renderComponent({ cards: cardsWithInvalidIcons });
      }).not.toThrow();

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'not-a-valid-url');
      expect(images[1]).toHaveAttribute('src', 'data:image/svg+xml;base64,invalid-data');
    });
  });

  describe('Component Structure', () => {
    it('should maintain proper element hierarchy', () => {
      renderComponent();

      const container = screen.getByTestId('desktop-grid');
      const firstCard = screen.getByTestId('desktop-grid-card-0');
      const firstIcon = screen.getByTestId('desktop-grid-card-0-icon');
      const firstContent = screen.getByTestId('desktop-grid-card-0-content');

      expect(container).toContainElement(firstCard);
      expect(firstCard).toContainElement(firstIcon);
      expect(firstCard).toContainElement(firstContent);
    });

    it('should render cards in correct order', () => {
      renderComponent();

      const container = screen.getByTestId('desktop-grid');
      const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);

      cards.forEach((card, index) => {
        expect(container).toContainElement(card);
        expect(card).toHaveAttribute('data-qa-id', `desktop-grid-card-${index}`);
      });
    });

    it('should maintain icon and content structure within each card', () => {
      renderComponent();

      for (let i = 0; i < 3; i++) {
        const card = screen.getByTestId(`desktop-grid-card-${i}`);
        const icon = screen.getByTestId(`desktop-grid-card-${i}-icon`);
        const content = screen.getByTestId(`desktop-grid-card-${i}-content`);
        const title = screen.getByTestId(`desktop-grid-card-${i}-title`);
        const text = screen.getByTestId(`desktop-grid-card-${i}-text`);

        expect(card).toContainElement(icon);
        expect(card).toContainElement(content);
        expect(content).toContainElement(title);
        expect(content).toContainElement(text);
      }
    });

    it('should render elements in the correct semantic order', () => {
      renderComponent();

      const firstCard = screen.getByTestId('desktop-grid-card-0');
      const children = Array.from(firstCard.children);

      expect(children).toHaveLength(2); // icon container and content container

      const iconContainer = children.find(child => 
        child.getAttribute('data-qa-id') === 'desktop-grid-card-0-icon'
      );
      const contentContainer = children.find(child => 
        child.getAttribute('data-qa-id') === 'desktop-grid-card-0-content'
      );

      expect(iconContainer).toBeInTheDocument();
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should provide proper alt text for all images', () => {
      renderComponent();

      const images = screen.getAllByRole('img');
      images.forEach((img, index) => {
        expect(img).toHaveAttribute('alt', defaultProps.cards[index].title);
      });
    });

    it('should use proper heading hierarchy', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);

      headings.forEach((heading, index) => {
        expect(heading).toHaveTextContent(defaultProps.cards[index].title);
      });
    });

    it('should maintain semantic structure with proper tags', () => {
      renderComponent();

      const container = screen.getByTestId('desktop-grid');
      expect(container.tagName).toBe('DIV');

      const titles = screen.getAllByTestId(/desktop-grid-card-\d+-title$/);
      titles.forEach(title => {
        expect(title.tagName).toBe('H3');
      });

      const contents = screen.getAllByTestId(/desktop-grid-card-\d+-text$/);
      contents.forEach(content => {
        expect(content.tagName).toBe('P');
      });
    });

    it('should be navigable by screen readers', () => {
      renderComponent();

      const headings = screen.getAllByRole('heading');
      const images = screen.getAllByRole('img');

      expect(headings).toHaveLength(3);
      expect(images).toHaveLength(3);

      headings.forEach(heading => {
        expect(heading).toBeVisible();
      });

      images.forEach(image => {
        expect(image).toBeVisible();
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many cards', () => {
      const manyCards = Array.from({ length: 20 }, (_, i) => ({
        title: `Card ${i + 1}`,
        content: `Content ${i + 1}`,
        icon: `/icon${i + 1}.svg`,
      }));

      const startTime = performance.now();
      renderComponent({ cards: manyCards });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getAllByTestId(/^desktop-grid-card-\d+$/)).toHaveLength(20);
    });

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = renderComponent();

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        const dynamicCards = Array.from({ length: i + 1 }, (_, j) => ({
          title: `Dynamic Card ${j + 1}`,
          content: `Dynamic content ${j + 1}`,
          icon: `/dynamic-icon${j + 1}.svg`,
        }));

        rerender(<DesktopGrid cards={dynamicCards} data-qa-id={`grid-${i}`} />);
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('grid-9')).toBeInTheDocument();
    });

    it('should maintain performance with frequent prop changes', () => {
      const { rerender } = renderComponent();

      const cards1 = [
        { title: 'Card A', content: 'Content A', icon: '/iconA.svg' },
        { title: 'Card B', content: 'Content B', icon: '/iconB.svg' },
      ];

      const cards2 = [
        { title: 'Card X', content: 'Content X', icon: '/iconX.svg' },
        { title: 'Card Y', content: 'Content Y', icon: '/iconY.svg' },
        { title: 'Card Z', content: 'Content Z', icon: '/iconZ.svg' },
      ];

      for (let i = 0; i < 5; i++) {
        rerender(<DesktopGrid cards={i % 2 === 0 ? cards1 : cards2} />);
        
        const cards = screen.getAllByTestId(/^desktop-grid-card-\d+$/);
        expect(cards.length).toBe(i % 2 === 0 ? 2 : 3);
      }
    });
  });

  describe('Props Interface Compliance', () => {
    it('should accept all valid props defined in DesktopGridProps', () => {
      expect(() => {
        render(
          <DesktopGrid
            cards={defaultProps.cards}
            data-qa-id="test-grid"
          />
        );
      }).not.toThrow();
    });

    it('should work with minimal required props', () => {
      expect(() => {
        render(<DesktopGrid cards={[]} />);
      }).not.toThrow();

      expect(screen.getByTestId('desktop-grid')).toBeInTheDocument();
    });

    it('should handle undefined data-qa-id gracefully', () => {
      expect(() => {
        render(<DesktopGrid cards={defaultProps.cards} data-qa-id={undefined} />);
      }).not.toThrow();

      expect(screen.getByTestId('desktop-grid')).toBeInTheDocument();
    });
  });
});