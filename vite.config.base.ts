/// <reference types='vitest' />
import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from 'vite-plugin-svgr';

interface AppConfig {
  appName: string;
  defaultPort: string;
  envPortKey: string;
  appPath: string;
}

export async function createAppConfig(appConfig: AppConfig) {
  const { checker } = await import('vite-plugin-checker');
  return defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '../../', '');
    const port = parseInt(env[appConfig.envPortKey] || appConfig.defaultPort);

    // Dynamic import for ESM-only packages
    const { default: i18nextLoader } = await import(
      'vite-plugin-i18next-loader'
    );

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
        svgr(),
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
        // Bundle analysis - only in build mode
        mode === 'production' &&
          visualizer({
            filename: `../../bundle-analysis/${appConfig.appName}-bundle-analysis.html`,
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
          }),
      ].filter(Boolean),
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
              // Split vendor code for better caching
              vendor: ['react', 'react-dom', 'react-router-dom'],
            },
            // Optimize chunk naming for caching
            chunkFileNames: chunkInfo => {
              const facadeModuleId = chunkInfo.facadeModuleId
                ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.js', '')
                : 'chunk';
              return `assets/${facadeModuleId}-[hash].js`;
            },
          },
        },
        // Performance optimizations
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: mode === 'development',
        cssCodeSplit: true,
        assetsInlineLimit: 4096, // 4kb - inline small assets
      },
    };

    return config;
  });
}
