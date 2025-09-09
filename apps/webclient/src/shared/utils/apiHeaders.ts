import { getCurrentLanguage } from '../lib/i18n';
import { useLanguage } from '../lib/i18n';

/**
 * Utility to create standardized API headers for the application
 * Includes required headers for the investor portal API
 */

export interface ApiRequestOptions {
  currentLanguage?: string;
  additionalHeaders?: Record<string, string>;
}

export function createApiHeaders(options: ApiRequestOptions = {}): HeadersInit {
  const { currentLanguage = getCurrentLanguage(), additionalHeaders = {} } = options;
  
  return {
    'accept': '*/*',
    'x-user-agent': 'InvestorPortal',
    'x-signature': 'secret456',
    'accept-language': currentLanguage,
    ...additionalHeaders,
  };
}

/**
 * Creates a fetch request with standardized headers
 */
export function createApiRequest(
  url: string, 
  options: RequestInit & ApiRequestOptions = {}
): Promise<Response> {
  const { currentLanguage, additionalHeaders, ...fetchOptions } = options;
  
  return fetch(url, {
    ...fetchOptions,
    headers: {
      ...createApiHeaders({ currentLanguage, additionalHeaders }),
      ...fetchOptions.headers,
    },
  });
}

/**
 * React hook to create API headers with current language from context
 */
export function useApiHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
  const { currentLanguage } = useLanguage();
  
  return createApiHeaders({ 
    currentLanguage, 
    additionalHeaders 
  });
}

/**
 * React hook to create API requests with current language from context
 */
export function useApiRequest() {
  const { currentLanguage } = useLanguage();
  
  return (url: string, options: RequestInit & Omit<ApiRequestOptions, 'currentLanguage'> = {}) => {
    return createApiRequest(url, { ...options, currentLanguage });
  };
}