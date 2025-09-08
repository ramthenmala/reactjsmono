/// <reference types='vitest' />
import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

interface AppConfig {
  appName: string;
  defaultPort: string;
  envPortKey: string;
  appPath: string;
}

export function createAppConfig(appConfig: AppConfig) {
  return defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '../../', '');
    const port = parseInt(env[appConfig.envPortKey] || appConfig.defaultPort);

    // Dynamic import for ESM-only packages
    const { default: i18nextLoader } = await import('vite-plugin-i18next-loader');

    const config: UserConfig = {
      root: appConfig.appPath,
      cacheDir: `../../node_modules/.vite/${appConfig.appName}`,
      server: {
        port,
        host: 'localhost',
        open: true,
      },
      preview: {
        port,
        host: 'localhost',
        open: true,
      },
      plugins: [
        react(),
        nxViteTsPaths(),
        i18nextLoader({
          paths: ['./src/locales'],
          namespaceResolution: 'relativePath',
        }),
        eslint({
          cache: false,
          include: ['src/**/*.{ts,tsx}'],
          exclude: ['node_modules', 'dist'],
        }),
        checker({
          typescript: true,
        }),
      ],
      build: {
        outDir: './dist',
        emptyOutDir: true,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 1000,
        commonjsOptions: {
          transformMixedEsModules: true,
        },
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              ui: ['react-aria-components'],
            },
          },
        },
      },
    };

    return config;
  });
}
