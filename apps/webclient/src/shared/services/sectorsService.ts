import type { Sector, SectorsApiResponse } from '../types/sectors';

export class SectorsService {
  private static readonly API_URL = import.meta.env.VITE_SECTORS_API_URL;
  private static cache: Sector[] | null = null;

  static async fetchSectors(): Promise<Sector[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: SectorsApiResponse = await response.json();
      // Sort sectors alphabetically by name
      const sortedSectors = apiResponse.data.sectors.sort((a, b) => a.name.localeCompare(b.name));
      this.cache = sortedSectors;
      return sortedSectors;
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache = null;
  }
}