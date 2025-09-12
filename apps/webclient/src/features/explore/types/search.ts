export interface ISearchCity {
  id: string;
  name: string;
  banner: string | null;
  cityName: string;
  regionName: string | null;
  totalArea: string | null;
  totalGasCapacity: string | null;
  totalWaterCapacity: string | null;
  totalElectricityCapacity: string | null;
  nearestAirportDistance: string | null;
  nearestDryportDistance: string | null;
  nearestLandportDistance: string | null;
  nearestRailwayDistance: string | null;
  nearestSeaportDistance: string | null;
  latitude: number;
  longitude: number;
}

export interface ISearchData {
  cities: ISearchCity[];
  total: number;
  page: string;
  limit: string;
}

export interface ISearchResponse {
  data: ISearchData;
}
