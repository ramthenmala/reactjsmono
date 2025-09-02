import type { IApiResponse } from './searchFilters';

/** Raw API models (matches your JSON) */
export interface IIndustrialCity {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export interface IMapCity {
  id: string;
  cityName: string;
  industrialCities: IIndustrialCity[];
}

export interface IMapData {
  cities: IMapCity[];
}

/** Envelope returned by /v1/search/map-info */
export type TGetMapDataResponse = IApiResponse<IMapData>;

/** ---- Shape expected by MapView (already grouped by city) ---- */
export type PlotStatus = 'available' | 'sold' | 'reserved';
export type PlotType = 'industrial' | 'residential' | 'commercial' | 'logistics';

export interface IPlotPoint {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  area: number;
  price: number;
  type: PlotType;
  status: PlotStatus;
  image: string;
  description: string;
  amenities: string[];
  electricity?: string;
  gas?: string;
  water?: string;
}

export type TCityData = Record<string, IPlotPoint[]>;

/** Convert API payload to the CityData shape (filters out null coords). */
export function toCityData(data: IMapData): TCityData {
  const grouped: TCityData = {};
  for (const c of data?.cities ?? []) {
    const points: IPlotPoint[] = (c.industrialCities ?? [])
      .filter(ic => typeof ic.latitude === 'number' && typeof ic.longitude === 'number')
      .map(ic => ({
        id: ic.id,
        city: c.cityName,
        latitude: ic.latitude as number,
        longitude: ic.longitude as number,
        title: ic.name,
        address: `${ic.name}, ${c.cityName}, Saudi Arabia`,
        area: 0,
        price: 0,
        type: 'industrial' as PlotType,
        status: 'available' as PlotStatus,
        image: '',
        description: '',
        amenities: [],
      }));

    if (points.length) grouped[c.cityName] = points;
  }
  return grouped;
}

export type TViewMode = 'list' | 'split' | 'map';
export enum EViewMode {
  list = 'list',
  split = 'split',
  map = 'map',
}

export interface IMapViewProps {
  /** Layout mode; default is "map" when used standalone */
  viewMode?: EViewMode;
  sector?: string,
  region?: string,
  location?: string,
  isic?: string,
  minArea?: string,
  maxArea?: string
}