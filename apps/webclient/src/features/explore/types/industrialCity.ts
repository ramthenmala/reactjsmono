export interface WorkforceTalent {
  availabilityOfSkilleLabor?: string;
  availabilityOfNonSkilleLabor?: string;
  skilledLaborAvgSalary?: string;
  nonSkilledLaborAvgSalary?: string;
  image?: string;
}

export interface LandsAndFactories {
  totalLand?: string;
  availableLand?: string;
  occupiedLand?: string;
  developedLand?: string;
  undevelopedLand?: string;
  occupancyRate?: string;
  logisticLandPercentage?: string;
  projectsUnderConstruction?: string | null;
  numberOfFactories?: string | number;
  currentWorkforce?: string;
  totalFactoriesAndFacilities?: string;
  availableFactoriesAndFacilities?: string;
  occupiedFactoriesAndFacilities?: string;
}

export interface Infrastructure {
  electricityDailyCapacity?: string;
  gasDailyCapacity?: string;
  waterDailyCapacity?: string;
  totalElectricityCapacity?: string;
  totalWaterCapacity?: string | null;
  totalGasCapacity?: string | null;
}

export interface LogisticsServices {
  nearestPort?: string;
  nearestAirport?: string;
  railwayAccess?: string;
  dryPort?: {
    name: string;
    distance: string;
  };
  airport?: {
    name: string;
    distance: string;
  };
  railwayStation?: {
    name: string;
    distance: string;
  } | null;
  neartestSeaport?: {
    name: string;
    distance: string;
  } | null;
  neartestRailway?: {
    name: string;
    distance: string;
  } | null;
  nearbyLogisticCenters?: string[];
}

export interface IndustrialCity {
  id: string;
  name: string;
  arabicName?: string;
  slug?: string;
  region?: string;
  arabicRegion?: string;
  description?: string;
  arabicDescription?: string;
  status?: 'active' | 'planned' | 'under-construction' | string;
  logo?: string;
  heroImage?: string;
  banner?: string | null;
  gallery?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  area?: string | number;
  establishedYear?: number;
  estYear?: string | number;
  district?: string;
  targetIndustries?: string[];
  workforceTalent?: WorkforceTalent;
  landsAndFactories?: LandsAndFactories;
  infrastructure?: Infrastructure;
  logisticsServices?: LogisticsServices;
  districtMap?: string;
  districtMapAndDetails?: string | null;
  features?: string[];
  amenities?: string[];
}

export interface IIndustrialCityModel {
  id: string;
  slug?: string;
  name: string;
  title?: string;
  description: string;
  banner: string | null;
  image?: string;
  estYear: number;
  district: string;
  region?: string;
  city?: string;
  area?: number;
  coordinates?: { lat: number; lng: number };
  status?: string;
  featured?: boolean;
  electricity?: number;
  water?: number;
  gas?: number;
  landsAndFactories?: {
    totalLand?: string;
    developedLand?: string;
    undevelopedLand?: string;
    occupancyRate?: string;
    logisticLandPercentage?: string;
    projectsUnderConstruction?: string | null;
    numberOfFactories?: number;
    currentWorkforce?: string;
  };
  infrastructure?: {
    totalElectricityCapacity?: string;
    totalWaterCapacity?: string | null;
    totalGasCapacity?: string | null;
  };
  logisticsServices?: {
    dryPort?: { name: string; distance: string };
    airport?: { name: string; distance: string };
    railwayStation?: { name: string; distance: string } | null;
    neartestSeaport?: { name: string; distance: string } | null;
    neartestRailway?: { name: string; distance: string } | null;
    nearbyLogisticCenters?: string[];
  };
  districtMapAndDetails?: string | null;
  industries?: { label: string | number; quantity: number }[];
  workforceTalent?: {
    availabilityOfSkilleLabor?: string;
    availabilityOfNonSkilleLabor?: string;
    skilledLaborAvgSalary?: string;
    nonSkilledLaborAvgSalary?: string;
  };
}

export interface PropertyDetailComponentProps {
  industrialCity: IndustrialCity;
}