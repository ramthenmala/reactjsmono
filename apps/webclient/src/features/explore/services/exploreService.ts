import { apiFetch } from '../../../shared/lib/api/client';
import { IExploreDetails, IExploreDetailsResponse } from '../types';

const API_PATH = '/v1/investor-journey/explore';

export const exploreService = {
  async getExploreData(acceptLanguage?: string): Promise<IExploreDetails> {
    try {
      const data = await apiFetch<IExploreDetailsResponse>(API_PATH, {
        acceptLanguage,
      });

      const exploreDetails: IExploreDetails = {
        bannerImage: data.data?.exploreDetails?.bannerImage || '',
        bannerTitle: data.data?.exploreDetails?.bannerTitle || '',
        bannerContent: data.data?.exploreDetails?.bannerContent || '',
        featuredIndustrialCitiesTitle: data.data?.exploreDetails?.featuredIndustrialCitiesTitle || '',
        featuredIndustrialCitiesContent: data.data?.exploreDetails?.featuredIndustrialCitiesContent || '',
        compassInvestorJourney: {
          title: data.data?.exploreDetails?.compassInvestorJourney?.title || '',
          content: data.data?.exploreDetails?.compassInvestorJourney?.content || '',
          cards: data.data?.exploreDetails?.compassInvestorJourney?.cards || [],
        },
        connect: {
          title: data.data?.exploreDetails?.connect?.title || '',
          content: data.data?.exploreDetails?.connect?.content || '',
          buttonLabel: data.data?.exploreDetails?.connect?.buttonLabel || '',
        },
      };

      return exploreDetails;
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw error; // Let the calling component handle the error
    }
  },
};
