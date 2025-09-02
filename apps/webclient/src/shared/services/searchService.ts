import { SelectOption } from '../types/search';

// Mock data - replace with actual API calls
const MOCK_DATA = {
  regions: [
    { id: 'riyadh', label: 'Riyadh Region' },
    { id: 'eastern', label: 'Eastern Province' },
    { id: 'western', label: 'Western Province' },
    { id: 'southern', label: 'Southern Region' },
  ],
  sectors: [
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'logistics', label: 'Logistics & Storage' },
    { id: 'petrochemicals', label: 'Petrochemicals' },
    { id: 'food', label: 'Food Processing' },
  ],
  isics: [
    { id: '101234', label: '101234' },
    { id: '101345', label: '101345' },
    { id: '222100', label: '222100' },
    { id: '471900', label: '471900' },
    { id: '620100', label: '620100' },
  ],
  cities: {
    riyadh: [
      { id: 'riyadh-city', label: 'Riyadh City' },
      { id: 'industrial-city-1', label: 'Industrial City 1' },
    ],
    eastern: [
      { id: 'dammam', label: 'Dammam' },
      { id: 'jubail', label: 'Jubail' },
    ],
    western: [
      { id: 'jeddah', label: 'Jeddah' },
      { id: 'yanbu', label: 'Yanbu' },
    ],
    southern: [
      { id: 'abha', label: 'Abha' },
      { id: 'najran', label: 'Najran' },
    ],
  },
};

class SearchService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getRegions(): Promise<SelectOption[]> {
    await this.delay(300);
    return MOCK_DATA.regions;
  }

  async getSectors(): Promise<SelectOption[]> {
    await this.delay(300);
    return MOCK_DATA.sectors;
  }

  async getIsicCodes(): Promise<SelectOption[]> {
    await this.delay(300);
    return MOCK_DATA.isics;
  }

  async getCitiesByRegion(regionId: string): Promise<SelectOption[]> {
    await this.delay(400);
    return MOCK_DATA.cities[regionId as keyof typeof MOCK_DATA.cities] || [];
  }

  buildSearchUrl(filters: Record<string, any>, locale: string): string {
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