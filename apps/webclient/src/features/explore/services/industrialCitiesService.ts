import {
  IIndustrialCitiesResponse,
  IIndustrialCityAPI,
  IProperty,
} from '../types/explore';
import { getPropertyImageByIndex } from '../constants';
import { createApiRequest } from '@/shared/utils/apiHeaders';

const API_URL =
  import.meta.env.VITE_INDUSTRIAL_CITIES_API_URL ||
  'https://www.jsonkeeper.com/b/IWHDX';

// Service to fetch industrial cities data
export class IndustrialCitiesService {
  static async fetchIndustrialCities(): Promise<IIndustrialCityAPI[]> {
    try {
      const response = await createApiRequest(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IIndustrialCitiesResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch industrial cities');
      }

      return data.data.cities;
    } catch (error) {
      console.error('Error fetching industrial cities:', error);
      throw error;
    }
  }

  // Transform API data to IProperty format for consistency with existing components
  static transformToProperties(cities: IIndustrialCityAPI[]): IProperty[] {
    // API already returns localized content based on accept-language header
    // No need for client-side localization anymore
    
    return cities.map((city, index) => ({
      id: city.id,
      slug: city.name.toLowerCase().replace(/\s+/g, '-'),
      city: city.cityName,
      title: city.name,
      // Keep the area as is from the API (it's in km²)
      area: parseFloat(city.totalArea) || 0,
      image: city.banner || getPropertyImageByIndex(index), // Use banner or fallback image
      electricity: city.totalElectricityCapacity || undefined,
      water: city.totalWaterCapacity || undefined,
      gas: city.totalGasCapacity || undefined,
      status: 'available' as const,
      featured: index < 2, // Make first 2 cities featured
      coordinates: {
        // Default to Riyadh coordinates since all are in the region
        // In a real app, you'd have actual coordinates for each city
        lat: 24.7136 + (Math.random() - 0.5) * 0.2,
        lng: 46.6753 + (Math.random() - 0.5) * 0.2,
      },
    }));
  }

  // Main method to get properties ready for the UI
  static async getProperties(): Promise<IProperty[]> {
    const cities = await this.fetchIndustrialCities();
    return this.transformToProperties(cities);
  }
}
