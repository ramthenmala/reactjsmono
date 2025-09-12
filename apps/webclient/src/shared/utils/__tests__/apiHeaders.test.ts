import { renderHook } from '@testing-library/react';
import {
  createApiHeaders,
  createApiRequest,
  useApiHeaders,
  useApiRequest,
} from '@/utils/apiHeaders';

// Mock the i18n module
jest.mock('../../../i18n', () => ({
  getCurrentLanguage: jest.fn(() => 'en'),
  useLanguage: jest.fn(() => ({
    currentLanguage: 'en',
  })),
}));

// Mock fetch and Response
global.fetch = jest.fn();
global.Response = jest.fn(() => ({
  ok: true,
  json: jest.fn(),
  text: jest.fn(),
})) as any;

import { getCurrentLanguage, useLanguage } from 'i18n';

describe('apiHeaders utilities', () => {
  const mockGetCurrentLanguage = getCurrentLanguage as jest.MockedFunction<
    typeof getCurrentLanguage
  >;
  const mockUseLanguage = useLanguage as jest.MockedFunction<
    typeof useLanguage
  >;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentLanguage.mockReturnValue('en');
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      isRTL: false,
      direction: 'ltr',
      changeLanguage: jest.fn(),
      isLoading: false,
    });
  });

  describe('createApiHeaders', () => {
    it('should create default headers with current language', () => {
      const headers = createApiHeaders();

      expect(headers).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
      });
      expect(mockGetCurrentLanguage).toHaveBeenCalled();
    });

    it('should use provided language over getCurrentLanguage', () => {
      const headers = createApiHeaders({ currentLanguage: 'ar' });

      expect(headers).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'ar',
      });
    });

    it('should merge additional headers', () => {
      const headers = createApiHeaders({
        additionalHeaders: {
          'Content-Type': 'application/json',
          'Custom-Header': 'custom-value',
        },
      });

      expect(headers).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value',
      });
    });

    it('should override default headers with additional headers', () => {
      const headers = createApiHeaders({
        additionalHeaders: {
          accept: 'application/json',
          'x-user-agent': 'CustomAgent',
        },
      });

      expect(headers).toEqual({
        accept: 'application/json',
        'x-user-agent': 'CustomAgent',
        'x-signature': 'secret456',
        'accept-language': 'en',
      });
    });

    it('should handle empty options', () => {
      const headers = createApiHeaders({});

      expect(headers).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
      });
    });
  });

  describe('createApiRequest', () => {
    const mockResponse = {
      ok: true,
      json: jest.fn(),
      text: jest.fn(),
    };

    beforeEach(() => {
      mockFetch.mockResolvedValue(mockResponse);
    });

    it('should create fetch request with API headers', async () => {
      const url = 'https://api.example.com/data';
      await createApiRequest(url);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
        },
      });
    });

    it('should merge fetch options', async () => {
      const url = 'https://api.example.com/data';
      await createApiRequest(url, {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
        },
      });
    });

    it('should use custom language', async () => {
      const url = 'https://api.example.com/data';
      await createApiRequest(url, { currentLanguage: 'ar' });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'ar',
        },
      });
    });

    it('should merge custom headers', async () => {
      const url = 'https://api.example.com/data';
      await createApiRequest(url, {
        additionalHeaders: {
          Authorization: 'Bearer token',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should prioritize fetchOptions.headers over additionalHeaders', async () => {
      const url = 'https://api.example.com/data';
      await createApiRequest(url, {
        additionalHeaders: {
          'Content-Type': 'text/plain',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should return the fetch response', async () => {
      const url = 'https://api.example.com/data';
      const response = await createApiRequest(url);

      expect(response).toBe(mockResponse);
    });
  });

  describe('useApiHeaders', () => {
    it('should return headers with current language from context', () => {
      const { result } = renderHook(() => useApiHeaders());

      expect(result.current).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
      });
      expect(mockUseLanguage).toHaveBeenCalled();
    });

    it('should merge additional headers', () => {
      const { result } = renderHook(() =>
        useApiHeaders({
          Authorization: 'Bearer token',
          'Custom-Header': 'value',
        }),
      );

      expect(result.current).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
        Authorization: 'Bearer token',
        'Custom-Header': 'value',
      });
    });

    it('should update when language changes', () => {
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        isRTL: true,
        direction: 'rtl',
        changeLanguage: jest.fn(),
        isLoading: false,
      });

      const { result } = renderHook(() => useApiHeaders());

      expect(result.current).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'ar',
      });
    });

    it('should handle empty additional headers', () => {
      const { result } = renderHook(() => useApiHeaders({}));

      expect(result.current).toEqual({
        accept: '*/*',
        'x-user-agent': 'InvestorPortal',
        'x-signature': 'secret456',
        'accept-language': 'en',
      });
    });
  });

  describe('useApiRequest', () => {
    const mockResponse = {
      ok: true,
      json: jest.fn(),
      text: jest.fn(),
    };

    beforeEach(() => {
      mockFetch.mockResolvedValue(mockResponse);
    });

    it('should return a function that creates API requests', () => {
      const { result } = renderHook(() => useApiRequest());

      expect(typeof result.current).toBe('function');
    });

    it('should use current language from context', async () => {
      const { result } = renderHook(() => useApiRequest());
      const url = 'https://api.example.com/data';

      await result.current(url);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
        },
      });
      expect(mockUseLanguage).toHaveBeenCalled();
    });

    it('should pass through fetch options', async () => {
      const { result } = renderHook(() => useApiRequest());
      const url = 'https://api.example.com/data';

      await result.current(url, {
        method: 'DELETE',
        headers: {
          'If-Match': 'etag-value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
          'If-Match': 'etag-value',
        },
      });
    });

    it('should use context language when it changes', async () => {
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        isRTL: true,
        direction: 'rtl',
        changeLanguage: jest.fn(),
        isLoading: false,
      });

      const { result } = renderHook(() => useApiRequest());
      const url = 'https://api.example.com/data';

      await result.current(url);

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'ar',
        },
      });
    });

    it('should handle additional headers in options', async () => {
      const { result } = renderHook(() => useApiRequest());
      const url = 'https://api.example.com/data';

      await result.current(url, {
        additionalHeaders: {
          'X-Request-ID': '12345',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        headers: {
          accept: '*/*',
          'x-user-agent': 'InvestorPortal',
          'x-signature': 'secret456',
          'accept-language': 'en',
          'X-Request-ID': '12345',
        },
      });
    });

    it('should return the fetch response', async () => {
      const { result } = renderHook(() => useApiRequest());
      const url = 'https://api.example.com/data';

      const response = await result.current(url);

      expect(response).toBe(mockResponse);
    });
  });
});