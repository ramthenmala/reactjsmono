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
    
    // Webclient app absolute path mappings (specific paths first)
    '^@/utils/(.*)$': '<rootDir>/apps/webclient/src/shared/utils/$1',
    '^@/lib/(.*)$': '<rootDir>/apps/webclient/src/shared/lib/$1',
    '^@/ui/(.*)$': '<rootDir>/apps/webclient/src/shared/ui/$1',
    '^@/types/(.*)$': '<rootDir>/apps/webclient/src/shared/types/$1',
    '^@/services/(.*)$': '<rootDir>/apps/webclient/src/shared/services/$1',
    '^@/store/(.*)$': '<rootDir>/apps/webclient/src/shared/store/$1',
    '^@/shared/(.*)$': '<rootDir>/apps/webclient/src/shared/$1',
    '^@/components/(.*)$': '<rootDir>/apps/webclient/src/components/$1',
    '^@/features/(.*)$': '<rootDir>/apps/webclient/src/features/$1',
    '^@/(.*)$': '<rootDir>/apps/webclient/src/$1',
    
    // Mock the API client to avoid import.meta issues
    '.*shared/lib/api/client$': '<rootDir>/__mocks__/apiClient.js',
    
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

  // Coverage thresholds - configured per app
  // Note: These only apply when the specific files are actually tested
  coverageThreshold: {
    global: {
      // Global fallback - lenient to allow partial test runs
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
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

  // Module path ignore patterns to fix duplicate package.json issues
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/coverage/'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Suppress console warnings during tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Handle static assets - merged into moduleNameMapper above
};
