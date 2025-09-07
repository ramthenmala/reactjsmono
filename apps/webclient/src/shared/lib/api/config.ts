/**
 * API Configuration utility
 * Handles switching between mock and production APIs
 */

export type ApiEndpoint = 'isic' | 'sectors' | 'regions' | 'areas' | 'industrial-cities';

interface ApiConfig {
  baseUrl: string;
  useMockApi: boolean;
  mockEndpoints: Record<ApiEndpoint, string>;
  prodEndpoints: Record<ApiEndpoint, string>;
}

class ApiConfigService {
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_API_BASE_URL || '',
      useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
      mockEndpoints: {
        'isic': import.meta.env.VITE_MOCK_ISIC_ENDPOINT || '',
        'sectors': import.meta.env.VITE_MOCK_SECTORS_ENDPOINT || '',
        'regions': import.meta.env.VITE_MOCK_REGIONS_ENDPOINT || '',
        'areas': import.meta.env.VITE_MOCK_AREA_ENDPOINT || '',
        'industrial-cities': import.meta.env.VITE_MOCK_INDUSTRIAL_CITIES_ENDPOINT || '',
      },
      prodEndpoints: {
        'isic': import.meta.env.VITE_PROD_ISIC_ENDPOINT || '/api/isic',
        'sectors': import.meta.env.VITE_PROD_SECTORS_ENDPOINT || '/api/sectors',
        'regions': import.meta.env.VITE_PROD_REGIONS_ENDPOINT || '/api/regions',
        'areas': import.meta.env.VITE_PROD_AREA_ENDPOINT || '/api/areas',
        'industrial-cities': import.meta.env.VITE_PROD_INDUSTRIAL_CITIES_ENDPOINT || '/api/industrial-cities',
      }
    };
  }

  /**
   * Get the full URL for a given endpoint
   */
  getApiUrl(endpoint: ApiEndpoint): string {
    const { baseUrl, useMockApi, mockEndpoints, prodEndpoints } = this.config;
    
    if (useMockApi) {
      const mockEndpoint = mockEndpoints[endpoint];
      return `${baseUrl}/${mockEndpoint}`;
    } else {
      const prodEndpoint = prodEndpoints[endpoint];
      return `${baseUrl}${prodEndpoint}`;
    }
  }

  /**
   * Check if we're using mock APIs
   */
  isUsingMockApi(): boolean {
    return this.config.useMockApi;
  }

  /**
   * Get the base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}

// Export singleton instance
export const apiConfig = new ApiConfigService();