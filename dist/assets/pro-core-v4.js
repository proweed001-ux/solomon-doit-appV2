(() => {
  'use strict';

  const SELF_SRC = document.currentScript?.src || location.href;
  const ASSET_BASE = new URL('.', SELF_SRC).href;
  const VERSION = '1028-native';
  const LEGACY_SAFE_VERSION = '1027';

  function assetUrl(fileName, version = VERSION) {
    return `${ASSET_BASE}${fileName}?v=${version}`;
  }

  function loadCss(href) {
    if ([...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);
      if (existing?.dataset.loaded === 'true') return resolve();
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error(`โหลด ${src} ไม่สำเร็จ`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.doitNativeStack = 'true';
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve();
      };
      script.onerror = () => reject(new Error(`โหลด ${src} ไม่สำเร็จ`));
      document.body.appendChild(script);
    });
  }

  function showBootError(error) {
    const message = String(error?.message || error || 'ไม่ทราบสาเหตุ');
    const box = document.createElement('div');
    box.style.cssText = 'margin:12px;padding:12px;border:1px solid #fecaca;background:#fef2f2;color:#991b1b;border-radius:12px;font-weight:900;white-space:pre-wrap';
    box.textContent = `โหลด Pro Native Core ไม่สำเร็จ\n${message}`;
    const main = document.querySelector('main') || document.body;
    main.prepend(box);
  }

  async function boot() {
    window.DOIT_PRO_CORE_BOOT = {
      version: VERSION,
      mode: 'native-stack-bootstrap',
      productionCandidate: true,
      legacyWrapperRemoved: true
    };

    loadCss(assetUrl('pro-print.css', LEGACY_SAFE_VERSION));

    const stack = [
      assetUrl('pro-print-store-bills.js', LEGACY_SAFE_VERSION),
      assetUrl('pro-native-core.js'),
      assetUrl('pro-native-core-overrides.js'),
      assetUrl('pro-results-mode.js'),
      assetUrl('pro-print-mode-fixes.js', LEGACY_SAFE_VERSION),
      assetUrl('pro-print-column-widths.js', LEGACY_SAFE_VERSION),
      assetUrl('pro-print-a4-pro-fix.js', LEGACY_SAFE_VERSION)
    ];

    for (const src of stack) await loadScript(src);
  }

  boot().catch(showBootError);
})();
