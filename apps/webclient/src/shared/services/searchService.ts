import { SelectOption } from '../types/search';
import { SectorsService } from './sectorsService';
import { RegionsService } from './regionsService';
import { CitiesService } from './citiesService';

class SearchService {

  async getRegions(): Promise<SelectOption[]> {
    try {
      const regions = await RegionsService.fetchRegions();
      return regions.map((region) => ({
        id: region.id,
        label: region.name,
        value: region.id
      }));
    } catch (error) {
      console.error('Failed to load regions from API:', error);
      return [];
    }
  }

  async getSectors(): Promise<SelectOption[]> {
    try {
      const sectors = await SectorsService.fetchSectors();
      return sectors.map((sector) => ({
        id: sector.id,
        label: sector.name,
        value: sector.id
      }));
    } catch (error) {
      console.error('Failed to load sectors from API:', error);
      return [];
    }
  }

  async getIsicCodes(): Promise<SelectOption[]> {
    // ISIC codes are loaded via useIsicSearch hook
    return [];
  }

  async getCitiesByRegion(regionId: string): Promise<SelectOption[]> {
    try {
      return await CitiesService.fetchCitiesByRegion(regionId);
    } catch (error) {
      console.error('Failed to load cities:', error);
      return [];
    }
  }

  buildSearchUrl(filters: Record<string, string | number | string[]>, locale: string): string {
    const qs = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        if (value.length) qs.set(key, value.join(','));
      } else {
        qs.set(key, String(value));
      }
    });

    const queryString = qs.toString();
    return queryString
      ? `/${locale}/explore/listing?${queryString}`
      : `/${locale}/explore/listing`;
  }
}

export const searchService = new SearchService();