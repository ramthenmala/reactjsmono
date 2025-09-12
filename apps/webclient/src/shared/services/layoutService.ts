import { apiFetch } from '../lib/api/client';
import { ILayoutResponse, ILayoutData } from '../types';

const API_PATH = '/v1/investor-journey/site-layout';

export const layoutService = {
  async getLayoutData(acceptLanguage?: string): Promise<ILayoutData> {
    try {
      const data = await apiFetch<ILayoutResponse>(API_PATH, {
        acceptLanguage,
      });

      const layoutData: ILayoutData = {
        header: {
          logos: data.data?.header?.logos || [],
          menu: data.data?.header?.menu || [],
        },
        footer: {
          footerContent: data.data?.footer?.footerContent || '',
          copyrightText: data.data?.footer?.copyrightText || '',
          logos: data.data?.footer?.logos || [],
          quickLinks: data.data?.footer?.quickLinks || [],
          legalPages: data.data?.footer?.legalPages || [],
          socialLinks: data.data?.footer?.socialLinks || [],
        },
      };

      return layoutData;
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw error; // Let the calling component handle the error
    }
  },
};
