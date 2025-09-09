// Regions service type definitions

export interface Region {
  id: string;
  name: string;
}

export interface RegionsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    regions: Region[];
  };
}
