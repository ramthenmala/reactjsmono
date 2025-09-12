import { apiFetch } from '../../../shared/lib/api/client';
import { ISearchData, ISearchResponse } from '../types';

const API_PATH = '/v1/search';

export const searchService = {
  async getSearchData(acceptLanguage?: string, params?: Record<string, string>): Promise<ISearchData> {
    try {
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (key === 'isic') {
            value.split(',').forEach(val => queryParams.append('isicIds', val.trim()));
          } else if (key === 'sector') {
            queryParams.append('sectorIds', value);
          } else if (key === 'region') {
            queryParams.append('regionIds', value);
          } else if (key === 'location') {
            queryParams.append('cityIds', value);
          } else if (key === 'minArea' || key === 'maxArea') {
            queryParams.append(key, value);
          }
        });
      }
      const data = await apiFetch<ISearchResponse>(API_PATH, {
        acceptLanguage,
        queryParams: queryParams.toString() ? Object.fromEntries(queryParams) : undefined,
      });

      const searchData: ISearchData = {
        cities: data.data?.cities || [],
        total: data.data?.total || 0,
        page: data.data?.page || '1',
        limit: data.data?.limit || '10',
      };

      return searchData;
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw error; // Let the calling component handle the error
    }
  },
};
