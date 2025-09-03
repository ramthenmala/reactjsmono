export interface IsicCode {
  id: string;
  code: number;
}

export interface IsicApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    isicCodes: IsicCode[];
  };
}

export class IsicService {
  private static readonly API_URL = import.meta.env.VITE_ISIC_API_URL;
  private static cache: IsicCode[] | null = null;

  static async fetchIsicCodes(): Promise<IsicCode[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse: IsicApiResponse = await response.json();
      this.cache = apiResponse.data.isicCodes;
      return apiResponse.data.isicCodes;
    } catch (error) {
      console.error('Failed to fetch ISIC codes:', error);
      return [];
    }
  }

  static async searchIsicCodes(query: string): Promise<IsicCode[]> {
    if (query.length < 2) {
      return [];
    }

    const allCodes = await this.fetchIsicCodes();
    const queryNumber = parseInt(query);

    return allCodes.filter(item => {
      const codeStr = item.code.toString();
      return codeStr.includes(query) || (!isNaN(queryNumber) && item.code === queryNumber);
    }).slice(0, 50); // Limit results for performance
  }

  static clearCache(): void {
    this.cache = null;
  }
}