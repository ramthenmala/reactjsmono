import '@testing-library/jest-dom';

// Configure testing-library to use data-qa-id instead of data-testid
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-qa-id',
});

// Mock CSS imports
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock import.meta.env for Jest environment
Object.defineProperty(globalThis, 'import', {
  writable: true,
  value: {
    meta: {
      env: {
        VITE_BASE_API_URL: 'https://api.compass.sa',
        VITE_USE_MOCK_API: 'false',
        VITE_MOCK_ISIC_ENDPOINT: 'mock/isic.json',
        VITE_MOCK_SECTORS_ENDPOINT: 'mock/sectors.json',
        VITE_MOCK_REGIONS_ENDPOINT: 'mock/regions.json',
        VITE_MOCK_AREA_ENDPOINT: 'mock/area.json',
        VITE_MOCK_INDUSTRIAL_CITIES_ENDPOINT: 'mock/cities.json',
        VITE_PROD_ISIC_ENDPOINT: '/api/isic',
        VITE_PROD_SECTORS_ENDPOINT: '/api/sectors',
        VITE_PROD_REGIONS_ENDPOINT: '/api/regions',
        VITE_PROD_AREA_ENDPOINT: '/api/areas',
        VITE_PROD_INDUSTRIAL_CITIES_ENDPOINT: '/api/cities',
      },
    },
  },
});

// Suppress console warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
        args[0].includes('React Router Future Flag Warning'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
        args[0].includes('v7_relativeSplatPath'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
