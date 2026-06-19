(() => {
  'use strict';

  const CORE_URL = 'https://cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2@a5ab43603f9e6893c7958a85906f224594aee21d/dist/assets/pro-core-v4.js';
  const SELF_SRC = document.currentScript?.src || location.href;
  const ASSET_BASE = new URL('.', SELF_SRC).href;
  const VERSION = '1013';

  function assetUrl(fileName) {
    return `${ASSET_BASE}${fileName}?v=${VERSION}`;
  }

  function loadCss(href) {
    if ([...document.styleSheets].some(sheet => sheet.href === href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`โหลดสคริปต์ไม่สำเร็จ: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadLegacyCore() {
    const response = await fetch(CORE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`โหลด Pro core เดิมไม่ได้: ${response.status}`);
    const code = await response.text();
    (0, eval)(code);
  }

  async function boot() {
    await loadLegacyCore();
    loadCss(assetUrl('pro-print.css'));
    await loadScript(assetUrl('pro-print-store-bills.js'));
    await loadScript(assetUrl('pro-print-mode-fixes.js'));
    await loadScript(assetUrl('pro-print-column-widths.js'));
    await loadScript(assetUrl('pro-print-a4-pro-fix.js'));
  }

  boot().catch(error => {
    console.error(error);
    document.body.innerHTML = '<div style="font-family:system-ui;padding:18px;color:#991b1b"><b>โหลดหน้า Pro ไม่สำเร็จ</b><br>' + String(error.message || error) + '</div>';
  });
})();
