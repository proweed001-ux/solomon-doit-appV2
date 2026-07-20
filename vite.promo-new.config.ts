import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

export const PROMO_BUILD_FLAVOR = 'VISUAL-FIRST-CACHE-V5-MANUAL-CONTROLS' as const;

function replaceRequired(code: string, search: string, replacement: string, marker: string): string {
  if (!code.includes(search)) throw new Error(`promo_admin_runtime_marker_missing:${marker}`);
  return code.replace(search, replacement);
}

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
      let next = code.replace(pattern, `const BUILD_ID = '${buildId}';`);
      next = replaceRequired(
        next,
        'visualSignatures: {},',
        'visualSignatures: undefined,',
        'fresh_run_must_build_visual_signatures',
      );
      next = replaceRequired(
        next,
        'const prepared = prepareCachedRun(cached.imported, {});',
        'const prepared = prepareCachedRun(cached.imported, cached.visualSignatures || {});',
        'cached_visual_signatures_must_be_loaded',
      );
      next = replaceRequired(
        next,
        'OCR รอบหลักจากหน้า PDF ครั้งเดียว; OCR หัวขวาบนเพิ่มเฉพาะ unresolved หลังเทียบ Product Master',
        'OCR ชื่อสินค้าจากมุมขวาบนครั้งเดียว แล้วสร้างลายนิ้วมือภาพครบก่อนจัดกลุ่ม',
        'single_pass_ocr_label',
      );
      next = replaceRequired(
        next,
        'การกดจากแคชจะไม่ OCR ซ้ำ ไม่สร้างลายนิ้วมือภาพ และอ่าน IndexedDB เพียงครั้งเดียว',
        'การกดจากแคชจะไม่ OCR ซ้ำ แต่จะตรวจลายนิ้วมือภาพทุกการ์ดและสร้างใหม่จากรูปในแคชเมื่อข้อมูลไม่ครบ',
        'cache_visual_rebuild_label',
      );
      next = replaceRequired(
        next,
        'ใช้ชื่อสินค้า Product Master และ XLSM เป็นหลัก; รูปเก็บไว้แสดงและตรวจด้วยตา ไม่ใช้เป็นตัวระบุสินค้าถาวร',
        'ใช้ชื่อมุมขวาบน Product Master และลายนิ้วมือรูปสินค้าเพื่อรวมข้าม Class; ราคาและ Promotion Family ให้แอดมินเลือกเอง',
        'visual_first_group_description',
      );
      next = replaceRequired(
        next,
        "'จัดกลุ่มจากข้อความ'",
        "'จัดกลุ่ม Visual-first'",
        'visual_first_progress_label',
      );
      next = replaceRequired(
        next,
        '`ประมวลผลข้อความแล้ว · OCR เพิ่ม ${adaptiveAttempted} ใบ · ดีขึ้น ${adaptiveImproved} ใบ`',
        '`ประมวลผล OCR รอบเดียวและ Visual-first แล้ว`',
        'single_pass_result_label',
      );
      return { code: next, map: null };
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
