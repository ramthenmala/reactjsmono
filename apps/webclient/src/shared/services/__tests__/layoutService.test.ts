import { layoutService } from '@/services/layoutService';
import { apiFetch } from '@/lib/api/client';
import { ILayoutResponse, ILayoutData } from '@/types';

// Mock the apiFetch function
jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe('layoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getLayoutData', () => {
    const mockApiResponse: ILayoutResponse = {
      data: {
        header: {
          logos: [
            { logoName: 'Main Logo', logo: '/logo.png' },
            { logoName: 'Secondary Logo', logo: '/logo2.png' },
          ],
          menu: [
            {
              label: 'Home',
              link: '/',
              hasSubMenu: false,
              subMenu: [],
            },
            {
              label: 'Services',
              link: '/services',
              hasSubMenu: true,
              subMenu: [
                {
                  label: 'Service 1',
                  link: '/services/1',
                  hasSubMenu: false,
                  subMenu: [],
                },
              ],
            },
          ],
        },
        footer: {
          footerContent: 'Footer content here',
          copyrightText: '© 2024 Company Name',
          logos: [{ logoName: 'Footer Logo', logo: '/footer-logo.png' }],
          quickLinks: [{ label: 'Quick Link', link: '/quick' }],
          legalPages: [{ label: 'Privacy', link: '/privacy' }],
          socialLinks: [
            { platform: 'facebook', label: 'Facebook', link: 'https://facebook.com' },
            { platform: 'twitter', label: 'Twitter', link: null },
          ],
        },
      },
    };

    it('should fetch layout data successfully without acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await layoutService.getLayoutData();

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/site-layout', {
        acceptLanguage: undefined,
      });

      expect(result).toEqual({
        header: {
          logos: mockApiResponse.data?.header.logos,
          menu: mockApiResponse.data?.header.menu,
        },
        footer: {
          footerContent: mockApiResponse.data?.footer.footerContent,
          copyrightText: mockApiResponse.data?.footer.copyrightText,
          logos: mockApiResponse.data?.footer.logos,
          quickLinks: mockApiResponse.data?.footer.quickLinks,
          legalPages: mockApiResponse.data?.footer.legalPages,
          socialLinks: mockApiResponse.data?.footer.socialLinks,
        },
      });
    });

    it('should fetch layout data successfully with acceptLanguage', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await layoutService.getLayoutData('en');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/investor-journey/site-layout', {
        acceptLanguage: 'en',
      });

      expect(result).toEqual({
        header: {
          logos: mockApiResponse.data?.header.logos,
          menu: mockApiResponse.data?.header.menu,
        },
        footer: {
          footerContent: mockApiResponse.data?.footer.footerContent,
          copyrightText: mockApiResponse.data?.footer.copyrightText,
          logos: mockApiResponse.data?.footer.logos,
          quickLinks: mockApiResponse.data?.footer.quickLinks,
          legalPages: mockApiResponse.data?.footer.legalPages,
          socialLinks: mockApiResponse.data?.footer.socialLinks,
        },
      });
    });

    it('should handle missing data properties gracefully with empty defaults', async () => {
      const incompleteResponse: ILayoutResponse = {
        data: {
          header: {
            logos: [{ logoName: 'Logo', logo: '/logo.png' }],
            // Missing menu
            menu: undefined as any,
          },
          footer: {
            footerContent: 'Some content',
            copyrightText: '',
            // Missing other properties
            logos: undefined as any,
            quickLinks: undefined as any,
            legalPages: undefined as any,
            socialLinks: undefined as any,
          },
        },
      };

      mockApiFetch.mockResolvedValue(incompleteResponse);

      const result = await layoutService.getLayoutData();

      expect(result).toEqual({
        header: {
          logos: [{ logoName: 'Logo', logo: '/logo.png' }],
          menu: [],
        },
        footer: {
          footerContent: 'Some content',
          copyrightText: '',
          logos: [],
          quickLinks: [],
          legalPages: [],
          socialLinks: [],
        },
      });
    });

    it('should handle completely missing header/footer sections', async () => {
      const minimalResponse: ILayoutResponse = {
        data: {
          header: undefined as any,
          footer: undefined as any,
        },
      };

      mockApiFetch.mockResolvedValue(minimalResponse);

      const result = await layoutService.getLayoutData();

      expect(result).toEqual({
        header: {
          logos: [],
          menu: [],
        },
        footer: {
          footerContent: '',
          copyrightText: '',
          logos: [],
          quickLinks: [],
          legalPages: [],
          socialLinks: [],
        },
      });
    });

    it('should handle null/undefined data', async () => {
      const nullDataResponse: ILayoutResponse = {
        data: undefined,
      };

      mockApiFetch.mockResolvedValue(nullDataResponse);

      const result = await layoutService.getLayoutData();

      expect(result).toEqual({
        header: {
          logos: [],
          menu: [],
        },
        footer: {
          footerContent: '',
          copyrightText: '',
          logos: [],
          quickLinks: [],
          legalPages: [],
          socialLinks: [],
        },
      });
    });

    it('should handle API errors and log them', async () => {
      const mockError = new Error('API Error');
      mockApiFetch.mockRejectedValue(mockError);

      await expect(layoutService.getLayoutData()).rejects.toThrow('API Error');

      expect(console.error).toHaveBeenCalledWith('Error fetching navigation data:', mockError);
    });

    it('should handle network errors with specific language', async () => {
      const networkError = new Error('Network Error');
      mockApiFetch.mockRejectedValue(networkError);

      await expect(layoutService.getLayoutData('es')).rejects.toThrow('Network Error');

      expect(console.error).toHaveBeenCalledWith('Error fetching navigation data:', networkError);
    });

    it('should preserve exact structure of nested menu items', async () => {
      const complexMenuResponse: ILayoutResponse = {
        data: {
          header: {
            logos: [],
            menu: [
              {
                label: 'Parent',
                link: '/parent',
                hasSubMenu: true,
                subMenu: [
                  {
                    label: 'Child 1',
                    link: '/parent/child1',
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    label: 'Child 2',
                    link: '/parent/child2',
                    hasSubMenu: true,
                    subMenu: [
                      {
                        label: 'Grandchild',
                        link: '/parent/child2/grandchild',
                        hasSubMenu: false,
                        subMenu: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          footer: {
            footerContent: '',
            copyrightText: '',
            logos: [],
            quickLinks: [],
            legalPages: [],
            socialLinks: [],
          },
        },
      };

      mockApiFetch.mockResolvedValue(complexMenuResponse);

      const result = await layoutService.getLayoutData();

      expect(result.header.menu).toHaveLength(1);
      expect(result.header.menu[0].subMenu).toHaveLength(2);
      expect(result.header.menu[0].subMenu[1].subMenu).toHaveLength(1);
      expect(result.header.menu[0].subMenu[1].subMenu[0].label).toBe('Grandchild');
    });

    it('should preserve social links with null links', async () => {
      const socialLinksResponse: ILayoutResponse = {
        data: {
          header: { logos: [], menu: [] },
          footer: {
            footerContent: '',
            copyrightText: '',
            logos: [],
            quickLinks: [],
            legalPages: [],
            socialLinks: [
              { platform: 'facebook', label: 'Facebook', link: 'https://facebook.com' },
              { platform: 'twitter', label: 'Twitter', link: null },
              { platform: 'instagram', label: 'Instagram', link: 'https://instagram.com' },
            ],
          },
        },
      };

      mockApiFetch.mockResolvedValue(socialLinksResponse);

      const result = await layoutService.getLayoutData();

      expect(result.footer.socialLinks).toHaveLength(3);
      expect(result.footer.socialLinks[1].link).toBeNull();
      expect(result.footer.socialLinks[0].link).toBe('https://facebook.com');
      expect(result.footer.socialLinks[2].link).toBe('https://instagram.com');
    });

    it('should handle different acceptLanguage values', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const languages = ['en', 'es', 'fr', 'de', 'ar'];

      for (const lang of languages) {
        await layoutService.getLayoutData(lang);
        expect(mockApiFetch).toHaveBeenLastCalledWith('/v1/investor-journey/site-layout', {
          acceptLanguage: lang,
        });
      }
    });
  });
});