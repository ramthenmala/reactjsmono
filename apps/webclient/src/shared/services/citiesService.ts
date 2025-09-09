import { SelectOption } from '../types/search';

// Mock cities data by region - replace with actual API when available
const CITIES_BY_REGION: Record<string, SelectOption[]> = {
  // These region IDs should match the actual region IDs from the API
  // For now using mock data structure
  default: [
    { id: 'riyadh-city', label: 'Riyadh City', value: 'riyadh-city' },
    { id: 'dammam', label: 'Dammam', value: 'dammam' },
    { id: 'jeddah', label: 'Jeddah', value: 'jeddah' },
    { id: 'mecca', label: 'Mecca', value: 'mecca' },
    { id: 'medina', label: 'Medina', value: 'medina' },
    { id: 'taif', label: 'Taif', value: 'taif' },
    { id: 'khobar', label: 'Khobar', value: 'khobar' },
    { id: 'jubail', label: 'Jubail', value: 'jubail' },
    { id: 'tabuk', label: 'Tabuk', value: 'tabuk' },
    { id: 'abha', label: 'Abha', value: 'abha' },
    { id: 'hail-city', label: 'Hail City', value: 'hail-city' },
    { id: 'jazan-city', label: 'Jazan City', value: 'jazan-city' },
    { id: 'najran', label: 'Najran', value: 'najran' },
  ],
};

export class CitiesService {
  private static cache: Record<string, SelectOption[]> = {};

  static async fetchCitiesByRegion(regionId: string): Promise<SelectOption[]> {
    // Check cache first
    if (this.cache[regionId]) {
      return this.cache[regionId];
    }

    try {
      // TODO: Replace with actual API call when cities endpoint is available
      // Expected API: GET /api/regions/{regionId}/cities
      // For now, simulate API delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return cities for all regions (same list for now)
      // In real implementation, this would filter cities by region
      const cities = CITIES_BY_REGION.default.sort((a, b) =>
        a.label.localeCompare(b.label)
      );

      // Cache the result
      this.cache[regionId] = cities;
      return cities;
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache = {};
  }
}
