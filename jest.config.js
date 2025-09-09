/** @type {import('jest').Config} */
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Root directory for tests
  rootDir: '.',

  // Test match patterns - only test the apps, not shared-ui
  testMatch: [
    '<rootDir>/apps/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/apps/**/*.(test|spec).(ts|tsx|js)',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@compass/shared-ui$': '<rootDir>/shared-ui/src/index.ts',
    '^@compass/shared-ui/(.*)$': '<rootDir>/shared-ui/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },

  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-react'] }],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@untitledui|react-aria))',
  ],

  // Coverage configuration - 90% threshold
  // Only collect coverage when explicitly requested via CLI
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage paths - only for apps, not shared-ui
  collectCoverageFrom: [
    'apps/compass-admin/src/**/*.{ts,tsx}',
    'apps/webclient/src/**/*.{ts,tsx}',
    // Exclude certain files
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.config.*',
    '!**/main.tsx',
    '!**/vite-env.d.ts',
    '!**/nx-welcome.tsx',
  ],

  // Coverage thresholds - 90% for apps only
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Specific thresholds for each app
    'apps/compass-admin/src/**/*.{ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    'apps/webclient/src/**/*.{ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/apps/*/e2e/',
    '.*\\.spec\\.ts$',
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Suppress console warnings during tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Handle static assets - merged into moduleNameMapper above
};
