export interface IMapInfo {
  title: string;
  map: string | null;
}

export interface IYearInfo {
  title: string;
  value: number | null;
}

export interface IDistrictInfo {
  title: string;
  value: string | null;
}

export interface ILandAndFactoriesInfo {
  title: string;
  totalLand: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  developedLand: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  undevelopedLand: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  occupancyRate: {
    title: string;
    value: string | null;
    unit: string | null;
  };
  percentageOfLogisticLand: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  projectsUnderConstruction: {
    title: string;
    value: number | null;
  };
  noOfFactories: {
    title: string;
    value: number | null;
  };
  currentWorkforce: {
    title: string;
    value: number | null;
  };
}

export interface IInfrastructureInfo {
  title: string;
  electricity: {
    title: string;
    value: string | null;
  };
  gas: {
    title: string;
    value: string | null;
  };
  water: {
    title: string;
    value: string | null;
  };
}

export interface ILogisticsServicesInfo {
  title: string;
  value: {
    dryPort: string | null;
    airport: {
      name: string | null;
      distance: string | null;
      unit: string | null;
    } | null;
    railwayStation: {
      name: string | null;
      distance: number | null;
      unit: string | null;
    } | null;
    neartestSeaport: {
      name: string | null;
      distance: number | null;
      unit: string | null;
    } | null;
    neartestRailway: string | null;
  };
}

export interface INearByLogisticCentersInfo {
  title: string;
  value: string[];
}

export interface IIndustriesInsideGraphInfo {
  title: string;
  value: {
    label: string;
    quantity: number;
  }[];
}

export interface IWorkforceAndTalent {
  title: string;
  image: string | null;
  avaialbilityOfSkilledLabor: {
    title: string;
    value: string | null;
    unit: string | null;
  };
  avaialbilityOfNonSkilledLabor: {
    title: string;
    value: string | null;
    unit: string | null;
  };
  skilledLaborAvgSalary: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  nonskilledLaborAvgSalary: {
    title: string;
    value: number | null;
    unit: string | null;
  };
}

export interface ISocialAndCommunity {
  title: string;
  residentialAreas: {
    title: string;
    value: string | null;
  };
  hospitalsAndMedicalCenters: {
    title: string;
    value: string | null;
  };
  publicTransportationAvailability: {
    title: string;
    value: string | null;
  };
  educationalInstitutions: {
    title: string;
    value: string | null;
  };
  noOfBanksAndCreditInstitutions: {
    title: string;
    value: number | null;
  };
  amenitiesForWorkforce: {
    title: string;
    value: string | null;
  };
  scenicLocationAndSurroundings: {
    title: string;
    value: string | null;
  };
}

export interface IMarketAccessAndDemand {
  title: string;
  subTitle: string;
  value: number | null;
}

export interface ILeagalAndRegulatory {
  title: string;
  subitile: string;
  value: string | null;
}

export interface IEnvironmental {
  title: string;
  humidity: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  temperature: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  percipitation: {
    title: string;
    value: number | null;
    unit: string | null;
  };
  polution: {
    title: string;
    value: number | null;
    unit: string | null;
  };
}

export interface IValueChainAndIndustryClusters {
  title: string;
  valueParks: {
    title: string;
    value: object[];
  };
  organicClusters: {
    title: string;
    value: object[];
  };
  knowHowAndInnovation: {
    title: string;
    value: number | null;
  };
}

export interface IPrioritizationResultInfo {
  title: string;
  workforceAndTalent: IWorkforceAndTalent;
  socialAndCommunity: ISocialAndCommunity;
  marketAccessAndDemand: IMarketAccessAndDemand;
  leagalAndRegulatory: ILeagalAndRegulatory;
  environmental: IEnvironmental;
  valueChainAndIndustryClusters: IValueChainAndIndustryClusters;
}

export interface IIndustrialCityData {
  id: string;
  name: string;
  description: string | null;
  banner: string | null;
  mapInfo: IMapInfo;
  yearInfo: IYearInfo;
  districtInfo: IDistrictInfo;
  landAndFactoriesInfo: ILandAndFactoriesInfo;
  infrastructureInfo: IInfrastructureInfo;
  logisticsServicesInfo: ILogisticsServicesInfo;
  nearByLogisticCentersInfo: INearByLogisticCentersInfo;
  industriesInsideGraphInfo: IIndustriesInsideGraphInfo;
  prioritizationResultInfo: IPrioritizationResultInfo;
}

export interface IIndustrialCityResponse {
  data: IIndustrialCityData;
}

// Props for DistrictMapSection component
export interface IDistrictMapSectionProps {
  mapInfo: IMapInfo;
  yearInfo: IYearInfo;
  districtInfo: IDistrictInfo;
  industriesInsideGraphInfo: IIndustriesInsideGraphInfo;
}
