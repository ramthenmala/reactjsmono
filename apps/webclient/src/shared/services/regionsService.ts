export interface Region {
  id: string;
  name: string;
}

export interface RegionsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    regions: Region[];
  };
}

export class RegionsService {
  private static readonly API_URL = import.meta.env.VITE_REGIONS_API_URL;
  private static cache: Region[] | null = null;

  static async fetchRegions(): Promise<Region[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: RegionsApiResponse = await response.json();
      // Sort regions alphabetically by name
      const sortedRegions = apiResponse.data.regions.sort((a, b) => a.name.localeCompare(b.name));
      this.cache = sortedRegions;
      return sortedRegions;
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      return [];
    }
  }

  static clearCache(): void {
    this.cache = null;
  }
}