import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const PROMO_BUILD_FLAVOR = 'HARDENED-SNAPSHOT-V2-CARD-UUID-V9' as const;
const commit = String(process.env.VERCEL_GIT_COMMIT_SHA || 'LOCAL').slice(0, 8).toUpperCase();
const buildId = `PROMO-${commit}-${PROMO_BUILD_FLAVOR}`;

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __PROMO_BUILD_ID__: JSON.stringify(buildId),
  },
  publicDir: false,
  build: {
    outDir: 'dist/assets/promo-new',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        admin: 'src/promo-new/admin/main.tsx',
        frontend: 'src/promo-new/frontend/main.tsx',
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: asset => asset.name?.endsWith('.css') ? 'style[extname]' : '[name][extname]',
      },
    },
  },
});
