// ISIC service type definitions

export interface IsicCode {
  id: string;
  code: number;
}

export interface IsicApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    isicCodes: IsicCode[];
  };
}
