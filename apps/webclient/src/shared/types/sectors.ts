// Sectors service type definitions

export interface Sector {
  id: string;
  name: string;
}

export interface SectorsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    sectors: Sector[];
  };
}