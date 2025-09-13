import { EViewMode } from './map';

// types/searchFilters.ts
export enum EFilterType {
  IsicCode = 'isicCode',
  Sector = 'sector',
  Region = 'region',
  City = 'city',
  Area = 'area',
}

export type TFilterType = keyof IFilterOptionsByType;

// Generic API envelope
export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Domain models
export interface IIsicCode {
  id: string;
  code: number;
} // e.g. 107944
export interface ISector {
  id: string;
  name: string;
}
export interface IRegion {
  id: string;
  name: string;
}
export interface ICity {
  id: string;
  name: string;
} // e.g. "Industrial Area 1"
export interface IAreaRange {
  min: number;
  max: number;
}

// Response payloads by type
export interface IFilterOptionsByType {
  [EFilterType.IsicCode]: { isicCodes: IIsicCode[] };
  [EFilterType.Sector]: { sectors: ISector[] };
  [EFilterType.Region]: { regions: IRegion[] };
  [EFilterType.City]: { cities: ICity[] };
  [EFilterType.Area]: { area: IAreaRange }; // { min, max } for the slider
}

// Typed API response
export type TSearchFilterOptionsResponse<T extends TFilterType> = IApiResponse<
  IFilterOptionsByType[T]
>;

export type TBaseParams<T extends TFilterType> = {
  type: T;
  locale?: string;
  signal?: AbortSignal;
};

/** Per-type params */
export type TIsicParams = TBaseParams<EFilterType.IsicCode> & {
  search?: string;
};
export type TSectorParams = TBaseParams<EFilterType.Sector>;
export type TRegionParams = TBaseParams<EFilterType.Region>;
export type TCityParams = TBaseParams<EFilterType.City>;
export type TAreaParams = TBaseParams<EFilterType.Area>;

// Union type for all possible params
export type TSearchFilterParams =
  | TIsicParams
  | TSectorParams
  | TRegionParams
  | TCityParams
  | TAreaParams;

// Search API parameters
export interface ISearchParams {
  locale?: string;
  page?: number;
  limit?: number;
  sector?: string;
  region?: string;
  location?: string;
  isic?: string;
  minArea?: string;
  maxArea?: string;
  view?: EViewMode;
}

// Search Results Response
export interface ISearchResultsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    properties: IProperty[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

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
}

// PropertyGrid props
export interface IPropertyGridProps {
  properties: IProperty[];
  totalResults: number;
  viewMode: EViewMode;
  onCompare?: (property: IProperty) => void;
  onView?: (property: IProperty) => void;
}

export interface IPropertyGridPropsWithQaId extends Omit<IPropertyGridProps, 'totalResults'> {
  'data-qa-id'?: string;
}
