export interface IExploreDetailsResponse {
  data: {
    exploreDetails: IExploreDetails;
  }
}

export interface IExploreDetails {
  bannerImage: string;
  bannerTitle: string;
  bannerContent: string;
  featuredIndustrialCitiesTitle: string;
  featuredIndustrialCitiesContent: string;
  compassInvestorJourney: ICompassInvestorJourney;
  connect: IConnectSection;
}

export interface ICompassInvestorJourney {
  title: string;
  content: string;
  cards: IInvestorJourneyCard[];
}

export interface IInvestorJourneyCard {
  icon: string;
  title: string;
  content: string;
}

export interface IConnectSection {
  title: string;
  content: string;
  buttonLabel: string;
}

export type TFeaturedProperty = {
  id: string;
  slug: string;
  city: string; // localized
  title: string; // localized
  area: number;
  image: string;
  electricity: string; // MW
  gas: string; // MMSCFD
  water: string; // m3/day
  status: 'available'; // keep literal type to match sample data
  featured: true;
};

export interface IProperty {
  id: string;
  slug: string;
  city: string;
  title: string;
  area: number;
  image: string;
  electricity?: string;
  water?: string;
  gas?: string;
  status: 'available' | 'sold' | 'reserved';
  featured?: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface IPropertyCardProps {
  property: IProperty;
  onCompare?: (property: IProperty) => void;
  onView?: (property: IProperty) => void;
  hideDistance?: boolean;
}

// --- API Response Types -------------------------------------------
export interface IIndustrialCityAPI {
  id: string;
  name: string;
  banner: string;
  cityName: string;
  regionName: string;
  totalArea: string; // in km²
  totalGasCapacity: string;
  totalWaterCapacity: string;
  totalElectricityCapacity: string;
  nearestAirportDistance: string;
  nearestDryportDistance: string;
  nearestLandportDistance: string;
  nearestRailwayDistance: string;
  nearestSeaportDistance: string;
}

export interface IIndustrialCitiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    cities: IIndustrialCityAPI[];
    total: number;
    page: string;
    limit: string;
  };
}

// --- Units ----------------------------------------------------------
export enum EAreaUnit {
  SqMeter = 'm2',
  SqFoot = 'ft2',
}
export enum EPowerUnit {
  MW = 'MW',
}
export enum EGasFlowUnit {
  MMSCFD = 'MMSCFD',
}
export enum EWaterFlowUnit {
  M3PerDay = 'm3/day',
}
