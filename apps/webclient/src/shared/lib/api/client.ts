const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || '';

const defaultHeaders: HeadersInit = {
  'x-user-agent': 'InvestorPortal',
  'x-signature': 'secret456',
  'accept-language': 'en',
  'Content-Type': 'application/json',
};

function getAuthHeaders(): HeadersInit {
  const token = typeof localStorage !== 'undefined'
    ? localStorage.getItem('authToken')
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  queryParams?: Record<string, string | number | boolean>;
  acceptLanguage?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL((BASE_API_URL || '') + endpoint);

  if (options.queryParams) {
    Object.entries(options.queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  function toHeaderObject(h: HeadersInit | undefined): Record<string, string> {
    if (!h) return {};
    if (h instanceof Headers) {
      const obj: Record<string, string> = {};
      h.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }
    if (Array.isArray(h)) {
      const obj: Record<string, string> = {};
      h.forEach(([key, value]) => {
        obj[key] = value;
      });
      return obj;
    }
    return { ...(h as Record<string, string>) };
  }

  const mergedHeadersObj: Record<string, string> = {
    ...toHeaderObject(defaultHeaders),
    ...toHeaderObject(getAuthHeaders()),
    ...(options.acceptLanguage ? { 'accept-language': options.acceptLanguage } : {}),
    ...toHeaderObject(options.headers),
  };

  const { queryParams, body, headers: _ignoredHeaders, ...rest } = options;

  let requestBody: BodyInit | undefined;
  if (typeof body !== 'undefined') {
    const contentType = mergedHeadersObj['Content-Type'];
    if (contentType === 'application/json' && typeof body !== 'string') {
      requestBody = JSON.stringify(body);
    } else {
      requestBody = body as BodyInit;
    }
  }

  const response = await fetch(url.toString(), {
    method: rest.method || 'GET',
    headers: mergedHeadersObj,
    body: requestBody,
    ...rest,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`,
    );
  }

  return response.json();
}
