import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

export const PROMO_BUILD_FLAVOR = 'VISUAL-FIRST-ANCHORED-MANUAL-CONTROLS' as const;

function promoBuildIdPlugin(): Plugin {
  const commit = String(process.env.VERCEL_GIT_COMMIT_SHA || 'LOCAL').slice(0, 8).toUpperCase();
  const buildId = `PROMO-${commit}-${PROMO_BUILD_FLAVOR}`;
  return {
    name: 'promo-build-id',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').endsWith('/src/promo-new/admin/main.tsx')) return null;
      const pattern = /const BUILD_ID = '[^']+';/u;
      if (!pattern.test(code)) throw new Error('promo_build_id_marker_missing');
      return { code: code.replace(pattern, `const BUILD_ID = '${buildId}';`), map: null };
    },
  };
}

export default defineConfig({
  plugins: [promoBuildIdPlugin(), react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
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
