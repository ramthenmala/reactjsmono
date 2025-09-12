import { apiFetch } from '../../../shared/lib/api/client';
import {
  IIndustrialCityData,
  IIndustrialCityResponse,
  IMapInfo,
  IYearInfo,
  IDistrictInfo,
  ILandAndFactoriesInfo,
  IInfrastructureInfo,
  ILogisticsServicesInfo,
  INearByLogisticCentersInfo,
  IIndustriesInsideGraphInfo,
  IPrioritizationResultInfo,
} from '../types/industrialCity';

const API_PATH = '/v1/search/industrial-city';

export const industrialCityService = {
  async getIndustrialCity(acceptLanguage: string, id: string): Promise<IIndustrialCityData> {
    try {
      const data = await apiFetch<IIndustrialCityResponse>(API_PATH, {
        acceptLanguage,
        queryParams: { industrialCityId: id },
      });

      const d = data.data || {};

      const mapInfo: IMapInfo = d.mapInfo ?? { title: '', map: null };
      const yearInfo: IYearInfo = d.yearInfo ?? { title: '', value: null };
      const districtInfo: IDistrictInfo = d.districtInfo ?? { title: '', value: null };
      const landAndFactoriesInfo: ILandAndFactoriesInfo =
        d.landAndFactoriesInfo ?? ({
          title: '',
          totalLand: { title: '', value: null, unit: null },
          developedLand: { title: '', value: null, unit: null },
          undevelopedLand: { title: '', value: null, unit: null },
          occupancyRate: { title: '', value: null, unit: null },
          percentageOfLogisticLand: { title: '', value: null, unit: null },
          projectsUnderConstruction: { title: '', value: null },
          noOfFactories: { title: '', value: null },
          currentWorkforce: { title: '', value: null },
        } as ILandAndFactoriesInfo);

      const infrastructureInfo: IInfrastructureInfo =
        d.infrastructureInfo ?? ({
          title: '',
          electricity: { title: '', value: null },
          gas: { title: '', value: null },
          water: { title: '', value: null },
        } as IInfrastructureInfo);

      const logisticsServicesInfo: ILogisticsServicesInfo =
        d.logisticsServicesInfo ?? ({
          title: '',
          value: {
            dryPort: null,
            airport: null,
            railwayStation: null,
            neartestSeaport: null,
            neartestRailway: null,
          },
        } as ILogisticsServicesInfo);

      const nearByLogisticCentersInfo: INearByLogisticCentersInfo =
        d.nearByLogisticCentersInfo ?? { title: '', value: [] };

      const industriesInsideGraphInfo: IIndustriesInsideGraphInfo =
        d.industriesInsideGraphInfo ?? { title: '', value: [] };

      const prioritizationResultInfo: IPrioritizationResultInfo =
        d.prioritizationResultInfo ?? ({
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
        } as IPrioritizationResultInfo);

      const industrialCity: IIndustrialCityData = {
        id: d.id || '',
        name: d.name || '',
        description: d.description ?? null,
        banner: d.banner ?? null,
        mapInfo,
        yearInfo,
        districtInfo,
        landAndFactoriesInfo,
        infrastructureInfo,
        logisticsServicesInfo,
        nearByLogisticCentersInfo,
        industriesInsideGraphInfo,
        prioritizationResultInfo,
      };

      return industrialCity;
    } catch (error) {
      console.error('Error fetching industrial city data:', error);
      throw error; // Let the calling component handle the error
    }
  },
};
