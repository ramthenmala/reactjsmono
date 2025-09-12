import { exploreService } from '../exploreService';
import { apiFetch } from '@/lib/api/client';
import { 
  IExploreDetailsResponse, 
  IExploreDetails,
  ICompassInvestorJourney,
  IConnectSection,
  IInvestorJourneyCard 
} from '../types/explore';

// Mock the API client
jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

// Mock console.error to avoid cluttering test output
const consoleSpy = {
  error: jest.fn(),
};

describe('exploreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
    console.error = consoleSpy.error;
  });

  describe('getExploreData', () => {
    const mockInvestorJourneyCards: IInvestorJourneyCard[] = [
      {
        icon: 'icon1.svg',
        title: 'Explore Opportunities',
        content: 'Discover industrial opportunities',
      },
      {
        icon: 'icon2.svg', 
        title: 'Analyze Data',
        content: 'Make data-driven decisions',
      },
    ];

    const mockCompassInvestorJourney: ICompassInvestorJourney = {
      title: 'Investor Journey',
      content: 'Your path to success',
      cards: mockInvestorJourneyCards,
    };

    const mockConnectSection: IConnectSection = {
      title: 'Connect With Us',
      content: 'Get in touch for more information',
      buttonLabel: 'Contact Now',
    };

    const mockExploreDetails: IExploreDetails = {
      bannerImage: 'banner.jpg',
      bannerTitle: 'Welcome to Compass',
      bannerContent: 'Explore industrial opportunities in Saudi Arabia',
      featuredIndustrialCitiesTitle: 'Featured Cities',
      featuredIndustrialCitiesContent: 'Discover our top industrial cities',
      compassInvestorJourney: mockCompassInvestorJourney,
      connect: mockConnectSection,
    };

    const mockApiResponse: IExploreDetailsResponse = {
      data: {
        exploreDetails: mockExploreDetails,
      },
    };

    it('should fetch explore data successfully without acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await exploreService.getExploreData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/explore', {
        acceptLanguage: undefined,
      });
      expect(result).toEqual(mockExploreDetails);
    });

    it('should fetch explore data successfully with acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await exploreService.getExploreData('ar');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/explore', {
        acceptLanguage: 'ar',
      });
      expect(result).toEqual(mockExploreDetails);
    });

    it('should handle partial data gracefully with default values', async () => {
      const partialApiResponse: IExploreDetailsResponse = {
        data: {
          exploreDetails: {
            bannerImage: 'partial-banner.jpg',
            bannerTitle: 'Partial Title',
            bannerContent: '',
            featuredIndustrialCitiesTitle: '',
            featuredIndustrialCitiesContent: '',
            compassInvestorJourney: {
              title: 'Journey Title',
              content: '',
              cards: [],
            },
            connect: {
              title: '',
              content: '',
              buttonLabel: '',
            },
          } as IExploreDetails,
        },
      };

      mockApiFetch.mockResolvedValue(partialApiResponse);

      const result = await exploreService.getExploreData('en');

      expect(result).toEqual({
        bannerImage: 'partial-banner.jpg',
        bannerTitle: 'Partial Title',
        bannerContent: '',
        featuredIndustrialCitiesTitle: '',
        featuredIndustrialCitiesContent: '',
        compassInvestorJourney: {
          title: 'Journey Title',
          content: '',
          cards: [],
        },
        connect: {
          title: '',
          content: '',
          buttonLabel: '',
        },
      });
    });

    it('should handle missing data structure with fallback defaults', async () => {
      const emptyApiResponse = {
        data: {},
      } as IExploreDetailsResponse;

      mockApiFetch.mockResolvedValue(emptyApiResponse);

      const result = await exploreService.getExploreData();

      expect(result).toEqual({
        bannerImage: '',
        bannerTitle: '',
        bannerContent: '',
        featuredIndustrialCitiesTitle: '',
        featuredIndustrialCitiesContent: '',
        compassInvestorJourney: {
          title: '',
          content: '',
          cards: [],
        },
        connect: {
          title: '',
          content: '',
          buttonLabel: '',
        },
      });
    });

    it('should handle null/undefined nested data gracefully', async () => {
      const nullDataResponse = {
        data: {
          exploreDetails: {
            bannerImage: 'banner.jpg',
            bannerTitle: null,
            bannerContent: undefined,
            featuredIndustrialCitiesTitle: 'Cities',
            featuredIndustrialCitiesContent: null,
            compassInvestorJourney: null,
            connect: undefined,
          },
        },
      } as unknown as IExploreDetailsResponse;

      mockApiFetch.mockResolvedValue(nullDataResponse);

      const result = await exploreService.getExploreData('en');

      expect(result).toEqual({
        bannerImage: 'banner.jpg',
        bannerTitle: '',
        bannerContent: '',
        featuredIndustrialCitiesTitle: 'Cities',
        featuredIndustrialCitiesContent: '',
        compassInvestorJourney: {
          title: '',
          content: '',
          cards: [],
        },
        connect: {
          title: '',
          content: '',
          buttonLabel: '',
        },
      });
    });

    it('should handle partial compassInvestorJourney data', async () => {
      const partialJourneyResponse = {
        data: {
          exploreDetails: {
            ...mockExploreDetails,
            compassInvestorJourney: {
              title: 'Journey Title',
              // missing content and cards
            },
          },
        },
      } as unknown as IExploreDetailsResponse;

      mockApiFetch.mockResolvedValue(partialJourneyResponse);

      const result = await exploreService.getExploreData();

      expect(result.compassInvestorJourney).toEqual({
        title: 'Journey Title',
        content: '',
        cards: [],
      });
    });

    it('should handle partial connect section data', async () => {
      const partialConnectResponse = {
        data: {
          exploreDetails: {
            ...mockExploreDetails,
            connect: {
              title: 'Connect Title',
              // missing content and buttonLabel
            },
          },
        },
      } as unknown as IExploreDetailsResponse;

      mockApiFetch.mockResolvedValue(partialConnectResponse);

      const result = await exploreService.getExploreData();

      expect(result.connect).toEqual({
        title: 'Connect Title',
        content: '',
        buttonLabel: '',
      });
    });

    it('should throw error when API call fails', async () => {
      const apiError = new Error('Network error');
      mockApiFetch.mockRejectedValue(apiError);

      await expect(exploreService.getExploreData()).rejects.toThrow('Network error');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', apiError);
    });

    it('should throw error when API returns error response', async () => {
      const apiError = new Error('API Error: 500 Internal Server Error');
      mockApiFetch.mockRejectedValue(apiError);

      await expect(exploreService.getExploreData('ar')).rejects.toThrow('API Error: 500 Internal Server Error');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', apiError);
      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/explore', {
        acceptLanguage: 'ar',
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiFetch.mockRejectedValue(timeoutError);

      await expect(exploreService.getExploreData()).rejects.toThrow('Request timeout');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', timeoutError);
    });

    it('should handle different acceptLanguage values', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const languages = ['en', 'ar', 'fr', 'es', ''];

      for (const lang of languages) {
        await exploreService.getExploreData(lang);
        
        expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/explore', {
          acceptLanguage: lang,
        });
      }

      expect(mockApiFetch).toHaveBeenCalledTimes(languages.length);
    });

    it('should preserve investor journey cards order and structure', async () => {
      const cardsList: IInvestorJourneyCard[] = [
        { icon: 'step1.svg', title: 'Step 1', content: 'First step' },
        { icon: 'step2.svg', title: 'Step 2', content: 'Second step' },
        { icon: 'step3.svg', title: 'Step 3', content: 'Third step' },
      ];

      const responseWithCards = {
        data: {
          exploreDetails: {
            ...mockExploreDetails,
            compassInvestorJourney: {
              ...mockCompassInvestorJourney,
              cards: cardsList,
            },
          },
        },
      };

      mockApiFetch.mockResolvedValue(responseWithCards);

      const result = await exploreService.getExploreData();

      expect(result.compassInvestorJourney.cards).toEqual(cardsList);
      expect(result.compassInvestorJourney.cards).toHaveLength(3);
      expect(result.compassInvestorJourney.cards[0]).toEqual(cardsList[0]);
    });

    it('should handle empty string values appropriately', async () => {
      const emptyStringResponse = {
        data: {
          exploreDetails: {
            bannerImage: '',
            bannerTitle: '',
            bannerContent: '',
            featuredIndustrialCitiesTitle: '',
            featuredIndustrialCitiesContent: '',
            compassInvestorJourney: {
              title: '',
              content: '',
              cards: [],
            },
            connect: {
              title: '',
              content: '',
              buttonLabel: '',
            },
          },
        },
      };

      mockApiFetch.mockResolvedValue(emptyStringResponse);

      const result = await exploreService.getExploreData();

      expect(result.bannerImage).toBe('');
      expect(result.bannerTitle).toBe('');
      expect(result.connect.buttonLabel).toBe('');
      expect(result.compassInvestorJourney.cards).toEqual([]);
    });

    it('should use correct API endpoint', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      await exploreService.getExploreData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/explore', expect.any(Object));
    });

    it('should return structured data matching IExploreDetails interface', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await exploreService.getExploreData();

      // Verify all required properties exist
      expect(result).toHaveProperty('bannerImage');
      expect(result).toHaveProperty('bannerTitle');
      expect(result).toHaveProperty('bannerContent');
      expect(result).toHaveProperty('featuredIndustrialCitiesTitle');
      expect(result).toHaveProperty('featuredIndustrialCitiesContent');
      expect(result).toHaveProperty('compassInvestorJourney');
      expect(result).toHaveProperty('connect');

      // Verify nested structures
      expect(result.compassInvestorJourney).toHaveProperty('title');
      expect(result.compassInvestorJourney).toHaveProperty('content');
      expect(result.compassInvestorJourney).toHaveProperty('cards');
      expect(Array.isArray(result.compassInvestorJourney.cards)).toBe(true);

      expect(result.connect).toHaveProperty('title');
      expect(result.connect).toHaveProperty('content');
      expect(result.connect).toHaveProperty('buttonLabel');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle malformed API response', async () => {
      const malformedResponse = {
        // missing data property, should have { data: { exploreDetails: ... } }
        exploreDetails: {},
      } as unknown as IExploreDetailsResponse;

      mockApiFetch.mockResolvedValue(malformedResponse);

      const result = await exploreService.getExploreData();

      expect(result).toEqual({
        bannerImage: '',
        bannerTitle: '',
        bannerContent: '',
        featuredIndustrialCitiesTitle: '',
        featuredIndustrialCitiesContent: '',
        compassInvestorJourney: {
          title: '',
          content: '',
          cards: [],
        },
        connect: {
          title: '',
          content: '',
          buttonLabel: '',
        },
      });
    });

    it('should handle JSON parsing errors from API', async () => {
      const jsonError = new SyntaxError('Unexpected token in JSON');
      mockApiFetch.mockRejectedValue(jsonError);

      await expect(exploreService.getExploreData()).rejects.toThrow('Unexpected token in JSON');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', jsonError);
    });

    it('should handle network connectivity issues', async () => {
      const networkError = new Error('Failed to fetch');
      mockApiFetch.mockRejectedValue(networkError);

      await expect(exploreService.getExploreData('en')).rejects.toThrow('Failed to fetch');

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching navigation data:', networkError);
    });
  });
});