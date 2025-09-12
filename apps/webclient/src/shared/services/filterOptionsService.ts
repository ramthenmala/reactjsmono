import { apiFetch } from '../lib/api/client';
import { IFilteroptionsResponse, IFilterOptionsData } from '../types';

const API_PATH = '/v1/search/filter-options';

export const filterOptionsService = {
  async getFilterData(acceptLanguage?: string, type?: string, regionId?: string): Promise<IFilterOptionsData> {
    try {
      const queryParams: Record<string, string> = {};
      if (type) queryParams.type = type;
      if (regionId) queryParams.regionId = regionId;

      const data = await apiFetch<IFilteroptionsResponse>(API_PATH, {
        acceptLanguage,
        queryParams: Object.keys(queryParams).length ? queryParams : undefined,
      });

      const filterOptionsData: IFilterOptionsData = {
        isicCodes: data.data?.isicCodes,
        regions: data.data?.regions,
        sectors: data.data?.sectors,
        areaRange: data.data?.areaRange,
        cities: data.data?.cities,
      };

      return filterOptionsData;
    } catch (error) {
      console.error('Error fetching filter options data:', error);
      throw error; // Let the calling component handle the error
    }
  },
};
