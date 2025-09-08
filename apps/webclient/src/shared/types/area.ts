// Area service type definitions

export interface AreaRange {
  min: number;
  max: number;
}

export interface AreaApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    area: AreaRange;
  };
}