// vite.config.ts
import { defineConfig, loadEnv } from 'vitest/config';   // Vitest-aware helper
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';        // ⟵ nice to have
import path from 'node:path';

export default defineConfig(({ mode }) => {
  /** ------------------------------------------------------------------
   *  1.  Runtime env vars (VITE_* only) are injected here so both
   *      client code and Vitest see the same values.
   *  ----------------------------------------------------------------- */
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    /* --------------------------------------------------------------
     *  2.  Core plugins
     * ------------------------------------------------------------- */
    plugins: [
      react({
        // Turn on React Fast Refresh + SWC for TS/JSX speed
        babel: {
          plugins: [['@babel/plugin-transform-typescript', { isTSX: true }]],
        },
      }),
      tsconfigPaths(),     // so "@/components/Button" works everywhere
    ],

    /* --------------------------------------------------------------
     *  3.  Path aliases (if you prefer without the plugin)
     * ------------------------------------------------------------- */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    /* --------------------------------------------------------------
     *  4.  Test configuration
     * ------------------------------------------------------------- */
    test: {
      globals: true,            // Jest-style API (expect, vi, etc.)
      environment: 'jsdom',     // DOM API for React components
      setupFiles: './src/test/setup.ts',
      coverage: {
        reporter: ['text', 'html', 'json-summary'],
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
      cache: {
        dir: 'node_modules/.vitest', // keeps CI caches tight
      },
    },

    /* --------------------------------------------------------------
     *  5.  Dev-only dependency pre-bundling tweaks
     * ------------------------------------------------------------- */
    optimizeDeps: {
      exclude: ['lucide-react'], // icon library = dozens of entry points
    },

    /* --------------------------------------------------------------
     *  6.  Build output – adjust to your needs
     * ------------------------------------------------------------- */
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },

    /* --------------------------------------------------------------
     *  7.  Expose env vars to client & tests
     * ------------------------------------------------------------- */
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // example: import.meta.env
    },
  };
});
