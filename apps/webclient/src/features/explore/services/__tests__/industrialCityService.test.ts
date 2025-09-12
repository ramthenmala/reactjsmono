import { industrialCityService } from '@/features/explore/services/industrialCityService';
import { apiFetch } from '@/shared/lib/api/client';
import {
  IIndustrialCityResponse,
  IIndustrialCityData,
  IMapInfo,
  IYearInfo,
  IDistrictInfo,
  ILandAndFactoriesInfo,
  IInfrastructureInfo,
  ILogisticsServicesInfo,
  INearByLogisticCentersInfo,
  IIndustriesInsideGraphInfo,
  IPrioritizationResultInfo,
} from '@/features/explore/types/industrialCity';

jest.mock('@/shared/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const consoleSpy = {
  error: jest.fn(),
};

describe('industrialCityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
    console.error = consoleSpy.error;
  });

  describe('getIndustrialCity', () => {
    const mockMapInfo: IMapInfo = {
      title: 'Map of Industrial City',
      map: '/maps/city.png',
    };

    const mockYearInfo: IYearInfo = {
      title: 'Establishment Year',
      value: 2020,
    };

    const mockDistrictInfo: IDistrictInfo = {
      title: 'District',
      value: 'Eastern Region',
    };

    const mockLandAndFactoriesInfo: ILandAndFactoriesInfo = {
      title: 'Land & Factories',
      totalLand: { title: 'Total Land', value: 5000, unit: 'sqm' },
      developedLand: { title: 'Developed Land', value: 3000, unit: 'sqm' },
      undevelopedLand: { title: 'Undeveloped Land', value: 2000, unit: 'sqm' },
      occupancyRate: { title: 'Occupancy Rate', value: '60%', unit: '%' },
      percentageOfLogisticLand: { title: 'Logistic Land', value: 20, unit: '%' },
      projectsUnderConstruction: { title: 'Under Construction', value: 5 },
      noOfFactories: { title: 'Number of Factories', value: 25 },
      currentWorkforce: { title: 'Current Workforce', value: 1200 },
    };

    const mockInfrastructureInfo: IInfrastructureInfo = {
      title: 'Infrastructure',
      electricity: { title: 'Electricity', value: '100 MW' },
      gas: { title: 'Gas', value: '50 MMSCFD' },
      water: { title: 'Water', value: '10000 m3/day' },
    };

    const mockLogisticsServicesInfo: ILogisticsServicesInfo = {
      title: 'Logistics Services',
      value: {
        dryPort: 'Available',
        airport: { name: 'King Fahd Airport', distance: '25', unit: 'km' },
        railwayStation: { name: 'Central Railway', distance: 10, unit: 'km' },
        neartestSeaport: { name: 'Dammam Port', distance: 30, unit: 'km' },
        neartestRailway: 'Central Line',
      },
    };

    const mockNearByLogisticCentersInfo: INearByLogisticCentersInfo = {
      title: 'Nearby Logistic Centers',
      value: ['Center A', 'Center B', 'Center C'],
    };

    const mockIndustriesInsideGraphInfo: IIndustriesInsideGraphInfo = {
      title: 'Industries Inside',
      value: [
        { label: 'Manufacturing', quantity: 15 },
        { label: 'Chemicals', quantity: 8 },
        { label: 'Food Processing', quantity: 5 },
      ],
    };

    const mockPrioritizationResultInfo: IPrioritizationResultInfo = {
      title: 'Prioritization Results',
      workforceAndTalent: {
        title: 'Workforce & Talent',
        image: '/images/workforce.jpg',
        avaialbilityOfSkilledLabor: { title: 'Skilled Labor', value: 'High', unit: null },
        avaialbilityOfNonSkilledLabor: { title: 'Non-skilled Labor', value: 'Medium', unit: null },
        skilledLaborAvgSalary: { title: 'Skilled Salary', value: 8000, unit: 'SAR' },
        nonskilledLaborAvgSalary: { title: 'Non-skilled Salary', value: 3000, unit: 'SAR' },
      },
      socialAndCommunity: {
        title: 'Social & Community',
        residentialAreas: { title: 'Residential Areas', value: 'Available' },
        hospitalsAndMedicalCenters: { title: 'Medical Centers', value: '5 Centers' },
        publicTransportationAvailability: { title: 'Public Transport', value: 'Limited' },
        educationalInstitutions: { title: 'Educational', value: '10 Schools' },
        noOfBanksAndCreditInstitutions: { title: 'Banks', value: 8 },
        amenitiesForWorkforce: { title: 'Amenities', value: 'Good' },
        scenicLocationAndSurroundings: { title: 'Scenic Location', value: 'Excellent' },
      },
      marketAccessAndDemand: {
        title: 'Market Access',
        subTitle: 'Demand Analysis',
        value: 85,
      },
      leagalAndRegulatory: {
        title: 'Legal & Regulatory',
        subitile: 'Compliance Status',
        value: 'Compliant',
      },
      environmental: {
        title: 'Environmental',
        humidity: { title: 'Humidity', value: 65, unit: '%' },
        temperature: { title: 'Temperature', value: 28, unit: '°C' },
        percipitation: { title: 'Precipitation', value: 120, unit: 'mm' },
        polution: { title: 'Pollution', value: 15, unit: 'AQI' },
      },
      valueChainAndIndustryClusters: {
        title: 'Value Chain',
        valueParks: { title: 'Value Parks', value: [{ name: 'Tech Park' }] },
        organicClusters: { title: 'Organic Clusters', value: [{ name: 'Chemical Cluster' }] },
        knowHowAndInnovation: { title: 'Innovation', value: 75 },
      },
    };

    const mockIndustrialCityData: IIndustrialCityData = {
      id: 'city-123',
      name: 'Test Industrial City',
      description: 'A modern industrial city with advanced facilities',
      banner: '/images/city-banner.jpg',
      mapInfo: mockMapInfo,
      yearInfo: mockYearInfo,
      districtInfo: mockDistrictInfo,
      landAndFactoriesInfo: mockLandAndFactoriesInfo,
      infrastructureInfo: mockInfrastructureInfo,
      logisticsServicesInfo: mockLogisticsServicesInfo,
      nearByLogisticCentersInfo: mockNearByLogisticCentersInfo,
      industriesInsideGraphInfo: mockIndustriesInsideGraphInfo,
      prioritizationResultInfo: mockPrioritizationResultInfo,
    };

    const mockApiResponse: IIndustrialCityResponse = {
      data: mockIndustrialCityData,
    };

    it('should fetch industrial city data successfully', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'city-123');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/industrial-city', {
        acceptLanguage: 'en',
        queryParams: { industrialCityId: 'city-123' },
      });
      expect(result).toEqual(mockIndustrialCityData);
    });

    it('should handle different language codes', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      await industrialCityService.getIndustrialCity('ar', 'city-456');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/industrial-city', {
        acceptLanguage: 'ar',
        queryParams: { industrialCityId: 'city-456' },
      });
    });

    it('should handle empty response data with fallback defaults', async () => {
      const emptyResponse = { data: {} } as IIndustrialCityResponse;
      mockApiFetch.mockResolvedValue(emptyResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'city-123');

      expect(result).toEqual({
        id: '',
        name: '',
        description: null,
        banner: null,
        mapInfo: { title: '', map: null },
        yearInfo: { title: '', value: null },
        districtInfo: { title: '', value: null },
        landAndFactoriesInfo: {
          title: '',
          totalLand: { title: '', value: null, unit: null },
          developedLand: { title: '', value: null, unit: null },
          undevelopedLand: { title: '', value: null, unit: null },
          occupancyRate: { title: '', value: null, unit: null },
          percentageOfLogisticLand: { title: '', value: null, unit: null },
          projectsUnderConstruction: { title: '', value: null },
          noOfFactories: { title: '', value: null },
          currentWorkforce: { title: '', value: null },
        },
        infrastructureInfo: {
          title: '',
          electricity: { title: '', value: null },
          gas: { title: '', value: null },
          water: { title: '', value: null },
        },
        logisticsServicesInfo: {
          title: '',
          value: {
            dryPort: null,
            airport: null,
            railwayStation: null,
            neartestSeaport: null,
            neartestRailway: null,
          },
        },
        nearByLogisticCentersInfo: { title: '', value: [] },
        industriesInsideGraphInfo: { title: '', value: [] },
        prioritizationResultInfo: {
          title: '',
          workforceAndTalent: {
            title: '',
            image: null,
            avaialbilityOfSkilledLabor: { title: '', value: null, unit: null },
            avaialbilityOfNonSkilledLabor: { title: '', value: null, unit: null },
            skilledLaborAvgSalary: { title: '', value: null, unit: null },
            nonskilledLaborAvgSalary: { title: '', value: null, unit: null },
          },
          socialAndCommunity: {
            title: '',
            residentialAreas: { title: '', value: null },
            hospitalsAndMedicalCenters: { title: '', value: null },
            publicTransportationAvailability: { title: '', value: null },
            educationalInstitutions: { title: '', value: null },
            noOfBanksAndCreditInstitutions: { title: '', value: null },
            amenitiesForWorkforce: { title: '', value: null },
            scenicLocationAndSurroundings: { title: '', value: null },
          },
          marketAccessAndDemand: { title: '', subTitle: '', value: null },
          leagalAndRegulatory: { title: '', subitile: '', value: null },
          environmental: {
            title: '',
            humidity: { title: '', value: null, unit: null },
            temperature: { title: '', value: null, unit: null },
            percipitation: { title: '', value: null, unit: null },
            polution: { title: '', value: null, unit: null },
          },
          valueChainAndIndustryClusters: {
            title: '',
            valueParks: { title: '', value: [] },
            organicClusters: { title: '', value: [] },
            knowHowAndInnovation: { title: '', value: null },
          },
        },
      });
    });

    it('should handle partial data with some fields missing', async () => {
      const partialResponse = {
        data: {
          id: 'partial-city',
          name: 'Partial City',
          mapInfo: { title: 'Map Title', map: null },
          landAndFactoriesInfo: {
            title: 'Land Info',
            totalLand: { title: 'Total', value: 1000, unit: 'sqm' },
          },
        },
      } as unknown as IIndustrialCityResponse;

      mockApiFetch.mockResolvedValue(partialResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'partial-city');

      expect(result.id).toBe('partial-city');
      expect(result.name).toBe('Partial City');
      expect(result.mapInfo).toEqual({ title: 'Map Title', map: null });
      expect(result.landAndFactoriesInfo.totalLand).toEqual({
        title: 'Total',
        value: 1000,
        unit: 'sqm',
      });
      expect(result.yearInfo).toEqual({ title: '', value: null });
      expect(result.infrastructureInfo.electricity).toEqual({ title: '', value: null });
    });

    it('should handle null values in nested objects', async () => {
      const nullDataResponse = {
        data: {
          id: 'null-city',
          name: 'City with Nulls',
          description: null,
          banner: null,
          mapInfo: null,
          yearInfo: null,
          prioritizationResultInfo: null,
        },
      } as unknown as IIndustrialCityResponse;

      mockApiFetch.mockResolvedValue(nullDataResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'null-city');

      expect(result.id).toBe('null-city');
      expect(result.name).toBe('City with Nulls');
      expect(result.description).toBeNull();
      expect(result.banner).toBeNull();
      expect(result.mapInfo).toEqual({ title: '', map: null });
      expect(result.yearInfo).toEqual({ title: '', value: null });
    });

    it('should preserve complex nested structures', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'city-123');

      expect(result.industriesInsideGraphInfo.value).toHaveLength(3);
      expect(result.industriesInsideGraphInfo.value[0]).toEqual({
        label: 'Manufacturing',
        quantity: 15,
      });
      expect(result.prioritizationResultInfo.workforceAndTalent.skilledLaborAvgSalary).toEqual({
        title: 'Skilled Salary',
        value: 8000,
        unit: 'SAR',
      });
      expect(result.logisticsServicesInfo.value.airport).toEqual({
        name: 'King Fahd Airport',
        distance: '25',
        unit: 'km',
      });
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Network error');
      mockApiFetch.mockRejectedValue(apiError);

      await expect(industrialCityService.getIndustrialCity('en', 'city-123')).rejects.toThrow(
        'Network error'
      );

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching industrial city data:', apiError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiFetch.mockRejectedValue(timeoutError);

      await expect(industrialCityService.getIndustrialCity('ar', 'city-456')).rejects.toThrow(
        'Request timeout'
      );

      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching industrial city data:', timeoutError);
    });

    it('should handle malformed response structure', async () => {
      const malformedResponse = {
        wrongProperty: 'invalid',
      } as unknown as IIndustrialCityResponse;

      mockApiFetch.mockResolvedValue(malformedResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'city-123');

      expect(result.id).toBe('');
      expect(result.name).toBe('');
      expect(result.description).toBeNull();
    });

    it('should use correct API endpoint and parameters', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      await industrialCityService.getIndustrialCity('fr', 'test-city-789');

      expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/industrial-city', {
        acceptLanguage: 'fr',
        queryParams: { industrialCityId: 'test-city-789' },
      });
    });

    it('should return structured data matching IIndustrialCityData interface', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const result = await industrialCityService.getIndustrialCity('en', 'city-123');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('banner');
      expect(result).toHaveProperty('mapInfo');
      expect(result).toHaveProperty('yearInfo');
      expect(result).toHaveProperty('districtInfo');
      expect(result).toHaveProperty('landAndFactoriesInfo');
      expect(result).toHaveProperty('infrastructureInfo');
      expect(result).toHaveProperty('logisticsServicesInfo');
      expect(result).toHaveProperty('nearByLogisticCentersInfo');
      expect(result).toHaveProperty('industriesInsideGraphInfo');
      expect(result).toHaveProperty('prioritizationResultInfo');

      expect(result.mapInfo).toHaveProperty('title');
      expect(result.mapInfo).toHaveProperty('map');
      expect(result.yearInfo).toHaveProperty('title');
      expect(result.yearInfo).toHaveProperty('value');
      expect(Array.isArray(result.nearByLogisticCentersInfo.value)).toBe(true);
      expect(Array.isArray(result.industriesInsideGraphInfo.value)).toBe(true);
    });

    it('should handle different input parameter types', async () => {
      mockApiFetch.mockResolvedValue(mockApiResponse);

      const testCases = [
        { lang: 'en-US', id: 'city-1' },
        { lang: 'ar-SA', id: 'city-2' },
        { lang: '', id: 'city-3' },
        { lang: 'zh-CN', id: '12345' },
      ];

      for (const testCase of testCases) {
        await industrialCityService.getIndustrialCity(testCase.lang, testCase.id);
        expect(mockApiFetch).toHaveBeenCalledWith('/v1/search/industrial-city', {
          acceptLanguage: testCase.lang,
          queryParams: { industrialCityId: testCase.id },
        });
      }
    });

    it('should handle array values in nested structures correctly', async () => {
      const responseWithArrays = {
        data: {
          ...mockIndustrialCityData,
          nearByLogisticCentersInfo: {
            title: 'Centers',
            value: ['Center 1', 'Center 2', 'Center 3', 'Center 4'],
          },
          industriesInsideGraphInfo: {
            title: 'Industries',
            value: [
              { label: 'Tech', quantity: 20 },
              { label: 'Manufacturing', quantity: 15 },
            ],
          },
        },
      };

      mockApiFetch.mockResolvedValue(responseWithArrays);

      const result = await industrialCityService.getIndustrialCity('en', 'array-city');

      expect(result.nearByLogisticCentersInfo.value).toHaveLength(4);
      expect(result.industriesInsideGraphInfo.value).toHaveLength(2);
      expect(result.industriesInsideGraphInfo.value[0]).toEqual({ label: 'Tech', quantity: 20 });
    });
  });
});