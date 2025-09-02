/**
 * URL utility functions
 */

export function buildSearchParams(filters: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
    } else {
      params.set(key, String(value));
    }
  });
  
  return params;
}

export function parseSearchParams(searchParams: URLSearchParams): Record<string, any> {
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    // Handle comma-separated array values
    if (value.includes(',')) {
      params[key] = value.split(',').filter(Boolean);
    } else {
      // Try to parse numbers
      const numValue = Number(value);
      params[key] = isNaN(numValue) ? value : numValue;
    }
  }
  
  return params;
}

export function createRouteUrl(path: string, locale: string, params?: Record<string, any>): string {
  const searchParams = params ? buildSearchParams(params) : null;
  const query = searchParams?.toString();
  
  const baseUrl = `/${locale}${path}`;
  return query ? `${baseUrl}?${query}` : baseUrl;
}