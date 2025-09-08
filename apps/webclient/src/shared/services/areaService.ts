import type { AreaRange, AreaApiResponse } from '../types/area';

export class AreaService {
  private static readonly API_URL = import.meta.env.VITE_AREA_API_URL;
  private static cache: AreaRange | null = null;

  static async fetchAreaRange(): Promise<AreaRange> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: AreaApiResponse = await response.json();
      this.cache = apiResponse.data.area;
      return apiResponse.data.area;
    } catch (error) {
      console.error('Failed to fetch area range:', error);
      // Fallback to default range
      return { min: 0, max: 25000 };
    }
  }

  static clearCache(): void {
    this.cache = null;
  }
}