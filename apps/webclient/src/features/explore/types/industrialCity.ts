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
    status: boolean;
    title: string;
    value: string | null;
  };
  hospitalsAndMedicalCenters: {
    status: boolean;
    title: string;
    value: string | null;
  };
  publicTransportationAvailability: {
    status: boolean;
    title: string;
    value: string | null;
  };
  educationalInstitutions: {
    status: boolean;
    title: string;
    value: string | null;
  };
  noOfBanksAndCreditInstitutions: {
    title: string;
    value: number | null;
  };
  amenitiesForWorkforce: {
    status: boolean;
    title: string;
    value: string | null;
  };
  scenicLocationAndSurroundings: {
    status: boolean;
    title: string;
    value: string | null;
  };
}

export interface IMarketAccessAndDemand {
  image: string | null;
  title: string;
  subTitle: string;
  value: number | null;
}

export interface ILeagalAndRegulatory {
  image: string | null;
  title: string;
  subTitle: string;
  value: string | null;
}

export interface IEnvironmental {
  title: string
  image: string | null;
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
    value: string[];
  };
  organicClusters: {
    title: string;
    value: string[];
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
  'data-qa-id'?: string;
}

// Props for PropertyHeader component
export interface IPropertyHeaderProps {
  banner: string | null;
  name: string;
  description: string | null;
  'data-qa-id'?: string;
}

// Props for PropertyDetailsSection component  
export interface IPropertyDetailsSectionProps extends IIndustrialCityData {
  'data-qa-id'?: string;
}

// Props for other PropertyDetail components
export interface ILandsFactoriesSectionProps extends ILandAndFactoriesInfo {
  'data-qa-id'?: string;
}

export interface IInfrastructureSectionProps extends IInfrastructureInfo {
  'data-qa-id'?: string;
}

export interface ILogisticsServicesSectionProps {
  logisticsServicesInfo: ILogisticsServicesInfo;
  nearByLogisticCentersInfo: INearByLogisticCentersInfo;
  'data-qa-id'?: string;
}

export interface IWorkforceTalentSectionProps extends IWorkforceAndTalent {
  'data-qa-id'?: string;
}

export interface ISocialAndCommunitySectionProps extends ISocialAndCommunity {
  'data-qa-id'?: string;
}

export interface IMarketAccessAndDemandSectionProps extends IMarketAccessAndDemand {
  'data-qa-id'?: string;
}

export interface ILeagalAndRegulatorySectionProps extends ILeagalAndRegulatory {
  'data-qa-id'?: string;
}

export interface IEnvironmentalSectionProps extends IEnvironmental {
  'data-qa-id'?: string;
}

export interface IValueChainAndIndustryClustersSectionProps extends IValueChainAndIndustryClusters {
  'data-qa-id'?: string;
}

export interface IPrioritizationResultsSectionProps extends IPrioritizationResultInfo {
  'data-qa-id'?: string;
}
